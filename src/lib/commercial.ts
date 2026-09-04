import { Decimal } from "@prisma/client/runtime/library";

export type TaxTreatment = "INCLUDED" | "EXCLUDED" | "ZERO" | "NOT_APPLICABLE";

export function calculateCommercialTotal(params: {
  subtotal: number | Decimal;
  discountAmount?: number | Decimal;
  additionalCharges?: number | Decimal;
  taxRate?: number | Decimal;
  taxTreatment: TaxTreatment;
}) {
  const subtotal = new Decimal(params.subtotal || 0);
  const discountAmount = new Decimal(params.discountAmount || 0);
  const additionalCharges = new Decimal(params.additionalCharges || 0);
  const taxRate = new Decimal(params.taxRate || 0);

  const baseAmount = subtotal.minus(discountAmount).plus(additionalCharges);
  let taxAmount = new Decimal(0);
  let finalTotal = baseAmount;

  if (params.taxTreatment === "EXCLUDED") {
    taxAmount = baseAmount.mul(taxRate.div(100));
    finalTotal = baseAmount.plus(taxAmount);
  } else if (params.taxTreatment === "INCLUDED") {
    // If tax is included, the baseAmount IS the final total.
    // taxAmount = baseAmount - (baseAmount / (1 + taxRate/100))
    const onePlusRate = new Decimal(1).plus(taxRate.div(100));
    const originalAmount = baseAmount.div(onePlusRate);
    taxAmount = baseAmount.minus(originalAmount);
    finalTotal = baseAmount;
  } else if (params.taxTreatment === "ZERO" || params.taxTreatment === "NOT_APPLICABLE") {
    taxAmount = new Decimal(0);
    finalTotal = baseAmount;
  }

  // Ensure exact 2 decimal places precision for currency (rounding half even / half up)
  return {
    subtotal: subtotal.toDecimalPlaces(2),
    discountAmount: discountAmount.toDecimalPlaces(2),
    additionalCharges: additionalCharges.toDecimalPlaces(2),
    baseAmount: baseAmount.toDecimalPlaces(2),
    taxRate: taxRate.toDecimalPlaces(2),
    taxAmount: taxAmount.toDecimalPlaces(2),
    finalTotal: finalTotal.toDecimalPlaces(2),
  };
}
