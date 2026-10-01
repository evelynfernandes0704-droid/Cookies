import React, { useState } from 'react';
import { ShoppingBag, FileText, MessageSquare, Check } from 'lucide-react';
import { CookieProduct, ProductVariation } from '../data/cookiesData';

interface ProductCardProps {
  product: CookieProduct;
  onOpenDetail: (product: CookieProduct) => void;
  onAddToCart: (product: CookieProduct, variation: ProductVariation, quantity: number) => void;
  onAskChatbot: (question: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onOpenDetail,
  onAddToCart,
  onAskChatbot,
}) => {
  const [selectedVarIdx, setSelectedVarIdx] = useState<number>(0);
  const [imgError, setImgError] = useState<boolean>(false);
  const [addedFeedback, setAddedFeedback] = useState<boolean>(false);

  const activeVar = product.variations[selectedVarIdx] || product.variations[0];
  const isOutOfStock = activeVar.stock <= 0;
  const totalProductStock = product.variations.reduce((acc, v) => acc + v.stock, 0);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    onAddToCart(product, activeVar, 1);
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 1400);
  };

  return (
    <article className="group bg-white border border-[#18181B]/12 flex flex-col justify-between transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-md">
      <div>
        <div
          onClick={() => onOpenDetail(product)}
          className="relative aspect-4/3 w-full overflow-hidden bg-[#2C1A12] cursor-pointer"
        >
          {!imgError ? (
            <img
              src={product.image}
              alt={product.name}
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            />
          ) : (
            <div
              className={`w-full h-full bg-gradient-to-br ${product.fallbackGradient} flex flex-col items-center justify-center p-6 text-center text-[#FAF9F6]`}
            >
              <span className="font-mono text-xs opacity-75">{product.sku}</span>
              <span className="font-serif text-base mt-1">{product.name}</span>
            </div>
          )}

          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent p-3.5 flex items-end justify-between text-[#FAF9F6]">
            <span className="font-mono text-[11px] tracking-tight opacity-90 tabular-nums">
              {product.sku} · {product.technicalSpec.netWeight.split(' ')[0]}
            </span>
            <span
              className={`font-mono text-[11px] font-medium tabular-nums ${
                totalProductStock === 0 ? 'text-[#FCA5A5]' : 'text-[#86EFAC]'
              }`}
            >
              {totalProductStock === 0
                ? 'Estoque Zerado (0 un.)'
                : `${totalProductStock} disp. no lote`}
            </span>
          </div>
        </div>

        <div className="p-5">
          <div className="flex items-center gap-1.5 text-[11px] text-[#64615A] truncate">
            <span>{product.categoryName}</span>
            <span aria-hidden="true">·</span>
            <span className="truncate">{product.dietaryNotes.slice(0, 2).join(' · ')}</span>
          </div>

          <h3
            onClick={() => onOpenDetail(product)}
            className="font-serif text-lg font-semibold text-[#18181B] mt-1.5 leading-snug cursor-pointer hover:underline"
          >
            {product.name}
          </h3>

          <p className="text-xs text-[#3F3D39] mt-1.5 line-clamp-2 leading-relaxed">
            {product.tagline}
          </p>

          <div className="mt-3.5 pt-3 border-t border-[#18181B]/8 text-[11px] text-[#64615A] space-y-1">
            <div className="flex justify-between gap-2">
              <span className="font-medium text-[#18181B]">Forneamento:</span>
              <span className="truncate text-right">
                {product.technicalSpec.bakeProfile.split('·')[0]}
              </span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="font-medium text-[#18181B]">Textura / Aw:</span>
              <span className="truncate text-right">
                {product.technicalSpec.moistureAndTexture.split('·')[1] ||
                  product.technicalSpec.moistureAndTexture}
              </span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="font-medium text-[#18181B]">Energia (100g):</span>
              <span className="font-mono tabular-nums text-right">
                {product.technicalSpec.nutritionPer100g.split('·')[0]}
              </span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#18181B]/8">
            <div className="flex items-center justify-between text-[11px] mb-1.5">
              <span className="font-medium text-[#64615A]">Variação:</span>
              <span
                className={`font-mono tabular-nums font-medium ${
                  isOutOfStock ? 'text-[#DC2626]' : 'text-[#16A34A]'
                }`}
              >
                {isOutOfStock ? '0 un. (Esgotado)' : `${activeVar.stock} un. em estoque`}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-1 bg-[#F3F1EC] p-1 border border-[#18181B]/10">
              {product.variations.map((v, i) => {
                const shortLabels = ['1 un.', 'Cx 4', 'Lata 6', 'Cx 12'];
                const isSelected = i === selectedVarIdx;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setSelectedVarIdx(i)}
                    className={`py-1.5 px-1 text-[11px] font-mono font-medium transition-colors whitespace-nowrap truncate ${
                      isSelected
                        ? 'bg-[#2C1A12] text-[#FAF9F6]'
                        : 'text-[#64615A] hover:text-[#18181B]'
                    }`}
                    title={`${v.label} — R$ ${v.price.toFixed(2).replace('.', ',')}`}
                  >
                    {shortLabels[i] || v.skuSuffix}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 pb-5 pt-2 flex flex-col gap-2.5">
        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-[11px] text-[#64615A] block truncate">{activeVar.label}</span>
            <span className="font-mono text-lg font-semibold text-[#18181B] tabular-nums">
              R$ {activeVar.price.toFixed(2).replace('.', ',')}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onOpenDetail(product)}
              title="Ver descrição técnica completa"
              className="h-9 px-2.5 border border-[#18181B]/20 hover:border-[#18181B] text-[#18181B] text-xs font-medium transition-colors flex items-center gap-1 whitespace-nowrap"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Ficha</span>
            </button>

            <button
              type="button"
              onClick={() =>
                onAskChatbot(
                  `Qual o estoque atual, variações, valores e ficha técnica do cookie ${product.name}?`
                )
              }
              title="Perguntar ao Bot de Atendimento sobre este cookie"
              className="h-9 w-9 border border-[#18181B]/20 hover:border-[#18181B] text-[#18181B] flex items-center justify-center transition-colors"
              aria-label="Perguntar ao Bot"
            >
              <MessageSquare className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <button
          type="button"
          disabled={isOutOfStock}
          onClick={handleQuickAdd}
          className={`w-full h-10 px-4 text-xs font-semibold transition-colors flex items-center justify-center gap-2 whitespace-nowrap ${
            isOutOfStock
              ? 'bg-[#E5E4DF] text-[#64615A] cursor-not-allowed border border-[#18181B]/10'
              : addedFeedback
              ? 'bg-[#16A34A] text-white'
              : 'bg-[#2C1A12] hover:bg-[#18181B] text-[#FAF9F6]'
          }`}
        >
          {isOutOfStock ? (
            <span>Indisponível · Estoque Zerado</span>
          ) : addedFeedback ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Adicionado à Sacola</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Adicionar {activeVar.label}</span>
            </>
          )}
        </button>
      </div>
    </article>
  );
};
