import { ipc } from '@renderer/utils/ipc'
import React, { createContext, ReactNode, useContext } from 'react'
import useSWR from 'swr'

interface AppConfigContextType {
  appConfig: AppConfig | undefined
  mutateAppConfig: () => void
  patchAppConfig: (value: Partial<AppConfig>) => Promise<void>
}

const AppConfigContext = createContext<AppConfigContextType | undefined>(undefined)

export const AppConfigProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { data: appConfig, mutate: mutateAppConfig } = useSWR('getConfig', () => ipc.getAppConfig())

  const patchAppConfig = async (value: Partial<AppConfig>): Promise<void> => {
    try {
      await ipc.patchAppConfig(value)
    } catch (e) {
      alert(e)
    } finally {
      mutateAppConfig()
    }
  }

  React.useEffect(() => {
    window.electron.ipcRenderer.on('appConfigUpdated', () => {
      mutateAppConfig()
    })
    return (): void => {
      window.electron.ipcRenderer.removeAllListeners('appConfigUpdated')
    }
  }, [])

  return (
    <AppConfigContext.Provider value={{ appConfig, mutateAppConfig, patchAppConfig }}>
      {children}
    </AppConfigContext.Provider>
  )
}

export const useAppConfig = (): AppConfigContextType => {
  const context = useContext(AppConfigContext)
  if (context === undefined) {
    throw new Error('useAppConfig must be used within an AppConfigProvider')
  }
  return context
}
