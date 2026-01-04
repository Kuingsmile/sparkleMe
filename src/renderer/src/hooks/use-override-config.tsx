import { ipc } from '@renderer/utils/ipc'
import React, { createContext, ReactNode, useContext, useEffect } from 'react'
import useSWR from 'swr'

interface OverrideConfigContextType {
  overrideConfig: OverrideConfig | undefined
  setOverrideConfig: (config: OverrideConfig) => Promise<void>
  mutateOverrideConfig: () => void
  addOverrideItem: (item: Partial<OverrideItem>) => Promise<void>
  updateOverrideItem: (item: OverrideItem) => Promise<void>
  removeOverrideItem: (id: string) => Promise<void>
}

const OverrideConfigContext = createContext<OverrideConfigContextType | undefined>(undefined)

export const OverrideConfigProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { data: overrideConfig, mutate: mutateOverrideConfig } = useSWR('getOverrideConfig', () =>
    ipc.getOverrideConfig(),
  )

  const setOverrideConfig = async (config: OverrideConfig): Promise<void> => {
    try {
      await ipc.setOverrideConfig(config)
    } catch (e) {
      alert(e)
    } finally {
      mutateOverrideConfig()
    }
  }

  const addOverrideItem = async (item: Partial<OverrideItem>): Promise<void> => {
    try {
      await ipc.addOverrideItem(item)
    } catch (e) {
      alert(e)
    } finally {
      mutateOverrideConfig()
    }
  }

  const removeOverrideItem = async (id: string): Promise<void> => {
    try {
      await ipc.removeOverrideItem(id)
    } catch (e) {
      alert(e)
    } finally {
      mutateOverrideConfig()
    }
  }

  const updateOverrideItem = async (item: OverrideItem): Promise<void> => {
    try {
      await ipc.updateOverrideItem(item)
    } catch (e) {
      alert(e)
    } finally {
      mutateOverrideConfig()
    }
  }

  useEffect(() => {
    window.electron.ipcRenderer.on('overrideConfigUpdated', () => {
      mutateOverrideConfig()
    })
    return (): void => {
      window.electron.ipcRenderer.removeAllListeners('overrideConfigUpdated')
    }
  }, [])

  return (
    <OverrideConfigContext.Provider
      value={{
        overrideConfig,
        setOverrideConfig,
        mutateOverrideConfig,
        addOverrideItem,
        removeOverrideItem,
        updateOverrideItem,
      }}
    >
      {children}
    </OverrideConfigContext.Provider>
  )
}

export const useOverrideConfig = (): OverrideConfigContextType => {
  const context = useContext(OverrideConfigContext)
  if (context === undefined) {
    throw new Error('useOverrideConfig must be used within an OverrideConfigProvider')
  }
  return context
}
