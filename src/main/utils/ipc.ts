import path from 'node:path'
import v8 from 'node:v8'

import { app, dialog, ipcMain } from 'electron'

import {
  addOverrideItem,
  addProfileItem,
  changeCurrentProfile,
  getAppConfig,
  getControledMihomoConfig,
  getCurrentProfileItem,
  getFileStr,
  getOverride,
  getOverrideConfig,
  getOverrideItem,
  getProfileConfig,
  getProfileItem,
  getProfileStr,
  patchAppConfig,
  patchControledMihomoConfig,
  removeOverrideItem,
  removeProfileItem,
  setFileStr,
  setOverride,
  setOverrideConfig,
  setProfileConfig,
  setProfileStr,
  updateOverrideItem,
  updateProfileItem,
} from '~/config'
import {
  getCurrentProfileStr,
  getOverrideProfileStr,
  getRawProfileStr,
  getRuntimeConfig,
  getRuntimeConfigStr,
} from '~/core/factory'
import {
  checkCorePermission,
  manualGrantCorePermition,
  quitWithoutCore,
  restartCore,
  revokeCorePermission,
  startNetworkDetection,
  stopNetworkDetection,
} from '~/core/manager'
import {
  mihomoChangeProxy,
  mihomoCloseAllConnections,
  mihomoCloseConnection,
  mihomoConfig,
  mihomoGroupDelay,
  mihomoGroups,
  mihomoProxies,
  mihomoProxyDelay,
  mihomoProxyProviders,
  mihomoRuleProviders,
  mihomoRules,
  mihomoUnfixedProxy,
  mihomoUpdateProxyProviders,
  mihomoUpdateRuleProviders,
  mihomoUpgrade,
  mihomoUpgradeGeo,
  mihomoUpgradeUI,
  mihomoVersion,
  patchMihomoConfig,
  restartMihomoConnections,
} from '~/core/mihomoApi'
import { subStoreCollections, subStoreSubs } from '~/core/subStoreApi'
import { closeMainWindow, mainWindow, setNotQuitDialog, showMainWindow, triggerMainWindow } from '~/index'
import { cancelUpdate, checkUpdate, downloadAndInstallUpdate } from '~/resolve/autoUpdater'
import { listWebdavBackups, webdavBackup, webdavDelete, webdavRestore } from '~/resolve/backup'
import { closeFloatingWindow, showContextMenu, showFloatingWindow } from '~/resolve/floatingWindow'
import { getGistUrl } from '~/resolve/gistApi'
import {
  downloadSubStore,
  startSubStoreBackendServer,
  startSubStoreFrontendServer,
  stopSubStoreBackendServer,
  stopSubStoreFrontendServer,
  subStoreFrontendPort,
  subStorePort,
} from '~/resolve/server'
import { registerShortcut } from '~/resolve/shortcut'
import { applyTheme, fetchThemes, importThemes, readTheme, resolveThemes, writeTheme } from '~/resolve/theme'
import { startMonitor } from '~/resolve/trafficMonitor'
import { closeTrayIcon, copyEnv, setDockVisible, showTrayIcon } from '~/resolve/tray'
import {
  initService,
  installService,
  restartService,
  serviceStatus,
  startService,
  stopService,
  testServiceConnection,
  uninstallService,
} from '~/service/manager'
import { checkAutoRun, disableAutoRun, enableAutoRun } from '~/sys/autoRun'
import { getInterfaces } from '~/sys/interface'
import {
  checkElevateTask,
  deleteElevateTask,
  getFilePath,
  openFile,
  openUWPTool,
  readTextFile,
  resetAppConfig,
  setNativeTheme,
  setupFirewall,
} from '~/sys/misc'
import { triggerSysProxy } from '~/sys/sysproxy'
import { getAppName } from '~/utils/appName'
import { findSystemMihomo } from '~/utils/dirs'
import { logDir } from '~/utils/dirs'
import { getIconDataURL, getImageDataURL } from '~/utils/icon'
import { getUserAgent } from '~/utils/userAgent'

function ipcErrorWrapper<T>(
  fn: (...args: any[]) => Promise<T>,
): (...args: any[]) => Promise<T | { invokeError: unknown }> {
  return async (...args: any[]) => {
    try {
      return await fn(...args)
    } catch (e) {
      if (e && typeof e === 'object') {
        if ('message' in e) {
          return { invokeError: e.message }
        } else {
          return { invokeError: JSON.stringify(e) }
        }
      }
      if (e instanceof Error || typeof e === 'string') {
        return { invokeError: e }
      }
      return { invokeError: 'Unknown Error' }
    }
  }
}

type HandlerFn = (...args: any[]) => any

interface HandlerConfig {
  handler: HandlerFn
  extractArgs?: (event: Electron.IpcMainInvokeEvent, ...args: any[]) => any[]
  wrap?: boolean
}

function registerHandler(channel: string, config: HandlerConfig | HandlerFn): void {
  const handlerConfig = typeof config === 'function' ? { handler: config, wrap: true } : config
  const { handler, extractArgs, wrap = true } = handlerConfig

  const wrappedHandler = wrap ? ipcErrorWrapper(handler) : handler

  if (extractArgs) {
    ipcMain.handle(channel, (event, ...args) => wrappedHandler(...extractArgs(event, ...args)))
  } else {
    ipcMain.handle(channel, (_e, ...args) => wrappedHandler(...args))
  }
}

function registerHandlers(handlers: Record<string, HandlerConfig | HandlerFn>): void {
  Object.entries(handlers).forEach(([channel, config]) => registerHandler(channel, config))
}

export function registerIpcMainHandlers(): void {
  // Mihomo API handlers
  registerHandlers({
    mihomoVersion,
    mihomoConfig,
    mihomoCloseConnection,
    mihomoCloseAllConnections,
    mihomoRules,
    mihomoProxies,
    mihomoGroups,
    mihomoProxyProviders,
    mihomoUpdateProxyProviders,
    mihomoRuleProviders,
    mihomoUpdateRuleProviders,
    mihomoChangeProxy,
    mihomoUnfixedProxy,
    mihomoUpgradeGeo,
    mihomoUpgradeUI,
    mihomoUpgrade,
    mihomoProxyDelay,
    mihomoGroupDelay,
    patchMihomoConfig,
  })

  // Auto run handlers
  registerHandlers({ checkAutoRun, enableAutoRun, disableAutoRun })

  // Config handlers
  registerHandlers({
    getAppConfig,
    patchAppConfig,
    getControledMihomoConfig,
    patchControledMihomoConfig,
    getProfileConfig,
    setProfileConfig,
    getCurrentProfileItem,
    getProfileItem,
    getProfileStr,
    getFileStr,
    setFileStr,
    setProfileStr,
    updateProfileItem,
    changeCurrentProfile,
    addProfileItem,
    removeProfileItem,
    getOverrideConfig,
    setOverrideConfig,
    getOverrideItem,
    addOverrideItem,
    removeOverrideItem,
    updateOverrideItem,
    getOverride,
    setOverride,
  })

  // Core management handlers
  registerHandlers({
    restartCore,
    restartMihomoConnections,
    startMonitor,
    triggerSysProxy,
    manualGrantCorePermition,
    checkCorePermission,
    revokeCorePermission,
    startNetworkDetection,
    stopNetworkDetection,
    quitWithoutCore,
  })

  // Service handlers
  registerHandlers({
    checkElevateTask,
    deleteElevateTask,
    serviceStatus,
    testServiceConnection,
    initService,
    installService,
    uninstallService,
    startService,
    restartService,
    stopService,
  })

  // File system handlers
  registerHandlers({
    findSystemMihomo: { handler: findSystemMihomo, wrap: false },
    getFilePath: { handler: getFilePath, wrap: false },
    readTextFile,
    getRuntimeConfigStr,
    getRawProfileStr,
    getCurrentProfileStr,
    getOverrideProfileStr,
    getRuntimeConfig,
  })

  // Update handlers
  registerHandlers({ downloadAndInstallUpdate, checkUpdate, cancelUpdate })

  // System info handlers
  registerHandlers({
    getVersion: { handler: () => app.getVersion(), wrap: false },
    platform: { handler: () => process.platform, wrap: false },
    openUWPTool,
    setupFirewall,
    getInterfaces: { handler: getInterfaces, wrap: false },
  })

  // Backup handlers
  registerHandlers({ webdavBackup, webdavRestore, listWebdavBackups, webdavDelete })

  // Shortcut handlers
  registerHandlers({ registerShortcut })

  // SubStore handlers
  registerHandlers({
    startSubStoreFrontendServer,
    stopSubStoreFrontendServer,
    startSubStoreBackendServer,
    stopSubStoreBackendServer,
    downloadSubStore,
    subStorePort: { handler: () => subStorePort, wrap: false },
    subStoreFrontendPort: { handler: () => subStoreFrontendPort, wrap: false },
    subStoreSubs,
    subStoreCollections,
  })

  // Gist handlers
  registerHandlers({ getGistUrl })

  // Theme handlers
  registerHandlers({
    setNativeTheme: { handler: setNativeTheme, wrap: false },
    resolveThemes,
    fetchThemes,
    importThemes,
    readTheme,
    writeTheme,
    applyTheme,
  })

  // Window handlers
  registerHandlers({
    setTitleBarOverlay: {
      handler: async (overlay): Promise<void> => {
        if (typeof mainWindow?.setTitleBarOverlay === 'function') {
          mainWindow.setTitleBarOverlay(overlay)
        }
      },
    },
    setAlwaysOnTop: { handler: alwaysOnTop => mainWindow?.setAlwaysOnTop(alwaysOnTop), wrap: false },
    isAlwaysOnTop: { handler: () => mainWindow?.isAlwaysOnTop(), wrap: false },
    showTrayIcon,
    closeTrayIcon,
    setDockVisible: { handler: setDockVisible, wrap: false },
    showMainWindow: { handler: showMainWindow, wrap: false },
    closeMainWindow: { handler: closeMainWindow, wrap: false },
    triggerMainWindow: { handler: triggerMainWindow, wrap: false },
    showFloatingWindow,
    closeFloatingWindow,
    showContextMenu,
  })

  // Utility handlers
  registerHandlers({
    openFile: { handler: openFile, wrap: false },
    openDevTools: { handler: () => mainWindow?.webContents.openDevTools(), wrap: false },
    createHeapSnapshot: {
      handler: () => v8.writeHeapSnapshot(path.join(logDir(), `${Date.now()}.heapsnapshot`)),
      wrap: false,
    },
    getUserAgent,
    getAppName,
    getImageDataURL,
    getIconDataURL,
    copyEnv,
  })

  // App lifecycle handlers
  registerHandlers({
    alert: { handler: msg => dialog.showErrorBox('SparkleMe', msg), wrap: false },
    resetAppConfig: { handler: resetAppConfig, wrap: false },
    relaunchApp: {
      handler: () => {
        setNotQuitDialog()
        app.relaunch()
        app.quit()
      },
      wrap: false,
    },
    quitApp: { handler: () => app.quit(), wrap: false },
    notDialogQuit: {
      handler: () => {
        setNotQuitDialog()
        app.quit()
      },
      wrap: false,
    },
  })
}
