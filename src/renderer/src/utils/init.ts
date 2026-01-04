import { ipc } from '@renderer/utils/ipc'

export const platform: NodeJS.Platform = window.api.platform
export let version: string = ''

export async function init(): Promise<void> {
  version = await ipc.getVersion()
}
