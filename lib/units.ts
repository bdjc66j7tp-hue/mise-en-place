// lib/units.ts
// Unit conversion utilities for Mise en Placé.
// Used by RecipeScaler and (later) the AI Meal Planner.

// ---------------------------------------------------------------------------
// Number parsing — handles whole, decimal, fraction, and mixed numbers
// ---------------------------------------------------------------------------

function parseNum(s: string): number | null {
  const t = s.trim()
  // Mixed: "1 1/2"
  const mixed = t.match(/^(\d+)\s+(\d+)\/(\d+)$/)
  if (mixed) return Number(mixed[1]) + Number(mixed[2]) / Number(mixed[3])
  // Fraction: "1/2"
  const frac = t.match(/^(\d+)\/(\d+)$/)
  if (frac) return Number(frac[1]) / Number(frac[2])
  // Decimal or whole: "2", "1.5"
  const n = parseFloat(t)
  return isNaN(n) ? null : n
}

// ---------------------------------------------------------------------------
// Output formatting
// ---------------------------------------------------------------------------

function fmtVol(ml: number): string {
  if (ml >= 1000) {
    const l = parseFloat((ml / 1000).toFixed(2))
    return `${l} L`
  }
  return `${Math.round(ml)} ml`
}

function fmtWt(g: number): string {
  if (g >= 1000) {
    const kg = parseFloat((g / 1000).toFixed(2))
    return `${kg} kg`
  }
  return `${Math.round(g)} g`
}

// ---------------------------------------------------------------------------
// Conversion tables (ml per unit, g per unit)
// ---------------------------------------------------------------------------

// Volume — ml per 1 unit
const VOL: Record<string, number> = {
  'fluid ounces': 29.57,
  'fluid ounce':  29.57,
  'tablespoons':  15,
  'tablespoon':   15,
  'teaspoons':    5,
  'teaspoon':     5,
  'gallons':      3785,
  'gallon':       3785,
  'quarts':       946,
  'quart':        946,
  'pints':        473,
  'pint':         473,
  'cups':         240,
  'cup':          240,
  'fl oz':        29.57,
  'tbsp':         15,
  'tsp':          5,
}

// Weight — g per 1 unit
const WT: Record<string, number> = {
  'pounds': 453.6,
  'pound':  453.6,
  'ounces': 28.35,
  'ounce':  28.35,
  'lbs':    453.6,
  'lb':     453.6,
  'oz':     28.35,
}

// ---------------------------------------------------------------------------
// Regex — built from the unit tables, longest units first to avoid
// partial matches (e.g. "tablespoons" must be tried before "spoon")
// ---------------------------------------------------------------------------

const ALL_UNITS = [...Object.keys(VOL), ...Object.keys(WT)]
  .sort((a, b) => b.length - a.length)
  .filter((v, i, arr) => arr.indexOf(v) === i)

const UNIT_PATTERN = ALL_UNITS
  .map(u => u.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+'))
  .join('|')

// Number pattern: mixed ("1 1/2") | fraction ("1/2") | decimal/whole ("2", "1.5")
const NUM_PAT = '(\\d+\\s+\\d+\\/\\d+|\\d+\\/\\d+|\\d+(?:\\.\\d+)?)'

const CONVERT_REGEX = new RegExp(`${NUM_PAT}\\s*(${UNIT_PATTERN})\\b`, 'gi')

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Converts imperial measurements in a single ingredient string to metric.
 * Already-metric ingredients (g, ml, kg, L) are left untouched.
 *
 * Examples:
 *   "2 cups flour"          → "480 ml flour"
 *   "1/2 teaspoon salt"     → "3 ml salt"
 *   "1 1/2 pounds chicken"  → "680 g chicken"
 *   "3 tablespoons oil"     → "45 ml oil"
 *   "2 large eggs"          → "2 large eggs"  (unchanged)
 */
export function convertToMetric(ingredient: string): string {
  return ingredient.replace(CONVERT_REGEX, (match, qty, unit) => {
    const n = parseNum(qty)
    if (n === null) return match
    const u = unit.toLowerCase().trim().replace(/\s+/g, ' ')
    if (VOL[u] !== undefined) return fmtVol(n * VOL[u])
    if (WT[u]  !== undefined) return fmtWt(n * WT[u])
    return match
  })
}

/**
 * Converts Fahrenheit temperatures to Celsius in any text string.
 *
 * Handles all common recipe formats:
 *   "350°F"                  → "177°C"
 *   "350 °F"                 → "177°C"
 *   "350F"                   → "177°C"
 *   "350 degrees F"          → "177°C"
 *   "350 degrees Fahrenheit" → "177°C"
 *   "350°Fahrenheit"         → "177°C"
 *
 * Safe to apply to steps, notes, and description text.
 */
export function convertTempToMetric(text: string): string {
  return text.replace(
    /(\d+(?:\.\d+)?)\s*°?\s*(?:degrees?\s*)?(?:F(?:ahrenheit)?)\b/gi,
    (_, f) => `${Math.round((parseFloat(f) - 32) * 5 / 9)}°C`
  )
}
