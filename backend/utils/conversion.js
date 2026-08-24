// Converts a harvest quantity into a standard kg value for reporting/stats.
// CRATES and LITRES don't have a fixed universal kg weight, so they're
// treated as 1:1 placeholders here — adjust KG_PER_CRATE if you have a
// standard crate weight for your crops (e.g. tomatoes vs maize differ).

const KG_PER_BAG_90KG = 90;
const KG_PER_TONNE = 1000;
const KG_PER_CRATE = 1; // placeholder — adjust to your actual average crate weight
const KG_PER_LITRE = 1; // placeholder — only meaningful for liquid produce by density ~1

export function normaliseToKg(quantity, unit) {
  if (typeof quantity !== "number" || Number.isNaN(quantity)) {
    throw new Error("quantity must be a valid number");
  }

  switch (unit) {
    case "KG":
      return quantity;
    case "BAGS_90KG":
      return quantity * KG_PER_BAG_90KG;
    case "TONNES":
      return quantity * KG_PER_TONNE;
    case "CRATES":
      return quantity * KG_PER_CRATE;
    case "LITRES":
      return quantity * KG_PER_LITRE;
    default:
      throw new Error(`Unknown unit: ${unit}`);
  }
}
