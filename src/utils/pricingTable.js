// Pricing table based on the provided txt
const pricingTable = {
  postal: {
    SWITZERLAND: { '1': 25, '2': 35, '5': 55, '>5': null },
    'EU COUNTRIES': { '1': 35, '2': 45, '5': 65, '>5': null },
    'USA, CANADA': { '1': 40, '2': 55, '5': 75, '>5': null },
    'OTHER COUNTRIES': { '1': 45, '2': 60, '5': 85, '>5': null },
  },
  fast: {
    SWITZERLAND: { '1': 40, '2': 56, '5': 88, '>5': null },
    'EU COUNTRIES': { '1': 56, '2': 72, '5': 104, '>5': null },
    'USA, CANADA': { '1': 64, '2': 88, '5': 120, '>5': null },
    'OTHER COUNTRIES': { '1': 72, '2': 96, '5': 136, '>5': null },
  },
  insuranceRate: 0.0083, // 0.83%
  packaging: { '1': 12, '2': 14, '5': 16, '>5': null },
  customDeclaration: { '1': 9, '2': 9, '5': 9, '>5': null },
  forwarding: { '1': 3, '2': 4, '5': 5, '>5': null },
};

export function calculateEstimate({
  shippingType, // 'postal' or 'fast'
  destination, // e.g., 'SWITZERLAND', 'EU COUNTRIES', etc.
  weight, // '1', '2', '5', '>5'
  invoiceValue, // number
  includeInsurance = true,
  includePackaging = true,
  includeCustomDeclaration = true,
  includeForwarding = true,
}) {
  let total = 0;
  let breakdown = {};

  // Main shipping
  const main = pricingTable[shippingType]?.[destination]?.[weight];
  if (main === null || main === undefined) {
    breakdown.error = 'Please contact us for this option.';
    return { total: null, breakdown };
  }
  breakdown.main = main;
  total += main;

  // Insurance
  if (includeInsurance && invoiceValue) {
    const insurance = Math.round(pricingTable.insuranceRate * invoiceValue * 100) / 100;
    breakdown.insurance = insurance;
    total += insurance;
  }

  // Packaging
  if (includePackaging) {
    const packaging = pricingTable.packaging[weight];
    if (packaging) {
      breakdown.packaging = packaging;
      total += packaging;
    }
  }

  // Custom Declaration (not for Switzerland)
  if (includeCustomDeclaration && destination !== 'SWITZERLAND') {
    const custom = pricingTable.customDeclaration[weight];
    if (custom) {
      breakdown.customDeclaration = custom;
      total += custom;
    }
  }

  // Forwarding
  if (includeForwarding) {
    const forwarding = pricingTable.forwarding[weight];
    if (forwarding) {
      breakdown.forwarding = forwarding;
      total += forwarding;
    }
  }

  breakdown.total = Math.round(total * 100) / 100;
  return { total: breakdown.total, breakdown };
} 