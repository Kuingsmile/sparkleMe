import { NetworkInterfaceInfo } from 'node:os'

import { TitleBarOverlayOptions } from 'electron'

function createIpcInvoker() {
  return new Proxy({} as IpcMethods, {
    get: (_target, method: string) => {
      return async (...args: any[]) => {
        const response = await window.electron.ipcRenderer.invoke(method, ...args)
        if (typeof response === 'object' && response && 'invokeError' in response) {
          throw response.invokeError
        }
        return response
      }
    },
  })
}

interface IpcMethods {
  // Mihomo Core
  mihomoVersion(): Promise<ControllerVersion>
  mihomoConfig(): Promise<ControllerConfigs>
  mihomoCloseConnection(id: string): Promise<void>
  mihomoCloseAllConnections(name?: string): Promise<void>
  mihomoRules(): Promise<ControllerRules>
  mihomoProxies(): Promise<ControllerProxies>
  mihomoGroups(): Promise<ControllerMixedGroup[]>
  mihomoProxyProviders(): Promise<ControllerProxyProviders>
  mihomoUpdateProxyProviders(name: string): Promise<void>
  mihomoRuleProviders(): Promise<ControllerRuleProviders>
  mihomoUpdateRuleProviders(name: string): Promise<void>
  mihomoChangeProxy(group: string, proxy: string): Promise<ControllerProxiesDetail>
  mihomoUnfixedProxy(group: string): Promise<ControllerProxiesDetail>
  mihomoUpgradeGeo(): Promise<void>
  mihomoUpgradeUI(): Promise<void>
  mihomoUpgrade(): Promise<void>
  mihomoProxyDelay(proxy: string, url?: string): Promise<ControllerProxiesDelay>
  mihomoGroupDelay(group: string, url?: string): Promise<ControllerGroupDelay>
  patchMihomoConfig(patch: Partial<MihomoConfig>): Promise<void>

  // Auto Run
  checkAutoRun(): Promise<boolean>
  enableAutoRun(): Promise<void>
  disableAutoRun(): Promise<void>

  // Config
  getAppConfig(force?: boolean): Promise<AppConfig>
  patchAppConfig(patch: Partial<AppConfig>): Promise<void>
  getControledMihomoConfig(force?: boolean): Promise<Partial<MihomoConfig>>
  patchControledMihomoConfig(patch: Partial<MihomoConfig>): Promise<void>
  getProfileConfig(force?: boolean): Promise<ProfileConfig>
  setProfileConfig(config: ProfileConfig): Promise<void>
  getCurrentProfileItem(): Promise<ProfileItem>
  getProfileItem(id: string | undefined): Promise<ProfileItem>
  changeCurrentProfile(id: string): Promise<void>
  addProfileItem(item: Partial<ProfileItem>): Promise<void>
  removeProfileItem(id: string): Promise<void>
  updateProfileItem(item: ProfileItem): Promise<void>
  getProfileStr(id: string): Promise<string>
  getFileStr(id: string): Promise<string>
  setFileStr(id: string, str: string): Promise<void>
  setProfileStr(id: string, str: string): Promise<void>
  getOverrideConfig(force?: boolean): Promise<OverrideConfig>
  setOverrideConfig(config: OverrideConfig): Promise<void>
  getOverrideItem(id: string): Promise<OverrideItem | undefined>
  addOverrideItem(item: Partial<OverrideItem>): Promise<void>
  removeOverrideItem(id: string): Promise<void>
  updateOverrideItem(item: OverrideItem): Promise<void>
  getOverride(id: string, ext: 'js' | 'yaml' | 'log'): Promise<string>
  setOverride(id: string, ext: 'js' | 'yaml', str: string): Promise<void>

  // Core Control
  restartCore(): Promise<void>
  restartMihomoConnections(): Promise<void>
  startMonitor(): Promise<void>

  // System Proxy
  triggerSysProxy(enable: boolean, onlyActiveDevice: boolean): Promise<void>
  manualGrantCorePermition(cores?: ('mihomo' | 'mihomo-alpha')[]): Promise<void>
  checkCorePermission(): Promise<{ mihomo: boolean; 'mihomo-alpha': boolean }>
  checkElevateTask(): Promise<boolean>
  deleteElevateTask(): Promise<void>
  revokeCorePermission(cores?: ('mihomo' | 'mihomo-alpha')[]): Promise<void>

  // Service
  serviceStatus(): Promise<'running' | 'stopped' | 'not-installed' | 'unknown'>
  testServiceConnection(): Promise<boolean>
  initService(): Promise<void>
  installService(): Promise<void>
  uninstallService(): Promise<void>
  startService(): Promise<void>
  restartService(): Promise<void>
  stopService(): Promise<void>

  // File Operations
  findSystemMihomo(): Promise<string[]>
  getFilePath(ext: string[]): Promise<string[] | undefined>
  readTextFile(filePath: string): Promise<string>
  getRuntimeConfigStr(): Promise<string>
  getRawProfileStr(): Promise<string>
  getCurrentProfileStr(): Promise<string>
  getOverrideProfileStr(): Promise<string>
  getRuntimeConfig(): Promise<MihomoConfig>

  // Update
  checkUpdate(): Promise<AppVersion | undefined>
  downloadAndInstallUpdate(version: string): Promise<void>
  cancelUpdate(): Promise<void>
  getVersion(): Promise<string>
  platform(): Promise<NodeJS.Platform>

  // System
  openUWPTool(): Promise<void>
  setupFirewall(): Promise<void>
  getInterfaces(): Promise<Record<string, NetworkInterfaceInfo[]>>

  // Backup
  webdavBackup(): Promise<boolean>
  webdavRestore(filename: string): Promise<void>
  listWebdavBackups(): Promise<string[]>
  webdavDelete(filename: string): Promise<void>

  // Window
  setTitleBarOverlay(overlay: TitleBarOverlayOptions): Promise<void>
  setAlwaysOnTop(alwaysOnTop: boolean): Promise<void>
  isAlwaysOnTop(): Promise<boolean>
  relaunchApp(): Promise<void>
  quitWithoutCore(): Promise<void>
  quitApp(): Promise<void>
  notDialogQuit(): Promise<void>
  setNativeTheme(theme: 'system' | 'light' | 'dark'): Promise<void>
  showTrayIcon(): Promise<void>
  closeTrayIcon(): Promise<void>
  setDockVisible(visible: boolean): Promise<void>
  showMainWindow(): Promise<void>
  closeMainWindow(): Promise<void>
  triggerMainWindow(): Promise<void>
  showFloatingWindow(): Promise<void>
  closeFloatingWindow(): Promise<void>
  showContextMenu(): Promise<void>
  openFile(type: 'profile' | 'override', id: string, ext?: 'yaml' | 'js'): Promise<void>
  openDevTools(): Promise<void>

  // Gist
  getGistUrl(): Promise<string>

  // SubStore
  startSubStoreFrontendServer(): Promise<void>
  stopSubStoreFrontendServer(): Promise<void>
  startSubStoreBackendServer(): Promise<void>
  stopSubStoreBackendServer(): Promise<void>
  downloadSubStore(): Promise<void>
  subStorePort(): Promise<number>
  subStoreFrontendPort(): Promise<number>
  subStoreSubs(): Promise<SubStoreSub[]>
  subStoreCollections(): Promise<SubStoreSub[]>

  // Misc
  resetAppConfig(): Promise<void>
  createHeapSnapshot(): Promise<void>
  getUserAgent(): Promise<string>
  getAppName(appPath: string): Promise<string>
  getImageDataURL(url: string): Promise<string>
  getIconDataURL(appPath: string): Promise<string>

  // Theme
  resolveThemes(): Promise<{ key: string; label: string; content: string }[]>
  fetchThemes(): Promise<void>
  importThemes(files: string[]): Promise<void>
  readTheme(theme: string): Promise<string>
  writeTheme(theme: string, css: string): Promise<void>
  applyTheme(theme: string): Promise<void>

  // Network
  startNetworkDetection(): Promise<void>
  stopNetworkDetection(): Promise<void>

  // Shortcut
  registerShortcut(oldShortcut: string, newShortcut: string, action: string): Promise<boolean>
  copyEnv(type: 'bash' | 'cmd' | 'powershell' | 'nushell'): Promise<void>

  // Alert
  alert(msg: string): Promise<void>
}

export const ipc = createIpcInvoker()

let applyThemeRunning = false
const waitList: string[] = []
export async function applyTheme(theme: string): Promise<void> {
  if (applyThemeRunning) {
    waitList.push(theme)
    return
  }
  applyThemeRunning = true
  try {
    return await ipc.applyTheme(theme)
  } finally {
    applyThemeRunning = false
    if (waitList.length > 0) {
      await applyTheme(waitList.shift() || '')
    }
  }
}

window.alert = async <T>(msg: T): Promise<void> => {
  const msgStr = typeof msg === 'string' ? msg : JSON.stringify(msg)
  return await ipc.alert(msgStr)
}
