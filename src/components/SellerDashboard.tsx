import React, { useState, useMemo } from 'react';
import {
  Download,
  Search,
  Plus,
  Minus,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Package,
  FileSpreadsheet,
} from 'lucide-react';
import {
  CookieProduct,
  CATEGORIES,
  CategoryId,
  MonthlyReportData,
} from '../data/cookiesData';

interface SellerDashboardProps {
  products: CookieProduct[];
  stockPreset: 'filled' | 'zero' | 'custom';
  onSetFilledStock: () => void;
  onSetZeroStock: () => void;
  onAddBatchStock: (delta: number) => void;
  onUpdateVariationStock: (productId: string, variationId: string, newStock: number) => void;
  monthlyReports: MonthlyReportData[];
  activeSellerTab: 'inventory' | 'reports';
  setActiveSellerTab: (tab: 'inventory' | 'reports') => void;
}

export const SellerDashboard: React.FC<SellerDashboardProps> = ({
  products,
  stockPreset,
  onSetFilledStock,
  onSetZeroStock,
  onAddBatchStock,
  onUpdateVariationStock,
  monthlyReports,
  activeSellerTab,
  setActiveSellerTab,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedMonthId, setSelectedMonthId] = useState<string>(
    monthlyReports[0]?.monthId || '2026-10'
  );
  const [flavorSortBy, setFlavorSortBy] = useState<'revenue' | 'unitsSold' | 'grossMarginPct'>(
    'revenue'
  );

  const inventoryStats = useMemo(() => {
    let totalItems = 0;
    let totalCookieUnitsEquivalent = 0;
    let totalRetailValue = 0;
    let totalCostValue = 0;
    let zeroedSkus = 0;
    let totalSkus = 0;

    products.forEach((p) => {
      p.variations.forEach((v) => {
        totalSkus += 1;
        totalItems += v.stock;
        totalCookieUnitsEquivalent += v.stock * v.unitsIncluded;
        totalRetailValue += v.stock * v.price;
        totalCostValue += v.stock * v.cost;
        if (v.stock === 0) zeroedSkus += 1;
      });
    });

    return {
      totalItems,
      totalCookieUnitsEquivalent,
      totalRetailValue,
      totalCostValue,
      zeroedSkus,
      totalSkus,
    };
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCat = selectedCategory === 'all' || p.categoryId === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.categoryName.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  const currentReport = useMemo(() => {
    return (
      monthlyReports.find((r) => r.monthId === selectedMonthId) || monthlyReports[0]
    );
  }, [monthlyReports, selectedMonthId]);

  const sortedFlavorMetrics = useMemo(() => {
    if (!currentReport) return [];
    return [...currentReport.flavorMetrics].sort((a, b) => b[flavorSortBy] - a[flavorSortBy]);
  }, [currentReport, flavorSortBy]);

  const handleExportCSV = () => {
    if (!currentReport) return;
    const headers = [
      'Mes',
      'Produto',
      'Categoria',
      'Unidades_Vendidas',
      'Receita_Bruta_BRL',
      'Custo_Insumos_BRL',
      'Margem_Bruta_Pct',
      'Variacao_Mais_Vendida',
      'Taxa_Recompra_Pct',
    ];
    const rows = sortedFlavorMetrics.map((f) => [
      `"${currentReport.monthLabel}"`,
      `"${f.productName}"`,
      `"${f.categoryName}"`,
      f.unitsSold,
      f.revenue.toFixed(2),
      f.cost.toFixed(2),
      f.grossMarginPct.toFixed(1),
      `"${f.topVariation}"`,
      f.returnRatePct.toFixed(1),
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `relatorio_atelier_crumb_${currentReport.monthId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-8 py-8">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-[#18181B]/12">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#64615A]">
            <span>Console do Lojista</span>
            <span aria-hidden="true">·</span>
            <span>Gestão de Operações & Inteligência Financeira</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">20 Produtos / 80 Variações</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[#18181B] mt-1">
            {activeSellerTab === 'reports'
              ? 'Relatórios Mensais Detalhados & DRE de Sabores'
              : 'Controle de Estoque em Tempo Real & Precificação'}
          </h1>
        </div>

        <div className="flex items-center gap-1 p-1 bg-[#F3F1EC] border border-[#18181B]/12 self-start lg:self-auto">
          <button
            type="button"
            onClick={() => setActiveSellerTab('reports')}
            className={`px-4 py-2 text-xs font-semibold transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeSellerTab === 'reports'
                ? 'bg-[#2C1A12] text-[#FAF9F6]'
                : 'text-[#64615A] hover:text-[#18181B]'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Relatórios Mensais do Dono</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSellerTab('inventory')}
            className={`px-4 py-2 text-xs font-semibold transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeSellerTab === 'inventory'
                ? 'bg-[#2C1A12] text-[#FAF9F6]'
                : 'text-[#64615A] hover:text-[#18181B]'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Gestão de Estoque ({inventoryStats.totalItems} un.)</span>
          </button>
        </div>
      </div>

      {/* Global Stock Simulation Bar */}
      <div className="mt-6 p-4 bg-[#F3F1EC] border border-[#18181B]/12 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {inventoryStats.totalItems === 0 ? (
            <AlertTriangle className="w-5 h-5 text-[#DC2626] shrink-0" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-[#16A34A] shrink-0" />
          )}
          <div>
            <div className="text-xs font-semibold text-[#18181B]">
              Estado Atual do Estoque da Loja:{' '}
              <span
                className={
                  inventoryStats.totalItems === 0 ? 'text-[#DC2626]' : 'text-[#16A34A]'
                }
              >
                {inventoryStats.totalItems === 0
                  ? 'ESTOQUE ZERADO (0 unidades em todas as categorias)'
                  : `ESTOQUE PREENCHIDO (${inventoryStats.totalItems} embalagens prontas · equiv. ${inventoryStats.totalCookieUnitsEquivalent} cookies)`}
              </span>
            </div>
            <p className="text-xs text-[#64615A] mt-0.5">
              O Bot de Atendimento Groq e a Vitrine do Comprador refletem instantaneamente qualquer alteração feita aqui.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onSetFilledStock}
            className={`px-3.5 py-2 text-xs font-semibold border transition-colors whitespace-nowrap ${
              stockPreset === 'filled' && inventoryStats.totalItems > 0
                ? 'bg-[#16A34A] text-white border-[#16A34A]'
                : 'bg-white text-[#18181B] border-[#18181B]/20 hover:border-[#18181B]'
            }`}
          >
            Ativar Estoque Preenchido
          </button>
          <button
            type="button"
            onClick={onSetZeroStock}
            className={`px-3.5 py-2 text-xs font-semibold border transition-colors whitespace-nowrap ${
              inventoryStats.totalItems === 0
                ? 'bg-[#DC2626] text-white border-[#DC2626]'
                : 'bg-white text-[#18181B] border-[#18181B]/20 hover:border-[#DC2626] hover:text-[#DC2626]'
            }`}
          >
            Zerar Todo o Estoque (0 un.)
          </button>
          <button
            type="button"
            onClick={() => onAddBatchStock(10)}
            className="px-3.5 py-2 text-xs font-medium bg-white text-[#18181B] border border-[#18181B]/20 hover:bg-[#18181B] hover:text-[#FAF9F6] transition-colors flex items-center gap-1.5 whitespace-nowrap"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>+10 un. em Tudo</span>
          </button>
        </div>
      </div>

      {/* TAB 1: MONTHLY OWNER REPORTS */}
      {activeSellerTab === 'reports' && currentReport && (
        <div className="mt-8 space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-1.5">
              {monthlyReports.map((rep) => (
                <button
                  key={rep.monthId}
                  type="button"
                  onClick={() => setSelectedMonthId(rep.monthId)}
                  className={`px-3.5 py-2 text-xs font-medium border transition-colors whitespace-nowrap ${
                    selectedMonthId === rep.monthId
                      ? 'bg-[#2C1A12] text-[#FAF9F6] border-[#2C1A12]'
                      : 'bg-white text-[#64615A] border-[#18181B]/12 hover:text-[#18181B]'
                  }`}
                >
                  {rep.monthLabel}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handleExportCSV}
              className="px-4 py-2 bg-[#18181B] hover:bg-[#2C1A12] text-[#FAF9F6] text-xs font-semibold transition-colors flex items-center gap-2 self-start sm:self-auto whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar Planilha Mensal (CSV)</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 bg-white border border-[#18181B]/12 divide-y sm:divide-y-0 sm:divide-x divide-[#18181B]/12">
            <div className="p-6">
              <div className="text-xs text-[#64615A]">Faturamento Bruto ({currentReport.quarter})</div>
              <div className="font-mono text-2xl font-semibold text-[#18181B] mt-2 tabular-nums">
                R$ {currentReport.grossRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <div className="text-xs text-[#64615A] mt-2 font-mono tabular-nums">
                Líquido: R$ {currentReport.netRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            </div>

            <div className="p-6">
              <div className="text-xs text-[#64615A]">Lucro Líquido do Dono</div>
              <div className="font-mono text-2xl font-semibold text-[#16A34A] mt-2 tabular-nums">
                R$ {currentReport.netProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <div className="text-xs text-[#18181B] mt-2 font-mono tabular-nums">
                Margem Líquida: {currentReport.netMarginPct.toFixed(1).replace('.', ',')}% · CMV:{' '}
                R$ {currentReport.cogs.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
              </div>
            </div>

            <div className="p-6">
              <div className="text-xs text-[#64615A]">Volume Expedido no Mês</div>
              <div className="font-mono text-2xl font-semibold text-[#18181B] mt-2 tabular-nums">
                {currentReport.totalUnitsSold.toLocaleString('pt-BR')} cookies
              </div>
              <div className="text-xs text-[#64615A] mt-2 font-mono tabular-nums">
                {currentReport.totalOrders.toLocaleString('pt-BR')} pedidos concluídos · Perda técnica:{' '}
                {currentReport.lossAndWastePct}%
              </div>
            </div>

            <div className="p-6">
              <div className="text-xs text-[#64615A]">Ticket Médio & Fidelização</div>
              <div className="font-mono text-2xl font-semibold text-[#18181B] mt-2 tabular-nums">
                R$ {currentReport.averageTicket.toFixed(2).replace('.', ',')}
              </div>
              <div className="text-xs text-[#16A34A] font-medium mt-2 font-mono tabular-nums">
                Taxa de Recompra: {currentReport.repeatPurchaseRatePct.toFixed(1).replace('.', ',')}% em 30 dias
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 bg-white border border-[#18181B]/12 p-6 space-y-6">
              <div className="border-b border-[#18181B]/10 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-lg font-semibold text-[#18181B]">
                    Desempenho por Categoria de Produto
                  </h3>
                  <p className="text-xs text-[#64615A]">
                    Participação na receita bruta e volume de unidades em {currentReport.monthLabel}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {currentReport.categorySplit.map((c) => (
                  <div key={c.categoryId} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#18181B]">{c.categoryName}</span>
                      <span className="font-mono tabular-nums text-[#18181B]">
                        R$ {c.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} ·{' '}
                        <span className="text-[#64615A]">{c.units} un.</span> ({c.sharePct.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-[#F3F1EC] overflow-hidden">
                      <div
                        className="h-full bg-[#2C1A12]"
                        style={{ width: `${Math.min(100, c.sharePct)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-[#18181B]/10">
                <h4 className="text-xs font-semibold text-[#18181B] mb-3">
                  Vendas por Variação de Embalagem
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {currentReport.variationSplit.map((vs) => (
                    <div
                      key={vs.variationLabel}
                      className="p-3 bg-[#FAF9F6] border border-[#18181B]/10"
                    >
                      <div className="text-[11px] text-[#64615A] truncate">{vs.variationLabel}</div>
                      <div className="font-mono text-sm font-semibold text-[#18181B] mt-1 tabular-nums">
                        {vs.sharePct.toFixed(0)}% da receita
                      </div>
                      <div className="font-mono text-[11px] text-[#64615A] mt-0.5 tabular-nums">
                        {vs.ordersCount} pedidos
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-white border border-[#18181B]/12 p-6 flex flex-col justify-between">
              <div>
                <div className="border-b border-[#18181B]/10 pb-3">
                  <h3 className="font-serif text-lg font-semibold text-[#18181B]">
                    DRE Gerencial Simplificado
                  </h3>
                  <p className="text-xs text-[#64615A]">
                    Estrutura de custos de confeitaria e margem operacional
                  </p>
                </div>

                <dl className="mt-4 space-y-2.5 text-xs font-mono tabular-nums">
                  <div className="flex justify-between py-1.5 border-b border-[#18181B]/8">
                    <dt className="font-sans text-[#18181B] font-medium">
                      (+) Receita Operacional Bruta
                    </dt>
                    <dd className="font-semibold text-[#18181B]">
                      R$ {currentReport.grossRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </dd>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#18181B]/8 text-[#64615A]">
                    <dt className="font-sans">(-) Impostos Simples & Taxas Gateway (8,5%)</dt>
                    <dd>
                      - R${' '}
                      {(currentReport.grossRevenue - currentReport.netRevenue).toLocaleString(
                        'pt-BR',
                        { minimumFractionDigits: 2 }
                      )}
                    </dd>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#18181B]/8">
                    <dt className="font-sans text-[#18181B] font-medium">(=) Receita Líquida</dt>
                    <dd className="text-[#18181B]">
                      R$ {currentReport.netRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </dd>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#18181B]/8 text-[#64615A]">
                    <dt className="font-sans">
                      (-) CMV Insumos (Chocolate Belga, Manteiga, Embalagens)
                    </dt>
                    <dd>
                      - R$ {currentReport.cogs.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </dd>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#18181B]/8 text-[#64615A]">
                    <dt className="font-sans">
                      (-) Despesas Fixas (Equipe Confeitaria, Energia Fornos, Aluguel)
                    </dt>
                    <dd>
                      - R${' '}
                      {currentReport.operatingExpenses.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                      })}
                    </dd>
                  </div>
                  <div className="flex justify-between py-2.5 bg-[#F3F1EC] px-3 font-semibold text-sm text-[#16A34A]">
                    <dt className="font-sans">(=) Lucro Líquido Caixa</dt>
                    <dd>
                      R$ {currentReport.netProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}{' '}
                      ({currentReport.netMarginPct.toFixed(1)}%)
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="mt-6 pt-4 border-t border-[#18181B]/10">
                <div className="text-xs font-semibold text-[#18181B]">
                  Nota Executiva da Operação ({currentReport.monthLabel}):
                </div>
                <p className="text-xs text-[#3F3D39] mt-1.5 leading-relaxed">
                  {currentReport.ownerNotes}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#18181B]/12">
            <div className="p-6 border-b border-[#18181B]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-lg font-semibold text-[#18181B]">
                  Auditoria de Vendas por Sabor de Cookie (20 Sabores do Catálogo)
                </h3>
                <p className="text-xs text-[#64615A] mt-0.5">
                  Desempenho individualizado de unidades, faturamento, margem bruta e variação favorita
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-[#64615A]">Ordenar por:</span>
                <button
                  type="button"
                  onClick={() => setFlavorSortBy('revenue')}
                  className={`px-3 py-1.5 border transition-colors ${
                    flavorSortBy === 'revenue'
                      ? 'bg-[#2C1A12] text-[#FAF9F6] border-[#2C1A12]'
                      : 'bg-[#FAF9F6] text-[#18181B] border-[#18181B]/15'
                  }`}
                >
                  Maior Receita (R$)
                </button>
                <button
                  type="button"
                  onClick={() => setFlavorSortBy('unitsSold')}
                  className={`px-3 py-1.5 border transition-colors ${
                    flavorSortBy === 'unitsSold'
                      ? 'bg-[#2C1A12] text-[#FAF9F6] border-[#2C1A12]'
                      : 'bg-[#FAF9F6] text-[#18181B] border-[#18181B]/15'
                  }`}
                >
                  Unidades Vendidas
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#18181B]/12 bg-[#FAF9F6] text-[11px] text-[#64615A] font-medium">
                    <th className="py-3 px-4">#</th>
                    <th className="py-3 px-4">Sabor de Cookie</th>
                    <th className="py-3 px-4">Categoria</th>
                    <th className="py-3 px-4">Variação Líder</th>
                    <th className="py-3 px-4 text-right">Unidades</th>
                    <th className="py-3 px-4 text-right">Custo CMV</th>
                    <th className="py-3 px-4 text-right">Margem Bruta</th>
                    <th className="py-3 px-4 text-right">Recompra</th>
                    <th className="py-3 px-4 text-right">Receita Bruta</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#18181B]/8 text-xs">
                  {sortedFlavorMetrics.map((item, idx) => (
                    <tr key={item.productId} className="hover:bg-[#FAF9F6] transition-colors">
                      <td className="py-3 px-4 font-mono text-[#64615A] tabular-nums">
                        {String(idx + 1).padStart(2, '0')}
                      </td>
                      <td className="py-3 px-4 font-medium text-[#18181B]">{item.productName}</td>
                      <td className="py-3 px-4 text-[#64615A]">{item.categoryName}</td>
                      <td className="py-3 px-4 text-[#3F3D39]">{item.topVariation}</td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums text-[#18181B]">
                        {item.unitsSold.toLocaleString('pt-BR')} un.
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums text-[#64615A]">
                        R$ {item.cost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums text-[#16A34A]">
                        {item.grossMarginPct.toFixed(1)}%
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums text-[#18181B]">
                        {item.returnRatePct.toFixed(1)}%
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-semibold tabular-nums text-[#18181B]">
                        R$ {item.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white border border-[#18181B]/12">
            <div className="p-6 border-b border-[#18181B]/10 flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg font-semibold text-[#18181B]">
                  Registro de Pedidos Recentes ({currentReport.monthLabel})
                </h3>
                <p className="text-xs text-[#64615A] mt-0.5">
                  Novas compras finalizadas no Modo Comprador são lançadas automaticamente neste livro-razão
                </p>
              </div>
              <FileSpreadsheet className="w-5 h-5 text-[#64615A]" />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#18181B]/12 bg-[#FAF9F6] text-[11px] text-[#64615A] font-medium">
                    <th className="py-3 px-4">Pedido</th>
                    <th className="py-3 px-4">Horário</th>
                    <th className="py-3 px-4">Cliente</th>
                    <th className="py-3 px-4">Canal</th>
                    <th className="py-3 px-4">Resumo de Itens & Variações</th>
                    <th className="py-3 px-4 text-right">Cookies</th>
                    <th className="py-3 px-4 text-right">Total (R$)</th>
                    <th className="py-3 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#18181B]/8 text-xs">
                  {currentReport.recentOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-[#FAF9F6]">
                      <td className="py-3 px-4 font-mono font-medium text-[#18181B] tabular-nums">
                        {ord.id}
                      </td>
                      <td className="py-3 px-4 font-mono text-[#64615A] tabular-nums">
                        {ord.timestamp}
                      </td>
                      <td className="py-3 px-4 font-medium text-[#18181B]">{ord.customerName}</td>
                      <td className="py-3 px-4 text-[#64615A]">{ord.channel}</td>
                      <td className="py-3 px-4 text-[#3F3D39] max-w-md truncate">
                        {ord.itemsSummary}
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums">
                        {ord.totalUnits} un.
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-semibold tabular-nums text-[#18181B]">
                        R$ {ord.totalValue.toFixed(2).replace('.', ',')}
                      </td>
                      <td className="py-3 px-4 text-right font-medium text-[#16A34A]">
                        {ord.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: INVENTORY MANAGEMENT */}
      {activeSellerTab === 'inventory' && (
        <div className="mt-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 bg-white border border-[#18181B]/12 divide-y sm:divide-y-0 sm:divide-x divide-[#18181B]/12">
            <div className="p-5">
              <div className="text-xs text-[#64615A]">Total de Embalagens Prontas em Estoque</div>
              <div className="font-mono text-2xl font-semibold text-[#18181B] mt-1 tabular-nums">
                {inventoryStats.totalItems.toLocaleString('pt-BR')} itens
              </div>
              <div className="text-xs text-[#64615A] mt-1 font-mono tabular-nums">
                Equivalente a {inventoryStats.totalCookieUnitsEquivalent.toLocaleString('pt-BR')} cookies assados
              </div>
            </div>

            <div className="p-5">
              <div className="text-xs text-[#64615A]">Valor de Venda do Estoque Atual</div>
              <div className="font-mono text-2xl font-semibold text-[#18181B] mt-1 tabular-nums">
                R${' '}
                {inventoryStats.totalRetailValue.toLocaleString('pt-BR', {
                  minimumFractionDigits: 2,
                })}
              </div>
              <div className="text-xs text-[#64615A] mt-1 font-mono tabular-nums">
                Custo CMV em estoque: R${' '}
                {inventoryStats.totalCostValue.toLocaleString('pt-BR', {
                  minimumFractionDigits: 2,
                })}
              </div>
            </div>

            <div className="p-5">
              <div className="text-xs text-[#64615A]">Disponibilidade de SKUs (Variações)</div>
              <div
                className={`font-mono text-2xl font-semibold mt-1 tabular-nums ${
                  inventoryStats.zeroedSkus > 0 ? 'text-[#DC2626]' : 'text-[#16A34A]'
                }`}
              >
                {inventoryStats.totalSkus - inventoryStats.zeroedSkus} / {inventoryStats.totalSkus}{' '}
                ativos
              </div>
              <div className="text-xs text-[#64615A] mt-1 font-mono tabular-nums">
                {inventoryStats.zeroedSkus} variações com estoque zerado
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`px-3.5 py-2 text-xs font-medium border transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-[#2C1A12] text-[#FAF9F6] border-[#2C1A12]'
                    : 'bg-white text-[#64615A] border-[#18181B]/15 hover:text-[#18181B]'
                }`}
              >
                Todas as 4 Categorias (20)
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-2 text-xs font-medium border transition-colors ${
                    selectedCategory === cat.id
                      ? 'bg-[#2C1A12] text-[#FAF9F6] border-[#2C1A12]'
                      : 'bg-white text-[#64615A] border-[#18181B]/15 hover:text-[#18181B]'
                  }`}
                >
                  {cat.indexNumber}. {cat.shortTitle} (5)
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-[#64615A] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por sabor ou SKU..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-[#18181B]/20 focus:outline-none focus:border-[#2C1A12]"
              />
            </div>
          </div>

          <div className="bg-white border border-[#18181B]/12 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#18181B]/12 bg-[#FAF9F6] text-[11px] text-[#64615A] font-medium">
                  <th className="py-3.5 px-4">SKU / Produto</th>
                  <th className="py-3.5 px-4">Unidade (1 un.)</th>
                  <th className="py-3.5 px-4">Caixa Degustação (4 un.)</th>
                  <th className="py-3.5 px-4">Lata Colecionável (6 un.)</th>
                  <th className="py-3.5 px-4">Caixa Atelier (12 un.)</th>
                  <th className="py-3.5 px-4 text-right">Total Produto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#18181B]/10 text-xs">
                {filteredProducts.map((product) => {
                  const prodTotal = product.variations.reduce((a, b) => a + b.stock, 0);
                  return (
                    <tr key={product.id} className="hover:bg-[#FAF9F6]/60">
                      <td className="py-4 px-4 max-w-xs">
                        <div className="font-mono text-[11px] text-[#64615A]">
                          {product.sku} · {product.categoryName}
                        </div>
                        <div className="font-semibold text-[#18181B] mt-0.5">{product.name}</div>
                        <div className="text-[11px] text-[#64615A] font-mono mt-0.5 tabular-nums">
                          Base: R$ {product.basePrice.toFixed(2).replace('.', ',')} · Peso:{' '}
                          {product.technicalSpec.netWeight}
                        </div>
                      </td>

                      {product.variations.map((v) => (
                        <td key={v.id} className="py-4 px-4 align-middle">
                          <div className="text-[11px] font-mono text-[#64615A] tabular-nums mb-1.5">
                            R$ {v.price.toFixed(2).replace('.', ',')}
                          </div>
                          <div className="inline-flex items-center border border-[#18181B]/20 bg-white">
                            <button
                              type="button"
                              onClick={() =>
                                onUpdateVariationStock(product.id, v.id, Math.max(0, v.stock - 1))
                              }
                              className="w-7 h-7 flex items-center justify-center hover:bg-[#F3F1EC] text-[#18181B]"
                              aria-label="Reduzir estoque"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span
                              className={`w-10 text-center font-mono text-xs font-semibold tabular-nums ${
                                v.stock === 0 ? 'text-[#DC2626]' : 'text-[#18181B]'
                              }`}
                            >
                              {v.stock}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                onUpdateVariationStock(product.id, v.id, v.stock + 1)
                              }
                              className="w-7 h-7 flex items-center justify-center hover:bg-[#F3F1EC] text-[#18181B]"
                              aria-label="Aumentar estoque"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </td>
                      ))}

                      <td className="py-4 px-4 text-right font-mono tabular-nums align-middle">
                        <span
                          className={`font-semibold ${
                            prodTotal === 0 ? 'text-[#DC2626]' : 'text-[#16A34A]'
                          }`}
                        >
                          {prodTotal === 0 ? 'ZERADO (0)' : `${prodTotal} un.`}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
