import { optimizeCloudinaryDeliveryUrl } from "@/lib/cloudinary"

export default function Head() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseOrigin = supabaseUrl ? new URL(supabaseUrl).origin : null

  // Likely homepage LCP image (used in the home Hero background)
  const lcpHeroImage = optimizeCloudinaryDeliveryUrl(
    "https://res.cloudinary.com/daqp8c5fa/image/upload/v1767795277/v7svtjhbjhj6cyadgfhz.webp",
    { width: 800, quality: "auto", format: "auto", crop: "limit" },
  )

  return (
    <>
      {/* DNS / Connection hints */}
      <link rel="dns-prefetch" href="//res.cloudinary.com" />
      <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />

      {supabaseOrigin && (
        <>
          <link rel="dns-prefetch" href={supabaseOrigin.replace(/^https?:/, "")} />
          <link rel="preconnect" href={supabaseOrigin} crossOrigin="anonymous" />
        </>
      )}

      {/* LCP hint */}
      <link rel="preload" as="image" href={lcpHeroImage} fetchPriority="high" />

      {/* Microsoft Clarity Analytics */}
      <script
        type="text/javascript"
        dangerouslySetInnerHTML={{
          __html: `(function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "v3ikvkpm3x");`,
        }}
      />
    </>
  )
}
