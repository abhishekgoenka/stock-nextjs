-- SELECT STRFTIME("%Y", purchaseDate) AS year,
--                         sum((qty*price)+stt+brokerage+otherCharges) AS stocks
--                         FROM StockInvestments s JOIN Companies c on s.companyID = c.id
--                         WHERE c.exchange = 'NSE'
--                         GROUP By STRFTIME("%Y", purchaseDate) ORDER By purchaseDate
-- SELECT sum((qty * price) + stt + brokerage + otherCharges) AS mutualFund
-- FROM MutualFundInvestments mi
--     JOIN MutualFunds mf on mf.id = mi.mutualFundID
-- WHERE exchange = 'NSE'
--     AND STRFTIME("%Y", purchaseDate) = '2024'
-- SELECT sum((qty * price) + stt + brokerage + otherCharges) AS mutualFund
-- FROM MutualFundInvestments mi
--   JOIN MutualFunds mf on mf.id = mi.mutualFundID
-- WHERE exchange = 'NSE'
--   AND STRFTIME("%Y", purchaseDate) = '2024'
-- SELECT sum((qty * price) + stt + brokerage + otherCharges) AS stock
-- FROM StockInvestments s
--   JOIN Companies c on s.companyID = c.id
-- WHERE c.exchange = :exchange
--   AND STRFTIME("%Y", purchaseDate) = '2024'
SELECT mi.id,
  mf.id as companyID,
  mf.name,
  purchaseDate,
  qty,
  price,
  mf.currentPrice,
  (qty * price) as grossAmount,
  ((qty * price) + stt + brokerage + otherCharges) AS netAmount,
  broker,
  (mf.currentPrice * qty) AS currentAmount,
  currency,
  'mf' as type
FROM MutualFundInvestments mi
  JOIN MutualFunds mf on mf.id = mi.mutualFundID
WHERE mi.broker = 'GROWW'
ORDER BY purchaseDate desc
