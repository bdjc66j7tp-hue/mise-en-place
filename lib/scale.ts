// lib/scale.ts
// Scales a list of ingredient strings by a factor.

const UNICODE_FRACTIONS: Record<string, number> = {
  '½': 0.5, '⅓': 1 / 3, '⅔': 2 / 3, '¼': 0.25, '¾': 0.75,
  '⅕': 0.2, '⅖': 0.4, '⅗': 0.6, '⅘': 0.8,
  '⅙': 1 / 6, '⅚': 5 / 6,
  '⅛': 0.125, '⅜': 0.375, '⅝': 0.625, '⅞': 0.875,
}

const NICE_FRACTIONS: Array<[number, string]> = [
  [0.125, '1/8'],
  [0.25, '1/4'],
  [1 / 3, '1/3'],
  [0.375, '3/8'],
  [0.5, '1/2'],
  [0.625, '5/8'],
  [2 / 3, '2/3'],
  [0.75, '3/4'],
  [0.875, '7/8'],
]

// Convert a decimal to a nice readable string.
// "0.75" -> "3/4", "1.5" -> "1 1/2", "2.08" -> "2", "1.56" -> "1 1/2"
function decimalToNiceString(n: number): string {
  if (n === 0) return '0'
  const negative = n < 0
  const abs = Math.abs(n)
  const whole = Math.floor(abs)
  const remainder = abs - whole

  // Generous tolerance — recipes don't need 2-decimal precision.
  // 0.08 catches things like 2.08 -> 2, 1.56 -> 1 1/2 (since 0.56 is within 0.07 of 0.5).
  const tolerance = 0.08

  // Remainder close to 0 → whole number
  if (remainder < tolerance) {
    return (negative ? '-' : '') + String(whole)
  }
  // Remainder close to 1 → round up
  if (remainder > 1 - tolerance) {
    return (negative ? '-' : '') + String(whole + 1)
  }

  // Look for nearest nice fraction
  let bestLabel: string | null = null
  let bestDist = Infinity
  for (const [value, label] of NICE_FRACTIONS) {
    const dist = Math.abs(remainder - value)
    if (dist < bestDist) {
      bestDist = dist
      bestLabel = label
    }
  }
  if (bestLabel && bestDist < tolerance) {
    const wholePart = whole > 0 ? `${whole} ` : ''
    return (negative ? '-' : '') + wholePart + bestLabel
  }

  // Fallback to a clean decimal (1 decimal place is plenty for recipes)
  const rounded = Math.round(abs * 10) / 10
  return (negative ? '-' : '') + String(rounded)
}

// Pulls a leading number out of a string.
// Returns { value, rest } if found, otherwise null.
// "2 cups flour" -> { value: 2, rest: " cups flour" }
function parseLeadingQuantity(s: string): { value: number; rest: string } | null {
  // Mixed fraction: "1 1/4 cups"
  const mixedAscii = s.match(/^(\d+)\s+(\d+)\/(\d+)(.*)$/)
  if (mixedAscii) {
    const den = parseInt(mixedAscii[3], 10)
    if (den > 0) return { value: parseInt(mixedAscii[1], 10) + parseInt(mixedAscii[2], 10) / den, rest: mixedAscii[4] }
  }

  // Mixed unicode: "1 ½ cup"
  const mixedUnicode = s.match(/^(\d+)\s*([½⅓⅔¼¾⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞])(.*)$/)
  if (mixedUnicode) {
    return { value: parseInt(mixedUnicode[1], 10) + UNICODE_FRACTIONS[mixedUnicode[2]], rest: mixedUnicode[3] }
  }

  // Simple fraction: "1/2 tsp"
  const simpleFrac = s.match(/^(\d+)\/(\d+)(.*)$/)
  if (simpleFrac) {
    const den = parseInt(simpleFrac[2], 10)
    if (den > 0) return { value: parseInt(simpleFrac[1], 10) / den, rest: simpleFrac[3] }
  }

  // Unicode fraction: "½ cup"
  const unicodeOnly = s.match(/^([½⅓⅔¼¾⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞])(.*)$/)
  if (unicodeOnly) {
    return { value: UNICODE_FRACTIONS[unicodeOnly[1]], rest: unicodeOnly[2] }
  }

  // Decimal or whole: "1.5 tsp" or "200g"
  const numeric = s.match(/^(\d+(?:\.\d+)?)(.*)$/)
  if (numeric) {
    return { value: parseFloat(numeric[1]), rest: numeric[2] }
  }

  return null
}

// Pulls a non-leading number from a string (for ranges).
// Used for the second number in "2 to 3 cups" or "2-3 cups".
function scaleRangeIfPresent(rest: string, factor: number): string {
  // Match: " to N", " - N", "-N", "–N" right at the start of `rest` (after the first number).
  // The connector can be: "to", "-", "–", "—"
  const rangeMatch = rest.match(/^(\s*(?:to|-|–|—)\s*)(\d+(?:\.\d+)?|\d+\/\d+|\d+\s+\d+\/\d+|[½⅓⅔¼¾⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞])(.*)$/)
  if (!rangeMatch) return rest

  const [, connector, secondNum, after] = rangeMatch
  const parsed = parseLeadingQuantity(secondNum)
  if (!parsed) return rest

  const scaled = parsed.value * factor
  return connector + decimalToNiceString(scaled) + after
}

// Scale a single ingredient string.
export function scaleIngredient(ingredient: string, factor: number): string {
  if (factor === 1) return ingredient
  const trimmedStart = ingredient.replace(/^\s+/, '')
  const parsed = parseLeadingQuantity(trimmedStart)
  if (!parsed) return ingredient

  const scaled = parsed.value * factor
  const scaledRest = scaleRangeIfPresent(parsed.rest, factor)
  return decimalToNiceString(scaled) + scaledRest
}

export function scaleIngredients(ingredients: string[], factor: number): string[] {
  return ingredients.map((i) => scaleIngredient(i, factor))
}