export async function simpleTry<T, K = undefined>(
  fn: () => Promise<T> | T,
  callback?: () => Promise<K> | K,
): Promise<T | K> {
  try {
    return await fn()
  } catch (_e) {
    return callback ? await callback() : (undefined as unknown as K)
  }
}

export function simpleTrySync<T, K = undefined>(fn: () => T, callback?: () => K): T | K {
  try {
    return fn()
  } catch (_e) {
    return callback ? callback() : (undefined as unknown as K)
  }
}
