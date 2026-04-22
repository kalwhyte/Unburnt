
import React, { createContext, useContext, useEffect, useState } from 'react'
import { useRouter, useSegments } from 'expo-router'
import { useAuthStore } from '../store/useAuthStore'
import { useOnboardingStore } from '../store/onboardingStore'

interface AuthContextType {
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { token } = useAuthStore()
  const { completed: onboardingCompleted } = useOnboardingStore()
  const [isLoading, setIsLoading] = useState(true)
  const segments = useSegments()
  const router = useRouter()

  useEffect(() => {
    // segments is empty on first render — wait until router is ready
    if (segments.length === 0) return

    const inAuthGroup       = segments[0] === '(auth)'
    const inOnboardingGroup = segments[0] === '(onboarding)'
    const inTabsGroup       = segments[0] === '(tabs)'

    if (!token) {
      if (!inAuthGroup) router.replace('/(auth)/welcome')
    } else if (!onboardingCompleted) {
      if (!inOnboardingGroup) router.replace('/(onboarding)/smoking-profile')
    } else {
      if (inAuthGroup || inOnboardingGroup) router.replace('/(tabs)/dashboard')
    }

    setIsLoading(false)
  }, [token, onboardingCompleted, segments])

  if (isLoading && segments.length === 0) {
    // Don't block the render — let the router mount first
    return (
      <AuthContext.Provider value={{ isLoading }}>
        {children}
      </AuthContext.Provider>
    )
  }

  return (
    <AuthContext.Provider value={{ isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}