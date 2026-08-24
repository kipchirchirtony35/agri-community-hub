/**
 * Normalises input quantity to kilograms based on unit type.
 */
function normaliseToKg(quantity, unit) {
  switch (unit) {
    case 'KG':
      return quantity;
    case 'BAGS_90KG':
      return quantity * 90;
    case 'CRATES':
      return quantity * 20; // Assuming standard 20kg crate
    case 'TONNES':
      return quantity * 1000;
    case 'LITRES':
      return quantity; // Assuming 1L ≈ 1kg for liquids like milk/honey
    default:
      return quantity;
  }
}

module.exports = { normaliseToKg };