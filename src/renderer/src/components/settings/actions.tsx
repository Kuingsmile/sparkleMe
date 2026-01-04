import { Button, Tooltip } from '@heroui/react'
import { startTour } from '@renderer/utils/driver'
import { version } from '@renderer/utils/init'
import { ipc } from '@renderer/utils/ipc'
import { useEffect, useState } from 'react'
import { IoIosHelpCircle } from 'react-icons/io'
import { useNavigate } from 'react-router-dom'

import ConfirmModal from '../base/base-confirm'
import SettingCard from '../base/base-setting-card'
import SettingItem from '../base/base-setting-item'
import UpdaterModal from '../updater/updater-modal'

const Actions: React.FC = () => {
  const navigate = useNavigate()
  const [newVersion, setNewVersion] = useState('')
  const [changelog, setChangelog] = useState('')
  const [openUpdate, setOpenUpdate] = useState(false)
  const [checkingUpdate, setCheckingUpdate] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [updateStatus, setUpdateStatus] = useState<{
    downloading: boolean
    progress: number
    error?: string
  }>({
    downloading: false,
    progress: 0,
  })

  useEffect(() => {
    const handleUpdateStatus = (_: Electron.IpcRendererEvent, status: typeof updateStatus): void => {
      setUpdateStatus(status)
    }

    window.electron.ipcRenderer.on('update-status', handleUpdateStatus)

    return (): void => {
      window.electron.ipcRenderer.removeAllListeners('update-status')
    }
  }, [])

  const handleCancelUpdate = async (): Promise<void> => {
    try {
      await ipc.cancelUpdate()
      setUpdateStatus({ downloading: false, progress: 0 })
    } catch (_e) {
      // ignore
    }
  }

  return (
    <>
      {openUpdate && (
        <UpdaterModal
          onClose={() => setOpenUpdate(false)}
          version={newVersion}
          changelog={changelog}
          updateStatus={updateStatus}
          onCancel={handleCancelUpdate}
        />
      )}
      {confirmOpen && (
        <ConfirmModal
          onChange={setConfirmOpen}
          title='确认删除配置？'
          description={
            <>
              ⚠️ 删除配置，
              <span className='text-red-500'>操作不可撤销</span>
            </>
          }
          confirmText='确认删除'
          cancelText='取消'
          onConfirm={ipc.resetAppConfig}
        />
      )}
      <SettingCard>
        <SettingItem title='打开引导页面' divider>
          <Button size='sm' onPress={() => startTour(navigate)}>
            打开引导页面
          </Button>
        </SettingItem>
        <SettingItem title='检查更新' divider>
          <Button
            size='sm'
            isLoading={checkingUpdate}
            onPress={async () => {
              try {
                setCheckingUpdate(true)
                const version = await ipc.checkUpdate()
                if (version) {
                  setNewVersion(version.version)
                  setChangelog(version.changelog)
                  setOpenUpdate(true)
                } else {
                  new window.Notification('当前已是最新版本', { body: '无需更新' })
                }
              } catch (e) {
                alert(e)
              } finally {
                setCheckingUpdate(false)
              }
            }}
          >
            检查更新
          </Button>
        </SettingItem>
        <SettingItem
          title='重置软件'
          actions={
            <Tooltip content='删除所有配置，将软件恢复初始状态'>
              <Button isIconOnly size='sm' variant='light'>
                <IoIosHelpCircle className='text-lg' />
              </Button>
            </Tooltip>
          }
          divider
        >
          <Button size='sm' onPress={() => setConfirmOpen(true)}>
            重置软件
          </Button>
        </SettingItem>
        <SettingItem
          title='清除缓存'
          actions={
            <Tooltip content='清除软件渲染进程缓存'>
              <Button isIconOnly size='sm' variant='light'>
                <IoIosHelpCircle className='text-lg' />
              </Button>
            </Tooltip>
          }
          divider
        >
          <Button size='sm' onPress={() => localStorage.clear()}>
            清除缓存
          </Button>
        </SettingItem>
        <SettingItem
          title='创建堆快照'
          actions={
            <Tooltip content='创建主进程堆快照，用于排查内存问题'>
              <Button isIconOnly size='sm' variant='light'>
                <IoIosHelpCircle className='text-lg' />
              </Button>
            </Tooltip>
          }
          divider
        >
          <Button size='sm' onPress={ipc.createHeapSnapshot}>
            创建堆快照
          </Button>
        </SettingItem>
        <SettingItem
          title='保留内核退出'
          actions={
            <Tooltip content='完全退出软件，只保留内核进程'>
              <Button isIconOnly size='sm' variant='light'>
                <IoIosHelpCircle className='text-lg' />
              </Button>
            </Tooltip>
          }
          divider
        >
          <Button size='sm' onPress={ipc.quitWithoutCore}>
            退出
          </Button>
        </SettingItem>
        <SettingItem title='退出应用' divider>
          <Button size='sm' onPress={ipc.quitApp}>
            退出应用
          </Button>
        </SettingItem>
        <SettingItem title='应用版本'>
          <div>v{version}</div>
        </SettingItem>
      </SettingCard>
    </>
  )
}

export default Actions
