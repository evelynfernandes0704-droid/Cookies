export default function handler(_req: any, res: any) {
  const key = process.env.GROQ_API_KEY || process.env.VITE_GROQ_API_KEY || '';
  const isConfigured = Boolean(
    key && key.trim() !== '' && key !== 'gsk_sua_chave_groq_aqui' && key !== 'MY_GROQ_API_KEY'
  );
  res.status(200).json({
    groqConfigured: isConfigured,
    model: 'llama-3.3-70b-versatile',
  });
}
