import { CookieProduct } from '../data/cookiesData';

export function generateLocalInventoryReply(
  userQuery: string,
  inventory: CookieProduct[],
  stockPreset: string
): string {
  const q = userQuery
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  const totalUnitsAcrossStore = inventory.reduce(
    (sum, p) => sum + p.variations.reduce((vSum, v) => vSum + v.stock, 0),
    0
  );

  const isZeroStock = totalUnitsAcrossStore === 0 || stockPreset === 'zero';

  const formatProductDetail = (p: CookieProduct) => {
    const totalProdStock = p.variations.reduce((s, v) => s + v.stock, 0);
    const varList = p.variations
      .map(
        (v) =>
          `• ${v.label}: R$ ${v.price.toFixed(2).replace('.', ',')} (${
            v.stock > 0 ? `${v.stock} disp.` : 'ESGOTADO / 0 un.'
          })`
      )
      .join('\n');

    return `**${p.name}** (${p.categoryName} · SKU ${p.sku})
- **Status de Estoque:** ${
      totalProdStock > 0
        ? `Disponível (${totalProdStock} itens somando as variações)`
        : 'ESTOQUE ZERADO no momento (0 unidades em todas as variações)'
    }
- **Ficha Técnica:** ${p.technicalSpec.netWeight} | ${p.technicalSpec.bakeProfile}
- **Ingredientes:** ${p.technicalSpec.originIngredients}
- **Alérgenos:** ${p.technicalSpec.allergens}
- **Nutrição (100g):** ${p.technicalSpec.nutritionPer100g}
- **Modo de Servir:** ${p.technicalSpec.servingTemperature}
- **Variações e Valores:**
${varList}`;
  };

  const matchedProducts = inventory.filter((p) => {
    const nameNorm = p.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    const keywords = nameNorm.split(/\s+/).filter((w) => w.length > 3);
    return keywords.some((kw) => q.includes(kw));
  });

  if (matchedProducts.length > 0 && matchedProducts.length <= 3) {
    const header = isZeroStock
      ? `Consultei nosso estoque em tempo real e atenção: **o estoque da loja encontra-se ZERADO no momento** (fornada em reposição). Confira abaixo a ficha técnica e valores de referência do(s) sabor(es) consultado(s):\n\n`
      : `Consultei o estoque em tempo real do Atelier Crumb. Aqui estão os dados técnicos, disponibilidade por variação e valores:\n\n`;

    return header + matchedProducts.map(formatProductDetail).join('\n\n---\n\n');
  }

  if (
    q.includes('estoque') ||
    q.includes('disponivel') ||
    q.includes('disponiveis') ||
    q.includes('tem ') ||
    q.includes('zerado') ||
    q.includes('esgotado') ||
    q.includes('pronta entrega')
  ) {
    if (isZeroStock) {
      return `Acabei de consultar o sistema em tempo real: **nosso estoque está 100% ZERADO (0 unidades disponíveis)** em todas as 4 categorias (*Clássicos de Forno*, *Recheados Artesanais*, *Edições Gourmet & Autorais* e *Veganos & Funcionais*).\n\nNossa equipe de confeitaria está preparando uma nova fornada. Caso você esteja testando a plataforma, basta clicar no botão **"Estoque Preenchido"** na barra superior para abastecer imediatamente todos os 20 produtos e suas variações! Posso adiantar alguma ficha técnica ou tabela de preços enquanto isso?`;
    }

    const byCategory = ['classicos', 'recheados', 'gourmet', 'veganos'].map((catId) => {
      const prods = inventory.filter((p) => p.categoryId === catId);
      const catName = prods[0]?.categoryName || catId;
      const lines = prods
        .map((p) => {
          const unVar = p.variations[0];
          const totalStock = p.variations.reduce((a, b) => a + b.stock, 0);
          return `  • **${p.name}**: R$ ${p.basePrice.toFixed(2).replace('.', ',')} (Unid: ${unVar.stock} disp. | Total variações: ${totalStock} disp.)`;
        })
        .join('\n');
      return `**${catName}**\n${lines}`;
    });

    return `Consultei o estoque ao vivo! Temos **${totalUnitsAcrossStore} itens prontos para envio** distribuídos nos 20 sabores:\n\n${byCategory.join(
      '\n\n'
    )}\n\nDeseja ver a ficha técnica ou as variações (Unidade, Caixa 4 un., Lata 6 un. ou Caixa 12 un.) de algum sabor específico?`;
  }

  if (
    q.includes('vegano') ||
    q.includes('lactose') ||
    q.includes('gluten') ||
    q.includes('alerg') ||
    q.includes('protei') ||
    q.includes('whey') ||
    q.includes('zero acucar') ||
    q.includes('dieta') ||
    q.includes('fit')
  ) {
    const veganCat = inventory.filter((p) => p.categoryId === 'veganos');
    const list = veganCat
      .map((p) => {
        const total = p.variations.reduce((a, b) => a + b.stock, 0);
        return `• **${p.name}** — a partir de R$ ${p.basePrice.toFixed(2).replace('.', ',')}\n  *Selos:* ${p.dietaryNotes.join(' · ')} | *Alérgenos:* ${p.technicalSpec.allergens} | *Estoque:* ${
          total > 0 ? `${total} itens disponíveis` : 'ESGOTADO (0 un.)'
        }`;
      })
      .join('\n\n');

    return `Na nossa categoria **04. Veganos & Funcionais**, trabalhamos com rigor técnico contra contaminação e ingredientes puros:\n\n${list}\n\nSe tiver alguma restrição alimentar severa, informe qual ingrediente precisa evitar e eu verifico a composição técnica exata!`;
  }

  if (
    q.includes('variac') ||
    q.includes('caixa') ||
    q.includes('lata') ||
    q.includes('presente') ||
    q.includes('preco') ||
    q.includes('valor') ||
    q.includes('quanto custa')
  ) {
    return `Todos os nossos **20 sabores de cookies** estão disponíveis em **4 variações de apresentação**:\n\n1. **Unidade Individual (1 un. · 110g a 135g):** Embalagem selada a quente (de R$ 16,00 a R$ 24,50).\n2. **Caixa Degustação (4 un.):** Caixa rígida kraft com berço protetor (~6% de desconto por unidade).\n3. **Lata Colecionável (6 un.):** Lata hermética reutilizável ideal para presentes (~9% de desconto).\n4. **Caixa Atelier Eventos (12 un.):** Formato corporativo e celebrações (~15% de desconto).\n\nStatus atual do estoque geral: **${
      isZeroStock
        ? 'ESTOQUE ZERADO (0 unidades disponíveis)'
        : `ESTOQUE PREENCHIDO (${totalUnitsAcrossStore} itens em pronta entrega)`
    }**. Qual sabor você gostaria de cotar?`;
  }

  return `Olá! Sou o especialista técnico do **Atelier Crumb**. Consulto nosso estoque e fichas técnicas em tempo real.\n\n- **Status do Estoque Agora:** ${
    isZeroStock
      ? 'ESTOQUE ZERADO (0 unidades disponíveis — aguardando reposição de fornada)'
      : `ESTOQUE PREENCHIDO (${totalUnitsAcrossStore} itens disponíveis nas 4 categorias)`
  }\n- **Categorias (5 sabores cada):**\n  1. *Clássicos de Forno* (Belga 54%, Macadâmia, Triplo Cacau, Aveia & Pecã, Beurre Noisette)\n  2. *Recheados Artesanais* (Gianduia Real, Red Velvet, Doce de Leite Uruguaio, Ganache Kinder, Caramelo & Praliné)\n  3. *Edições Gourmet & Autorais* (Pistache Iraniano, Matcha & Yuzu, Chocolate Ruby, Café Bourbon & Cardamomo, Limão Siciliano)\n  4. *Veganos & Funcionais* (Cacau 70% Vegano, Banana & Castanha Sem Glúten, Proteico 22g Whey, Zero Açúcar Coco & Chia, Tâmaras & Tahine)\n\nPergunte sobre qualquer sabor, disponibilidade por variação, alérgenos, gramatura ou modo de aquecimento!`;
}
