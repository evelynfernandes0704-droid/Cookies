import heroCookieImg from '../assets/images/hero_cookie_atelier_1790872654679.jpg';
import catClassicsImg from '../assets/images/cat_classics_cookies_1790872666538.jpg';
import catStuffedImg from '../assets/images/cat_stuffed_cookies_1790872676906.jpg';
import catGourmetImg from '../assets/images/cat_gourmet_pistachio_1790872687757.jpg';
import catVeganImg from '../assets/images/cat_vegan_fit_1790872696824.jpg';

export type CategoryId = 'classicos' | 'recheados' | 'gourmet' | 'veganos';

export interface ProductVariation {
  id: string;
  label: string;
  weightLabel: string;
  unitsIncluded: number;
  price: number;
  cost: number;
  stock: number;
  defaultStock: number;
  skuSuffix: string;
}

export interface TechnicalSpec {
  netWeight: string;
  dimensions: string;
  bakeProfile: string;
  moistureAndTexture: string;
  originIngredients: string;
  allergens: string;
  shelfLife: string;
  nutritionPer100g: string;
  servingTemperature: string;
}

export interface CookieProduct {
  id: string;
  sku: string;
  name: string;
  categoryId: CategoryId;
  categoryName: string;
  tagline: string;
  description: string;
  basePrice: number;
  image: string;
  fallbackGradient: string;
  featured?: boolean;
  dietaryNotes: string[];
  technicalSpec: TechnicalSpec;
  variations: ProductVariation[];
}

export interface CategoryInfo {
  id: CategoryId;
  indexNumber: string;
  name: string;
  shortTitle: string;
  description: string;
  technicalStandard: string;
  image: string;
}

export interface FlavorSalesMetric {
  productId: string;
  productName: string;
  categoryId: CategoryId;
  categoryName: string;
  unitsSold: number;
  revenue: number;
  cost: number;
  grossMarginPct: number;
  topVariation: string;
  returnRatePct: number;
}

export interface OrderRecord {
  id: string;
  timestamp: string;
  customerName: string;
  channel: 'E-commerce Direto' | 'Balcão Atelier' | 'Corporativo B2B';
  itemsSummary: string;
  totalUnits: number;
  totalValue: number;
  status: 'Concluído' | 'Em Forneamento' | 'Expedido';
}

export interface MonthlyReportData {
  monthId: string;
  monthLabel: string;
  quarter: string;
  grossRevenue: number;
  netRevenue: number;
  cogs: number;
  operatingExpenses: number;
  netProfit: number;
  netMarginPct: number;
  totalOrders: number;
  totalUnitsSold: number;
  averageTicket: number;
  repeatPurchaseRatePct: number;
  lossAndWastePct: number;
  categorySplit: {
    categoryId: CategoryId;
    categoryName: string;
    revenue: number;
    units: number;
    sharePct: number;
  }[];
  variationSplit: {
    variationLabel: string;
    ordersCount: number;
    revenue: number;
    sharePct: number;
  }[];
  flavorMetrics: FlavorSalesMetric[];
  recentOrders: OrderRecord[];
  ownerNotes: string;
}

export const HERO_IMAGE = heroCookieImg;

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'classicos',
    indexNumber: '01',
    name: 'Clássicos de Forno',
    shortTitle: 'Clássicos',
    description: 'Massas descansadas por 48 horas a 4°C com manteiga de creme doce batida e chocolates belgas de origem única.',
    technicalStandard: 'Gramatura 115g · Umidade interna 18% · Forno de lastro 185°C',
    image: catClassicsImg,
  },
  {
    id: 'recheados',
    indexNumber: '02',
    name: 'Recheados Artesanais',
    shortTitle: 'Recheados',
    description: 'Núcleos encapsulados a -18°C antes do forneamento para garantir centro líquido cremoso e estrutura externa firme.',
    technicalStandard: 'Gramatura 135g (85g massa + 50g recheio) · Forno 192°C por 10m30s',
    image: catStuffedImg,
  },
  {
    id: 'gourmet',
    indexNumber: '03',
    name: 'Edições Gourmet & Autorais',
    shortTitle: 'Gourmet & Autorais',
    description: 'Ingredientes raros importados — pistache iraniano de Kerman, matcha cerimonial de Uji, chocolate Ruby e especiarias.',
    technicalStandard: 'Gramatura 120g · Maturação a frio 72h · Finalização manual pós-forno',
    image: catGourmetImg,
  },
  {
    id: 'veganos',
    indexNumber: '04',
    name: 'Veganos & Funcionais',
    shortTitle: 'Veganos & Fit',
    description: 'Formulações plant-based, sem lactose ou proteicas, estruturadas com pastas de oleaginosas puras e açúcares de baixo índice.',
    technicalStandard: 'Gramatura 110g · Sem lácteos refinados · Emulsão vegetal de castanhas',
    image: catVeganImg,
  },
];

function createVariations(
  basePrice: number,
  skuPrefix: string,
  stocks: [number, number, number, number]
): ProductVariation[] {
  const unitPrice = basePrice;
  const box4Price = Math.round(basePrice * 3.75 * 10) / 10;
  const tin6Price = Math.round(basePrice * 5.45 * 10) / 10;
  const pack12Price = Math.round(basePrice * 10.2 * 10) / 10;

  return [
    {
      id: `${skuPrefix}-UN`,
      label: 'Unidade Individual',
      weightLabel: '1 un. · Embalagem selada a quente',
      unitsIncluded: 1,
      price: unitPrice,
      cost: Math.round(unitPrice * 0.34 * 100) / 100,
      stock: stocks[0],
      defaultStock: stocks[0],
      skuSuffix: 'UN1',
    },
    {
      id: `${skuPrefix}-CX4`,
      label: 'Caixa Degustação 4 un.',
      weightLabel: '4 un. · Caixa rígida kraft c/ berço',
      unitsIncluded: 4,
      price: box4Price,
      cost: Math.round(box4Price * 0.32 * 100) / 100,
      stock: stocks[1],
      defaultStock: stocks[1],
      skuSuffix: 'CX4',
    },
    {
      id: `${skuPrefix}-LT6`,
      label: 'Lata Colecionável 6 un.',
      weightLabel: '6 un. · Lata hermética reutilizável',
      unitsIncluded: 6,
      price: tin6Price,
      cost: Math.round(tin6Price * 0.35 * 100) / 100,
      stock: stocks[2],
      defaultStock: stocks[2],
      skuSuffix: 'LT6',
    },
    {
      id: `${skuPrefix}-PK12`,
      label: 'Caixa Atelier 12 un.',
      weightLabel: '12 un. · Formato eventos & corporativo',
      unitsIncluded: 12,
      price: pack12Price,
      cost: Math.round(pack12Price * 0.30 * 100) / 100,
      stock: stocks[3],
      defaultStock: stocks[3],
      skuSuffix: 'PK12',
    },
  ];
}

export const INITIAL_COOKIE_PRODUCTS: CookieProduct[] = [
  // ==================== CATEGORIA 1: CLÁSSICOS DE FORNO (5 PRODUTOS) ====================
  {
    id: 'c1-belga-flordesal',
    sku: 'ATC-CL-001',
    name: 'Chocolate Belga 54% & Flor de Sal de Mossoró',
    categoryId: 'classicos',
    categoryName: 'Clássicos de Forno',
    tagline: 'Massa amanteigada com blocos irregulares de chocolate Callebaut 54,5% e cristais de flor de sal.',
    description:
      'Nosso carro-chefe técnico. A massa leva mistura de açúcar mascavo escuro úmido e açúcar demerara orgânico, descansada por 48 horas para hidratação completa do amido e notas de toffee.',
    basePrice: 16.5,
    image: catClassicsImg,
    fallbackGradient: 'from-[#3A2618] to-[#1E140C]',
    featured: true,
    dietaryNotes: ['Vegetariano', 'Maturação 48h', 'Cacau Belga Rastreável'],
    technicalSpec: {
      netWeight: '115g por unidade (±3g)',
      dimensions: 'Diâmetro 95mm · Altura central 26mm',
      bakeProfile: '185°C em forno de lastro de pedra por 11 min · Repouso em grade por 18 min',
      moistureAndTexture: 'Atividade de água (Aw) 0,68 · Casca crocante de 2mm e miolo denso e úmido',
      originIngredients:
        'Farinha de trigo tipo 1 não branqueada (W=260), manteiga extra sem sal 84% lipídios, chocolate Callebaut 811 (54,5% cacau), açúcar mascavo artesanal, ovos caipiras pasteurizados, extrato puro de baunilha de Madagascar, bicarbonato de sódio e flor de sal.',
      allergens: 'Contém trigo (glúten), ovos, derivados de leite e lecitina de soja. Pode conter traços de avelã e pistache.',
      shelfLife: '7 dias em embalagem selada (20°C–24°C) · 60 dias congelado (-18°C)',
      nutritionPer100g: '442 kcal · Carboidratos: 54g · Proteínas: 5,8g · Gorduras Totais: 22g',
      servingTemperature: 'Ideal a 38°C (aquecer 12s no micro-ondas ou 4 min em forno a 170°C)',
    },
    variations: createVariations(16.5, 'CL001', [38, 14, 9, 5]),
  },
  {
    id: 'c1-macadamia-branco',
    sku: 'ATC-CL-002',
    name: 'Macadâmia Tostada & Chocolate Branco Caramelizado',
    categoryId: 'classicos',
    categoryName: 'Clássicos de Forno',
    tagline: 'Nozes de macadâmia australiana tostadas em manteiga com chocolate branco Gold caramelizado.',
    description:
      'Equilíbrio preciso entre a untuosidade amanteigada da macadâmia tostada lentamente a 140°C e o dulçor lácteo levemente salgado do chocolate branco caramelizado.',
    basePrice: 18.0,
    image: catClassicsImg,
    fallbackGradient: 'from-[#4A3520] to-[#261B10]',
    dietaryNotes: ['Vegetariano', 'Macadâmia Calibre 1', 'Chocolate Caramelizado'],
    technicalSpec: {
      netWeight: '115g por unidade (±3g)',
      dimensions: 'Diâmetro 94mm · Altura central 25mm',
      bakeProfile: '180°C por 11m30s com vaporização zero para preservar crocância da macadâmia',
      moistureAndTexture: 'Aw 0,65 · Mordida amanteigada com inclusão de 28% de nozes inteiras e metades',
      originIngredients:
        'Farinha de trigo tipo 1, manteiga extra 84%, chocolate branco caramelizado 30,4% manteiga de cacau, macadâmias tostadas (22%), açúcar refinado e mascavo claro, ovos caipiras, fava de baunilha.',
      allergens: 'Contém trigo (glúten), macadâmia, ovos, leite e derivados de soja.',
      shelfLife: '7 dias em temperatura ambiente · 60 dias congelado (-18°C)',
      nutritionPer100g: '468 kcal · Carboidratos: 51g · Proteínas: 6,2g · Gorduras Totais: 26g',
      servingTemperature: 'Servir em temperatura ambiente (22°C) ou levemente aquecido (32°C)',
    },
    variations: createVariations(18.0, 'CL002', [26, 11, 7, 4]),
  },
  {
    id: 'c1-triplo-cacau',
    sku: 'ATC-CL-003',
    name: 'Triplo Cacau Alcalino Black, Belga 70% & Nibs',
    categoryId: 'classicos',
    categoryName: 'Clássicos de Forno',
    tagline: 'Massa escura de cacau black holandês com moedas 70,5% e crocância de nibs de cacau torrados.',
    description:
      'Desenvolvido para apreciadores de cacau intenso. Combina cacau alcalinizado de pH 8.0 na estrutura da massa, gotas generosas de chocolate amargo 70,5% e nibs fermentados da Bahia.',
    basePrice: 17.5,
    image: catClassicsImg,
    fallbackGradient: 'from-[#231815] to-[#120C0A]',
    dietaryNotes: ['Intenso 70%', 'Nibs de Origem Bahia', 'Baixo Dulçor'],
    technicalSpec: {
      netWeight: '115g por unidade (±3g)',
      dimensions: 'Diâmetro 92mm · Altura central 28mm',
      bakeProfile: '188°C por 10 min · Resfriamento rápido para textura fudgy de brownie',
      moistureAndTexture: 'Aw 0,70 · Textura interna de trufa densa com contraste crocante dos nibs',
      originIngredients:
        'Farinha de trigo, manteiga extra, chocolate amargo 70,5% cacau, cacau em pó alcalino 100%, açúcar mascavo escuro, ovos caipiras, nibs de cacau torrados de Ilhéus-BA, café expresso reduzido.',
      allergens: 'Contém trigo (glúten), ovos, leite e lecitina de soja.',
      shelfLife: '8 dias em embalagem selada · 60 dias congelado (-18°C)',
      nutritionPer100g: '430 kcal · Carboidratos: 49g · Proteínas: 6,9g · Gorduras Totais: 23g',
      servingTemperature: 'Ideal a 40°C para derretimento completo das moedas 70%',
    },
    variations: createVariations(17.5, 'CL003', [32, 12, 8, 6]),
  },
  {
    id: 'c1-aveia-peca-rum',
    sku: 'ATC-CL-004',
    name: 'Aveia Laminada, Nozes Pecã & Passas Douradas ao Rum',
    categoryId: 'classicos',
    categoryName: 'Clássicos de Forno',
    tagline: 'Textura rústica de aveia integral grossa, pecãs caramelizadas no bordo e passas maceradas em rum envelhecido.',
    description:
      'Releitura de confeitaria fina para o clássico Oatmeal Pecan. As passas brancas são hidratadas por 24 horas em rum envelhecido em carvalho e especiarias quentes.',
    basePrice: 16.0,
    image: catClassicsImg,
    fallbackGradient: 'from-[#4E3622] to-[#2B1D12]',
    dietaryNotes: ['Fibras Naturais', 'Macerado 24h', 'Especiarias Moídas na Hora'],
    technicalSpec: {
      netWeight: '115g por unidade (±3g)',
      dimensions: 'Diâmetro 96mm · Altura central 24mm',
      bakeProfile: '182°C por 12 min · Douramento uniforme das lâminas de aveia',
      moistureAndTexture: 'Aw 0,66 · Mastigabilidade alta (chewy) e aroma pronunciado de canela do Ceilão e noz-moscada',
      originIngredients:
        'Aveia em flocos grossos laminados, farinha de trigo, manteiga extra, nozes pecã do Rio Grande do Sul, passas douradas, rum escuro envelhecido, açúcar mascavo, ovos, canela verdadeira do Ceilão.',
      allergens: 'Contém trigo, aveia (glúten), noz pecã, ovos e derivados de leite.',
      shelfLife: '8 dias em temperatura ambiente · 45 dias congelado',
      nutritionPer100g: '418 kcal · Carboidratos: 56g · Proteínas: 6,5g · Gorduras Totais: 19g',
      servingTemperature: 'Excelente a 30°C acompanhado de café filtrado ou chá preto',
    },
    variations: createVariations(16.0, 'CL004', [22, 9, 5, 3]),
  },
  {
    id: 'c1-manteiga-noisette',
    sku: 'ATC-CL-005',
    name: 'Beurre Noisette, Toffee Inglês & Meio Amargo 60%',
    categoryId: 'classicos',
    categoryName: 'Clássicos de Forno',
    tagline: 'Manteiga clarificada dourada com notas de avelã, pedaços de butterscotch toffee e chocolate 60%.',
    description:
      'Toda a manteiga desta receita é cozida lentamente até atingir 155°C (Beurre Noisette), caramelizando os sólidos do leite antes da mistura e criando profundidade aromática incomparável.',
    basePrice: 17.0,
    image: catClassicsImg,
    fallbackGradient: 'from-[#52381E] to-[#281A0D]',
    dietaryNotes: ['Manteiga Tostada 155°C', 'Toffee Artesanal', 'Fermentação Fria 48h'],
    technicalSpec: {
      netWeight: '115g por unidade (±3g)',
      dimensions: 'Diâmetro 95mm · Altura central 25mm',
      bakeProfile: '185°C por 11 min · Cristalização do toffee durante o resfriamento',
      moistureAndTexture: 'Aw 0,64 · Borda extremamente crocante e caramelizada com centro macio',
      originIngredients:
        'Manteiga noisette artesanal, farinha de trigo tipo 1, chocolate 60% cacau, toffee inglês quebrado na faca (manteiga, açúcar demerara, flor de sal), ovos caipiras, baunilha Bourbon.',
      allergens: 'Contém trigo (glúten), ovos, leite e soja.',
      shelfLife: '7 dias em embalagem hermética · 60 dias congelado',
      nutritionPer100g: '455 kcal · Carboidratos: 53g · Proteínas: 5,5g · Gorduras Totais: 24g',
      servingTemperature: 'Servir a 35°C para amolecer o toffee e o chocolate',
    },
    variations: createVariations(17.0, 'CL005', [30, 10, 6, 4]),
  },

  // ==================== CATEGORIA 2: RECHEADOS ARTESANAIS (5 PRODUTOS) ====================
  {
    id: 'c2-gianduia-avela',
    sku: 'ATC-RC-001',
    name: 'Gianduia Real & Creme de Avelã Piemontesa Tostada',
    categoryId: 'recheados',
    categoryName: 'Recheados Artesanais',
    tagline: 'Massa de cacau aveludada recheada com 50g de pasta pura de avelã e chocolate gianduia derretido.',
    description:
      'Nosso recheado mais vendido. O núcleo de gianduia artesanal (45% avelãs tostadas moídas em moinho de pedra + chocolate ao leite belga) é congelado em semiesferas antes de ser envolto pela massa.',
    basePrice: 21.5,
    image: catStuffedImg,
    fallbackGradient: 'from-[#3B2314] to-[#1A0F08]',
    featured: true,
    dietaryNotes: ['50g de Recheio Cremoso', 'Avelã 45%', 'Centro Vulcão'],
    technicalSpec: {
      netWeight: '135g por unidade (85g massa + 50g recheio)',
      dimensions: 'Diâmetro 92mm · Altura central 34mm',
      bakeProfile: '192°C por 10m30s · Choque térmico do núcleo congelado mantém o recheio fluido',
      moistureAndTexture: 'Massa estruturada macia com interior 100% cremoso de viscosidade controlada',
      originIngredients:
        'Massa de cacau Callebaut, pasta pura de avelã tostada, chocolate gianduia 36%, manteiga extra, farinha de trigo, açúcar mascavo, ovos, avelãs granuladas na cobertura.',
      allergens: 'Contém trigo (glúten), avelãs, leite, ovos e soja.',
      shelfLife: '5 dias em temperatura ambiente · 45 dias congelado',
      nutritionPer100g: '475 kcal · Carboidratos: 50g · Proteínas: 6,8g · Gorduras Totais: 27g',
      servingTemperature: 'Ideal a 42°C (aquecer 15s no micro-ondas para efeito vulcão)',
    },
    variations: createVariations(21.5, 'RC001', [42, 16, 10, 6]),
  },
  {
    id: 'c2-redvelvet-creamcheese',
    sku: 'ATC-RC-002',
    name: 'Red Velvet Cacau Rubi & Cream Cheese de Madagascar',
    categoryId: 'recheados',
    categoryName: 'Recheados Artesanais',
    tagline: 'Massa vermelho-profundo com toque de cacau e buttermilk, recheada com frosting denso de cream cheese e baunilha.',
    description:
      'Fugimos de massas artificiais: nosso Red Velvet utiliza reação natural de cacau não alcalino com leitelho (buttermilk) ácido, envolvendo um recheio aveludado de cream cheese Philadelphia e fava de baunilha.',
    basePrice: 20.5,
    image: catStuffedImg,
    fallbackGradient: 'from-[#5A1818] to-[#2B0B0B]',
    dietaryNotes: ['Cream Cheese Autêntico', 'Fava de Baunilha', 'Gotas de Chocolate Branco'],
    technicalSpec: {
      netWeight: '135g por unidade (85g massa + 50g recheio)',
      dimensions: 'Diâmetro 90mm · Altura central 35mm',
      bakeProfile: '186°C por 11 min · Temperatura moderada para não dourar excessivamente o tom rubi',
      moistureAndTexture: 'Aw 0,72 · Massa extremamente macia tipo bolo denso e recheio cremoso levemente ácido',
      originIngredients:
        'Cream cheese integral, farinha de trigo, manteiga sem sal, chocolate branco belga, açúcar de confeiteiro impalpável, cacau natural, buttermilk fermentado, ovos, extrato de beterraba e páprica doce, fava de baunilha.',
      allergens: 'Contém trigo (glúten), leite e derivados, ovos e soja.',
      shelfLife: '3 dias em ambiente fresco (até 21°C) ou 7 dias refrigerado (4°C)',
      nutritionPer100g: '438 kcal · Carboidratos: 48g · Proteínas: 5,9g · Gorduras Totais: 24g',
      servingTemperature: 'Servir a 28°C (10s de micro-ondas) ou gelado (8°C) estilo cheesecake',
    },
    variations: createVariations(20.5, 'RC002', [29, 12, 7, 4]),
  },
  {
    id: 'c2-docedeleite-uruguaio',
    sku: 'ATC-RC-003',
    name: 'Doce de Leite Uruguaio Conaprole & Flor de Sal',
    categoryId: 'recheados',
    categoryName: 'Recheados Artesanais',
    tagline: 'Massa dourada de baunilha e canela recheada com doce de leite de tacho uruguaio e toque de sal marinho.',
    description:
      'Utilizamos doce de leite uruguaio de alta concentração de sólidos lácteos (68° Brix), que não ferve nem escapa durante o forneamento, mantendo textura cremosa intensa.',
    basePrice: 19.5,
    image: catStuffedImg,
    fallbackGradient: 'from-[#613B16] to-[#2E1B09]',
    dietaryNotes: ['Doce de Leite 68° Brix', 'Contraste Salgado', 'Sem Amido Adicionado'],
    technicalSpec: {
      netWeight: '135g por unidade (85g massa + 50g recheio)',
      dimensions: 'Diâmetro 92mm · Altura central 33mm',
      bakeProfile: '190°C por 10m30s · Polvilhado com flor de sal imediatamente na saída do forno',
      moistureAndTexture: 'Contraste entre a massa amanteigada estruturada e o centro de doce de leite denso',
      originIngredients:
        'Doce de leite uruguaio integral, farinha de trigo tipo 1, manteiga extra, açúcar mascavo e refinado, gotas de chocolate ao leite 33%, ovos caipiras, flor de sal.',
      allergens: 'Contém trigo (glúten), leite, ovos e derivados de soja.',
      shelfLife: '6 dias em temperatura ambiente · 45 dias congelado',
      nutritionPer100g: '449 kcal · Carboidratos: 57g · Proteínas: 6,1g · Gorduras Totais: 21g',
      servingTemperature: 'Ideal a 38°C para o doce de leite fluir ao partir o cookie',
    },
    variations: createVariations(19.5, 'RC003', [34, 13, 8, 5]),
  },
  {
    id: 'c2-duplo-ganache-kinder',
    sku: 'ATC-RC-004',
    name: 'Ganache Láctea de Avelã Branca & Chocolate Ao Leite 40%',
    categoryId: 'recheados',
    categoryName: 'Recheados Artesanais',
    tagline: 'Massa mesclada de baunilha e cacau recheada com creme lácteo de avelã branca e barras de chocolate ao leite.',
    description:
      'Inspirado na confeitaria centro-europeia. O recheio combina creme de leite fresco reduzido, chocolate branco, pasta de avelã levemente tostada e pedaços crocantes de wafer.',
    basePrice: 21.0,
    image: catStuffedImg,
    fallbackGradient: 'from-[#4A2F1D] to-[#22150D]',
    dietaryNotes: ['Massa Mesclada', 'Ganache de Avelã Branca', 'Inclusão de Wafer Crocante'],
    technicalSpec: {
      netWeight: '135g por unidade (85g massa + 50g recheio)',
      dimensions: 'Diâmetro 93mm · Altura central 34mm',
      bakeProfile: '188°C por 10m45s · Finalizado com barra láctea derretida pelo calor residual',
      moistureAndTexture: 'Aw 0,69 · Textura dupla cremosa e crocante no interior',
      originIngredients:
        'Farinha de trigo, manteiga sem sal, chocolate ao leite 40% cacau, chocolate branco, pasta de avelã, leite em pó integral, feuilletine (wafer francês crocante), açúcar mascavo, ovos.',
      allergens: 'Contém trigo (glúten), avelã, leite, ovos e soja.',
      shelfLife: '5 dias em temperatura ambiente · 45 dias congelado',
      nutritionPer100g: '472 kcal · Carboidratos: 52g · Proteínas: 6,4g · Gorduras Totais: 26g',
      servingTemperature: 'Servir a 36°C (12s no micro-ondas)',
    },
    variations: createVariations(21.0, 'RC004', [25, 9, 6, 3]),
  },
  {
    id: 'c2-caramelo-praline',
    sku: 'ATC-RC-005',
    name: 'Caramelo Salgado de Baunilha & Praliné de Amêndoas',
    categoryId: 'recheados',
    categoryName: 'Recheados Artesanais',
    tagline: 'Recheio duplo de caramelo mou com manteiga salgada e praliné crocante de amêndoas californianas.',
    description:
      'Para quem busca complexidade de texturas: dentro do cookie há uma camada de praliné 60% amêndoas tostadas e uma camada de caramelo mou cozido a 118°C com creme fresco.',
    basePrice: 20.0,
    image: catStuffedImg,
    fallbackGradient: 'from-[#573412] to-[#291807]',
    dietaryNotes: ['Caramelo Cozido a 118°C', 'Praliné de Pedra', 'Amêndoas Tostadas'],
    technicalSpec: {
      netWeight: '135g por unidade (85g massa + 50g recheio)',
      dimensions: 'Diâmetro 92mm · Altura central 32mm',
      bakeProfile: '185°C por 11 min · Selagem reforçada na base da massa',
      moistureAndTexture: 'Recheio elástico e brilhante com crocância cristalina do praliné',
      originIngredients:
        'Amêndoas laminadas e inteiras, creme de leite 35% gordura, manteiga com sal da Bretanha, açúcar cristal, glucose de milho, farinha de trigo, chocolate meio amargo, ovos.',
      allergens: 'Contém trigo (glúten), amêndoas, leite, ovos e soja.',
      shelfLife: '6 dias em temperatura ambiente · 45 dias congelado',
      nutritionPer100g: '462 kcal · Carboidratos: 54g · Proteínas: 6,0g · Gorduras Totais: 25g',
      servingTemperature: 'Servir a 34°C para fluidez ideal do caramelo',
    },
    variations: createVariations(20.0, 'RC005', [19, 8, 5, 3]),
  },

  // ==================== CATEGORIA 3: EDIÇÕES GOURMET & AUTORAIS (5 PRODUTOS) ====================
  {
    id: 'c3-pistache-iraniano',
    sku: 'ATC-GM-001',
    name: 'Pistache Iraniano Kerman Puro & Chocolate Branco 33%',
    categoryId: 'gourmet',
    categoryName: 'Edições Gourmet & Autorais',
    tagline: 'Massa verde natural de pasta 100% pistache iraniano, recheada com ganache de pistache e grãos tostados.',
    description:
      'Elaborado sem corantes ou aromas sintéticos. Usamos pasta pura de pistache verde de Kerman tanto na emulsão da massa quanto no recheio cremoso, finalizado com pistaches inteiros sem pele.',
    basePrice: 24.5,
    image: catGourmetImg,
    fallbackGradient: 'from-[#364928] to-[#1A2413]',
    featured: true,
    dietaryNotes: ['Pistache 100% Puro', 'Sem Corantes Artificiais', 'Maturação 72h'],
    technicalSpec: {
      netWeight: '125g por unidade (±3g)',
      dimensions: 'Diâmetro 92mm · Altura central 32mm',
      bakeProfile: '176°C por 11 min · Temperatura mais baixa para preservar a clorofila natural do pistache',
      moistureAndTexture: 'Aw 0,69 · Textura amanteigada ultra-macia com centro cremoso de pistache',
      originIngredients:
        'Pasta pura de pistache iraniano (28% da receita), pistaches inteiros tostados, chocolate branco Callebaut Velvet 33%, manteiga extra sem sal, farinha de trigo, açúcar demerara claro, ovos, flor de sal.',
      allergens: 'Contém trigo (glúten), pistache, leite, ovos e soja.',
      shelfLife: '6 dias em temperatura ambiente · 45 dias congelado',
      nutritionPer100g: '482 kcal · Carboidratos: 46g · Proteínas: 8,1g · Gorduras Totais: 29g',
      servingTemperature: 'Servir a 32°C (8s no micro-ondas) para realçar os óleos essenciais do pistache',
    },
    variations: createVariations(24.5, 'GM001', [36, 15, 9, 5]),
  },
  {
    id: 'c3-matcha-yuzu',
    sku: 'ATC-GM-002',
    name: 'Matcha Cerimonial de Uji, Chocolate Branco & Gel de Yuzu',
    categoryId: 'gourmet',
    categoryName: 'Edições Gourmet & Autorais',
    tagline: 'Umami profundo do chá verde japonês primeira colheita com notas cítricas aromáticas de yuzu.',
    description:
      'Equilíbrio oriental de confeitaria contemporânea: o amargor elegante e rico em L-teanina do Matcha de Uji corta a doçura do chocolate branco, enquanto o centro traz compota cítrica de yuzu.',
    basePrice: 23.5,
    image: catGourmetImg,
    fallbackGradient: 'from-[#283E24] to-[#131F11]',
    dietaryNotes: ['Matcha Primeira Colheita', 'Yuzu Importado', 'Perfil Umami & Cítrico'],
    technicalSpec: {
      netWeight: '120g por unidade (±3g)',
      dimensions: 'Diâmetro 90mm · Altura central 30mm',
      bakeProfile: '174°C por 11 min em assadeira dupla isolada para evitar oxidação térmica do matcha',
      moistureAndTexture: 'Aw 0,68 · Miolo macio verde-jade com centro de ganache cítrica de yuzu',
      originIngredients:
        'Matcha cerimonial de Uji (Kyoto, Japão), chocolate branco 33%, suco e raspas de yuzu japonês, manteiga extra, farinha de trigo tipo 1, açúcar orgânico claro, ovos caipiras.',
      allergens: 'Contém trigo (glúten), leite, ovos e soja.',
      shelfLife: '5 dias em embalagem opaca protegida da luz · 45 dias congelado',
      nutritionPer100g: '440 kcal · Carboidratos: 51g · Proteínas: 6,2g · Gorduras Totais: 23g',
      servingTemperature: 'Melhor apreciado em temperatura ambiente (22°C)',
    },
    variations: createVariations(23.5, 'GM002', [18, 7, 4, 2]),
  },
  {
    id: 'c3-ruby-framboesa',
    sku: 'ATC-GM-003',
    name: 'Chocolate Ruby RB1, Framboesa Liofilizada & Rosas',
    categoryId: 'gourmet',
    categoryName: 'Edições Gourmet & Autorais',
    tagline: 'O quarto tipo de chocolate com acidez frutada natural, framboesas crocantes e água de rosas orgânica.',
    description:
      'Inspirado no clássico Ispahan parisiense. A massa clara de baunilha e amêndoas recebe moedas de chocolate Ruby RB1, framboesas liofilizadas inteiras e um toque sutil de hidrolato de rosas.',
    basePrice: 23.0,
    image: catGourmetImg,
    fallbackGradient: 'from-[#5E2338] to-[#2C0F19]',
    dietaryNotes: ['Chocolate Ruby RB1', 'Fruta Liofilizada', 'Inspiração Parisiense'],
    technicalSpec: {
      netWeight: '120g por unidade (±3g)',
      dimensions: 'Diâmetro 92mm · Altura central 28mm',
      bakeProfile: '180°C por 10m30s · Aplicação de cristais de framboesa pós-forno',
      moistureAndTexture: 'Aw 0,66 · Massa amanteigada com farinha de amêndoas e notas ácidas vibrantes',
      originIngredients:
        'Chocolate Callebaut Ruby RB1 (47,3% cacau), framboesas liofilizadas, farinha de amêndoas, farinha de trigo, manteiga sem sal, açúcar refinado, ovos, água de rosas damascena.',
      allergens: 'Contém trigo (glúten), amêndoas, leite, ovos e soja.',
      shelfLife: '6 dias em local seco · 45 dias congelado',
      nutritionPer100g: '452 kcal · Carboidratos: 52g · Proteínas: 6,1g · Gorduras Totais: 24g',
      servingTemperature: 'Servir a 24°C para preservar a crocância da framboesa liofilizada',
    },
    variations: createVariations(23.0, 'GM003', [21, 8, 5, 3]),
  },
  {
    id: 'c3-cafe-cardamomo',
    sku: 'ATC-GM-004',
    name: 'Café Bourbon Amarelo Microlote, Caramelo & Cardamomo',
    categoryId: 'gourmet',
    categoryName: 'Edições Gourmet & Autorais',
    tagline: 'Infusão a frio de café especial da Mantiqueira (86 pontos SCA) com sementes de cardamomo verde e chocolate 54%.',
    description:
      'A manteiga é infusionada por 12 horas com grãos de café Bourbon Amarelo torra média e cápsulas de cardamomo verde recém-moídas, resultando em um cookie aromático e sofisticado.',
    basePrice: 21.0,
    image: catGourmetImg,
    fallbackGradient: 'from-[#3D281A] to-[#1C120B]',
    dietaryNotes: ['Café 86 pts SCA', 'Cardamomo Verde Moído', 'Infusão na Manteiga'],
    technicalSpec: {
      netWeight: '120g por unidade (±3g)',
      dimensions: 'Diâmetro 94mm · Altura central 27mm',
      bakeProfile: '184°C por 11 min · Perfume intenso de torrefação e especiarias',
      moistureAndTexture: 'Aw 0,67 · Borda crocante e interior macio com gotas de chocolate 54% e caramelo',
      originIngredients:
        'Café arábica Bourbon Amarelo (Serra da Mantiqueira), manteiga extra, chocolate 54,5% cacau, cardamomo verde da Guatemala, açúcar mascavo escuro, farinha de trigo, ovos.',
      allergens: 'Contém trigo (glúten), leite, ovos e soja.',
      shelfLife: '7 dias em temperatura ambiente · 60 dias congelado',
      nutritionPer100g: '446 kcal · Carboidratos: 53g · Proteínas: 5,9g · Gorduras Totais: 23g',
      servingTemperature: 'Excelente a 36°C',
    },
    variations: createVariations(21.0, 'GM004', [24, 9, 6, 3]),
  },
  {
    id: 'c3-limao-merengue',
    sku: 'ATC-GM-005',
    name: 'Curd de Limão Siciliano, Papoula & Merengue Maçaricado',
    categoryId: 'gourmet',
    categoryName: 'Edições Gourmet & Autorais',
    tagline: 'Massa cítrica com sementes de papoula azul, recheio de lemon curd amanteigado e coroa de merengue suíço.',
    description:
      'Refrescante e teatral. A massa leva zest de três limões sicilianos por batelada e sementes de papoula, recheada com curd de limão cozido em banho-maria e finalizada com merengue maçaricado.',
    basePrice: 22.0,
    image: catGourmetImg,
    fallbackGradient: 'from-[#594A1C] to-[#2B230B]',
    dietaryNotes: ['Lemon Curd Artesanal', 'Sementes de Papoula', 'Acidez Equilibrada'],
    technicalSpec: {
      netWeight: '125g por unidade (±3g)',
      dimensions: 'Diâmetro 91mm · Altura central 34mm',
      bakeProfile: '180°C por 10m30s · Finalização com maçarico culinário após resfriamento',
      moistureAndTexture: 'Aw 0,71 · Textura cremosa ácida no centro e leve crocância das sementes de papoula',
      originIngredients:
        'Limão siciliano fresco (suco e raspas), manteiga sem sal, gemas caipiras, açúcar orgânico, farinha de trigo, sementes de papoula azul importadas, claras pasteurizadas.',
      allergens: 'Contém trigo (glúten), ovos e leite.',
      shelfLife: '4 dias em ambiente fresco · 5 dias refrigerado',
      nutritionPer100g: '412 kcal · Carboidratos: 55g · Proteínas: 5,4g · Gorduras Totais: 19g',
      servingTemperature: 'Servir em temperatura ambiente (20°C) ou levemente fresco',
    },
    variations: createVariations(22.0, 'GM005', [20, 8, 5, 2]),
  },

  // ==================== CATEGORIA 4: VEGANOS & FUNCIONAIS (5 PRODUTOS) ====================
  {
    id: 'c4-vegano-cacau-amendoas',
    sku: 'ATC-VF-001',
    name: 'Cacau 70% Amazônia, Pasta de Amêndoas & Flor de Sal (Vegano)',
    categoryId: 'veganos',
    categoryName: 'Veganos & Funcionais',
    tagline: '100% Plant-Based. Emulsão de pasta de amêndoas tostadas, óleo de coco extravirgem e chocolate 70% da Amazônia.',
    description:
      'Prova de que a confeitaria vegana técnica entrega textura idদ্বêntica ou superior à tradicional. A gordura da amêndoa tostada substitui a manteiga láctea mantendo umidade prolongada.',
    basePrice: 19.0,
    image: catVeganImg,
    fallbackGradient: 'from-[#2D221B] to-[#16100D]',
    featured: true,
    dietaryNotes: ['100% Vegano', 'Sem Lactose', 'Cacau Nativo 70%'],
    technicalSpec: {
      netWeight: '110g por unidade (±3g)',
      dimensions: 'Diâmetro 90mm · Altura central 26mm',
      bakeProfile: '178°C por 11 min · Estabilização lipídica em grade por 25 min',
      moistureAndTexture: 'Aw 0,67 · Centro fudgy rico em cacau e borda delicadamente crocante',
      originIngredients:
        'Pasta integral de amêndoas tostadas, chocolate 70% cacau vegano (sem leite), açúcar de coco e demerara orgânico, farinha de trigo orgânica, leite de amêndoas, linhaça dourada hidratada, óleo de coco, flor de sal.',
      allergens: 'Contém trigo (glúten) e amêndoas. Zero leite, zero ovos.',
      shelfLife: '9 dias em temperatura ambiente · 60 dias congelado',
      nutritionPer100g: '435 kcal · Carboidratos: 44g · Proteínas: 7,8g · Gorduras Totais: 25g (insaturadas)',
      servingTemperature: 'Ideal a 35°C (10s no micro-ondas)',
    },
    variations: createVariations(19.0, 'VF001', [31, 12, 7, 4]),
  },
  {
    id: 'c4-semgluten-banana-castanha',
    sku: 'ATC-VF-002',
    name: 'Banana Nanica Caramelizada, Castanha-do-Pará & Canela (Vegano & Sem Glúten)',
    categoryId: 'veganos',
    categoryName: 'Veganos & Funcionais',
    tagline: 'Mix de farinhas de amêndoas, aveia sem glúten e arroz integral com banana caramelizada e chocolate 65%.',
    description:
      'Desenvolvido em bancada dedicada livre de glúten e lácteos. A banana nanica madura é reduzida no forno para concentrar açúcares naturais sem excesso de água livre.',
    basePrice: 19.5,
    image: catVeganImg,
    fallbackGradient: 'from-[#47331E] to-[#23190E]',
    dietaryNotes: ['Vegano', 'Sem Glúten', 'Castanha-do-Pará Nativa'],
    technicalSpec: {
      netWeight: '110g por unidade (±3g)',
      dimensions: 'Diâmetro 90mm · Altura central 25mm',
      bakeProfile: '180°C por 12 min · Douramento lento dos açúcares da fruta',
      moistureAndTexture: 'Aw 0,70 · Textura macia e úmida com crocância da castanha-do-pará tostada',
      originIngredients:
        'Farinha de aveia certificada sem glúten, farinha de amêndoas, banana nanica assada, castanha-do-pará, chocolate 65% vegano, óleo de coco sem sabor, açúcar mascavo orgânico, canela do Ceilão.',
      allergens: 'Contém amêndoas e castanha-do-pará. Não contém glúten, leite ou ovos.',
      shelfLife: '6 dias em temperatura ambiente · 45 dias congelado',
      nutritionPer100g: '408 kcal · Carboidratos: 43g · Proteínas: 7,4g · Gorduras Totais: 22g',
      servingTemperature: 'Servir a 32°C',
    },
    variations: createVariations(19.5, 'VF002', [23, 9, 5, 3]),
  },
  {
    id: 'c4-proteico-whey-amendoim',
    sku: 'ATC-VF-003',
    name: 'Proteico 22g Whey Isolado, Pasta de Amendoim & Chocolate 70%',
    categoryId: 'veganos',
    categoryName: 'Veganos & Funcionais',
    tagline: '22g de proteína por unidade com textura real de confeitaria — sem aspecto seco ou residual de adoçante.',
    description:
      'Formulamos a proporção exata entre Whey Protein Isolado não desnaturado e pasta de amendoim torrado com pele para garantir maciez após o forno e saciedade nutricional.',
    basePrice: 21.0,
    image: catVeganImg,
    fallbackGradient: 'from-[#4F3624] to-[#261910]',
    dietaryNotes: ['22g Proteína / un.', 'Baixo Açúcar', 'Pasta de Amendoim Integral'],
    technicalSpec: {
      netWeight: '110g por unidade (±3g)',
      dimensions: 'Diâmetro 88mm · Altura central 27mm',
      bakeProfile: '172°C por 9m30s · Forneamento curto evita ressecamento das proteínas do soro do leite',
      moistureAndTexture: 'Aw 0,68 · Macio, denso e amanteigado com centro de pasta de amendoim cremosa',
      originIngredients:
        'Pasta de amendoim integral torrado, Whey Protein Isolado sabor baunilha natural, aveia em flocos finos, chocolate 70% adoçado com maltitol e stevia, ovos caipiras, manteiga ghee, eritritol.',
      allergens: 'Contém amendoim, derivados de leite (whey), aveia e ovos.',
      shelfLife: '7 dias em embalagem selada · 45 dias congelado',
      nutritionPer100g: '392 kcal · Carboidratos: 26g · Proteínas: 20g (22g por cookie) · Gorduras: 23g',
      servingTemperature: 'Servir em temperatura ambiente ou 8s no micro-ondas',
    },
    variations: createVariations(21.0, 'VF003', [28, 11, 6, 4]),
  },
  {
    id: 'c4-zeroacucar-coco-chia',
    sku: 'ATC-VF-004',
    name: 'Zero Açúcar Adicionado: Coco Queimado, Chia & Chocolate 85%',
    categoryId: 'veganos',
    categoryName: 'Veganos & Funcionais',
    tagline: 'Adoçado com alulose e fibras prebióticas (polidextrose), lascas de coco queimado no forno e cacau 85%.',
    description:
      'Usamos alulose culinária, que carameliza exatamente como a sacarose na reação de Maillard sem elevar a glicemia e sem o efeito gelado na boca típico de polióis comuns.',
    basePrice: 20.5,
    image: catVeganImg,
    fallbackGradient: 'from-[#33261E] to-[#17110D]',
    dietaryNotes: ['Zero Açúcar Adicionado', 'Baixo Índice Glicêmico', 'Rico em Fibras'],
    technicalSpec: {
      netWeight: '110g por unidade (±3g)',
      dimensions: 'Diâmetro 90mm · Altura central 24mm',
      bakeProfile: '175°C por 11 min · Caramelização controlada da alulose',
      moistureAndTexture: 'Aw 0,65 · Textura crocante nas bordas com fitas de coco queimado e miolo úmido',
      originIngredients:
        'Farinha de amêndoas, farinha de coco, alulose, polidextrose (fibra solúvel), chocolate 85% cacau zero açúcar, coco em fitas tostado, óleo de coco extravirgem, sementes de chia, leite de coco.',
      allergens: 'Contém amêndoas. Sem glúten, sem lactose e sem açúcares adicionados.',
      shelfLife: '10 dias em temperatura ambiente · 60 dias congelado',
      nutritionPer100g: '378 kcal · Carboidratos líquidos: 14g · Fibras: 11g · Proteínas: 8,2g · Gorduras: 28g',
      servingTemperature: 'Servir a 22°C–28°C',
    },
    variations: createVariations(20.5, 'VF004', [19, 7, 4, 2]),
  },
  {
    id: 'c4-tamaras-tahine-gergelim',
    sku: 'ATC-VF-005',
    name: 'Tâmaras Medjool, Tahine Artesanal & Gergelim Negro (Vegano)',
    categoryId: 'veganos',
    categoryName: 'Veganos & Funcionais',
    tagline: 'Dulçor natural de tâmaras Medjool caramelizadas com pasta de gergelim (tahine) e chocolate amargo 70%.',
    description:
      'Inspirado na confeitaria do Mediterrâneo Oriental. O tahine de gergelim cru tostado confere untuosidade salgada que corta o caramelo natural das tâmaras Medjool.',
    basePrice: 20.0,
    image: catVeganImg,
    fallbackGradient: 'from-[#2A2421] to-[#14110F]',
    dietaryNotes: ['100% Vegano', 'Adoçado c/ Tâmaras Medjool', 'Tahine de Pedra'],
    technicalSpec: {
      netWeight: '110g por unidade (±3g)',
      dimensions: 'Diâmetro 91mm · Altura central 25mm',
      bakeProfile: '180°C por 11 min · Crosta de gergelim branco e negro tostado',
      moistureAndTexture: 'Aw 0,68 · Textura densa, amanteigada pelo tahine e pedaços macios de tâmara',
      originIngredients:
        'Tahine 100% gergelim, tâmaras Medjool sem caroço, chocolate 70% cacau vegano, farinha de trigo integral orgânica, xarope de bordo (maple) puro, gergelim negro e dourado, flor de sal.',
      allergens: 'Contém trigo (glúten) e gergelim. Zero leite, zero ovos.',
      shelfLife: '9 dias em temperatura ambiente · 60 dias congelado',
      nutritionPer100g: '428 kcal · Carboidratos: 47g · Proteínas: 8,5g · Gorduras Totais: 23g',
      servingTemperature: 'Excelente a 30°C acompanhado de café espresso',
    },
    variations: createVariations(20.0, 'VF005', [22, 8, 5, 3]),
  },
];

function buildMonthlyReport(
  monthId: string,
  monthLabel: string,
  quarter: string,
  scaleFactor: number,
  repeatRate: number,
  wasteRate: number,
  ownerNotes: string
): MonthlyReportData {
  const baseUnitSales: Record<string, { units: number; topVar: string; retRate: number }> = {
    'c1-belga-flordesal': { units: 640, topVar: 'Caixa Degustação 4 un.', retRate: 64.2 },
    'c1-macadamia-branco': { units: 410, topVar: 'Unidade Individual', retRate: 51.0 },
    'c1-triplo-cacau': { units: 485, topVar: 'Caixa Degustação 4 un.', retRate: 58.4 },
    'c1-aveia-peca-rum': { units: 295, topVar: 'Unidade Individual', retRate: 49.5 },
    'c1-manteiga-noisette': { units: 390, topVar: 'Caixa Degustação 4 un.', retRate: 55.8 },

    'c2-gianduia-avela': { units: 780, topVar: 'Caixa Degustação 4 un.', retRate: 71.5 },
    'c2-redvelvet-creamcheese': { units: 520, topVar: 'Unidade Individual', retRate: 60.1 },
    'c2-docedeleite-uruguaio': { units: 560, topVar: 'Caixa Degustação 4 un.', retRate: 62.8 },
    'c2-duplo-ganache-kinder': { units: 490, topVar: 'Lata Colecionável 6 un.', retRate: 59.0 },
    'c2-caramelo-praline': { units: 370, topVar: 'Unidade Individual', retRate: 52.3 },

    'c3-pistache-iraniano': { units: 710, topVar: 'Lata Colecionável 6 un.', retRate: 68.9 },
    'c3-matcha-yuzu': { units: 260, topVar: 'Unidade Individual', retRate: 47.2 },
    'c3-ruby-framboesa': { units: 330, topVar: 'Lata Colecionável 6 un.', retRate: 53.6 },
    'c3-cafe-cardamomo': { units: 310, topVar: 'Unidade Individual', retRate: 50.4 },
    'c3-limao-merengue': { units: 285, topVar: 'Caixa Degustação 4 un.', retRate: 48.9 },

    'c4-vegano-cacau-amendoas': { units: 460, topVar: 'Caixa Degustação 4 un.', retRate: 65.0 },
    'c4-semgluten-banana-castanha': { units: 340, topVar: 'Unidade Individual', retRate: 57.1 },
    'c4-proteico-whey-amendoim': { units: 495, topVar: 'Caixa Atelier 12 un.', retRate: 66.8 },
    'c4-zeroacucar-coco-chia': { units: 315, topVar: 'Caixa Degustação 4 un.', retRate: 61.2 },
    'c4-tamaras-tahine-gergelim': { units: 275, topVar: 'Unidade Individual', retRate: 54.0 },
  };

  const flavorMetrics: FlavorSalesMetric[] = INITIAL_COOKIE_PRODUCTS.map((p) => {
    const base = baseUnitSales[p.id] || { units: 300, topVar: 'Unidade Individual', retRate: 50 };
    const unitsSold = Math.round(base.units * scaleFactor);
    const avgRevenuePerUnit = p.basePrice * 0.94;
    const revenue = Math.round(unitsSold * avgRevenuePerUnit * 100) / 100;
    const cost = Math.round(revenue * 0.33 * 100) / 100;
    const grossMarginPct = Math.round(((revenue - cost) / revenue) * 1000) / 10;

    return {
      productId: p.id,
      productName: p.name,
      categoryId: p.categoryId,
      categoryName: p.categoryName,
      unitsSold,
      revenue,
      cost,
      grossMarginPct,
      topVariation: base.topVar,
      returnRatePct: base.retRate,
    };
  });

  const grossRevenue = Math.round(flavorMetrics.reduce((acc, f) => acc + f.revenue, 0) * 100) / 100;
  const totalUnitsSold = flavorMetrics.reduce((acc, f) => acc + f.unitsSold, 0);
  const cogs = Math.round(flavorMetrics.reduce((acc, f) => acc + f.cost, 0) * 100) / 100;
  const netRevenue = Math.round(grossRevenue * 0.915 * 100) / 100;
  const operatingExpenses = Math.round(grossRevenue * 0.24 * 100) / 100;
  const netProfit = Math.round((netRevenue - cogs - operatingExpenses) * 100) / 100;
  const netMarginPct = Math.round((netProfit / grossRevenue) * 1000) / 10;
  const totalOrders = Math.round(totalUnitsSold / 4.2);
  const averageTicket = Math.round((grossRevenue / totalOrders) * 100) / 100;

  const categorySplit = CATEGORIES.map((cat) => {
    const catItems = flavorMetrics.filter((f) => f.categoryId === cat.id);
    const rev = Math.round(catItems.reduce((a, b) => a + b.revenue, 0) * 100) / 100;
    const un = catItems.reduce((a, b) => a + b.unitsSold, 0);
    return {
      categoryId: cat.id,
      categoryName: cat.name,
      revenue: rev,
      units: un,
      sharePct: Math.round((rev / grossRevenue) * 1000) / 10,
    };
  });

  const variationSplit = [
    {
      variationLabel: 'Unidade Individual (1 un.)',
      ordersCount: Math.round(totalOrders * 0.36),
      revenue: Math.round(grossRevenue * 0.22 * 100) / 100,
      sharePct: 22.0,
    },
    {
      variationLabel: 'Caixa Degustação (4 un.)',
      ordersCount: Math.round(totalOrders * 0.38),
      revenue: Math.round(grossRevenue * 0.41 * 100) / 100,
      sharePct: 41.0,
    },
    {
      variationLabel: 'Lata Colecionável (6 un.)',
      ordersCount: Math.round(totalOrders * 0.17),
      revenue: Math.round(grossRevenue * 0.23 * 100) / 100,
      sharePct: 23.0,
    },
    {
      variationLabel: 'Caixa Atelier Eventos (12 un.)',
      ordersCount: Math.round(totalOrders * 0.09),
      revenue: Math.round(grossRevenue * 0.14 * 100) / 100,
      sharePct: 14.0,
    },
  ];

  const recentOrders: OrderRecord[] = [
    {
      id: `PED-${monthId.toUpperCase()}-904`,
      timestamp: 'Hoje · 14:22',
      customerName: 'Helena Vasconcelos',
      channel: 'E-commerce Direto',
      itemsSummary: '1x Lata 6 un. Pistache Iraniano, 1x Caixa 4 un. Gianduia Real',
      totalUnits: 10,
      totalValue: 214.0,
      status: 'Concluído',
    },
    {
      id: `PED-${monthId.toUpperCase()}-903`,
      timestamp: 'Hoje · 11:48',
      customerName: 'Estúdio Arquitetura Kengo',
      channel: 'Corporativo B2B',
      itemsSummary: '3x Caixa Atelier 12 un. (Belga 54%, Triplo Cacau, Caramelo Salgado)',
      totalUnits: 36,
      totalValue: 564.3,
      status: 'Expedido',
    },
    {
      id: `PED-${monthId.toUpperCase()}-902`,
      timestamp: 'Ontem · 18:05',
      customerName: 'Rafael Mendonça',
      channel: 'Balcão Atelier',
      itemsSummary: '1x Caixa 4 un. Proteico Whey 22g, 2x Un. Cacau 70% Amazônia Vegano',
      totalUnits: 6,
      totalValue: 116.75,
      status: 'Concluído',
    },
    {
      id: `PED-${monthId.toUpperCase()}-901`,
      timestamp: 'Ontem · 15:30',
      customerName: 'Beatriz Alencar',
      channel: 'E-commerce Direto',
      itemsSummary: '1x Lata 6 un. Red Velvet Cream Cheese, 1x Un. Matcha & Yuzu',
      totalUnits: 7,
      totalValue: 135.2,
      status: 'Concluído',
    },
  ];

  return {
    monthId,
    monthLabel,
    quarter,
    grossRevenue,
    netRevenue,
    cogs,
    operatingExpenses,
    netProfit,
    netMarginPct,
    totalOrders,
    totalUnitsSold,
    averageTicket,
    repeatPurchaseRatePct: repeatRate,
    lossAndWastePct: wasteRate,
    categorySplit,
    variationSplit,
    flavorMetrics,
    recentOrders,
    ownerNotes,
  };
}

export const INITIAL_MONTHLY_REPORTS: MonthlyReportData[] = [
  buildMonthlyReport(
    '2026-10',
    'Outubro 2026 (Mês Atual)',
    'Q4 · 2026',
    1.18,
    64.8,
    1.4,
    'Alta procura por Latas Colecionáveis de Pistache Iraniano e Gianduia Real no início do 4º trimestre. Margem bruta expandiu +1,8 p.p. após negociação direta de chocolate Callebaut em sacas de 10kg.'
  ),
  buildMonthlyReport(
    '2026-09',
    'Setembro 2026',
    'Q3 · 2026',
    1.08,
    62.4,
    1.6,
    'Lançamento da linha Veganos & Funcionais impulsionou recompra semanal de clientes fitness (Proteico 22g Whey liderou pedidos de Caixas Atelier 12 un.).'
  ),
  buildMonthlyReport(
    '2026-08',
    'Agosto 2026',
    'Q3 · 2026',
    1.02,
    60.9,
    1.8,
    'Campanha de Inverno do Café Bourbon Amarelo & Cardamomo e Triplo Cacau aumentou o ticket médio no e-commerce próprio em 14%.'
  ),
  buildMonthlyReport(
    '2026-07',
    'Julho 2026',
    'Q3 · 2026',
    1.12,
    61.5,
    1.5,
    'Férias de julho elevaram vendas da linha Recheados Artesanais (Gianduia, Doce de Leite Uruguaio e Kinder) no balcão e delivery.'
  ),
  buildMonthlyReport(
    '2026-06',
    'Junho 2026',
    'Q2 · 2026',
    0.96,
    58.7,
    1.9,
    'Padronização do ultracongelamento de núcleos recheados reduziu perdas técnicas de forneamento de 3,1% para 1,9%.'
  ),
  buildMonthlyReport(
    '2026-05',
    'Maio 2026',
    'Q2 · 2026',
    1.05,
    59.8,
    2.1,
    'Dia das Mães gerou recorde na variação Lata Colecionável 6 un. para os sabores Ruby & Framboesa e Pistache Iraniano.'
  ),
];
