export class ClaimAdjudicator {
  adjudicateClaim({ claimAmount, annualDeductibleRemaining, copayAmount = 25, coinsuranceRate = 0.20 }) {
    if (claimAmount <= 0) throw new Error('Claim amount must be greater than zero');

    let patientResponsibility = 0;
    let planResponsibility = 0;
    let deductibleApplied = 0;

    // Apply copay first
    patientResponsibility += Math.min(claimAmount, copayAmount);
    let remainingAmount = Math.max(0, claimAmount - copayAmount);

    // Apply deductible
    if (remainingAmount > 0 && annualDeductibleRemaining > 0) {
      deductibleApplied = Math.min(remainingAmount, annualDeductibleRemaining);
      patientResponsibility += deductibleApplied;
      remainingAmount -= deductibleApplied;
    }

    // Apply coinsurance on remaining
    if (remainingAmount > 0) {
      const patientCoinsurance = remainingAmount * coinsuranceRate;
      patientResponsibility += patientCoinsurance;
      planResponsibility += (remainingAmount - patientCoinsurance);
    }

    return {
      claimAmount,
      patientResponsibility: Number(patientResponsibility.toFixed(2)),
      planResponsibility: Number(planResponsibility.toFixed(2)),
      deductibleApplied: Number(deductibleApplied.toFixed(2)),
      newDeductibleRemaining: Number(Math.max(0, annualDeductibleRemaining - deductibleApplied).toFixed(2))
    };
  }
}
