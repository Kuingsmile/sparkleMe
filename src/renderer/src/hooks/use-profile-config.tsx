import { ipc } from '@renderer/utils/ipc'
import React, { createContext, ReactNode, useContext, useEffect } from 'react'
import useSWR from 'swr'

interface ProfileConfigContextType {
  profileConfig: ProfileConfig | undefined
  setProfileConfig: (config: ProfileConfig) => Promise<void>
  mutateProfileConfig: () => void
  addProfileItem: (item: Partial<ProfileItem>) => Promise<void>
  updateProfileItem: (item: ProfileItem) => Promise<void>
  removeProfileItem: (id: string) => Promise<void>
  changeCurrentProfile: (id: string) => Promise<void>
}

const ProfileConfigContext = createContext<ProfileConfigContextType | undefined>(undefined)

export const ProfileConfigProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { data: profileConfig, mutate: mutateProfileConfig } = useSWR('getProfileConfig', () => ipc.getProfileConfig())

  const setProfileConfig = async (config: ProfileConfig): Promise<void> => {
    try {
      await ipc.setProfileConfig(config)
    } catch (e) {
      alert(e)
    } finally {
      mutateProfileConfig()
      window.electron.ipcRenderer.send('updateTrayMenu')
    }
  }

  const addProfileItem = async (item: Partial<ProfileItem>): Promise<void> => {
    try {
      await ipc.addProfileItem(item)
    } catch (e) {
      alert(e)
    } finally {
      mutateProfileConfig()
      window.electron.ipcRenderer.send('updateTrayMenu')
    }
  }

  const removeProfileItem = async (id: string): Promise<void> => {
    try {
      await ipc.removeProfileItem(id)
    } catch (e) {
      alert(e)
    } finally {
      mutateProfileConfig()
      window.electron.ipcRenderer.send('updateTrayMenu')
    }
  }

  const updateProfileItem = async (item: ProfileItem): Promise<void> => {
    try {
      await ipc.updateProfileItem(item)
    } catch (e) {
      alert(e)
    } finally {
      mutateProfileConfig()
      window.electron.ipcRenderer.send('updateTrayMenu')
    }
  }

  const changeCurrentProfile = async (id: string): Promise<void> => {
    try {
      await ipc.changeCurrentProfile(id)
    } catch (e) {
      alert(e)
    } finally {
      mutateProfileConfig()
      window.electron.ipcRenderer.send('updateTrayMenu')
    }
  }

  useEffect(() => {
    window.electron.ipcRenderer.on('profileConfigUpdated', () => {
      mutateProfileConfig()
    })
    return (): void => {
      window.electron.ipcRenderer.removeAllListeners('profileConfigUpdated')
    }
  }, [])

  return (
    <ProfileConfigContext.Provider
      value={{
        profileConfig,
        setProfileConfig,
        mutateProfileConfig,
        addProfileItem,
        removeProfileItem,
        updateProfileItem,
        changeCurrentProfile,
      }}
    >
      {children}
    </ProfileConfigContext.Provider>
  )
}

export const useProfileConfig = (): ProfileConfigContextType => {
  const context = useContext(ProfileConfigContext)
  if (context === undefined) {
    throw new Error('useProfileConfig must be used within a ProfileConfigProvider')
  }
  return context
}
