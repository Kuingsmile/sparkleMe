import { ChildProcess, spawn } from 'node:child_process'
import { existsSync } from 'node:fs'
import { readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'

import { getAppConfig } from '~/config'
import { dataDir, resourcesFilesDir } from '~/utils/dirs'

let child: ChildProcess

export async function startMonitor(detached = false): Promise<void> {
  if (process.platform !== 'win32') return
  if (existsSync(path.join(dataDir(), 'monitor.pid'))) {
    const pid = parseInt(await readFile(path.join(dataDir(), 'monitor.pid'), 'utf-8'))
    try {
      process.kill(pid, 'SIGINT')
    } catch {
      // ignore
    } finally {
      await rm(path.join(dataDir(), 'monitor.pid'))
    }
  }
  await stopMonitor()
  const { showTraffic = false } = await getAppConfig()
  if (!showTraffic) return
  child = spawn(path.join(resourcesFilesDir(), 'TrafficMonitor/TrafficMonitor.exe'), [], {
    cwd: path.join(resourcesFilesDir(), 'TrafficMonitor'),
    detached,
    stdio: detached ? 'ignore' : undefined,
  })
  if (detached) {
    if (child && child.pid) {
      await writeFile(path.join(dataDir(), 'monitor.pid'), child.pid.toString())
    }
    child.unref()
  }
}

async function stopMonitor(): Promise<void> {
  if (child) {
    child.kill('SIGINT')
  }
}
