import os from 'node:os'

export function getInterfaces(): NodeJS.Dict<NetworkInterfaceInfo[]> {
  return os.networkInterfaces()
}
