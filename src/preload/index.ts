import type { IpcRendererEvent } from 'electron'
import { contextBridge, ipcRenderer, webUtils } from 'electron'

type IpcRendererListener = (event: IpcRendererEvent, ...args: any[]) => void

// Custom APIs for renderer
const api = {
  webUtils,
  platform: process.platform,
}

const electronAPI = {
  ipcRenderer: {
    send(channel: string, ...args: any[]) {
      ipcRenderer.send(channel, ...args)
    },
    invoke(channel: string, ...args: any[]) {
      return ipcRenderer.invoke(channel, ...args)
    },
    on(channel: string, listener: IpcRendererListener) {
      ipcRenderer.on(channel, listener)
      return () => {
        ipcRenderer.removeListener(channel, listener)
      }
    },
    once(channel: string, listener: IpcRendererListener) {
      ipcRenderer.once(channel, listener)
      return () => {
        ipcRenderer.removeListener(channel, listener)
      }
    },
    removeListener(channel: string, listener: IpcRendererListener) {
      ipcRenderer.removeListener(channel, listener)
      return this
    },
    removeAllListeners(channel: string) {
      ipcRenderer.removeAllListeners(channel)
    },
  },
}

try {
  contextBridge.exposeInMainWorld('electron', electronAPI)
  contextBridge.exposeInMainWorld('api', api)
} catch (error) {
  console.error(error)
}
