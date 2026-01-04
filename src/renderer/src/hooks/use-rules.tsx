import { ipc } from '@renderer/utils/ipc'
import React, { createContext, ReactNode, useContext } from 'react'
import useSWR from 'swr'

interface RulesContextType {
  rules: ControllerRules | undefined
  mutate: () => void
}

const RulesContext = createContext<RulesContextType | undefined>(undefined)

export const RulesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { data: rules, mutate } = useSWR<ControllerRules>('mihomoRules', ipc.mihomoRules, {
    errorRetryInterval: 200,
    errorRetryCount: 10,
  })

  React.useEffect(() => {
    window.electron.ipcRenderer.on('rulesUpdated', () => {
      mutate()
    })
    window.electron.ipcRenderer.on('core-started', () => {
      mutate()
    })
    return (): void => {
      window.electron.ipcRenderer.removeAllListeners('rulesUpdated')
      window.electron.ipcRenderer.removeAllListeners('core-started')
    }
  }, [])

  return <RulesContext.Provider value={{ rules, mutate }}>{children}</RulesContext.Provider>
}

export const useRules = (): RulesContextType => {
  const context = useContext(RulesContext)
  if (context === undefined) {
    throw new Error('useRules must be used within an RulesProvider')
  }
  return context
}
