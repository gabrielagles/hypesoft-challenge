import { Outlet, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { LayoutDashboard, Package, FolderTree, LogOut, ChevronRight, Sparkles } from 'lucide-react'

export function Layout() {
  const location = useLocation()
  const { logout, user } = useAuth()

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/products', label: 'Produtos', icon: Package },
    { path: '/categories', label: 'Categorias', icon: FolderTree },
  ]

  const getBreadcrumb = () => {
    switch (location.pathname) {
      case '/': return 'Dashboard'
      case '/products': return 'Produtos'
      case '/categories': return 'Categorias'
      default: return ''
    }
  }

  return (
    <div className="min-h-screen flex bg-slate-50">
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col fixed h-full z-20">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                Hypesoft
              </h1>
              <p className="text-xs text-slate-500">Gestão</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                      isActive
                        ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/25'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Icon size={20} className={isActive ? '' : 'group-hover:text-primary-500'} />
                    <span className="font-medium">{item.label}</span>
                    {isActive && (
                      <ChevronRight size={16} className="ml-auto" />
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-accent-400 rounded-full flex items-center justify-center text-white font-bold">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-900 truncate">{user?.name}</p>
                <p className="text-xs text-slate-500">
                  {user?.roles?.includes('admin') ? 'Administrador' : 
                   user?.roles?.includes('manager') ? 'Gerente' : 'Usuário'}
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors font-medium"
          >
            <LogOut size={18} />
            Sair
          </button>
        </div>
      </aside>

      <main className="flex-1 ml-72 p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900">{getBreadcrumb()}</h2>
          <p className="text-slate-500 text-sm mt-1">Bem-vindo de volta, {user?.name}</p>
        </div>
        <Outlet />
      </main>
    </div>
  )
}
