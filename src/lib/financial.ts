// import moment = require("moment");
import { interest, compoundAnnualGrowthRate } from "capitaljs";
import { differenceInDays, differenceInYears } from "date-fns";
import { orderBy, round } from "lodash";
// var xirr = require("xirr");
import { xirr, convertRate, RateInterval } from "node-irr";
// const { xirr } = require("node-irr");

/**
 * CAGR is 0 if investment is less then a year
 * @param purchaseDate purchase date
 * @param startValue initial investment
 * @param endValue current valur
 * @returns CAGR percentage
 */
export function calculateCAGR(purchaseDate: Date, startValue: number, endValue: number): number {
  const period = differenceInYears(new Date(), purchaseDate);
  let rate = 0;
  if (period > 0) {
    rate = compoundAnnualGrowthRate({
      startValue,
      endValue,
      years: period,
    }).percent;
  }
  return rate;
}

export function customDifferenceInYears(purchaseDate: Date): number {
  return differenceInYears(new Date(), purchaseDate);
}

export function customDifferenceInDays(purchaseDate: Date): number {
  return differenceInDays(new Date(), purchaseDate);
}

export function calculateInterest(purchaseDate: Date, principal: number, rate: number): number {
  const periods = customDifferenceInYears(purchaseDate);
  let interestValue = 0;
  if (periods > 0) {
    // more then 1 year. Calculate CAGR
    interestValue = getCompountedInterest(principal, rate, periods).interest;
  } else {
    let periodDays = customDifferenceInDays(purchaseDate);
    periodDays++;
    interestValue = (principal * rate * periodDays) / 36525;
  }
  return round(interestValue, 2);
}

export function calculateXIRR(val: Array<{ amount: number; date: Date }>): number {
  if (val.length < 2) {
    return 0;
  }
  const data = orderBy(val, "date");
  const calculate = xirr(data);
  const rate = convertRate(calculate.rate, RateInterval.Year);
  return rate;
}

export function getCompountedInterest(principal: number, rate: number, periods: number): { interest: number; total: number } {
  return interest({
    principal,
    rate,
    periods,
    compoundings: 1,
  });
}
