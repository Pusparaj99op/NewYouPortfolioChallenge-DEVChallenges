export type FeeTier = 'early' | 'regular'

export type PaymentReceipt = {
  id: string
  tier: FeeTier
  amount: number
  teamName: string
  membersCount: number
  paidAtIso: string
  method: 'UPI' | 'Card' | 'NetBanking'
}

const KEY = 'hackthonix2_payment'

export function getFee(tier: FeeTier) {
  return tier === 'early' ? 110 : 150
}

export function loadReceipt(): PaymentReceipt | null {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    return JSON.parse(raw) as PaymentReceipt
  } catch {
    return null
  }
}

export function saveReceipt(r: PaymentReceipt) {
  localStorage.setItem(KEY, JSON.stringify(r))
}

export function clearReceipt() {
  localStorage.removeItem(KEY)
}

export function fakePay(params: {
  tier: FeeTier
  teamName: string
  membersCount: number
  method: PaymentReceipt['method']
}) {
  const amount = getFee(params.tier) * params.membersCount
  const id = `HX2-${Math.random().toString(36).slice(2, 8).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`
  const receipt: PaymentReceipt = {
    id,
    tier: params.tier,
    amount,
    teamName: params.teamName,
    membersCount: params.membersCount,
    paidAtIso: new Date().toISOString(),
    method: params.method,
  }
  saveReceipt(receipt)
  return receipt
}
