import { cleanup } from "@testing-library/react";
import { describe, it, expect, afterEach } from "vitest";
import { calculateCAGR, calculateInterest, calculateXIRR, customDifferenceInDays, customDifferenceInYears } from "./financial";
import { differenceInDays, sub } from "date-fns";
import { round } from "lodash";

describe("Financial Methods", () => {
  afterEach(() => {
    cleanup();
  });

  it("should calculate CAGR", () => {
    const purchaseDate = sub(new Date(), { years: 3 });
    const startValue = 5000;
    const endValue = 10000;

    const carg = calculateCAGR(purchaseDate, startValue, endValue);
    expect(carg).toBe(26);
  });

  it("should return 0 CAGR when preiod is less then 0", () => {
    const purchaseDate = sub(new Date(), { months: 3 });
    const startValue = 5000;
    const endValue = 4000;

    const carg = calculateCAGR(purchaseDate, startValue, endValue);
    expect(carg).toBe(0);
  });

  it("should return years when purchase date is more then 1 year", () => {
    const purchaseDate = sub(new Date(), { years: 4 });

    const years = customDifferenceInYears(purchaseDate);

    expect(years).toBe(4);
  });

  it("should return zero when purchase date is less then 1 year", () => {
    const purchaseDate = sub(new Date(), { months: 4 });

    const years = customDifferenceInYears(purchaseDate);

    expect(years).toBe(0);
  });

  it("should calculate interest when investment is more then 1 year", () => {
    const purchaseDate = sub(new Date(), { days: 55 });

    const days = customDifferenceInDays(purchaseDate);

    expect(days).toBe(55);
  });

  it("should calculate interest", () => {
    // 3 years of investment
    let interest = calculateInterest(sub(new Date(), { years: 3 }), 5000, 12);
    expect(interest).toBe(round(7024.64 - 5000, 2));

    // 1 years of investment
    interest = calculateInterest(sub(new Date(), { years: 1 }), 5000, 12);
    expect(interest).toBe(round(5600 - 5000, 2));

    // 100 days
    interest = calculateInterest(sub(new Date(), { days: 100 }), 5000, 12);
    expect(interest).toBe(round(5165.91 - 5000, 2));

    // 365 days
    interest = calculateInterest(sub(new Date(), { days: 365 }), 5000, 12);
    expect(interest).toBe(round(5601.23 - 5000, 2));
  });

  it("should calculate XIRR", async () => {
    // 1 month of investment
    let value = [
      { amount: -5000, when: new Date(2024, 5, 1) },
      { amount: 6000, when: new Date(2024, 6, 5) },
    ];
    let interest = calculateXIRR(value);
    expect(interest).toBe(6.080011529539937);

    // 1 year of investment
    value = [
      { amount: -5000, when: new Date(2024, 5, 1) },
      { amount: 6000, when: new Date(2025, 7, 1) },
    ];
    interest = calculateXIRR(value);
    expect(interest).toBe(0.16907691913316417);

    // when only 1 value is passed in array
    value = [{ amount: -5000, when: new Date(2024, 5, 1) }];
    interest = calculateXIRR(value);
    expect(interest).toBe(0);

    // when negative value is not passed
    value = [
      { amount: 5000, when: new Date(2024, 5, 1) },
      { amount: 6000, when: new Date(2025, 7, 1) },
    ];
    expect(() => calculateXIRR(value)).toThrowError("Transactions must not all be nonnegative");
  });
});
