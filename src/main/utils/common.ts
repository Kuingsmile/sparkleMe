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
