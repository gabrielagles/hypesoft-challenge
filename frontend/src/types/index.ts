export interface Product {
  id: string
  name: string
  description: string | null
  price: number
  categoryId: string
  stockQuantity: number
  isLowStock: boolean
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string
  name: string
  description: string | null
  createdAt: string
  updatedAt: string
}

export interface DashboardData {
  totalProducts: number
  totalStockValue: number
  totalStockUnits: number
  lowStockCount: number
  lowStockProducts: Product[]
  productsByCategory: CategoryProductCount[]
}

export interface CategoryProductCount {
  categoryId: string
  categoryName: string
  productCount: number
}
