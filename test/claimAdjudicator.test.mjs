import { test, describe } from 'node:test';
import assert from 'node:assert';
import { ClaimAdjudicator } from '../src/claimAdjudicator.mjs';

describe('Healthcare Claim Adjudicator Suite', () => {
  const adjudicator = new ClaimAdjudicator();

  test('should compute copay, deductible satisfaction, and coinsurance split accurately', () => {
    // Claim: $500. Deductible Remaining: $200. Copay: $25. Coinsurance: 20%
    // Copay: $25. Remaining: $475.
    // Deductible: $200 applied. Remaining: $275.
    // Coinsurance: 20% of $275 = $55 (patient), 80% = $220 (plan)
    // Patient total = 25 + 200 + 55 = $280
    // Plan total = $220
    const res = adjudicator.adjudicateClaim({
      claimAmount: 500,
      annualDeductibleRemaining: 200,
      copayAmount: 25,
      coinsuranceRate: 0.20
    });

    assert.strictEqual(res.patientResponsibility, 280.00);
    assert.strictEqual(res.planResponsibility, 220.00);
    assert.strictEqual(res.deductibleApplied, 200.00);
    assert.strictEqual(res.newDeductibleRemaining, 0.00);
  });
});
