import { useCallback, useState } from 'react';

interface AuthState {
  isAuthenticated: boolean
  token: string | null
  user: { name: string; roles: string[] } | null
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>(() => {
    const token = localStorage.getItem('token')
    const userStr = localStorage.getItem('user')
    return {
      isAuthenticated: !!token,
      token,
      user: userStr ? JSON.parse(userStr) : null,
    }
  })

  const login = useCallback(async (username: string, _password: string) => {
    try {
      const token = 'demo-token-' + Date.now()
      localStorage.setItem('token', token)
      const user = { name: username, roles: ['admin', 'manager', 'user'] }
      localStorage.setItem('user', JSON.stringify(user))
      setAuthState({ isAuthenticated: true, token, user })
      return { success: true }
    } catch (error: any) {
      return { success: false, error: 'Login failed' }
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setAuthState({ isAuthenticated: false, token: null, user: null })
  }, [])

  return {
    ...authState,
    login,
    logout,
    isManager: authState.user?.roles.includes('manager') || authState.user?.roles.includes('admin'),
    isAdmin: authState.user?.roles.includes('admin'),
  }
}
