# 🔐 Security Setup Guide

## Environment Variables Security

### Current Setup
Your API keys are now stored in `.env.local` which provides better security:

- ✅ **`.env.local`** - Contains actual API keys (never committed to Git)
- ✅ **`.env`** - Contains only template/placeholder values
- ✅ **`.env.example`** - Template for other developers

### File Hierarchy (Next.js loads in this order):
1. `.env.local` (highest priority - your actual keys)
2. `.env.production` / `.env.development`
3. `.env` (lowest priority - templates only)

### Security Features Implemented:

#### 1. **GitIgnore Protection**
```gitignore
.env*.local
.env
.env.production
```

#### 2. **Test vs Production Keys**
- **Test Keys** (current): `pk_test_*` and `sk_test_*`
  - Safe for development
  - Limited functionality
  - Can be shared in test environments

- **Production Keys**: `pk_live_*` and `sk_live_*`
  - ⚠️ **NEVER** commit these to Git
  - Only use in production environment
  - Store in platform-specific environment variables

#### 3. **Platform-Specific Deployment**
For production deployment:

**Vercel:**
```bash
vercel env add STRIPE_SECRET_KEY
vercel env add NEXT_PUBLIC_STRIPE_PUBLIC_KEY
```

**Netlify:**
- Add in Site Settings → Environment Variables

**Railway/Heroku:**
- Add via dashboard or CLI

### 🚨 Security Best Practices

1. **Never commit real API keys to Git**
2. **Use different keys for development/production**
3. **Rotate keys regularly**
4. **Monitor Stripe dashboard for unusual activity**
5. **Use environment-specific configurations**

### Current Status: ✅ SECURE
- Your keys are now in `.env.local` (gitignored)
- Template files are safe to commit
- Test keys are being used (low risk)

### Next Steps for Production:
1. Generate production Stripe keys
2. Add them to your deployment platform's environment variables
3. Never add production keys to local files
