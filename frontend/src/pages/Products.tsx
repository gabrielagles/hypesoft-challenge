import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { productsApi, categoriesApi } from '../services/api'
import { Plus, Search, Pencil, Trash2, X, ChevronLeft, ChevronRight, Package, Filter, AlertCircle } from 'lucide-react'
import { productSchema, type ProductFormData } from '../lib/schemas'
import type { Product, Category } from '../types'

export function Products() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const queryClient = useQueryClient()

  const { data: productsData, isLoading } = useQuery({
    queryKey: ['products', page, search, categoryFilter],
    queryFn: async () => {
      const response = await productsApi.getAll(page, 10, categoryFilter || undefined, search || undefined)
      return response.data
    },
  })

  const { data: categories } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await categoriesApi.getAll()
      return response.data
    },
  })

  const createMutation = useMutation({
    mutationFn: (data: any) => productsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      closeModal()
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => productsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      closeModal()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => productsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      price: '',
      categoryId: '',
      stockQuantity: '',
    },
  })

  const openModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product)
      reset({
        name: product.name,
        description: product.description || '',
        price: product.price.toString(),
        categoryId: product.categoryId,
        stockQuantity: product.stockQuantity.toString(),
      })
    } else {
      setEditingProduct(null)
      reset({
        name: '',
        description: '',
        price: '',
        categoryId: '',
        stockQuantity: '',
      })
    }
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingProduct(null)
    reset()
  }

  const onSubmit = (data: ProductFormData) => {
    const price = typeof data.price === 'string' ? parseFloat(data.price) : data.price
    const stock = typeof data.stockQuantity === 'string' ? parseInt(data.stockQuantity) : data.stockQuantity
    
    const payload = {
      name: data.name,
      description: data.description?.trim() || null,
      price: price,
      categoryId: data.categoryId,
      stockQuantity: stock,
    }

    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct.id, data: payload })
    } else {
      createMutation.mutate(payload)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Produtos</h1>
          <p className="text-slate-500">Gerencie seus produtos</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl hover:from-primary-500 hover:to-primary-400 transition-all shadow-lg shadow-primary-500/25 font-medium"
        >
          <Plus size={20} />
          Novo Produto
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Buscar produtos..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <select
              value={categoryFilter}
              onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
              className="pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition appearance-none cursor-pointer min-w-[200px]"
            >
              <option value="">Todas as categorias</option>
              {categories?.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="relative w-12 h-12 mx-auto">
              <div className="absolute inset-0 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
            </div>
            <p className="text-slate-500 mt-4">Carregando produtos...</p>
          </div>
        ) : !productsData?.length ? (
          <div className="p-12 text-center">
            <Package size={48} className="mx-auto text-slate-300 mb-4" />
            <p className="text-slate-500 font-medium">Nenhum produto encontrado</p>
            <p className="text-slate-400 text-sm mt-1">Clique em "Novo Produto" para adicionar</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="text-left py-4 px-5 text-sm font-semibold text-slate-600">Produto</th>
                  <th className="text-left py-4 px-5 text-sm font-semibold text-slate-600">Categoria</th>
                  <th className="text-right py-4 px-5 text-sm font-semibold text-slate-600">Preço</th>
                  <th className="text-center py-4 px-5 text-sm font-semibold text-slate-600">Estoque</th>
                  <th className="py-4 px-5"></th>
                </tr>
              </thead>
              <tbody>
                {productsData.map((product: Product, index: number) => {
                  const category = categories?.find((c) => c.id === product.categoryId)
                  return (
                    <tr key={product.id} className={`border-b border-slate-50 hover:bg-slate-50/50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-slate-25'}`}>
                      <td className="py-4 px-5">
                        <p className="font-semibold text-slate-900">{product.name}</p>
                        <p className="text-sm text-slate-500 truncate max-w-xs mt-0.5">{product.description}</p>
                      </td>
                      <td className="py-4 px-5">
                        <span className="inline-flex items-center px-3 py-1 bg-primary-50 text-primary-600 rounded-full text-xs font-medium">
                          {category?.name || '-'}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-right font-semibold text-slate-900">
                        R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-4 px-5 text-center">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                          product.isLowStock 
                            ? product.stockQuantity === 0 
                              ? 'bg-red-100 text-red-700' 
                              : 'bg-amber-100 text-amber-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {product.stockQuantity} un
                        </span>
                      </td>
                      <td className="py-4 px-5">
                        <div className="flex items-center justify-end gap-1">
                          <button 
                            onClick={() => openModal(product)} 
                            className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                          >
                            <Pencil size={18} />
                          </button>
                          <button 
                            onClick={() => deleteMutation.mutate(product.id)} 
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          Página <span className="font-semibold text-slate-700">{page}</span>
        </p>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setPage(p => Math.max(1, p - 1))} 
            disabled={page === 1}
            className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={() => setPage(p => p + 1)}
            disabled={!productsData?.length || productsData.length < 10}
            className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-scale-in">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-bold text-slate-900">{editingProduct ? 'Editar Produto' : 'Novo Produto'}</h2>
                <p className="text-sm text-slate-500 mt-1">{editingProduct ? 'Altere os dados do produto' : 'Preencha os dados do novo produto'}</p>
              </div>
              <button onClick={closeModal} className="p-2 hover:bg-slate-100 rounded-xl transition">
                <X size={20} className="text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Nome *</label>
                <input 
                  type="text" 
                  {...register('name')}
                  className={`w-full px-4 py-3 bg-slate-50 border rounded-xl focus:ring-2 focus:border-primary-500 outline-none transition ${
                    errors.name ? 'border-red-300 focus:ring-red-500' : 'border-slate-200 focus:ring-primary-500'
                  }`}
                  placeholder="Ex: Notebook Gamer"
                />
                {errors.name && (
                  <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Descrição</label>
                <textarea 
                  {...register('description')}
                  rows={3}
                  className={`w-full px-4 py-3 bg-slate-50 border rounded-xl focus:ring-2 focus:border-primary-500 outline-none transition resize-none ${
                    errors.description ? 'border-red-300 focus:ring-red-500' : 'border-slate-200 focus:ring-primary-500'
                  }`}
                  placeholder="Descrição do produto..."
                />
                {errors.description && (
                  <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Preço *</label>
                  <input 
                    type="number" 
                    {...register('price')}
                    step="0.01"
                    min="0"
                    className={`w-full px-4 py-3 bg-slate-50 border rounded-xl focus:ring-2 focus:border-primary-500 outline-none transition ${
                      errors.price ? 'border-red-300 focus:ring-red-500' : 'border-slate-200 focus:ring-primary-500'
                    }`}
                    placeholder="0.00"
                  />
                  {errors.price && (
                    <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.price.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Estoque *</label>
                  <input 
                    type="number" 
                    {...register('stockQuantity')}
                    min="0"
                    className={`w-full px-4 py-3 bg-slate-50 border rounded-xl focus:ring-2 focus:border-primary-500 outline-none transition ${
                      errors.stockQuantity ? 'border-red-300 focus:ring-red-500' : 'border-slate-200 focus:ring-primary-500'
                    }`}
                    placeholder="0"
                  />
                  {errors.stockQuantity && (
                    <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.stockQuantity.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Categoria *</label>
                <select 
                  {...register('categoryId')}
                  className={`w-full px-4 py-3 bg-slate-50 border rounded-xl focus:ring-2 focus:border-primary-500 outline-none transition appearance-none cursor-pointer ${
                    errors.categoryId ? 'border-red-300 focus:ring-red-500' : 'border-slate-200 focus:ring-primary-500'
                  }`}
                >
                  <option value="">Selecione uma categoria</option>
                  {categories?.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                {errors.categoryId && (
                  <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.categoryId.message}
                  </p>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={closeModal}
                  className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition font-medium"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting || createMutation.isPending || updateMutation.isPending}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl hover:from-primary-500 hover:to-primary-400 transition font-medium shadow-lg shadow-primary-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting || createMutation.isPending || updateMutation.isPending ? 'Salvando...' : (editingProduct ? 'Salvar' : 'Criar')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
