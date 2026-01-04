import '@renderer/assets/main.css'

import { HeroUIProvider } from '@heroui/react'
import App from '@renderer/App'
import BaseErrorBoundary from '@renderer/components/base/base-error-boundary'
import { ProviderComposer, ProviderConfig } from '@renderer/components/ProviderComposer'
import { AppConfigProvider } from '@renderer/hooks/use-app-config'
import { ControledMihomoConfigProvider } from '@renderer/hooks/use-controled-mihomo-config'
import { GroupsProvider } from '@renderer/hooks/use-groups'
import { OverrideConfigProvider } from '@renderer/hooks/use-override-config'
import { ProfileConfigProvider } from '@renderer/hooks/use-profile-config'
import { RulesProvider } from '@renderer/hooks/use-rules'
import { init, platform } from '@renderer/utils/init'
import { ipc } from '@renderer/utils/ipc'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'

let F12Count = 0

init()
  .then(() => {
    document.addEventListener('keydown', e => {
      if (platform !== 'darwin' && e.ctrlKey && e.key === 'q') {
        e.preventDefault()
        ipc.quitApp()
      }
      if (platform === 'darwin' && e.metaKey && e.key === 'q') {
        e.preventDefault()
        ipc.quitApp()
      }
      if (e.key === 'Escape') {
        e.preventDefault()
        window.close()
      }
      if (e.key === 'F12') {
        e.preventDefault()
        F12Count++
        if (F12Count >= 5) {
          ipc.openDevTools()
          F12Count = 0
        }
      }
    })
  })
  .catch(err => {
    console.error('Initialization failed:', err)
  })

const providers: ProviderConfig[] = [
  React.StrictMode,
  HeroUIProvider,
  [NextThemesProvider, { attribute: 'class', enableSystem: true, defaultTheme: 'dark' }],
  BaseErrorBoundary,
  HashRouter,
  AppConfigProvider,
  ControledMihomoConfigProvider,
  ProfileConfigProvider,
  OverrideConfigProvider,
  GroupsProvider,
  RulesProvider,
]

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <ProviderComposer providers={providers}>
    <App />
  </ProviderComposer>,
)
