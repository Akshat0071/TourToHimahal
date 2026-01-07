"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function CloudinaryDiagnostics() {
  const [envVars, setEnvVars] = useState<Record<string, string | undefined>>({})
  const [error, setError] = useState("")

  useEffect(() => {
    // Check environment variables
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
    const apiKey = process.env.CLOUDINARY_API_KEY

    setEnvVars({
      cloudName,
      uploadPreset,
      apiKey: apiKey ? `${apiKey.substring(0, 5)}...` : "NOT SET",
    })

    // Log to console
    console.log("=== CLOUDINARY DIAGNOSTICS ===")
    console.log("Cloud Name:", cloudName)
    console.log("Upload Preset:", uploadPreset)
    console.log("API Key present:", !!apiKey)
    console.log("===============================")

    if (!cloudName) setError("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not set")
    if (!uploadPreset) setError("NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET is not set")
  }, [])

  const testPreset = async () => {
    try {
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
      if (!cloudName) {
        alert("Missing NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME")
        return
      }

      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload/presets`)
      const data = await response.json()
      console.log("Available presets:", data)
      alert("Check console for available presets")
    } catch (err) {
      console.error("Error fetching presets:", err)
      alert("Error: Check console")
    }
  }

  return (
    <div className="container mx-auto max-w-2xl py-8">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>🔍 Cloudinary Diagnostics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Environment Variables */}
          <div className="space-y-2">
            <h3 className="font-semibold">Environment Variables</h3>
            <div className="space-y-2 rounded-lg bg-slate-100 p-4 font-mono text-sm dark:bg-slate-900">
              <div>
                <span className="text-green-600">CLOUD_NAME:</span>{" "}
                <span className={envVars.cloudName ? "text-green-600" : "text-red-600"}>
                  {envVars.cloudName || "❌ NOT SET"}
                </span>
              </div>
              <div>
                <span className="text-green-600">UPLOAD_PRESET:</span>{" "}
                <span className={envVars.uploadPreset ? "text-green-600" : "text-red-600"}>
                  {envVars.uploadPreset || "❌ NOT SET"}
                </span>
              </div>
              <div>
                <span className="text-green-600">API_KEY:</span>{" "}
                <span className={envVars.apiKey?.includes("...") ? "text-green-600" : "text-red-600"}>
                  {envVars.apiKey || "❌ NOT SET"}
                </span>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-lg bg-red-100 p-4 text-red-800 dark:bg-red-900 dark:text-red-100">
              <p className="font-semibold">⚠️ Error Detected:</p>
              <p>{error}</p>
            </div>
          )}

          {/* Instructions */}
          <div className="space-y-3">
            <h3 className="font-semibold">✅ Fix Steps</h3>
            <ol className="list-inside list-decimal space-y-2 text-sm">
              <li>
                Check <code className="rounded bg-slate-200 px-2 py-1">.env.local</code> file:
              </li>
              <li>
                Make sure{" "}
                <code className="rounded bg-slate-200 px-2 py-1">
                  NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=&lt;your_unsigned_preset&gt;
                </code>
              </li>
              <li>
                There should be ONLY ONE line with{" "}
                <code className="rounded bg-slate-200 px-2 py-1">NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET</code>
              </li>
              <li>Stop dev server: Press Ctrl+C</li>
              <li>Restart: Run `npm run dev`</li>
              <li>Hard refresh page: Press Ctrl+F5 (or Cmd+Shift+R)</li>
              <li>Check this page again - variables should show ✅</li>
            </ol>
          </div>

          {/* Cloudinary Links */}
          <div className="space-y-2">
            <h3 className="font-semibold">🔗 Check Cloudinary</h3>
            <div className="space-y-2">
              <p className="text-sm">
                1. Go to{" "}
                <a
                  href={
                    envVars.cloudName
                      ? `https://console.cloudinary.com/settings/c-${envVars.cloudName}/upload_presets`
                      : "https://console.cloudinary.com/settings"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  Upload Presets
                </a>
              </p>
              <p className="text-sm">
                2. Do you see your preset (e.g. <code className="rounded bg-slate-200 px-2 py-1">tourtohimachal_uploads</code>)?
              </p>
              <p className="text-sm">3. Is it set to "Unsigned"?</p>
              <p className="text-sm">4. If not, create it now!</p>
            </div>
          </div>

          {/* Debug Button */}
          <Button onClick={testPreset} variant="outline" className="w-full">
            🧪 Test Preset Fetch (Check Console)
          </Button>

          {/* Console Instructions */}
          <div className="rounded-lg bg-blue-100 p-4 text-sm text-blue-800 dark:bg-blue-900 dark:text-blue-100">
            <p className="font-semibold">💡 Open Browser Console (F12):</p>
            <p className="mt-1">You should see the diagnostics logged there</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
