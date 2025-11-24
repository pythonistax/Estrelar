# IP-Based Currency Detection Implementation Guide

## Current Status
❌ **NOT INTEGRATED** - The current setup does NOT consider IP address to show the correct user currency. All prices are hardcoded to Euro (€).

## Requirements
- If IP is from **US** → Show **$ (USD)**
- If IP is from **EU** → Show **€ (EUR)**
- Default to EUR if detection fails

---

## Implementation Steps

### Step 1: Create API Endpoint for IP Detection

Create a new API route: `app/api/detect-currency/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'

// List of EU country codes
const EU_COUNTRIES = [
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR',
  'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL',
  'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE'
]

// Free IP geolocation service (you can also use paid services like MaxMind, ipapi.co, etc.)
async function getCountryFromIP(ip: string): Promise<string | null> {
  try {
    // Option 1: Using ipapi.co (free tier: 1000 requests/day)
    const response = await fetch(`https://ipapi.co/${ip}/country_code/`, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    })
    
    if (response.ok) {
      const countryCode = await response.text()
      return countryCode.trim().toUpperCase()
    }
    
    // Option 2: Fallback to ip-api.com (free tier: 45 requests/minute)
    const fallbackResponse = await fetch(`http://ip-api.com/json/${ip}?fields=countryCode`)
    if (fallbackResponse.ok) {
      const data = await fallbackResponse.json()
      return data.countryCode?.toUpperCase() || null
    }
    
    return null
  } catch (error) {
    console.error('Error detecting country:', error)
    return null
  }
}

function getCurrencyFromCountry(countryCode: string | null): 'USD' | 'EUR' {
  if (!countryCode) return 'EUR' // Default to EUR
  
  // US territories
  if (countryCode === 'US') return 'USD'
  
  // EU countries
  if (EU_COUNTRIES.includes(countryCode)) return 'EUR'
  
  // Default to EUR for all other countries
  return 'EUR'
}

export async function GET(request: NextRequest) {
  try {
    // Get IP address from request
    // In production, you might need to check X-Forwarded-For header for proxies
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0].trim() : 
               request.headers.get('x-real-ip') || 
               request.ip || 
               'unknown'
    
    // Skip localhost/development IPs
    if (ip === 'unknown' || ip === '::1' || ip.startsWith('127.') || ip.startsWith('192.168.')) {
      // For development, you can return a default or test value
      return NextResponse.json({
        currency: 'EUR',
        country: 'DE',
        ip: ip,
        detected: false
      })
    }
    
    const countryCode = await getCountryFromIP(ip)
    const currency = getCurrencyFromCountry(countryCode)
    
    return NextResponse.json({
      currency,
      country: countryCode || 'UNKNOWN',
      ip: ip,
      detected: true
    })
  } catch (error) {
    console.error('Error in currency detection:', error)
    return NextResponse.json({
      currency: 'EUR',
      country: 'UNKNOWN',
      ip: 'unknown',
      detected: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
```

---

### Step 2: Create Currency Context/Hook

Create `lib/currency.ts`:

```typescript
'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

type Currency = 'USD' | 'EUR'

interface CurrencyContextType {
  currency: Currency
  symbol: string
  isLoading: boolean
  refreshCurrency: () => Promise<void>
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

// Currency conversion rates (update these periodically or fetch from an API)
const CONVERSION_RATES = {
  EUR_TO_USD: 1.10, // Example: 1 EUR = 1.10 USD (update with real rates)
  USD_TO_EUR: 0.91  // Example: 1 USD = 0.91 EUR
}

// Pricing in EUR (base currency)
const PRICING_EUR = {
  '1week': { original: 13.86, discounted: 6.93 },
  '4week': { original: 39.99, discounted: 19.99 },
  '12week': { original: 79.99, discounted: 39.99 }
}

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>('EUR')
  const [isLoading, setIsLoading] = useState(true)

  const detectCurrency = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/detect-currency')
      const data = await response.json()
      
      if (data.currency) {
        setCurrency(data.currency)
        // Store in sessionStorage for persistence
        sessionStorage.setItem('userCurrency', data.currency)
        sessionStorage.setItem('userCountry', data.country)
      }
    } catch (error) {
      console.error('Failed to detect currency:', error)
      // Fallback to stored currency or default
      const stored = sessionStorage.getItem('userCurrency') as Currency | null
      setCurrency(stored || 'EUR')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Check if currency is already stored
    const storedCurrency = sessionStorage.getItem('userCurrency') as Currency | null
    if (storedCurrency) {
      setCurrency(storedCurrency)
      setIsLoading(false)
    } else {
      detectCurrency()
    }
  }, [])

  return (
    <CurrencyContext.Provider value={{
      currency,
      symbol: currency === 'USD' ? '$' : '€',
      isLoading,
      refreshCurrency: detectCurrency
    }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (!context) {
    throw new Error('useCurrency must be used within CurrencyProvider')
  }
  return context
}

// Helper function to convert prices
export function convertPrice(priceEUR: number, targetCurrency: Currency): number {
  if (targetCurrency === 'EUR') return priceEUR
  return priceEUR * CONVERSION_RATES.EUR_TO_USD
}

// Helper function to format price with currency symbol
export function formatPrice(priceEUR: number, currency: Currency, symbol: string): string {
  const convertedPrice = convertPrice(priceEUR, currency)
  return `${symbol}${convertedPrice.toFixed(2)}`
}

// Get pricing for a plan
export function getPlanPricing(plan: '1week' | '4week' | '12week', currency: Currency) {
  const basePricing = PRICING_EUR[plan]
  return {
    original: convertPrice(basePricing.original, currency),
    discounted: convertPrice(basePricing.discounted, currency)
  }
}
```

---

### Step 3: Update App Layout to Include Currency Provider

Update `app/layout.tsx`:

```typescript
import { CurrencyProvider } from '@/lib/currency'
// ... other imports

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <CurrencyProvider>
          {children}
        </CurrencyProvider>
      </body>
    </html>
  )
}
```

---

### Step 4: Update SellingPage.tsx

Replace all hardcoded € prices with dynamic currency:

```typescript
'use client'

import { useCurrency, getPlanPricing, formatPrice } from '@/lib/currency'
// ... other imports

export default function SellingPage({ onContinue, onBack }: SellingPageProps) {
  const { currency, symbol, isLoading } = useCurrency()
  // ... existing state

  // Get subscription text based on selected plan
  const getSubscriptionText = () => {
    const pricing = getPlanPricing(selectedPlan, currency)
    const baseText = {
      '1week': `By clicking "Get My Plan", you agree to automatic subscription renewal to Coursiv: first 1 week at ${symbol}${pricing.discounted.toFixed(2)}, then ${symbol}${pricing.discounted.toFixed(2)} every week (both excluding taxes) until you cancel. You can cancel anytime via support or account settings. See `,
      '4week': `By clicking "Get My Plan", you agree to automatic subscription renewal to Coursiv: first 4 weeks at ${symbol}${pricing.discounted.toFixed(2)}, then ${symbol}${pricing.discounted.toFixed(2)} every 4 weeks (both excluding taxes) until you cancel. You can cancel anytime via support or account settings. See `,
      '12week': `By clicking "Get My Plan", you agree to automatic subscription renewal to Coursiv: first 12 weeks at ${symbol}${pricing.discounted.toFixed(2)}, then ${symbol}${pricing.discounted.toFixed(2)} every 12 weeks (both excluding taxes) until you cancel. You can cancel anytime via support or account settings. See `,
    }
    return (
      <>
        {baseText[selectedPlan]}
        <span className="underline">Subscription Terms</span> for details.
      </>
    )
  }

  // Helper to render price
  const renderPrice = (plan: '1week' | '4week' | '12week') => {
    const pricing = getPlanPricing(plan, currency)
    return (
      <>
        <span className="text-sm font-medium text-secondary line-through">
          {formatPrice(PRICING_EUR[plan].original, currency, symbol)}
        </span>
        <span className="text-lg font-bold text-[#4F981D]">
          {formatPrice(pricing.discounted, currency, symbol)}
        </span>
      </>
    )
  }

  // Helper to calculate price per day
  const getPricePerDay = (plan: '1week' | '4week' | '12week') => {
    const pricing = getPlanPricing(plan, currency)
    const days = plan === '1week' ? 7 : plan === '4week' ? 28 : 84
    return (pricing.discounted / days).toFixed(2)
  }

  // ... rest of component, replace all hardcoded € prices with:
  // - renderPrice('1week'), renderPrice('4week'), renderPrice('12week')
  // - getPricePerDay('1week'), etc.
  // - Use {symbol} instead of '€'
}
```

**Key changes in SellingPage.tsx:**
1. Import `useCurrency`, `getPlanPricing`, `formatPrice`
2. Replace all `€6.93`, `€19.99`, `€39.99` with dynamic prices
3. Replace all `€` symbols with `{symbol}`
4. Update `getSubscriptionText()` to use dynamic currency
5. Update price per day calculations

---

### Step 5: Update PaymentSection.tsx

```typescript
'use client'

import { useCurrency, getPlanPricing } from '@/lib/currency'

export default function PaymentSection() {
  const { currency, symbol } = useCurrency()
  const pricing = getPlanPricing('4week', currency) // or get from props
  
  return (
    <div className="payment-section px-6">
      {/* ... existing code ... */}
      
      <p className="px-1 pb-3 text-center text-xs leading-snug text-secondary mt-4">
        You agree that <b>{symbol}{pricing.discounted.toFixed(2)}</b> will be as an intro offer, then <b>{symbol}{pricing.discounted.toFixed(2)}</b> will be automatically billed every 1 month until you cancel in settings.{' '}
        <a className="underline" href="https://legal.coursiv.io/en/subscription" target="_blank" rel="noreferrer">
          Subscription Terms.
        </a>
      </p>
    </div>
  )
}
```

---

### Step 6: Update CheckoutModal.tsx

```typescript
'use client'

import { useCurrency, getPlanPricing } from '@/lib/currency'
// ... other imports

export default function CheckoutModal({ isOpen, onClose, selectedPlan }: CheckoutModalProps) {
  const { currency, symbol } = useCurrency()
  
  // Map plan names to pricing keys
  const planKey = selectedPlan.name.includes('1-Week') ? '1week' :
                  selectedPlan.name.includes('4-Week') ? '4week' : '12week'
  
  const pricing = getPlanPricing(planKey, currency)
  const vatRate = currency === 'EUR' ? 0.23 : 0.10 // Adjust VAT rates as needed
  const vat = pricing.discounted * vatRate
  const total = pricing.discounted + vat

  // ... rest of component, replace:
  // - €{basePrice.toFixed(2)} with {symbol}{pricing.discounted.toFixed(2)}
  // - €{total.toFixed(2)} with {symbol}{total.toFixed(2)}
  // - €{vat.toFixed(2)} with {symbol}{vat.toFixed(2)}
}
```

---

### Step 7: Update API Route to Capture IP

Update `app/api/save-email/route.ts` to also capture and store IP:

```typescript
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Get IP address
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0].trim() : 
               request.headers.get('x-real-ip') || 
               request.ip || 
               'unknown'
    
    // Get currency from request body or detect it
    let currency = body.currency
    if (!currency) {
      // Detect currency from IP
      const currencyResponse = await fetch(`${request.nextUrl.origin}/api/detect-currency`, {
        headers: {
          'x-forwarded-for': ip,
          'x-real-ip': ip
        }
      })
      const currencyData = await currencyResponse.json()
      currency = currencyData.currency || 'EUR'
    }
    
    const { email, name, sessionId, quizAnswers, privacyConsent, marketingConsent, createdAt, submittedAt } = body

    // ... existing validation ...

    // TODO: Save to database including IP and currency
    console.log('Email submission received:', {
      sessionId,
      email,
      name,
      ip,
      currency,
      quizAnswers,
      privacyConsent,
      marketingConsent,
      createdAt,
      submittedAt
    })

    return NextResponse.json({
      success: true,
      message: 'Email saved successfully',
      sessionId,
      currency,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    // ... error handling ...
  }
}
```

---

## Testing

### Test US IP:
```bash
# Use a VPN or proxy to test from US
# Or use curl with a US proxy
curl http://localhost:3000/api/detect-currency
# Should return: {"currency":"USD","country":"US",...}
```

### Test EU IP:
```bash
# Use a VPN or proxy to test from EU
curl http://localhost:3000/api/detect-currency
# Should return: {"currency":"EUR","country":"DE",...}
```

---

## Alternative: Paid IP Geolocation Services

For production, consider using:
- **MaxMind GeoIP2** (most accurate, paid)
- **ipapi.co** (free tier: 1000/day, paid plans available)
- **ip-api.com** (free tier: 45/min, paid plans available)
- **Cloudflare** (if using Cloudflare, they provide country in headers)

### Using Cloudflare (if deployed on Cloudflare):

```typescript
// In detect-currency route
const countryCode = request.headers.get('cf-ipcountry') || 
                    request.headers.get('x-vercel-ip-country') // Vercel
```

---

## Environment Variables

Add to `.env.local`:

```env
# Optional: API key for paid IP geolocation service
IP_GEOLOCATION_API_KEY=your_api_key_here
```

---

## Notes

1. **Rate Limiting**: Free IP geolocation services have rate limits. Consider caching results in sessionStorage.
2. **Privacy**: Consider adding a cookie consent banner if required by GDPR.
3. **Fallback**: Always default to EUR if detection fails.
4. **Currency Rates**: Update conversion rates regularly or fetch from an API like exchangerate-api.com
5. **Testing**: Use VPN or browser extensions to test different countries.

---

## Files to Create/Modify

1. ✅ Create: `app/api/detect-currency/route.ts`
2. ✅ Create: `lib/currency.ts`
3. ✅ Modify: `app/layout.tsx` (add CurrencyProvider)
4. ✅ Modify: `components/SellingPage.tsx`
5. ✅ Modify: `components/PaymentSection.tsx`
6. ✅ Modify: `components/CheckoutModal.tsx`
7. ✅ Modify: `app/api/save-email/route.ts` (add IP capture)

---

## Quick Implementation Checklist

- [ ] Create currency detection API endpoint
- [ ] Create currency context/hook
- [ ] Wrap app with CurrencyProvider
- [ ] Update all pricing components
- [ ] Test with US IP (should show $)
- [ ] Test with EU IP (should show €)
- [ ] Update conversion rates
- [ ] Add error handling
- [ ] Add loading states
- [ ] Test fallback to EUR

---

**End of Implementation Guide**

