import React, { useState, useMemo } from 'react';
import {
  ShoppingBag,
  MessageSquare,
  Search,
  Store,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  SlidersHorizontal,
  KeyRound,
  Check,
  Lock,
  LogOut,
  Eye,
  EyeOff,
} from 'lucide-react';
import {
  CATEGORIES,
  INITIAL_COOKIE_PRODUCTS,
  INITIAL_MONTHLY_REPORTS,
  HERO_IMAGE,
  CookieProduct,
  ProductVariation,
  CategoryId,
  MonthlyReportData,
} from './data/cookiesData';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { SellerDashboard } from './components/SellerDashboard';
import { ChatbotDrawer } from './components/ChatbotDrawer';
import { CartDrawer, CartItem } from './components/CartDrawer';

export function App() {
  // Core Mode: Buyer vs Seller
  const [appMode, setAppMode] = useState<'buyer' | 'seller'>('buyer');
  const [activeSellerTab, setActiveSellerTab] = useState<'inventory' | 'reports'>('reports');

  // Seller Authentication State (Nome: lojista / Senha: lojista123)
  const [isSellerAuthenticated, setIsSellerAuthenticated] = useState<boolean>(false);
  const [loginUsername, setLoginUsername] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');
  const [showLoginPassword, setShowLoginPassword] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleSellerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginUsername.trim() === 'lojista' && loginPassword === 'lojista123') {
      setIsSellerAuthenticated(true);
      setLoginError(null);
    } else {
      setLoginError('Usuário ou senha incorretos. Verifique suas credenciais e tente novamente.');
    }
  };

  const handleSellerLogout = () => {
    setIsSellerAuthenticated(false);
    setLoginUsername('');
    setLoginPassword('');
    setLoginError(null);
    setAppMode('buyer');
  };

  // Products & Real-Time Stock State
  const [products, setProducts] = useState<CookieProduct[]>(INITIAL_COOKIE_PRODUCTS);
  const [stockPreset, setStockPreset] = useState<'filled' | 'zero' | 'custom'>('filled');

  // Monthly Reports State
  const [monthlyReports, setMonthlyReports] = useState<MonthlyReportData[]>(
    INITIAL_MONTHLY_REPORTS
  );

  // Groq API Key State (synced between Top Control Bar & Chatbot Drawer + localStorage)
  const [groqApiKey, setGroqApiKey] = useState<string>(() => {
    try {
      return localStorage.getItem('atelier_crumb_groq_api_key') || '';
    } catch {
      return '';
    }
  });
  const [topKeySavedFeedback, setTopKeySavedFeedback] = useState<boolean>(false);

  const handleUpdateGroqApiKey = (newKey: string) => {
    setGroqApiKey(newKey);
    try {
      localStorage.setItem('atelier_crumb_groq_api_key', newKey);
    } catch {
      // ignore storage errors
    }
    setTopKeySavedFeedback(true);
    setTimeout(() => setTopKeySavedFeedback(false), 1800);
  };

  // Buyer Catalog Filtering
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<CategoryId | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedProductModal, setSelectedProductModal] = useState<CookieProduct | null>(null);

  // Shopping Cart State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  // Chatbot State
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [externalChatPrompt, setExternalChatPrompt] = useState<string | null>(null);
  const [heroImgError, setHeroImgError] = useState<boolean>(false);

  // Total live stock count across all 20 products x 4 variations
  const totalStoreStock = useMemo(() => {
    return products.reduce(
      (sum, p) => sum + p.variations.reduce((vSum, v) => vSum + v.stock, 0),
      0
    );
  }, [products]);

  // Stock Preset Handlers: Estoque Preenchido vs Estoque Zerado
  const handleSetFilledStock = () => {
    setProducts((prev) =>
      prev.map((p) => ({
        ...p,
        variations: p.variations.map((v) => ({
          ...v,
          stock: v.defaultStock,
        })),
      }))
    );
    setStockPreset('filled');
  };

  const handleSetZeroStock = () => {
    setProducts((prev) =>
      prev.map((p) => ({
        ...p,
        variations: p.variations.map((v) => ({
          ...v,
          stock: 0,
        })),
      }))
    );
    setStockPreset('zero');
  };

  const handleAddBatchStock = (delta: number) => {
    setProducts((prev) =>
      prev.map((p) => ({
        ...p,
        variations: p.variations.map((v) => ({
          ...v,
          stock: Math.max(0, v.stock + delta),
        })),
      }))
    );
    setStockPreset('custom');
  };

  const handleUpdateVariationStock = (
    productId: string,
    variationId: string,
    newStock: number
  ) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id !== productId
          ? p
          : {
              ...p,
              variations: p.variations.map((v) =>
                v.id !== variationId ? v : { ...v, stock: Math.max(0, newStock) }
              ),
            }
      )
    );
    setStockPreset('custom');
  };

  // Cart Handlers
  const handleAddToCart = (
    product: CookieProduct,
    variation: ProductVariation,
    quantity: number
  ) => {
    if (variation.stock <= 0 || quantity <= 0) return;

    setCartItems((prev) => {
      const existingIdx = prev.findIndex(
        (item) => item.product.id === product.id && item.variation.id === variation.id
      );
      if (existingIdx > -1) {
        const currentQty = prev[existingIdx].quantity;
        const nextQty = Math.min(variation.stock, currentQty + quantity);
        const updated = [...prev];
        updated[existingIdx] = { ...updated[existingIdx], quantity: nextQty };
        return updated;
      }
      return [...prev, { product, variation, quantity: Math.min(variation.stock, quantity) }];
    });
  };

  const handleUpdateCartQty = (productId: string, variationId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveCartItem(productId, variationId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId && item.variation.id === variationId
          ? { ...item, quantity: newQty }
          : item
      )
    );
  };

  const handleRemoveCartItem = (productId: string, variationId: string) => {
    setCartItems((prev) =>
      prev.filter(
        (item) => !(item.product.id === productId && item.variation.id === variationId)
      )
    );
  };

  // Complete Order: Deducts stock and updates the current Monthly Report
  const handleCompleteOrder = (
    customerName: string,
    channel: 'E-commerce Direto' | 'Balcão Atelier'
  ): string => {
    const orderId = `PED-2026-10-${Math.floor(905 + Math.random() * 90)}`;
    const orderValue = cartItems.reduce(
      (acc, i) => acc + i.variation.price * i.quantity,
      0
    );
    const orderCost = cartItems.reduce(
      (acc, i) => acc + i.variation.cost * i.quantity,
      0
    );
    const orderCookieUnits = cartItems.reduce(
      (acc, i) => acc + i.variation.unitsIncluded * i.quantity,
      0
    );
    const summaryText = cartItems
      .map((i) => `${i.quantity}x ${i.variation.label} ${i.product.name}`)
      .join(', ');

    setProducts((prev) =>
      prev.map((prod) => ({
        ...prod,
        variations: prod.variations.map((v) => {
          const bought = cartItems.find(
            (ci) => ci.product.id === prod.id && ci.variation.id === v.id
          );
          if (!bought) return v;
          return {
            ...v,
            stock: Math.max(0, v.stock - bought.quantity),
          };
        }),
      }))
    );

    setMonthlyReports((prev) =>
      prev.map((rep, idx) => {
        if (idx !== 0) return rep;
        const newGross = Math.round((rep.grossRevenue + orderValue) * 100) / 100;
        const newNet = Math.round(newGross * 0.915 * 100) / 100;
        const newCogs = Math.round((rep.cogs + orderCost) * 100) / 100;
        const newProfit =
          Math.round((newNet - newCogs - rep.operatingExpenses) * 100) / 100;
        const newOrdersCount = rep.totalOrders + 1;
        const newUnits = rep.totalUnitsSold + orderCookieUnits;

        const updatedFlavors = rep.flavorMetrics.map((fm) => {
          const matchingItems = cartItems.filter((ci) => ci.product.id === fm.productId);
          if (matchingItems.length === 0) return fm;
          const addedUnits = matchingItems.reduce(
            (s, ci) => s + ci.variation.unitsIncluded * ci.quantity,
            0
          );
          const addedRev = matchingItems.reduce(
            (s, ci) => s + ci.variation.price * ci.quantity,
            0
          );
          const addedCost = matchingItems.reduce(
            (s, ci) => s + ci.variation.cost * ci.quantity,
            0
          );
          return {
            ...fm,
            unitsSold: fm.unitsSold + addedUnits,
            revenue: Math.round((fm.revenue + addedRev) * 100) / 100,
            cost: Math.round((fm.cost + addedCost) * 100) / 100,
          };
        });

        return {
          ...rep,
          grossRevenue: newGross,
          netRevenue: newNet,
          cogs: newCogs,
          netProfit: newProfit,
          netMarginPct: Math.round((newProfit / newGross) * 1000) / 10,
          totalOrders: newOrdersCount,
          totalUnitsSold: newUnits,
          averageTicket: Math.round((newGross / newOrdersCount) * 100) / 100,
          flavorMetrics: updatedFlavors,
          recentOrders: [
            {
              id: orderId,
              timestamp: 'Agora mesmo',
              customerName,
              channel,
              itemsSummary: summaryText,
              totalUnits: orderCookieUnits,
              totalValue: orderValue,
              status: 'Em Forneamento',
            },
            ...rep.recentOrders,
          ],
        };
      })
    );

    setCartItems([]);
    return orderId;
  };

  const handleAskChatbot = (question: string) => {
    setExternalChatPrompt(question);
    setIsChatOpen(true);
  };

  const syncedModalProduct = useMemo(() => {
    if (!selectedProductModal) return null;
    return products.find((p) => p.id === selectedProductModal.id) || null;
  }, [products, selectedProductModal]);

  const totalCartItemsCount = cartItems.reduce((a, b) => a + b.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-[#18181B]">
      {/* ==================== STRICT 3-ZONE TOP BAR CONTRACT ==================== */}
      <header className="sticky top-0 z-30 bg-[#FAF9F6]/95 backdrop-blur-sm border-b border-[#18181B]/12 px-4 sm:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            setAppMode('buyer');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="font-serif text-xl font-semibold tracking-tight text-[#18181B] whitespace-nowrap shrink-0"
        >
          Atelier Crumb
        </a>

        {/* Zone 2: 5 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-[#64615A]">
          <button
            type="button"
            onClick={() => {
              setAppMode('buyer');
              document.getElementById('catalogo-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className={`hover:text-[#18181B] hover:underline underline-offset-4 transition-colors whitespace-nowrap ${
              appMode === 'buyer' ? 'text-[#18181B] font-semibold' : ''
            }`}
          >
            Catálogo (20)
          </button>
          <button
            type="button"
            onClick={() => {
              setAppMode('buyer');
              document
                .getElementById('parametros-tecnicos')
                ?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hover:text-[#18181B] hover:underline underline-offset-4 transition-colors whitespace-nowrap"
          >
            Engenharia & Forno
          </button>
          <button
            type="button"
            onClick={() => {
              setAppMode('seller');
              setActiveSellerTab('inventory');
            }}
            className={`hover:text-[#18181B] hover:underline underline-offset-4 transition-colors whitespace-nowrap ${
              appMode === 'seller' && activeSellerTab === 'inventory'
                ? 'text-[#18181B] font-semibold underline'
                : ''
            }`}
          >
            Gestão de Estoque
          </button>
          <button
            type="button"
            onClick={() => {
              setAppMode('seller');
              setActiveSellerTab('reports');
            }}
            className={`hover:text-[#18181B] hover:underline underline-offset-4 transition-colors whitespace-nowrap ${
              appMode === 'seller' && activeSellerTab === 'reports'
                ? 'text-[#18181B] font-semibold underline'
                : ''
            }`}
          >
            Relatórios Mensais
          </button>
          <button
            type="button"
            onClick={() => setIsChatOpen(true)}
            className="hover:text-[#18181B] hover:underline underline-offset-4 transition-colors whitespace-nowrap"
          >
            Bot de Atendimento
          </button>
        </nav>

        {/* Zone 3: 2 primary actions (Mode Toggle + Shopping Bag) */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => setAppMode((m) => (m === 'buyer' ? 'seller' : 'buyer'))}
            className="h-9 px-3.5 border border-[#18181B]/25 bg-white hover:bg-[#18181B] hover:text-[#FAF9F6] text-xs font-semibold text-[#18181B] transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            {appMode === 'buyer' ? (
              <>
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Modo Vendedor</span>
              </>
            ) : (
              <>
                <Store className="w-3.5 h-3.5" />
                <span>Modo Comprador</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="h-9 px-3.5 bg-[#2C1A12] hover:bg-[#18181B] text-[#FAF9F6] text-xs font-semibold transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Sacola</span>
            <span className="font-mono tabular-nums">({totalCartItemsCount})</span>
          </button>
        </div>
      </header>

      {/* ==================== OPERATIONAL SIMULATION & GROQ API KEY CONTROL BAR ==================== */}
      <div className="bg-[#F3F1EC] border-b border-[#18181B]/12 px-4 sm:px-8 py-3">
        <div className="max-w-[1360px] mx-auto flex flex-col xl:flex-row xl:items-center justify-between gap-3">
          {/* Left: Mode Switcher + Stock Toggles */}
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-[11px] font-semibold text-[#64615A] flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Controles Rápidos:</span>
            </span>

            <div className="inline-flex bg-white p-0.5 border border-[#18181B]/15">
              <button
                type="button"
                onClick={() => setAppMode('buyer')}
                className={`px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap ${
                  appMode === 'buyer'
                    ? 'bg-[#2C1A12] text-[#FAF9F6]'
                    : 'text-[#64615A] hover:text-[#18181B]'
                }`}
              >
                Modo Comprador
              </button>
              <button
                type="button"
                onClick={() => setAppMode('seller')}
                className={`px-3 py-1.5 text-xs font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                  appMode === 'seller'
                    ? 'bg-[#2C1A12] text-[#FAF9F6]'
                    : 'text-[#64615A] hover:text-[#18181B]'
                }`}
              >
                <Lock className="w-3 h-3" />
                <span>Modo Vendedor {isSellerAuthenticated ? '(Logado)' : '(Login)'}</span>
              </button>
            </div>

            <div className="inline-flex bg-white p-0.5 border border-[#18181B]/15">
              <button
                type="button"
                onClick={handleSetFilledStock}
                className={`px-3 py-1.5 text-xs font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                  totalStoreStock > 0
                    ? 'bg-[#16A34A] text-white'
                    : 'text-[#64615A] hover:text-[#18181B]'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Estoque Preenchido ({totalStoreStock > 0 ? `${totalStoreStock} un.` : 'Ativar'})</span>
              </button>

              <button
                type="button"
                onClick={handleSetZeroStock}
                className={`px-3 py-1.5 text-xs font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                  totalStoreStock === 0
                    ? 'bg-[#DC2626] text-white'
                    : 'text-[#64615A] hover:text-[#DC2626]'
                }`}
              >
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Estoque Zerado (0 un.)</span>
              </button>
            </div>
          </div>

          {/* Right: Bot Trigger */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setIsChatOpen((o) => !o)}
              className="px-3.5 py-2 bg-[#2C1A12] hover:bg-[#18181B] text-[#FAF9F6] text-xs font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Abrir Bot de Atendimento</span>
            </button>
          </div>
        </div>
      </div>

      {/* ==================== MAIN CONTENT VIEWPORT ==================== */}
      <main className="flex-1">
        {appMode === 'seller' ? (
          !isSellerAuthenticated ? (
            <div className="max-w-md mx-auto px-4 py-16 sm:py-24">
              <div className="bg-white border border-[#18181B]/15 p-6 sm:p-8 shadow-sm">
                <div className="flex items-center gap-2 text-xs text-[#64615A] font-mono">
                  <Lock className="w-3.5 h-3.5 text-[#2C1A12]" />
                  <span>ACESSO RESTRITO · CONSOLE DO LOJISTA</span>
                </div>

                <h1 className="font-serif text-2xl font-semibold text-[#18181B] mt-2">
                  Login do Modo Vendedor
                </h1>
                <p className="text-xs text-[#64615A] mt-1 leading-relaxed">
                  Insira suas credenciais de proprietário para acessar o controle de estoque das 80 variações e os relatórios financeiros mensais.
                </p>

                {loginError && (
                  <div className="mt-4 p-3 bg-[#FEF2F2] border border-[#DC2626]/30 text-xs text-[#991B1B] flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-[#DC2626] shrink-0" />
                    <span>{loginError}</span>
                  </div>
                )}

                <form onSubmit={handleSellerLogin} className="mt-5 space-y-4">
                  <div>
                    <label
                      htmlFor="seller-username"
                      className="block text-xs font-semibold text-[#18181B] mb-1.5"
                    >
                      Nome de Usuário
                    </label>
                    <input
                      id="seller-username"
                      type="text"
                      required
                      autoComplete="username"
                      value={loginUsername}
                      onChange={(e) => setLoginUsername(e.target.value)}
                      placeholder="Digite seu usuário"
                      className="w-full px-3.5 py-2.5 text-xs font-mono bg-[#FAF9F6] border border-[#18181B]/25 focus:outline-none focus:border-[#2C1A12]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="seller-password"
                      className="block text-xs font-semibold text-[#18181B] mb-1.5"
                    >
                      Senha de Acesso
                    </label>
                    <div className="relative">
                      <input
                        id="seller-password"
                        type={showLoginPassword ? 'text' : 'password'}
                        required
                        autoComplete="current-password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="Digite sua senha"
                        className="w-full pl-3.5 pr-10 py-2.5 text-xs font-mono bg-[#FAF9F6] border border-[#18181B]/25 focus:outline-none focus:border-[#2C1A12]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword((s) => !s)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64615A] hover:text-[#18181B]"
                        title={showLoginPassword ? 'Ocultar senha' : 'Mostrar senha'}
                      >
                        {showLoginPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                    <button
                      type="submit"
                      className="flex-1 h-10 px-5 bg-[#2C1A12] hover:bg-[#18181B] text-[#FAF9F6] text-xs font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Entrar no Modo Vendedor</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAppMode('buyer')}
                      className="h-10 px-4 bg-white hover:bg-[#F3F1EC] text-[#18181B] border border-[#18181B]/20 text-xs font-medium transition-colors"
                    >
                      Voltar à Loja
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div>
              {/* Seller Authenticated Bar */}
              <div className="bg-[#2C1A12] text-[#FAF9F6] px-4 sm:px-8 py-2 border-b border-[#FAF9F6]/10">
                <div className="max-w-[1360px] mx-auto flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-mono">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#86EFAC]" />
                    <span>Sessão do Lojista Ativa · Usuário: <strong>lojista</strong></span>
                  </div>
                  <button
                    type="button"
                    onClick={handleSellerLogout}
                    className="px-3 py-1 bg-white/10 hover:bg-white/20 text-[#FAF9F6] text-[11px] font-semibold transition-colors flex items-center gap-1.5"
                  >
                    <LogOut className="w-3 h-3" />
                    <span>Encerrar Sessão (Logout)</span>
                  </button>
                </div>
              </div>

              <SellerDashboard
                products={products}
                stockPreset={stockPreset}
                onSetFilledStock={handleSetFilledStock}
                onSetZeroStock={handleSetZeroStock}
                onAddBatchStock={handleAddBatchStock}
                onUpdateVariationStock={handleUpdateVariationStock}
                monthlyReports={monthlyReports}
                activeSellerTab={activeSellerTab}
                setActiveSellerTab={setActiveSellerTab}
              />
            </div>
          )
        ) : (
          <div>
            {/* SECTION 1: STOREFRONT HERO */}
            <section className="border-b border-[#18181B]/12 bg-[#FAF9F6]">
              <div className="max-w-[1360px] mx-auto px-4 sm:px-8 py-10 lg:py-14 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                <div className="lg:col-span-6 space-y-5">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#64615A]">
                    <span>Confeitaria de Precisão</span>
                    <span aria-hidden="true">·</span>
                    <span>4 Categorias Técnicas</span>
                    <span aria-hidden="true">·</span>
                    <span>20 Receitas Autorais</span>
                    <span aria-hidden="true">·</span>
                    <span>São Paulo, Brasil</span>
                  </div>

                  <h1 className="font-serif text-3xl sm:text-4xl lg:text-[42px] font-semibold text-[#18181B] leading-[1.12] tracking-tight">
                    Engenharia de forno, chocolates de origem e recheios encapsulados a frio.
                  </h1>

                  <p className="text-sm sm:text-base text-[#3F3D39] leading-relaxed max-w-[62ch]">
                    Cada batelada passa por maturação controlada de 48h a 72h a 4°C antes do
                    forneamento em pedra refratária. Explore nossas 4 categorias com ficha técnica
                    completa, 4 variações por sabor e atendimento inteligente em tempo real.
                  </p>

                  <div className="p-3.5 bg-[#F3F1EC] border border-[#18181B]/12 flex items-center justify-between gap-4 text-xs">
                    <div>
                      <span className="text-[#64615A]">Disponibilidade imediata de fornada: </span>
                      <strong
                        className={`font-mono tabular-nums ${
                          totalStoreStock === 0 ? 'text-[#DC2626]' : 'text-[#16A34A]'
                        }`}
                      >
                        {totalStoreStock === 0
                          ? 'ESTOQUE ZERADO (0 unidades disponíveis)'
                          : `${totalStoreStock} embalagens prontas nos 20 sabores`}
                      </strong>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        handleAskChatbot('Quais cookies estão disponíveis em estoque agora?')
                      }
                      className="text-xs font-semibold text-[#2C1A12] underline underline-offset-4 hover:text-[#18181B] whitespace-nowrap"
                    >
                      Consultar no Bot
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() =>
                        document
                          .getElementById('catalogo-section')
                          ?.scrollIntoView({ behavior: 'smooth' })
                      }
                      className="h-11 px-6 bg-[#2C1A12] hover:bg-[#18181B] text-[#FAF9F6] text-xs font-semibold transition-colors flex items-center gap-2 whitespace-nowrap"
                    >
                      <span>Explorar as 4 Categorias (20 Cookies)</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setAppMode('seller');
                        setActiveSellerTab('reports');
                      }}
                      className="h-11 px-5 bg-white hover:bg-[#F3F1EC] text-[#18181B] border border-[#18181B]/20 text-xs font-semibold transition-colors whitespace-nowrap"
                    >
                      Ver Relatórios Mensais do Lojista
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-6">
                  <div className="relative aspect-16/9 w-full overflow-hidden border border-[#18181B]/15 bg-[#2C1A12]">
                    {!heroImgError ? (
                      <img
                        src={HERO_IMAGE}
                        alt="Cookies artesanais Atelier Crumb com chocolate belga, pistache e flor de sal sobre pedra travertino"
                        referrerPolicy="no-referrer"
                        onError={() => setHeroImgError(true)}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#3A2618] to-[#18100A] flex items-center justify-center p-8 text-[#FAF9F6]">
                        <span className="font-serif text-2xl">
                          Atelier Crumb — Confeitaria Técnica de Cookies
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-5 text-[#FAF9F6] flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                      <div>
                        <div className="text-xs font-mono opacity-85">
                          Lote Diário Auditado · Callebaut 54,5% & Pistache Kerman
                        </div>
                        <div className="font-serif text-base font-medium mt-0.5">
                          Variações: Unidade Individual · Caixa 4 un. · Lata 6 un. · Caixa 12 un.
                        </div>
                      </div>
                      <span className="font-mono text-xs opacity-90 tabular-nums shrink-0">
                        Forno de Lastro 185°C
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 2: 4 CATEGORIES X 5 PRODUCTS CATALOG */}
            <section id="catalogo-section" className="max-w-[1360px] mx-auto px-4 sm:px-8 py-12">
              <div className="pb-8 border-b border-[#18181B]/12 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div>
                  <div className="text-xs text-[#64615A]">
                    Catálogo Completo · Especificação Técnica, Valor & 4 Variações por Produto
                  </div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#18181B] mt-1">
                    Coleções de Forno (4 Categorias · 20 Sabores)
                  </h2>
                </div>

                <div className="relative w-full lg:w-80">
                  <Search className="w-4 h-4 text-[#64615A] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Filtrar por sabor, ingrediente ou SKU..."
                    className="w-full pl-10 pr-4 py-2.5 text-xs bg-white border border-[#18181B]/20 focus:outline-none focus:border-[#2C1A12]"
                  />
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveCategoryFilter('all')}
                  className={`px-4 py-2.5 text-xs font-semibold border transition-colors whitespace-nowrap ${
                    activeCategoryFilter === 'all'
                      ? 'bg-[#2C1A12] text-[#FAF9F6] border-[#2C1A12]'
                      : 'bg-white text-[#18181B] border-[#18181B]/15 hover:border-[#18181B]'
                  }`}
                >
                  Todas as 4 Categorias (20 Produtos)
                </button>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveCategoryFilter(cat.id)}
                    className={`px-4 py-2.5 text-xs font-semibold border transition-colors whitespace-nowrap ${
                      activeCategoryFilter === cat.id
                        ? 'bg-[#2C1A12] text-[#FAF9F6] border-[#2C1A12]'
                        : 'bg-white text-[#18181B] border-[#18181B]/15 hover:border-[#18181B]'
                    }`}
                  >
                    {cat.indexNumber}. {cat.name} (5)
                  </button>
                ))}
              </div>

              <div className="mt-10 space-y-16">
                {CATEGORIES.filter(
                  (cat) => activeCategoryFilter === 'all' || cat.id === activeCategoryFilter
                ).map((category) => {
                  const categoryProducts = products.filter((p) => {
                    const inCat = p.categoryId === category.id;
                    const q = searchTerm.trim().toLowerCase();
                    const matchesSearch =
                      !q ||
                      p.name.toLowerCase().includes(q) ||
                      p.tagline.toLowerCase().includes(q) ||
                      p.sku.toLowerCase().includes(q) ||
                      p.technicalSpec.originIngredients.toLowerCase().includes(q);
                    return inCat && matchesSearch;
                  });

                  const categoryTotalStock = categoryProducts.reduce(
                    (s, p) => s + p.variations.reduce((vs, v) => vs + v.stock, 0),
                    0
                  );

                  return (
                    <div key={category.id} className="space-y-6">
                      <div className="p-6 bg-[#F3F1EC] border border-[#18181B]/12 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2 text-xs text-[#64615A]">
                            <span className="font-mono font-semibold text-[#18181B]">
                              Categoria {category.indexNumber}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span>5 Produtos Catalogados</span>
                            <span aria-hidden="true">·</span>
                            <span className="font-mono">{category.technicalStandard}</span>
                          </div>
                          <h3 className="font-serif text-2xl font-semibold text-[#18181B]">
                            {category.indexNumber}. {category.name}
                          </h3>
                          <p className="text-xs sm:text-sm text-[#3F3D39] max-w-3xl">
                            {category.description}
                          </p>
                        </div>

                        <div className="shrink-0 md:text-right border-t md:border-t-0 pt-3 md:pt-0 border-[#18181B]/10">
                          <span className="text-[11px] text-[#64615A] block">
                            Estoque da Categoria
                          </span>
                          <span
                            className={`font-mono text-sm font-semibold tabular-nums ${
                              categoryTotalStock === 0 ? 'text-[#DC2626]' : 'text-[#16A34A]'
                            }`}
                          >
                            {categoryTotalStock === 0
                              ? 'Estoque Zerado (0 un.)'
                              : `${categoryTotalStock} embalagens prontas`}
                          </span>
                        </div>
                      </div>

                      {categoryProducts.length === 0 ? (
                        <div className="p-8 bg-white border border-[#18181B]/12 text-center text-xs text-[#64615A]">
                          Nenhum cookie encontrado nesta categoria para o termo "{searchTerm}".
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {categoryProducts.map((product) => (
                            <ProductCard
                              key={product.id}
                              product={product}
                              onOpenDetail={(prod) => setSelectedProductModal(prod)}
                              onAddToCart={handleAddToCart}
                              onAskChatbot={handleAskChatbot}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* SECTION 3: TECHNICAL STANDARDS */}
            <section
              id="parametros-tecnicos"
              className="border-t border-[#18181B]/12 bg-[#F3F1EC] py-14"
            >
              <div className="max-w-[1360px] mx-auto px-4 sm:px-8 space-y-10">
                <div className="max-w-2xl">
                  <div className="text-xs text-[#64615A]">
                    Padronização Física & Rastreabilidade de Insumos
                  </div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#18181B] mt-1">
                    Por que nossos cookies mantêm centro fudgy por 7 dias sem conservantes sintéticos
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 bg-white border border-[#18181B]/12 divide-y md:divide-y-0 md:divide-x divide-[#18181B]/12">
                  <div className="p-6 space-y-2">
                    <div className="font-mono text-xs text-[#64615A]">
                      01 · Controle de Atividade de Água (Aw)
                    </div>
                    <h3 className="font-serif text-lg font-semibold text-[#18181B]">
                      Hidratação Fria de 48h a 72h
                    </h3>
                    <p className="text-xs text-[#3F3D39] leading-relaxed">
                      O descanso prolongado a 4°C permite que as proteínas da farinha e as fibras do
                      cacau absorvam a umidade dos ovos caipiras, resultando em Aw entre 0,65 e 0,71
                      e reduzindo a retrogradação do amido em 68% após 5 dias.
                    </p>
                  </div>

                  <div className="p-6 space-y-2">
                    <div className="font-mono text-xs text-[#64615A]">
                      02 · Termodinâmica de Núcleo Congelado
                    </div>
                    <h3 className="font-serif text-lg font-semibold text-[#18181B]">
                      Recheios Encapsulados a -18°C
                    </h3>
                    <p className="text-xs text-[#3F3D39] leading-relaxed">
                      Na linha de Recheados Artesanais (135g), os 50g de gianduia, pistache ou doce
                      de leite uruguaio entram no forno a -18°C enquanto a massa externa assa a
                      192°C por 10m30s, impedindo fervura interna.
                    </p>
                  </div>

                  <div className="p-6 space-y-2">
                    <div className="font-mono text-xs text-[#64615A]">
                      03 · Apresentação & Variações Modulares
                    </div>
                    <h3 className="font-serif text-lg font-semibold text-[#18181B]">
                      4 Formatos em Todos os 20 Sabores
                    </h3>
                    <p className="text-xs text-[#3F3D39] leading-relaxed">
                      Do consumo individual em filme barreira de oxigênio (1 un.) às Latas
                      Colecionáveis herméticas (6 un.) e Caixas Atelier Corporativas (12 un.), com
                      economia progressiva de até 15% por unidade.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}
      </main>

      {/* QUIET EDITORIAL FOOTER */}
      <footer className="bg-white border-t border-[#18181B]/12 py-8 px-4 sm:px-8 text-xs text-[#64615A]">
        <div className="max-w-[1360px] mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="font-serif font-semibold text-[#18181B]">Atelier Crumb</span>
            <span className="mx-2">·</span>
            <span>Confeitaria Técnica de Cookies & Plataforma de Gestão do Lojista</span>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => setAppMode('buyer')}
              className="hover:text-[#18181B] underline-offset-4 hover:underline"
            >
              Modo Comprador
            </button>
            <button
              type="button"
              onClick={() => {
                setAppMode('seller');
                setActiveSellerTab('reports');
              }}
              className="hover:text-[#18181B] underline-offset-4 hover:underline"
            >
              Relatórios Mensais
            </button>
            <button
              type="button"
              onClick={() => setIsChatOpen(true)}
              className="hover:text-[#18181B] underline-offset-4 hover:underline"
            >
              Atendimento Groq
            </button>
          </div>
        </div>
      </footer>

      {/* MODALS & DRAWERS */}
      <ProductDetailModal
        product={syncedModalProduct}
        onClose={() => setSelectedProductModal(null)}
        onAddToCart={handleAddToCart}
        onAskChatbot={handleAskChatbot}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQty={handleUpdateCartQty}
        onRemoveItem={handleRemoveCartItem}
        onCompleteOrder={handleCompleteOrder}
      />

      <ChatbotDrawer
        isOpen={isChatOpen}
        onToggleOpen={() => setIsChatOpen((prev) => !prev)}
        products={products}
        stockPreset={stockPreset}
        externalPrompt={externalChatPrompt}
        onClearExternalPrompt={() => setExternalChatPrompt(null)}
        onSetFilledStock={handleSetFilledStock}
        onSetZeroStock={handleSetZeroStock}
        groqApiKey={groqApiKey}
        onChangeGroqApiKey={handleUpdateGroqApiKey}
      />
    </div>
  );
}

export default App;
