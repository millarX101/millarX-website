# millarX Website DNS Switching Guide

**Prepared for:** Ben Millar
**Date:** December 2025
**Current Status:** Staging on Netlify, Production on Wix

---

## Current Configuration

| Item | Value |
|------|-------|
| Domain Registrar | Crazy Domains |
| Current DNS Provider | Wix (`ns0.wixdns.net`, `ns1.wixdns.net`) |
| Email Provider | Google Workspace |
| New Hosting | Netlify |

---

## Pre-Switch Checklist

- [ ] Netlify staging site tested and working
- [ ] Environment variables set in Netlify
- [ ] Supabase webhooks configured (for email notifications)
- [ ] All forms tested and submitting correctly
- [ ] Logo/images loading from Supabase Storage

---

## OPTION A: Update DNS in Wix (Recommended)

*Keep nameservers at Wix, just update the website records*

### Step 1: Log into Wix

1. Go to [wix.com](https://wix.com) and log in
2. Navigate to: **Domains** → **millarx.com.au** → **Manage DNS**

### Step 2: Disconnect Existing Wix Site (if connected)

1. In Wix Dashboard, go to **Domains**
2. Click on `millarx.com.au`
3. If connected to a Wix site, click **Disconnect Domain**
4. Confirm disconnection

### Step 3: Update DNS Records

**Delete or update these records:**

| Type | Name | Old Value | New Value |
|------|------|-----------|-----------|
| A | @ | (Wix IP) | `75.2.60.5` |
| CNAME | www | (Wix) | `[your-site].netlify.app` |

**DO NOT TOUCH these records (email):**

| Type | Name | Value | Priority |
|------|------|-------|----------|
| MX | @ | aspmx.l.google.com | 10 |
| MX | @ | alt1.aspmx.l.google.com | 20 |
| MX | @ | alt2.aspmx.l.google.com | 30 |
| MX | @ | alt3.aspmx.l.google.com | 40 |
| MX | @ | alt4.aspmx.l.google.com | 50 |

### Step 4: Configure Domain in Netlify

1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Select your site
3. Go to **Site settings** → **Domain management**
4. Click **Add custom domain**
5. Enter: `millarx.com.au`
6. Also add: `www.millarx.com.au`
7. Netlify will verify DNS and provision SSL automatically

### Step 5: Wait for Propagation

- DNS changes typically take **5-60 minutes**
- SSL certificate provisioning takes **~15 minutes** after DNS propagates
- Test by visiting `https://millarx.com.au`

---

## OPTION B: Move DNS to Netlify (Alternative)

*Transfer DNS control to Netlify completely*

### Step 1: Get Netlify Nameservers

1. In Netlify, add `millarx.com.au` as custom domain
2. Choose **Netlify DNS**
3. Note the nameservers (typically):
   ```
   dns1.p01.nsone.net
   dns2.p01.nsone.net
   dns3.p01.nsone.net
   dns4.p01.nsone.net
   ```

### Step 2: Update Nameservers at Crazy Domains

1. Log into [Crazy Domains](https://www.crazydomains.com.au)
2. Go to **My Domains** → `millarx.com.au`
3. Find **Nameservers** or **DNS Settings**
4. Change from Wix nameservers to Netlify:

   | Current | New |
   |---------|-----|
   | ns0.wixdns.net | dns1.p01.nsone.net |
   | ns1.wixdns.net | dns2.p01.nsone.net |
   | | dns3.p01.nsone.net |
   | | dns4.p01.nsone.net |

5. Save changes

### Step 3: Add Email Records in Netlify DNS

**IMPORTANT: Do this immediately after nameserver change**

1. In Netlify Dashboard → **Domains** → `millarx.com.au` → **DNS settings**
2. Add these MX records:

   | Type | Name | Value | Priority |
   |------|------|-------|----------|
   | MX | @ | aspmx.l.google.com | 10 |
   | MX | @ | alt1.aspmx.l.google.com | 20 |
   | MX | @ | alt2.aspmx.l.google.com | 30 |
   | MX | @ | alt3.aspmx.l.google.com | 40 |
   | MX | @ | alt4.aspmx.l.google.com | 50 |

### Step 4: Wait for Propagation

- Nameserver changes take **24-48 hours** to fully propagate
- Email may be delayed during this period
- SSL will auto-provision once DNS propagates

---

## Post-Switch Verification

### Immediately After:

- [ ] Visit `https://millarx.com.au` - new site loads
- [ ] Visit `https://www.millarx.com.au` - redirects correctly
- [ ] SSL padlock shows in browser
- [ ] Send test email to `ben@millarx.com.au` - arrives correctly

### Within 24 Hours:

- [ ] Submit test contact form
- [ ] Check Supabase for form submission
- [ ] Verify email notification received
- [ ] Test on mobile device
- [ ] Check all pages load correctly

---

## Rollback Plan

If something goes wrong:

### If using Option A (Wix DNS):
1. Log back into Wix DNS
2. Change A record back to Wix IP
3. Reconnect Wix site

### If using Option B (Netlify DNS):
1. Log into Crazy Domains
2. Change nameservers back to:
   - `ns0.wixdns.net`
   - `ns1.wixdns.net`
3. Wait for propagation (24-48 hours)

---

## Important Contacts

| Service | Support |
|---------|---------|
| Crazy Domains | 1300 121 123 |
| Netlify | support.netlify.com |
| Wix | support.wix.com |
| Google Workspace | admin.google.com |

---

## Summary: Recommended Steps

1. **Test staging site thoroughly** (`[your-site].netlify.app`)
2. **Choose Option A** (simpler, faster, less risk)
3. **Do it during low-traffic time** (early morning or weekend)
4. **Keep Wix accessible** for 48 hours in case of rollback
5. **Monitor email** to ensure Google Workspace still works

---

*Document generated for millarX website migration*
