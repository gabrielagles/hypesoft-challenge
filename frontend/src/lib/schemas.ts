import { z } from 'zod'

export const productSchema = z.object({
  name: z.string()
    .min(3, 'Nome deve ter pelo menos 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  description: z.string().max(500, 'Descrição deve ter no máximo 500 caracteres').optional().nullable(),
  price: z.number()
    .min(0.01, 'Preço deve ser maior que zero')
    .max(999999.99, 'Preço inválido'),
  categoryId: z.string()
    .min(1, 'Selecione uma categoria'),
  stockQuantity: z.number()
    .min(0, 'Estoque não pode ser negativo')
    .int('Estoque deve ser um número inteiro'),
})

export const categorySchema = z.object({
  name: z.string()
    .min(3, 'Nome deve ter pelo menos 3 caracteres')
    .max(50, 'Nome deve ter no máximo 50 caracteres'),
  description: z.string().max(200, 'Descrição deve ter no máximo 200 caracteres').optional().nullable(),
})

export const loginSchema = z.object({
  username: z.string().min(1, 'Usuário é obrigatório'),
  password: z.string().min(1, 'Senha é obrigatória'),
})

export type ProductFormData = z.infer<typeof productSchema>
export type CategoryFormData = z.infer<typeof categorySchema>
export type LoginFormData = z.infer<typeof loginSchema>
