export const sendCurrencies = [
    { code: "NGN", symbol: "₦", name: "Nigerian Naira" },
    { code: "ZAR", symbol: "R", name: "South African Rand" },
    { code: "KES", symbol: "KSh", name: "Kenyan Shilling" },
    { code: "GHS", symbol: "GH₵", name: "Ghanaian Cedi" },
    { code: "XOF", symbol: "CFA", name: "West African CFA" },
    { code: "EGP", symbol: "E£", name: "Egyptian Pound" },
    { code: "RWF", symbol: "FRw", name: "Rwandan Franc" },
    { code: "UGX", symbol: "USh", name: "Ugandan Shilling" },
];

export const countries = [
    { code: "NG", name: "Nigeria", currency: "NGN", symbol: "₦" },
    { code: "ZA", name: "South Africa", currency: "ZAR", symbol: "R" },
    { code: "KE", name: "Kenya", currency: "KES", symbol: "KSh" },
    { code: "GH", name: "Ghana", currency: "GHS", symbol: "GH₵" },
    { code: "SN", name: "Senegal", currency: "XOF", symbol: "CFA" },
    { code: "EG", name: "Egypt", currency: "EGP", symbol: "E£" },
    { code: "RW", name: "Rwanda", currency: "RWF", symbol: "FRw" },
    { code: "UG", name: "Uganda", currency: "UGX", symbol: "USh" },
];

export const banks = [
    { id: "gtb", name: "Guaranty Trust Bank (GTB)", country: "NG" },
    { id: "access", name: "Access Bank", country: "NG" },
    { id: "zenith", name: "Zenith Bank", country: "NG" },
    { id: "standard-za", name: "Standard Bank", country: "ZA" },
    { id: "fnb-za", name: "First National Bank (FNB)", country: "ZA" },
    { id: "capitec", name: "Capitec Bank", country: "ZA" },
    { id: "kcb", name: "KCB Bank Kenya", country: "KE" },
    { id: "equity", name: "Equity Bank", country: "KE" },
    { id: "mpesa", name: "M-Pesa", country: "KE" },
    { id: "gcb", name: "GCB Bank", country: "GH" },
    { id: "ecobank-gh", name: "Ecobank Ghana", country: "GH" },
    { id: "cbao", name: "CBAO Groupe Attijariwafa", country: "SN" },
    { id: "cib-eg", name: "Commercial International Bank (CIB)", country: "EG" },
    { id: "bk-rw", name: "Bank of Kigali", country: "RW" },
    { id: "stanbic-ug", name: "Stanbic Bank Uganda", country: "UG" },
];

export const paymentMethods = [
    { id: "bank", label: "Bank transfer" },
    { id: "card", label: "Card" },
    { id: "mobile", label: "Mobile money" },
] as const;

// Fallback rates relative to NGN, used if the live feed is unavailable
const fallbackRatesToNgn: Record<string, number> = {
    NGN: 1,
    ZAR: 91.38,
    KES: 11.74,
    GHS: 97.46,
    XOF: 2.59,
    EGP: 31.15,
    RWF: 1.14,
    UGX: 0.41,
};

/** Units of `to` per 1 unit of `from`. `live` maps currency code -> units per USD. */
export function getRate(from: string, to: string, live: Record<string, number>): number {
    if (live[from] && live[to]) return live[to] / live[from];
    return (fallbackRatesToNgn[from] ?? 1) / (fallbackRatesToNgn[to] ?? 1);
}

export const flagSrc = (isoCode: string) => `https://flagcdn.com/w40/${isoCode.toLowerCase()}.png`;

export const FEE_RATE = 0.01; // 1%

