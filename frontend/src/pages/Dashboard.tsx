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
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    )
  }

  const pieData = {
    labels: data?.productsByCategory?.map((c: any) => c.categoryName) || [],
    datasets: [
      {
        data: data?.productsByCategory?.map((c: any) => c.productCount) || [],
        backgroundColor: ['#0ea5e9', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#6366f1'],
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  }

  const barData = {
    labels: data?.productsByCategory?.map((c: any) => c.categoryName) || [],
    datasets: [
      {
        label: 'Produtos',
        data: data?.productsByCategory?.map((c: any) => c.productCount) || [],
        backgroundColor: '#0ea5e9',
        borderRadius: 8,
      },
    ],
  }

  const hasLowStock = data?.lowStockProducts && data.lowStockProducts.length > 0

  const totalStockUnits = data?.lowStockProducts?.reduce((acc: number, p: any) => acc + p.stockQuantity, 0) || 0
  const zeroStock = data?.lowStockProducts?.filter((p: any) => p.stockQuantity === 0).length || 0
  const avgPrice = data?.totalProducts ? (data.totalStockValue / data.totalProducts) : 0
  const avgStock = data?.totalProducts ? Math.round(totalStockUnits / data.totalProducts) : 0

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500">Visao geral do sistema</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl shadow-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total de Produtos</p>
              <p className="text-4xl font-bold mt-1">{data?.totalProducts || 0}</p>
            </div>
            <div className="p-3 bg-white/20 rounded-lg">
              <Package size={28} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl shadow-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Valor em Estoque</p>
              <p className="text-2xl font-bold mt-1">
                R$ {data?.totalStockValue?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}
              </p>
            </div>
            <div className="p-3 bg-white/20 rounded-lg">
              <DollarSign size={28} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-6 rounded-xl shadow-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-100 text-sm">Estoque Baixo</p>
              <p className="text-4xl font-bold mt-1">{data?.lowStockCount || 0}</p>
            </div>
            <div className="p-3 bg-white/20 rounded-lg">
              <AlertTriangle size={28} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl shadow-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Categorias</p>
              <p className="text-4xl font-bold mt-1">{data?.productsByCategory?.length || 0}</p>
            </div>
            <div className="p-3 bg-white/20 rounded-lg">
              <FolderTree size={28} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 mb-2">
            <Boxes className="text-cyan-500" size={18} />
            <h3 className="text-sm font-semibold text-slate-900">Estoque Total</h3>
          </div>
          <p className="text-2xl font-bold text-slate-900">{totalStockUnits}</p>
          <p className="text-xs text-slate-500">unidades</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="text-green-500" size={18} />
            <h3 className="text-sm font-semibold text-slate-900">Media Preco</h3>
          </div>
          <p className="text-2xl font-bold text-slate-900">
            R$ {avgPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-slate-500">por produto</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 mb-2">
            <Percent className="text-indigo-500" size={18} />
            <h3 className="text-sm font-semibold text-slate-900">Media Estoque</h3>
          </div>
          <p className="text-2xl font-bold text-slate-900">{avgStock}</p>
          <p className="text-xs text-slate-500">por produto</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 mb-2">
            <PackageX className="text-red-500" size={18} />
            <h3 className="text-sm font-semibold text-slate-900">Sem Estoque</h3>
          </div>
          <p className="text-2xl font-bold text-red-600">{zeroStock}</p>
          <p className="text-xs text-slate-500">produtos zerados</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Produtos por Categoria</h2>
          <div className="h-72 flex items-center justify-center">
            {data?.productsByCategory?.length ? (
              <Pie data={pieData} options={{ maintainAspectRatio: false }} />
            ) : (
              <p className="text-slate-400">Sem dados</p>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Distribuicao de Produtos</h2>
          <div className="h-72">
            {data?.productsByCategory?.length ? (
              <Bar data={barData} options={{ maintainAspectRatio: false }} />
            ) : (
              <p className="text-slate-400">Sem dados</p>
            )}
          </div>
        </div>
      </div>

      {hasLowStock && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="text-amber-500" size={20} />
              <h2 className="text-lg font-semibold text-slate-900">Produtos com Estoque Baixo</h2>
            </div>
            <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
              {data?.lowStockCount} produtos
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Produto</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-slate-600">Status</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-slate-600">Quantidade</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-slate-600">Preco Unit.</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-slate-600">Valor em Estoque</th>
                </tr>
              </thead>
              <tbody>
                {data?.lowStockProducts?.map((product: any) => (
                  <tr key={product.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <p className="font-medium text-slate-900">{product.name}</p>
                      <p className="text-sm text-slate-500 truncate max-w-xs">{product.description}</p>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.stockQuantity === 0 ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {product.stockQuantity === 0 ? 'Zerado' : 'Baixo'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="font-bold text-slate-900">{product.stockQuantity} un</span>
                    </td>
                    <td className="py-3 px-4 text-right font-medium">
                      R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-slate-900">
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
