import '@renderer/assets/main.css'

import { HeroUIProvider } from '@heroui/react'
import App from '@renderer/App'
import { init, platform } from '@renderer/utils/init'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'

import BaseErrorBoundary from './components/base/base-error-boundary'
import { AppConfigProvider } from './hooks/use-app-config'
import { ControledMihomoConfigProvider } from './hooks/use-controled-mihomo-config'
import { GroupsProvider } from './hooks/use-groups'
import { OverrideConfigProvider } from './hooks/use-override-config'
import { ProfileConfigProvider } from './hooks/use-profile-config'
import { RulesProvider } from './hooks/use-rules'
import { openDevTools, quitApp } from './utils/ipc'

let F12Count = 0
console.log('Renderer process platform:', platform)

init().then(() => {
  document.addEventListener('keydown', e => {
    if (platform !== 'darwin' && e.ctrlKey && e.key === 'q') {
      e.preventDefault()
      quitApp()
    }
    if (platform === 'darwin' && e.metaKey && e.key === 'q') {
      e.preventDefault()
      quitApp()
    }
    if (e.key === 'Escape') {
      e.preventDefault()
      window.close()
    }
    if (e.key === 'F12') {
      e.preventDefault()
      F12Count++
      if (F12Count >= 5) {
        openDevTools()
        F12Count = 0
      }
    }
  })
})

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <HeroUIProvider>
      <NextThemesProvider attribute='class' enableSystem defaultTheme='dark'>
        <BaseErrorBoundary>
          <HashRouter>
            <AppConfigProvider>
              <ControledMihomoConfigProvider>
                <ProfileConfigProvider>
                  <OverrideConfigProvider>
                    <GroupsProvider>
                      <RulesProvider>
                        <App />
                      </RulesProvider>
                    </GroupsProvider>
                  </OverrideConfigProvider>
                </ProfileConfigProvider>
              </ControledMihomoConfigProvider>
            </AppConfigProvider>
          </HashRouter>
        </BaseErrorBoundary>
      </NextThemesProvider>
    </HeroUIProvider>
  </React.StrictMode>,
)
