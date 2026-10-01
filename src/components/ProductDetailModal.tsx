import React, { useState } from 'react';
import { X, Plus, Minus, ShoppingBag, MessageSquare, Check, AlertCircle } from 'lucide-react';
import { CookieProduct, ProductVariation } from '../data/cookiesData';

interface ProductDetailModalProps {
  product: CookieProduct | null;
  onClose: () => void;
  onAddToCart: (product: CookieProduct, variation: ProductVariation, quantity: number) => void;
  onAskChatbot: (question: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onAskChatbot,
}) => {
  const [selectedVarIndex, setSelectedVarIndex] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [imgError, setImgError] = useState<boolean>(false);
  const [justAdded, setJustAdded] = useState<boolean>(false);

  if (!product) return null;

  const currentVariation = product.variations[selectedVarIndex] || product.variations[0];
  const maxAvailable = currentVariation.stock;
  const isOutOfStock = maxAvailable <= 0;
  const effectiveQty = isOutOfStock ? 0 : Math.min(quantity, maxAvailable);

  const handleAdd = () => {
    if (isOutOfStock || effectiveQty <= 0) return;
    onAddToCart(product, currentVariation, effectiveQty);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);
  };

  const unitPriceEquivalent = currentVariation.price / currentVariation.unitsIncluded;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 md:p-6 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl max-h-[92vh] overflow-y-auto bg-[#FAF9F6] border border-[#18181B]/15 shadow-2xl grid grid-cols-1 lg:grid-cols-12"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Fechar ficha técnica"
          className="absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center bg-[#FAF9F6]/90 text-[#18181B] border border-[#18181B]/15 hover:bg-[#18181B] hover:text-[#FAF9F6] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left Column: Visual & Technical Overview */}
        <div className="lg:col-span-5 bg-[#F3F1EC] border-b lg:border-b-0 lg:border-r border-[#18181B]/10 flex flex-col justify-between">
          <div>
            <div className="relative aspect-4/3 w-full overflow-hidden bg-[#2C1A12]">
              {!imgError ? (
                <img
                  src={product.image}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className={`w-full h-full bg-gradient-to-br ${product.fallbackGradient} flex flex-col items-center justify-center p-6 text-center text-[#FAF9F6]`}
                >
                  <span className="font-mono text-xs opacity-70">{product.sku}</span>
                  <span className="font-serif text-lg mt-1">{product.name}</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-5 right-5 text-[#FAF9F6]">
                <div className="text-xs font-mono tracking-tight opacity-85">
                  {product.sku} · {product.categoryName}
                </div>
                <div className="text-xs opacity-90 mt-1">
                  {product.dietaryNotes.join(' · ')}
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="border-b border-[#18181B]/10 pb-2">
                <h4 className="font-serif text-base font-semibold text-[#18181B]">
                  Especificação Técnica de Confeitaria
                </h4>
                <p className="text-xs text-[#64615A] mt-0.5">
                  Parâmetros auditados por lote de produção
                </p>
              </div>

              <dl className="space-y-3 text-xs">
                <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-[#18181B]/8">
                  <dt className="text-[#64615A] font-medium">Peso Líquido</dt>
                  <dd className="col-span-2 font-mono text-[#18181B] tabular-nums">
                    {product.technicalSpec.netWeight}
                  </dd>
                </div>
                <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-[#18181B]/8">
                  <dt className="text-[#64615A] font-medium">Geometria</dt>
                  <dd className="col-span-2 font-mono text-[#18181B] tabular-nums">
                    {product.technicalSpec.dimensions}
                  </dd>
                </div>
                <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-[#18181B]/8">
                  <dt className="text-[#64615A] font-medium">Forneamento</dt>
                  <dd className="col-span-2 text-[#18181B]">
                    {product.technicalSpec.bakeProfile}
                  </dd>
                </div>
                <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-[#18181B]/8">
                  <dt className="text-[#64615A] font-medium">Textura & Aw</dt>
                  <dd className="col-span-2 text-[#18181B]">
                    {product.technicalSpec.moistureAndTexture}
                  </dd>
                </div>
                <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-[#18181B]/8">
                  <dt className="text-[#64615A] font-medium">Nutrição (100g)</dt>
                  <dd className="col-span-2 font-mono text-[#18181B] tabular-nums">
                    {product.technicalSpec.nutritionPer100g}
                  </dd>
                </div>
                <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-[#18181B]/8">
                  <dt className="text-[#64615A] font-medium">Validade</dt>
                  <dd className="col-span-2 text-[#18181B]">
                    {product.technicalSpec.shelfLife}
                  </dd>
                </div>
                <div className="grid grid-cols-3 gap-2 py-1.5">
                  <dt className="text-[#64615A] font-medium">Serviço Ideal</dt>
                  <dd className="col-span-2 text-[#18181B]">
                    {product.technicalSpec.servingTemperature}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="p-6 pt-0">
            <button
              type="button"
              onClick={() => {
                onClose();
                onAskChatbot(
                  `Quero saber detalhes técnicos, alérgenos e o estoque atual de todas as variações do cookie ${product.name}.`
                );
              }}
              className="w-full py-2.5 px-4 border border-[#18181B]/20 bg-[#FAF9F6] hover:bg-[#18181B] hover:text-[#FAF9F6] text-xs font-medium text-[#18181B] transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Tirar dúvida sobre este sabor no Bot de Atendimento</span>
            </button>
          </div>
        </div>

        {/* Right Column: Contiguous Purchase Module & Variations */}
        <div className="lg:col-span-7 p-6 md:p-8 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#64615A]">
              <span>{product.categoryName}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">SKU {product.sku}</span>
              <span aria-hidden="true">·</span>
              <span
                className={`font-mono tabular-nums font-medium ${
                  isOutOfStock ? 'text-[#DC2626]' : 'text-[#16A34A]'
                }`}
              >
                {isOutOfStock
                  ? 'Esgotado nesta variação (0 un.)'
                  : `Em estoque (${maxAvailable} un. disponíveis)`}
              </span>
            </div>

            <h2 className="font-serif text-2xl md:text-3xl font-semibold text-[#18181B] mt-2 leading-tight">
              {product.name}
            </h2>

            <p className="text-sm text-[#3F3D39] mt-3 leading-relaxed">
              {product.description}
            </p>

            <div className="mt-6 pt-5 border-t border-[#18181B]/10 flex items-baseline justify-between">
              <div>
                <span className="text-xs text-[#64615A] block">
                  Valor na variação selecionada ({currentVariation.label})
                </span>
                <div className="flex items-baseline gap-3 mt-1">
                  <span className="font-mono text-2xl md:text-3xl font-semibold text-[#18181B] tabular-nums">
                    R$ {currentVariation.price.toFixed(2).replace('.', ',')}
                  </span>
                  {currentVariation.unitsIncluded > 1 && (
                    <span className="text-xs font-mono text-[#64615A] tabular-nums">
                      (R$ {unitPriceEquivalent.toFixed(2).replace('.', ',')} / cookie)
                    </span>
                  )}
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs text-[#64615A] block">Código da Variação</span>
                <span className="font-mono text-xs font-medium text-[#18181B] tabular-nums">
                  {currentVariation.id}
                </span>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-semibold text-[#18181B]">
                  Selecione a Variação de Apresentação (4 opções)
                </span>
                <span className="text-xs text-[#64615A] font-mono tabular-nums">
                  Total geral: {product.variations.reduce((a, b) => a + b.stock, 0)} un.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {product.variations.map((v, idx) => {
                  const isSelected = idx === selectedVarIndex;
                  const varOut = v.stock <= 0;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => {
                        setSelectedVarIndex(idx);
                        setQuantity(1);
                      }}
                      className={`text-left p-3.5 border transition-colors ${
                        isSelected
                          ? 'border-[#2C1A12] bg-[#2C1A12] text-[#FAF9F6]'
                          : 'border-[#18181B]/15 bg-white text-[#18181B] hover:border-[#18181B]/40'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold truncate">{v.label}</span>
                        <span className="font-mono text-xs font-semibold tabular-nums shrink-0">
                          R$ {v.price.toFixed(2).replace('.', ',')}
                        </span>
                      </div>
                      <div
                        className={`text-[11px] mt-1 flex items-center justify-between ${
                          isSelected ? 'text-[#FAF9F6]/80' : 'text-[#64615A]'
                        }`}
                      >
                        <span className="truncate">{v.weightLabel}</span>
                        <span
                          className={`font-mono tabular-nums shrink-0 ml-2 ${
                            varOut
                              ? isSelected
                                ? 'text-[#FCA5A5]'
                                : 'text-[#DC2626]'
                              : isSelected
                              ? 'text-[#86EFAC]'
                              : 'text-[#16A34A]'
                          }`}
                        >
                          {varOut ? '0 un. (Zerado)' : `${v.stock} disp.`}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-[#18181B]/10 space-y-3 text-xs">
              <div>
                <span className="font-semibold text-[#18181B]">
                  Composição & Ingredientes de Origem:
                </span>
                <p className="text-[#3F3D39] mt-1 leading-relaxed">
                  {product.technicalSpec.originIngredients}
                </p>
              </div>
              <div>
                <span className="font-semibold text-[#18181B]">Declaração de Alérgenos:</span>
                <p className="text-[#64615A] mt-0.5">{product.technicalSpec.allergens}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-5 border-t border-[#18181B]/10">
            {isOutOfStock ? (
              <div className="p-4 bg-[#FEF2F2] border border-[#DC2626]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 text-xs text-[#991B1B]">
                  <AlertCircle className="w-4 h-4 shrink-0 text-[#DC2626]" />
                  <span>
                    Esta variação encontra-se com <strong>estoque zerado (0 unidades)</strong>.
                    Você pode ativar <em>"Estoque Preenchido"</em> no topo da página ou consultar o Bot.
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="flex items-center border border-[#18181B]/20 bg-white h-11 px-2">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-8 h-8 flex items-center justify-center text-[#18181B] hover:bg-[#F3F1EC] transition-colors"
                    aria-label="Diminuir quantidade"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 text-center font-mono text-sm font-medium tabular-nums">
                    {effectiveQty}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(maxAvailable, q + 1))}
                    className="w-8 h-8 flex items-center justify-center text-[#18181B] hover:bg-[#F3F1EC] transition-colors"
                    aria-label="Aumentar quantidade"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAdd}
                  className="flex-1 h-11 px-6 bg-[#2C1A12] hover:bg-[#18181B] text-[#FAF9F6] text-xs font-semibold transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  {justAdded ? (
                    <>
                      <Check className="w-4 h-4 text-[#86EFAC]" />
                      <span>Adicionado à Sacola!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>
                        Adicionar {effectiveQty}x {currentVariation.label} · R${' '}
                        {(currentVariation.price * effectiveQty).toFixed(2).replace('.', ',')}
                      </span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
