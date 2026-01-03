export function calcTraffic(byte: number): string {
  if (byte < 1) return `0 B`

  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.min(Math.floor(Math.log(byte) / Math.log(1024)), units.length - 1)

  const val = byte / Math.pow(1024, i)
  return i === 0 ? `${val} B` : `${formatNumString(val)} ${units[i]}`
}

function formatNumString(num: number): string {
  let str = num.toFixed(2)
  if (str.length <= 5) return str
  if (str.length === 6) {
    str = num.toFixed(1)
    return str
  } else {
    str = Math.round(num).toString()
    return str
  }
}
