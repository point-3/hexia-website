type CmsAsset =
  | string
  | {
      id?: string | null
      modified_on?: string | null
      uploaded_on?: string | null
      filesize?: number | string | null
      filename_download?: string | null
    }
  | null
  | undefined

function assetVersionToken(image: Exclude<CmsAsset, string | null | undefined>): string | null {
  const parts = [image.modified_on, image.uploaded_on, image.filesize, image.filename_download]
  const token = parts
    .filter((part) => part !== undefined && part !== null && String(part).trim() !== "")
    .join("-")
  return token || null
}

export function getRawCmsAssetUrl(image: CmsAsset): string {
  if (!image) return ""
  const id = typeof image === "object" ? image.id : image
  if (!id) return ""

  const params = new URLSearchParams()
  const version = typeof image === "object" ? assetVersionToken(image) : null
  if (version) {
    params.set("v", version)
  }

  const query = params.toString()
  const path = `/api/cms-assets/${id}`
  return query ? `${path}?${query}` : path
}
