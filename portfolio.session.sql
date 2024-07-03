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
SELECT sum((qty * price) + stt + brokerage + otherCharges) AS stock
FROM StockInvestments s
  JOIN Companies c on s.companyID = c.id
WHERE c.exchange = :exchange
  AND STRFTIME("%Y", purchaseDate) = '2024'
