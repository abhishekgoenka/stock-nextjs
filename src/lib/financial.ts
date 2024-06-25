// import moment = require("moment");
import { interest, compoundAnnualGrowthRate, returnOnInvestment } from "capitaljs";
import { differenceInDays, differenceInYears } from "date-fns";
import * as _ from "lodash";
import moment from "moment";
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

export function calculateSimpleInterest(purchasePrice: number, periodDays: number, rate: number): number {
  return (purchasePrice * rate * periodDays) / 36525;
}

export function calculateInterest(amount: number, rate: number, period: number): number {
  const r = interest({
    principal: amount,
    rate,
    periods: period,
    compoundings: 1,
  });
  return _.round(r.interest, 2);
}

export function calculateXIRR(val: Array<{ amount: number; when: moment.Moment }>): number {
  try {
    console.log(val);
    return xirr(val);
  } catch (error) {
    console.error(error);
    console.log(val);
    return 0;
  }
}

export function getCompountedInterest(principal: number, rate: number, periods: number): { interest: number; total: number } {
  return interest({
    principal,
    rate,
    periods,
    compoundings: 1,
  });
}
