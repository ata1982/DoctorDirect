import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  email: string
  name?: string
  image?: string
  isDoctor: boolean
}

interface HealthData {
  symptoms: string[]
  severity: number
  duration: string
  lastCheckup?: Date
  vitals: {
    bloodPressure?: string
    heartRate?: number
    weight?: number
    temperature?: number
  }
}

interface AppState {
  // User state
  user: User | null
  setUser: (user: User | null) => void
  
  // Health state
  healthData: HealthData
  updateHealthData: (data: Partial<HealthData>) => void
  
  // UI state
  isLoading: boolean
  setLoading: (loading: boolean) => void
  
  // Notifications
  notifications: Array<{
    id: string
    type: 'info' | 'success' | 'warning' | 'error'
    title: string
    message: string
    timestamp: Date
  }>
  addNotification: (notification: Omit<AppState['notifications'][0], 'id' | 'timestamp'>) => void
  removeNotification: (id: string) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // User state
      user: null,
      setUser: (user) => set({ user }),
      
      // Health state
      healthData: {
        symptoms: [],
        severity: 1,
        duration: '',
        vitals: {}
      },
      updateHealthData: (data) => set((state) => ({
        healthData: { ...state.healthData, ...data }
      })),
      
      // UI state
      isLoading: false,
      setLoading: (loading) => set({ isLoading: loading }),
      
      // Notifications
      notifications: [],
      addNotification: (notification) => set((state) => ({
        notifications: [
          ...state.notifications,
          {
            ...notification,
            id: Math.random().toString(36).substr(2, 9),
            timestamp: new Date()
          }
        ]
      })),
      removeNotification: (id) => set((state) => ({
        notifications: state.notifications.filter(n => n.id !== id)
      }))
    }),
    {
      name: 'doctor-direct-storage',
      partialize: (state) => ({
        user: state.user,
        healthData: state.healthData
      })
    }
  )
)