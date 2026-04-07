import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '../services/api'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js'
import { Pie, Bar } from 'react-chartjs-2'
import { Package, DollarSign, AlertTriangle, FolderTree, TrendingUp, PackageX, Boxes, Percent } from 'lucide-react'
import type { DashboardData } from '../types'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement)

export function Dashboard() {
  const { data, isLoading } = useQuery<DashboardData>({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const response = await dashboardApi.get()
      return response.data
    },
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-accent-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
        </div>
      </div>
    )
  }

  const pieData = {
    labels: data?.productsByCategory?.map((c: any) => c.categoryName) || [],
    datasets: [
      {
        data: data?.productsByCategory?.map((c: any) => c.productCount) || [],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(99, 102, 241, 0.8)',
        ],
        borderWidth: 0,
        hoverOffset: 8,
      },
    ],
  }

  const barData = {
    labels: data?.productsByCategory?.map((c: any) => c.categoryName) || [],
    datasets: [
      {
        label: 'Produtos',
        data: data?.productsByCategory?.map((c: any) => c.productCount) || [],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  }

  const hasLowStock = data?.lowStockProducts && data.lowStockProducts.length > 0
  const totalStockUnits = data?.lowStockProducts?.reduce((acc: number, p: any) => acc + p.stockQuantity, 0) || 0
  const zeroStock = data?.lowStockProducts?.filter((p: any) => p.stockQuantity === 0).length || 0
  const avgPrice = data?.totalProducts ? (data.totalStockValue / data.totalProducts) : 0
  const avgStock = data?.totalProducts ? Math.round(totalStockUnits / data.totalProducts) : 0

  const stats = [
    { label: 'Total de Produtos', value: data?.totalProducts || 0, icon: Package, gradient: 'from-blue-500 to-blue-600', bgLight: 'bg-blue-50' },
    { label: 'Valor em Estoque', value: `R$ ${data?.totalStockValue?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, icon: DollarSign, gradient: 'from-emerald-500 to-emerald-600', bgLight: 'bg-emerald-50' },
    { label: 'Estoque Baixo', value: data?.lowStockCount || 0, icon: AlertTriangle, gradient: 'from-amber-500 to-amber-600', bgLight: 'bg-amber-50' },
    { label: 'Categorias', value: data?.productsByCategory?.length || 0, icon: FolderTree, gradient: 'from-violet-500 to-violet-600', bgLight: 'bg-violet-50' },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-slate-100 hover:shadow-lg transition-all duration-300" style={{ animationDelay: `${index * 100}ms` }}>
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${stat.bgLight}`}>
                    <Icon className={`text-${stat.gradient.split('-')[1]}-600`} size={24} />
                  </div>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />
                </div>
                <p className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</p>
                <p className="text-sm text-slate-500">{stat.label}</p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-3">
            <Boxes className="text-cyan-500" size={18} />
            <h3 className="text-sm font-semibold text-slate-700">Estoque Total</h3>
          </div>
          <p className="text-2xl font-bold text-slate-900">{totalStockUnits}</p>
          <p className="text-xs text-slate-500 mt-1">unidades</p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="text-green-500" size={18} />
            <h3 className="text-sm font-semibold text-slate-700">Média Preço</h3>
          </div>
          <p className="text-2xl font-bold text-slate-900">
            R$ {avgPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-slate-500 mt-1">por produto</p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-3">
            <Percent className="text-indigo-500" size={18} />
            <h3 className="text-sm font-semibold text-slate-700">Média Estoque</h3>
          </div>
          <p className="text-2xl font-bold text-slate-900">{avgStock}</p>
          <p className="text-xs text-slate-500 mt-1">por produto</p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 mb-3">
            <PackageX className="text-red-500" size={18} />
            <h3 className="text-sm font-semibold text-slate-700">Sem Estoque</h3>
          </div>
          <p className="text-2xl font-bold text-red-600">{zeroStock}</p>
          <p className="text-xs text-slate-500 mt-1">produtos zerados</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-900">Produtos por Categoria</h2>
            <div className="px-3 py-1 bg-primary-50 text-primary-600 rounded-full text-sm font-medium">
              {data?.productsByCategory?.length || 0} categorias
            </div>
          </div>
          <div className="h-72 flex items-center justify-center">
            {data?.productsByCategory?.length ? (
              <Pie data={pieData} options={{ 
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: {
                      padding: 20,
                      usePointStyle: true,
                    }
                  }
                }
              }} />
            ) : (
              <div className="text-center text-slate-400">
                <Package size={48} className="mx-auto mb-2 opacity-50" />
                <p>Sem dados disponíveis</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-900">Distribuição de Produtos</h2>
            <div className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-sm font-medium">
              Visão geral
            </div>
          </div>
          <div className="h-72">
            {data?.productsByCategory?.length ? (
              <Bar data={barData} options={{ 
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: {
                      color: 'rgba(0,0,0,0.05)'
                    }
                  },
                  x: {
                    grid: {
                      display: false
                    }
                  }
                }
              }} />
            ) : (
              <div className="h-full flex items-center justify-center text-center text-slate-400">
                <div>
                  <Package size={48} className="mx-auto mb-2 opacity-50" />
                  <p>Sem dados disponíveis</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {hasLowStock && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-50 rounded-xl">
                <AlertTriangle className="text-amber-500" size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Produtos com Estoque Baixo</h2>
                <p className="text-sm text-slate-500">Itens que precisam de reposição</p>
              </div>
            </div>
            <span className="px-4 py-2 bg-amber-50 text-amber-600 rounded-xl text-sm font-semibold">
              {data?.lowStockCount} produtos
            </span>
          </div>
          <div className="overflow-hidden rounded-xl border border-slate-100">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50">
                  <th className="text-left py-4 px-5 text-sm font-semibold text-slate-600">Produto</th>
                  <th className="text-center py-4 px-5 text-sm font-semibold text-slate-600">Status</th>
                  <th className="text-right py-4 px-5 text-sm font-semibold text-slate-600">Quantidade</th>
                  <th className="text-right py-4 px-5 text-sm font-semibold text-slate-600">Preço Unit.</th>
                  <th className="text-right py-4 px-5 text-sm font-semibold text-slate-600">Valor Total</th>
                </tr>
              </thead>
              <tbody>
                {data?.lowStockProducts?.map((product: any, index: number) => (
                  <tr key={product.id} className={`border-t border-slate-100 hover:bg-slate-50/50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}>
                    <td className="py-4 px-5">
                      <p className="font-semibold text-slate-900">{product.name}</p>
                      <p className="text-sm text-slate-500 truncate max-w-xs mt-0.5">{product.description}</p>
                    </td>
                    <td className="py-4 px-5 text-center">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                        product.stockQuantity === 0 
                          ? 'bg-red-100 text-red-700' 
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {product.stockQuantity === 0 ? 'Zerado' : 'Baixo'}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right">
                      <span className={`font-bold ${product.stockQuantity === 0 ? 'text-red-600' : 'text-amber-600'}`}>
                        {product.stockQuantity} un
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right font-medium text-slate-700">
                      R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-4 px-5 text-right font-bold text-slate-900">
                      R$ {(product.price * product.stockQuantity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
