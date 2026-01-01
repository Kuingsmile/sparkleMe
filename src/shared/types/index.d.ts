import { ipcRenderer } from 'electron'
import { webUtils } from 'electron'

declare global {
  export interface Window {
    electron: {
      ipcRenderer: typeof ipcRenderer
    }
    api: { webUtils: typeof webUtils; platform: NodeJS.Platform }
  }
}
