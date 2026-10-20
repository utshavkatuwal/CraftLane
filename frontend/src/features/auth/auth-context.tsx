/* Craftlane — Auth context
 * Manages authentication state (session token and user) across the
 * application. Provides login, logout, and getMe functions.
 *
 * Session tokens are held in React state (memory only) — never in
 * localStorage or sessionStorage — so a page refresh clears the session
 * and the user must sign in again.
 */

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { api, setAuthToken, getAuthToken } from '@/services/api-client'
import {
  signin as signinService,
  signup as signupService,
  getMe as getMeService,
  signout as signoutService,
  SignupSchema,
  SigninSchema,
} from '@/features/auth/auth.service'
import type { SignUpForm, SignInForm, User } from '@/types'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (data: SignInForm) => Promise<void>
  signup: (data: SignUpForm) => Promise<void>
  logout: () => Promise<void>
  getMe: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }: { children: ReactNode }): JSX.Element {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Restore session from memory on mount.
  useEffect(() => {
    const token = getAuthToken()
    if (token) {
      // We have a token but need to fetch the user. Do it silently.
      void getMe()
        .catch(() => {
          // If getMe fails, the session may be invalid — clear it.
          setAuthToken(null)
          setUser(null)
        })
        .finally(() => {
          setIsLoading(false)
        })
    } else {
      setIsLoading(false)
    }
  }, [])

  const login = async (data: SignInForm): Promise<void> => {
    const result = await signinService(data)
    setAuthToken(result.session_token)
    setUser(result.user)
  }

  const signup = async (data: SignUpForm): Promise<void> => {
    const result = await signupService(data)
    // Signup does not return a session token — the user must sign in.
    // Return the created user so the caller can show a success message.
    setUser(result.user)
  }

  const logout = async (): Promise<void> => {
    // Invalidate the session on the backend if we have a token.
    if (getAuthToken()) {
      try {
        await api.post('/auth/signout')
      } catch {
        // Ignore errors during logout cleanup — clear local state anyway.
      }
    }
    setAuthToken(null)
    setUser(null)
  }

  const getMe = async (): Promise<void> => {
    const result = await getMeService()
    setUser(result)
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
    getMe,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
