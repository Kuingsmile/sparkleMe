import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Snippet } from '@heroui/react'
import { useAppConfig } from '@renderer/hooks/use-app-config'
import { getInterfaces } from '@renderer/utils/ipc'
import React, { useEffect, useState } from 'react'

interface Props {
  onClose: () => void
}

const InterfaceModal: React.FC<Props> = props => {
  const { onClose } = props
  const { appConfig: { disableAnimation = false } = {} } = useAppConfig()
  const [info, setInfo] = useState<Record<string, NetworkInterfaceInfo[]>>({})
  const getInfo = async (): Promise<void> => {
    setInfo(await getInterfaces())
  }

  useEffect(() => {
    getInfo()
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
        <ModalHeader className='flex app-drag'>网络信息</ModalHeader>
        <ModalBody>
          {Object.entries(info).map(([key, value]) => {
            return (
              <div key={key}>
                <h4 className='font-bold'>{key}</h4>
                {value.map(v => {
                  return (
                    <div key={v.address}>
                      <div className='mt-2 flex justify-between'>
                        {v.family}
                        <Snippet symbol='' size='sm'>
                          {v.address}
                        </Snippet>
                      </div>
                    </div>
                  )
                })}
              </div>
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

export default InterfaceModal
