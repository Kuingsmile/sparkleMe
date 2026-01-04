import { Button, Divider, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@heroui/react'
import { useAppConfig } from '@renderer/hooks/use-app-config'
import { ipc } from '@renderer/utils/ipc'
import React, { useEffect, useState } from 'react'

interface Props {
  id: string
  onClose: () => void
}

const ExecLogModal: React.FC<Props> = props => {
  const { id, onClose } = props
  const { appConfig: { disableAnimation = false } = {} } = useAppConfig()
  const [logs, setLogs] = useState<string[]>([])

  const getLog = async (): Promise<void> => {
    setLogs((await ipc.getOverride(id, 'log')).split('\n').filter(Boolean))
  }

  useEffect(() => {
    getLog()
  }, [])

  return (
    <Modal
      backdrop={disableAnimation ? 'transparent' : 'blur'}
      disableAnimation={disableAnimation}
      classNames={{ backdrop: 'top-[48px]' }}
      hideCloseButton
      isOpen={true}
      onOpenChange={onClose}
      scrollBehavior='inside'
    >
      <ModalContent>
        <ModalHeader className='flex app-drag'>执行日志</ModalHeader>
        <ModalBody>
          {logs.map(log => {
            return (
              <>
                <small className='break-all select-text'>{log}</small>
                <Divider />
              </>
            )
          })}
        </ModalBody>
        <ModalFooter>
          <Button size='sm' variant='light' onPress={onClose}>
            关闭
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default ExecLogModal
