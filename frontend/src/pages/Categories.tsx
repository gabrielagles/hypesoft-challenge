import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { categoriesApi } from '../services/api'
import { Plus, Pencil, Trash2, X, FolderTree, AlertCircle } from 'lucide-react'
import { categorySchema, type CategoryFormData } from '../lib/schemas'
import type { Category } from '../types'

const categoryColors = [
  'from-blue-500 to-blue-600',
  'from-violet-500 to-violet-600',
  'from-emerald-500 to-emerald-600',
  'from-amber-500 to-amber-600',
  'from-rose-500 to-rose-600',
  'from-cyan-500 to-cyan-600',
  'from-purple-500 to-purple-600',
  'from-indigo-500 to-indigo-600',
]

export function Categories() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const queryClient = useQueryClient()

  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await categoriesApi.getAll()
      return response.data
    },
  })

  const createMutation = useMutation({
    mutationFn: (data: any) => categoriesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      closeModal()
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => categoriesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      closeModal()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => categoriesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      description: '',
    },
  })

  const openModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category)
      reset({
        name: category.name,
        description: category.description || '',
      })
    } else {
      setEditingCategory(null)
      reset({
        name: '',
        description: '',
      })
    }
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingCategory(null)
    reset()
  }

  const onSubmit = (data: CategoryFormData) => {
    const payload = {
      ...data,
      description: data.description || null,
    }

    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory.id, data: payload })
    } else {
      createMutation.mutate(payload)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Categorias</h1>
          <p className="text-slate-500">Organize seus produtos por categorias</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl hover:from-primary-500 hover:to-primary-400 transition-all shadow-lg shadow-primary-500/25 font-medium"
        >
          <Plus size={20} />
          Nova Categoria
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 animate-pulse">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-slate-200 rounded-xl" />
                <div className="w-16 h-6 bg-slate-200 rounded" />
              </div>
              <div className="w-3/4 h-5 bg-slate-200 rounded mb-2" />
              <div className="w-1/2 h-4 bg-slate-100 rounded" />
            </div>
          ))
        ) : !categories?.length ? (
          <div className="col-span-full">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
              <FolderTree size={48} className="mx-auto text-slate-300 mb-4" />
              <p className="text-slate-500 font-medium">Nenhuma categoria encontrada</p>
              <p className="text-slate-400 text-sm mt-1 mb-4">Clique em "Nova Categoria" para adicionar</p>
            </div>
          </div>
        ) : (
          categories.map((category, index) => {
            const colorIndex = index % categoryColors.length
            const gradient = categoryColors[colorIndex]
            
            return (
              <div 
                key={category.id} 
                className="group relative bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg hover:border-primary-100 transition-all duration-300"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity rounded-2xl`} />
                
                <div className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}>
                      <FolderTree className="text-white" size={24} />
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => openModal(category)} 
                        className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                      >
                        <Pencil size={16} />
                      </button>
                      <button 
                        onClick={() => deleteMutation.mutate(category.id)} 
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <h3 className="font-bold text-slate-900 text-lg mb-1">{category.name}</h3>
                  <p className="text-sm text-slate-500 line-clamp-2">
                    {category.description || 'Sem descrição'}
                  </p>
                  
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <p className="text-xs text-slate-400">
                      Criado em {new Date(category.createdAt).toLocaleDateString('pt-BR', { 
                        day: '2-digit', 
                        month: 'short', 
                        year: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-scale-in">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl">
                  <FolderTree className="text-white" size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{editingCategory ? 'Editar Categoria' : 'Nova Categoria'}</h2>
                  <p className="text-sm text-slate-500 mt-1">{editingCategory ? 'Altere os dados da categoria' : 'Preencha os dados da nova categoria'}</p>
                </div>
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
                  placeholder="Ex: Eletrônicos"
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
                  placeholder="Descreva a categoria..."
                />
                {errors.description && (
                  <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.description.message}
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
                  {isSubmitting || createMutation.isPending || updateMutation.isPending ? 'Salvando...' : (editingCategory ? 'Salvar' : 'Criar')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
