export type RegisterMediaPayload = {
  name?: string
  url: string
  public_id?: string
  folder?: string
  alt_text?: string
  size?: number
  format?: string
  resource_type?: string
  mime_type?: string
}

export async function registerMedia(
  payload: RegisterMediaPayload,
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const res = await fetch("/api/admin/media", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    const data = await res.json().catch(() => null)

    if (!res.ok) {
      return { ok: false, error: data?.error || "Failed to register media" }
    }

    return { ok: true }
  } catch (e) {
    console.error(e)
    return { ok: false, error: "Failed to register media" }
  }
}
