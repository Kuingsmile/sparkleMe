import '@renderer/assets/floating.css'

import { HeroUIProvider } from '@heroui/react'
import BaseErrorBoundary from '@renderer/components/base/base-error-boundary'
import { ProviderComposer, ProviderConfig } from '@renderer/components/ProviderComposer'
import FloatingApp from '@renderer/FloatingApp'
import { AppConfigProvider } from '@renderer/hooks/use-app-config'
import { ControledMihomoConfigProvider } from '@renderer/hooks/use-controled-mihomo-config'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import React from 'react'
import ReactDOM from 'react-dom/client'

const providers: ProviderConfig[] = [
  React.StrictMode,
  HeroUIProvider,
  [NextThemesProvider, { attribute: 'class', enableSystem: true, defaultTheme: 'dark' }],
  BaseErrorBoundary,
  AppConfigProvider,
  ControledMihomoConfigProvider,
]

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <ProviderComposer providers={providers}>
    <FloatingApp />
  </ProviderComposer>,
)
