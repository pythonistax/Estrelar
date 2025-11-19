import appConfig from '@/config/app.json'
import copyConfig from '@/config/copy.json'
import themeConfig from '@/config/theme.json'

export const app = appConfig
export const copy = copyConfig
export const theme = themeConfig

// Type definitions for better TypeScript support
export interface AppConfig {
  name: string
  version: string
  type: string
  settings: {
    enableAnalytics: boolean
    enableSocialProof: boolean
    enableCountdown: boolean
    enableNotifications: boolean
  }
}

export interface CopyConfig {
  hero: {
    title: string
    subtitle: string
    cta: string
  }
  socialProof: {
    title: string
    testimonials: Array<{
      name: string
      location: string
      text: string
      time: string
    }>
    stats: {
      users: string
      satisfaction: string
      completed: string
    }
  }
  quiz: {
    steps: Array<{
      id: number
      question: string
      options: string[]
    }>
  }
  notifications: string[]
}

export interface ThemeConfig {
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    text: string
    textLight: string
  }
  typography: {
    fontFamily: string
    headingSize: string
    bodySize: string
  }
  spacing: {
    section: string
    element: string
  }
  borderRadius: {
    button: string
    card: string
  }
}

