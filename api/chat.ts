export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages = [], inventory = [], stockPreset = 'filled', clientGroqKey = '' } = req.body || {};
    const envKey = process.env.GROQ_API_KEY || process.env.VITE_GROQ_API_KEY || '';
    const activeKey =
      clientGroqKey && String(clientGroqKey).trim() !== ''
        ? String(clientGroqKey).trim()
        : envKey && envKey.trim() !== '' && envKey !== 'gsk_sua_chave_groq_aqui'
        ? envKey.trim()
        : '';

    const totalStoreStock = Array.isArray(inventory)
      ? inventory.reduce(
          (sum: number, p: any) =>
            sum +
            (Array.isArray(p.variations)
              ? p.variations.reduce((vSum: number, v: any) => vSum + (Number(v.stock) || 0), 0)
              : 0),
          0
        )
      : 0;

    if (activeKey && Array.isArray(inventory)) {
      const inventoryContext = inventory
        .map((p: any) => {
          const vars = Array.isArray(p.variations)
            ? p.variations
                .map((v: any) => `${v.label}: R$${Number(v.price).toFixed(2)} [Estoque: ${v.stock} un.]`)
                .join(' | ')
            : '';
          return `[${p.sku}] ${p.name} (${p.categoryName})
  - Ficha Técnica: Peso ${p.technicalSpec?.netWeight}; Dimensões ${p.technicalSpec?.dimensions}; Forno: ${p.technicalSpec?.bakeProfile}
  - Ingredientes: ${p.technicalSpec?.originIngredients}
  - Alérgenos: ${p.technicalSpec?.allergens} | Nutrição: ${p.technicalSpec?.nutritionPer100g}
  - Variações e Estoque Atual: ${vars}`;
        })
        .join('\n\n');

      const systemPrompt = `Você é o Concierge Técnico e Especialista de Atendimento do Atelier Crumb, uma confeitaria artesanal de cookies de alto padrão.
Sua função é responder dúvidas técnicas sobre os 20 produtos (divididos em 4 categorias com 5 sabores cada), informar valores, variações (Unidade, Caixa 4 un., Lata 6 un., Caixa 12 un.), ingredientes, alérgenos, dicas de aquecimento e CONSULTAR O ESTOQUE EM TEMPO REAL abaixo.

ESTADO ATUAL DO ESTOQUE GLOBAL: ${
        totalStoreStock === 0 || stockPreset === 'zero'
          ? 'ESTOQUE TOTALMENTE ZERADO (0 unidades em todos os produtos). Avise claramente o cliente que os produtos estão esgotados no momento.'
          : `ESTOQUE PREENCHIDO (${totalStoreStock} itens disponíveis somando todas as variações).`
      }

CATÁLOGO COMPLETO E ESTOQUE EM TEMPO REAL:
${inventoryContext}

Diretrizes:
- Responda sempre em Português do Brasil, de forma elegante, prestativa, direta e tecnicamente precisa.
- Sempre cite os valores exatos em R$ e a quantidade exata em estoque da variação perguntada.`;

      const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${activeKey}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages.slice(-8).map((m: any) => ({
              role: m.role,
              content: m.content,
            })),
          ],
          temperature: 0.35,
          max_tokens: 700,
        }),
      });

      if (groqResponse.ok) {
        const data: any = await groqResponse.json();
        const reply = data?.choices?.[0]?.message?.content;
        if (reply) {
          return res.status(200).json({
            reply,
            engine: 'groq-llama-3.3-70b',
            totalStoreStock,
          });
        }
      }
    }

    return res.status(200).json({
      reply: null,
      useClientEngine: true,
      totalStoreStock,
    });
  } catch (err) {
    return res.status(200).json({
      reply: null,
      useClientEngine: true,
    });
  }
}
