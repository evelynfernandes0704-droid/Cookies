import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, CheckCircle2, ArrowRight } from 'lucide-react';
import { CookieProduct, ProductVariation } from '../data/cookiesData';

export interface CartItem {
  product: CookieProduct;
  variation: ProductVariation;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQty: (productId: string, variationId: string, newQty: number) => void;
  onRemoveItem: (productId: string, variationId: string) => void;
  onCompleteOrder: (customerName: string, channel: 'E-commerce Direto' | 'Balcão Atelier') => string;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQty,
  onRemoveItem,
  onCompleteOrder,
}) => {
  const [customerName, setCustomerName] = useState<string>('Cliente Atelier');
  const [deliveryMethod, setDeliveryMethod] = useState<'E-commerce Direto' | 'Balcão Atelier'>(
    'E-commerce Direto'
  );
  const [confirmedOrderId, setConfirmedOrderId] = useState<string | null>(null);

  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => acc + item.variation.price * item.quantity, 0);
  const totalCookieUnits = items.reduce(
    (acc, item) => acc + item.variation.unitsIncluded * item.quantity,
    0
  );
  const freeShippingThreshold = 140;
  const shippingFee =
    deliveryMethod === 'Balcão Atelier' || subtotal >= freeShippingThreshold || subtotal === 0
      ? 0
      : 14.9;
  const finalTotal = subtotal + shippingFee;

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    const orderId = onCompleteOrder(customerName.trim() || 'Cliente Atelier', deliveryMethod);
    setConfirmedOrderId(orderId);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-[1px] flex justify-end"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-[#FAF9F6] h-full border-l border-[#18181B]/15 shadow-2xl flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-[#18181B]/12 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-4 h-4 text-[#18181B]" />
            <h2 className="font-serif text-lg font-semibold text-[#18181B]">
              Sacola de Compras
            </h2>
            <span className="font-mono text-xs text-[#64615A] tabular-nums">
              ({items.reduce((a, b) => a + b.quantity, 0)} itens)
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              setConfirmedOrderId(null);
              onClose();
            }}
            aria-label="Fechar sacola"
            className="w-8 h-8 flex items-center justify-center text-[#64615A] hover:text-[#18181B]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {confirmedOrderId ? (
            <div className="p-6 bg-white border border-[#16A34A]/30 space-y-4">
              <div className="flex items-center gap-2.5 text-[#16A34A]">
                <CheckCircle2 className="w-6 h-6 shrink-0" />
                <h3 className="font-serif text-lg font-semibold text-[#18181B]">
                  Pedido {confirmedOrderId} Confirmado!
                </h3>
              </div>
              <p className="text-xs text-[#3F3D39] leading-relaxed">
                Sua compra foi registrada com sucesso. As unidades foram <strong>deduzidas do estoque em tempo real</strong> e o valor já foi contabilizado nos <strong>Relatórios Mensais do Lojista</strong> (Outubro 2026).
              </p>
              <button
                type="button"
                onClick={() => {
                  setConfirmedOrderId(null);
                  onClose();
                }}
                className="w-full py-2.5 px-4 bg-[#2C1A12] text-[#FAF9F6] text-xs font-semibold hover:bg-[#18181B] transition-colors"
              >
                Voltar à Vitrine
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <ShoppingBag className="w-8 h-8 text-[#64615A] mx-auto opacity-50" />
              <div className="font-serif text-base font-medium text-[#18181B]">
                Sua sacola está vazia
              </div>
              <p className="text-xs text-[#64615A] max-w-xs mx-auto">
                Explore nossas 4 categorias de cookies artesanais, escolha a variação desejada (Unidade, Caixa 4, Lata 6 ou Caixa 12) e adicione à sacola.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-3 bg-[#F3F1EC] border border-[#18181B]/10 text-xs text-[#3F3D39]">
                {subtotal >= freeShippingThreshold ? (
                  <span className="font-medium text-[#16A34A]">
                    Frete Cortesia desbloqueado para entrega expressa climatizada!
                  </span>
                ) : (
                  <span>
                    Faltam{' '}
                    <strong className="font-mono tabular-nums">
                      R$ {(freeShippingThreshold - subtotal).toFixed(2).replace('.', ',')}
                    </strong>{' '}
                    para Frete Cortesia (acima de R$ 140,00).
                  </span>
                )}
              </div>

              <div className="divide-y divide-[#18181B]/10 border-t border-b border-[#18181B]/10 bg-white">
                {items.map((item) => (
                  <div
                    key={`${item.product.id}-${item.variation.id}`}
                    className="p-4 flex flex-col gap-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-[11px] text-[#64615A]">
                          {item.product.categoryName} · {item.variation.label}
                        </div>
                        <div className="text-xs font-semibold text-[#18181B] mt-0.5">
                          {item.product.name}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemoveItem(item.product.id, item.variation.id)}
                        aria-label="Remover item"
                        className="text-[#64615A] hover:text-[#DC2626] p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div className="inline-flex items-center border border-[#18181B]/20">
                        <button
                          type="button"
                          onClick={() =>
                            onUpdateQty(item.product.id, item.variation.id, item.quantity - 1)
                          }
                          className="w-7 h-7 flex items-center justify-center hover:bg-[#F3F1EC]"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center font-mono text-xs tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            onUpdateQty(
                              item.product.id,
                              item.variation.id,
                              Math.min(item.variation.stock, item.quantity + 1)
                            )
                          }
                          className="w-7 h-7 flex items-center justify-center hover:bg-[#F3F1EC]"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="font-mono text-xs font-semibold text-[#18181B] tabular-nums">
                        R$ {(item.variation.price * item.quantity).toFixed(2).replace('.', ',')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <form id="checkout-form" onSubmit={handleCheckout} className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-medium text-[#18181B] mb-1">
                    Seu Nome (para identificação no pedido)
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-[#18181B]/20 focus:outline-none focus:border-[#2C1A12]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#18181B] mb-1">
                    Modalidade de Entrega
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setDeliveryMethod('E-commerce Direto')}
                      className={`py-2 px-3 text-xs font-medium border transition-colors ${
                        deliveryMethod === 'E-commerce Direto'
                          ? 'bg-[#2C1A12] text-[#FAF9F6] border-[#2C1A12]'
                          : 'bg-white text-[#18181B] border-[#18181B]/20'
                      }`}
                    >
                      Delivery Express
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeliveryMethod('Balcão Atelier')}
                      className={`py-2 px-3 text-xs font-medium border transition-colors ${
                        deliveryMethod === 'Balcão Atelier'
                          ? 'bg-[#2C1A12] text-[#FAF9F6] border-[#2C1A12]'
                          : 'bg-white text-[#18181B] border-[#18181B]/20'
                      }`}
                    >
                      Retirada no Atelier
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>

        {items.length > 0 && !confirmedOrderId && (
          <div className="p-5 bg-white border-t border-[#18181B]/12 space-y-3">
            <div className="space-y-1.5 text-xs font-mono tabular-nums">
              <div className="flex justify-between text-[#64615A]">
                <span className="font-sans">Volume total ({totalCookieUnits} cookies)</span>
                <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
              </div>
              <div className="flex justify-between text-[#64615A]">
                <span className="font-sans">Frete Climatizado</span>
                <span>
                  {shippingFee === 0
                    ? 'Grátis'
                    : `R$ ${shippingFee.toFixed(2).replace('.', ',')}`}
                </span>
              </div>
              <div className="flex justify-between text-sm font-semibold text-[#18181B] pt-2 border-t border-[#18181B]/10">
                <span className="font-sans">Total a Pagar</span>
                <span>R$ {finalTotal.toFixed(2).replace('.', ',')}</span>
              </div>
            </div>

            <button
              type="submit"
              form="checkout-form"
              className="w-full py-3 px-4 bg-[#2C1A12] hover:bg-[#18181B] text-[#FAF9F6] text-xs font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <span>Finalizar Pedido & Atualizar Estoque</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
