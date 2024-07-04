// import moment = require("moment");
import { interest, compoundAnnualGrowthRate } from "capitaljs";
import { differenceInDays, differenceInYears, interval } from "date-fns";
import { round } from "lodash";
var xirr = require("xirr");

/**
 * CAGR is 0 if investment is less then a year
 * @param purchaseDate purchase date
 * @param startValue initial investment
 * @param endValue current valur
 * @returns CAGR percentage
 */
export function calculateCAGR(purchaseDate: Date, startValue: number, endValue: number): number {
  // const period = moment().diff(moment(purchaseDate, "YYYY-MM-DD"), "years");
  const period = differenceInYears(new Date(), purchaseDate);
  let rate = 0;
  if (period > 0 && endValue > 0) {
    rate = compoundAnnualGrowthRate({
      startValue,
      endValue,
      years: period,
    }).percent;
  }
  return rate;
}

export function calculatePeriodYear(purchaseDate: Date): number {
  return differenceInYears(new Date(), purchaseDate);
}

export function calculatePeriodDays(purchaseDate: Date): number {
  return differenceInDays(new Date(), purchaseDate);
}

export function calculateInterest(purchaseDate: Date, principal: number, rate: number): number {
  const periods = calculatePeriodYear(purchaseDate);
  let interestValue = 0;
  if (periods > 0) {
    // more then 1 year. Calculate CAGR
    const compoundInterest = interest({
      principal,
      rate,
      periods,
      compoundings: 1,
    }).interest;
    interestValue = round(compoundInterest, 2);
  } else {
    let periodDays = calculatePeriodDays(purchaseDate);
    periodDays++;
    interestValue = (principal * rate * periodDays) / 36525;
  }
  return interestValue;
}

export function calculateSimpleInterest(purchasePrice: number, periodDays: number, rate: number): number {
  return (purchasePrice * rate * periodDays) / 36525;
}

export function calculateCompoundingInterest(amount: number, rate: number, period: number): number {
  const r = interest({
    principal: amount,
    rate,
    periods: period,
    compoundings: 1,
  });
  return round(r.interest, 2);
}

export function calculateXIRR(val: Array<{ amount: number; when: Date }>): number {
  if (val.length < 2) {
    return 0;
  }
  return xirr(val);
}

export function getCompountedInterest(principal: number, rate: number, periods: number): { interest: number; total: number } {
  return interest({
    principal,
    rate,
    periods,
    compoundings: 1,
  });
}
