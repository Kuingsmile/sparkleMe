import '@renderer/assets/traymenu.css'

import { HeroUIProvider } from '@heroui/react'
import BaseErrorBoundary from '@renderer/components/base/base-error-boundary'
import { ProviderComposer, ProviderConfig } from '@renderer/components/ProviderComposer'
import { AppConfigProvider } from '@renderer/hooks/use-app-config'
import { ControledMihomoConfigProvider } from '@renderer/hooks/use-controled-mihomo-config'
import { GroupsProvider } from '@renderer/hooks/use-groups'
import TrayMenuApp from '@renderer/TrayMenuApp'
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
  GroupsProvider,
]

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <ProviderComposer providers={providers}>
    <TrayMenuApp />
  </ProviderComposer>,
)
