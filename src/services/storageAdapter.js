/**
 * Storage Adapter (Firebase Firestore & Cloudflare R2 Ready)
 *
 * Replace loadPhoneState / savePhoneState with Firestore onSnapshot / setDoc
 * and uploadToCloudflareR2 with a presigned PUT to your Cloudflare Worker + R2 bucket.
 */

const STORAGE_KEY = 'pov_smart_glasses_phone_state_v1'

export function loadPhoneState(fallbackState) {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return fallbackState
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object' || !parsed.notes) {
      return fallbackState
    }
    return {
      ...fallbackState,
      ...parsed,
    }
  } catch {
    return fallbackState
  }
}

export function savePhoneState(state) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Ignore quota errors (e.g., large data-URL uploads)
  }
}

export function clearPhoneState() {
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Ignore
  }
}

/**
 * Simulates a Cloudflare R2 presigned multipart upload with progress callbacks.
 * If a real File is provided, generates a local object URL so the asset renders immediately.
 */
export async function mockUploadToCloudflareR2({ file, bucket, prefix = 'uploads', onProgress }) {
  const safeName = (file?.name || `asset_${Date.now()}.bin`).replace(/\s+/g, '_')
  const r2Key = `${prefix}/${Date.now()}_${safeName}`

  for (let pct = 12; pct <= 100; pct += 22) {
    if (onProgress) onProgress(Math.min(pct, 100))
    // eslint-disable-next-line no-await-in-loop
    await new Promise((resolve) => setTimeout(resolve, 140))
  }
  if (onProgress) onProgress(100)

  const localObjectUrl = file instanceof File ? URL.createObjectURL(file) : null

  return {
    r2Bucket: bucket,
    r2Key,
    publicUrl: `https://cdn.pov-vault.r2.dev/${r2Key}`,
    r2Uri: `r2://${bucket}/${r2Key}`,
    localObjectUrl,
    filename: safeName,
    sizeBytes: file?.size || 184320,
    mimeType: file?.type || 'application/octet-stream',
  }
}
