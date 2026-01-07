# Email Notifications Setup Guide

## Overview

Email notifications are now enabled for new lead submissions using Resend email service.

## Setup Steps

### 1. Create a Resend Account

1. Go to [resend.com](https://resend.com)
2. Sign up for a free account (100 emails/day free tier)
3. Verify your email address

### 2. Verify Your Domain (Important!)

**Option A: Use Your Own Domain (Recommended for Production)**

1. Go to Resend Dashboard → Domains → Add Domain
2. Enter your domain (e.g., `tourtohimachal.com`)
3. Add the DNS records provided by Resend to your domain registrar
4. Wait for verification (usually 5-30 minutes)
5. Update the `from` address in `lib/email.ts` to use your domain:
   ```typescript
   from: "TourToHimachal <noreply@tourtohimachal.com>"
   ```

**Option B: Use Resend's Onboarding Domain (For Testing Only)**

1. Resend provides `onboarding@resend.dev` for testing
2. Emails can only be sent to your verified email address
3. Update `lib/email.ts`:
   ```typescript
   from: "TourToHimachal <onboarding@resend.dev>"
   ```

### 3. Get Your API Key

1. Go to Resend Dashboard → API Keys
2. Click "Create API Key"
3. Name it (e.g., "TourToHimachal Production")
4. Copy the API key (starts with `re_`)

### 4. Configure Environment Variables

Add to your `.env.local` file:

```env
# Email Configuration (Resend)
RESEND_API_KEY=re_your_actual_api_key_here

# Admin email to receive notifications
ADMIN_NOTIFICATION_EMAIL=your-email@example.com

# Site URL (for email links)
NEXT_PUBLIC_SITE_URL=https://tourtohimachal.com
```

### 5. Restart Your Development Server

```bash
# Stop the current dev server (Ctrl+C)
pnpm dev
```

## Testing Email Notifications

### Test with Development Domain

1. Use `onboarding@resend.dev` as sender
2. Set `ADMIN_NOTIFICATION_EMAIL` to your verified email
3. Submit a test contact form on your website
4. Check your inbox (and spam folder)

### Test with Production Domain

1. Verify your domain in Resend first
2. Update sender email in `lib/email.ts`
3. Submit test forms
4. Emails will be delivered to `ADMIN_NOTIFICATION_EMAIL`

## Email Template Features

The notification email includes:

- **Professional design** with gradient header
- **Reference number** for tracking
- **Service type** badge (package/taxi/enquiry)
- **Customer details**: name, email, phone
- **Message content** with proper formatting
- **Quick action button** linking to admin panel
- **Mobile responsive** HTML

## Troubleshooting

### Issue: "Email service not configured"

**Solution**: Add `RESEND_API_KEY` to `.env.local` and restart server

### Issue: Emails not arriving

**Possible causes**:

1. Domain not verified in Resend
2. Wrong `ADMIN_NOTIFICATION_EMAIL`
3. Emails in spam folder
4. Using free tier without verified domain (only sends to your Resend account email)

**Check**:

- Resend Dashboard → Logs → Check for failed sends
- Server console for error messages
- Verify domain DNS records are correct

### Issue: "Error: Invalid API key"

**Solution**:

1. Double-check your API key in Resend dashboard
2. Ensure no extra spaces in `.env.local`
3. Restart development server after changing env vars

## Production Deployment

### Vercel/Netlify

1. Add environment variables in project settings:
   - `RESEND_API_KEY`
   - `ADMIN_NOTIFICATION_EMAIL`
   - `NEXT_PUBLIC_SITE_URL`
2. Redeploy your site

### Important Notes

- Free tier: 100 emails/day, 3,000/month
- Production tier: $20/month for 50,000 emails
- Email delivery is async - submissions succeed even if email fails
- All emails are logged in Resend dashboard for debugging

## Customization

### Change Email Template

Edit `lib/email.ts` → `sendLeadNotification()` function

### Add More Recipients

Update the API route to send to multiple emails:

```typescript
await sendLeadNotification({
  to: ["admin1@example.com", "admin2@example.com"],
  leadData: { ... }
})
```

### Custom Email Per Service Type

Modify `app/api/contact/route.ts`:

```typescript
const emailMap = {
  package: "packages@tourtohimachal.com",
  taxi: "taxi@tourtohimachal.com",
  enquiry: "info@tourtohimachal.com",
}
const adminEmail = emailMap[serviceType] || process.env.ADMIN_NOTIFICATION_EMAIL
```

## Security Best Practices

1. **Never commit** `.env.local` to Git
2. **Use different API keys** for dev and production
3. **Rotate API keys** regularly (every 3-6 months)
4. **Monitor usage** in Resend dashboard to detect abuse
5. **Implement rate limiting** if needed (Resend has built-in limits)

## Support Resources

- Resend Documentation: https://resend.com/docs
- Resend Status Page: https://status.resend.com
- Email Template Testing: Use Resend's test mode
- Technical Support: support@resend.com

---

**Quick Start Command:**

```bash
# 1. Install package (already done)
pnpm add resend

# 2. Add env vars to .env.local
# 3. Restart dev server
pnpm dev

# 4. Test by submitting a contact form
```
