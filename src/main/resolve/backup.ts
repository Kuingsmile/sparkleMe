import AdmZip from 'adm-zip'
import dayjs from 'dayjs'
import { createClient } from 'webdav'

import { getAppConfig } from '~/config'
import {
  appConfigPath,
  controledMihomoConfigPath,
  dataDir,
  overrideConfigPath,
  overrideDir,
  profileConfigPath,
  profilesDir,
  subStoreDir,
  themesDir,
} from '~/utils/dirs'

async function createWebdav() {
  const { webdavUrl = '', webdavUsername = '', webdavPassword = '', webdavDir = 'sparkleme' } = await getAppConfig()
  return {
    client: createClient(webdavUrl, {
      username: webdavUsername,
      password: webdavPassword,
    }),
    webdavDir,
  }
}

export async function webdavBackup(): Promise<boolean> {
  const { client, webdavDir } = await createWebdav()
  const zip = new AdmZip()
  const configFiles = [appConfigPath(), controledMihomoConfigPath(), profileConfigPath(), overrideConfigPath()]
  const configFolders = {
    themes: themesDir(),
    profiles: profilesDir(),
    override: overrideDir(),
    substore: subStoreDir(),
  }
  for (const filePath of configFiles) {
    zip.addLocalFile(filePath)
  }
  for (const [folderName, folderPath] of Object.entries(configFolders)) {
    zip.addLocalFolder(folderPath, folderName)
  }
  const date = new Date()
  const zipFileName = `${process.platform}_${dayjs(date).format('YYYY-MM-DD_HH-mm-ss')}.zip`

  try {
    await client.createDirectory(webdavDir)
  } catch {}

  return await client.putFileContents(`${webdavDir}/${zipFileName}`, zip.toBuffer())
}

export async function webdavRestore(filename: string): Promise<void> {
  const { client, webdavDir } = await createWebdav()
  const zipData = await client.getFileContents(`${webdavDir}/${filename}`)
  const zip = new AdmZip(zipData as Buffer)
  zip.extractAllTo(dataDir(), true)
}

export async function listWebdavBackups(): Promise<string[]> {
  const { client, webdavDir } = await createWebdav()
  const files = await client.getDirectoryContents(webdavDir, { glob: '*.zip' })
  return Array.isArray(files) ? files.map(file => file.basename) : files.data.map(file => file.basename)
}

export async function webdavDelete(filename: string): Promise<void> {
  const { client, webdavDir } = await createWebdav()
  await client.deleteFile(`${webdavDir}/${filename}`)
}
