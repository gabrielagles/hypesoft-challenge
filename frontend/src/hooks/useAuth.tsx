import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthState {
  isAuthenticated: boolean
  token: string | null
  user: { name: string; roles: string[] } | null
}

const USERS = [
  { username: 'admin', password: 'admin123', roles: ['admin', 'manager', 'user'] },
  { username: 'manager', password: 'manager123', roles: ['manager', 'user'] },
  { username: 'user', password: 'user123', roles: ['user'] },
]

export function useAuth() {
  const navigate = useNavigate();
  
  const [authState, setAuthState] = useState<AuthState>(() => {
    const token = localStorage.getItem('token')
    const userStr = localStorage.getItem('user')
    return {
      isAuthenticated: !!token,
      token,
      user: userStr ? JSON.parse(userStr) : null,
    }
  })

  const login = useCallback(async (username: string, password: string) => {
    try {
      const user = USERS.find(u => u.username === username && u.password === password)
      
      if (!user) {
        return { success: false, error: 'Usuário ou senha incorretos' }
      }

      const token = 'demo-token-' + Date.now()
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify({ name: user.username, roles: user.roles }))
      setAuthState({ isAuthenticated: true, token, user: { name: user.username, roles: user.roles } })
      return { success: true }
    } catch (error: any) {
      return { success: false, error: 'Login failed' }
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setAuthState({ isAuthenticated: false, token: null, user: null })
    navigate('/login')
  }, [navigate])

  return {
    ...authState,
    login,
    logout,
    isManager: authState.user?.roles.includes('manager') || authState.user?.roles.includes('admin'),
    isAdmin: authState.user?.roles.includes('admin'),
  }
}
