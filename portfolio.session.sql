SELECT s.id,
  purchaseDate,
  ((qty * price) + stt + brokerage + otherCharges) AS purchasePrice,
  broker,
  (c.currentPrice * qty) AS currentAmount
FROM StockInvestments s
  JOIN Companies c on s.companyID = c.id
WHERE c.exchange = 'NSE'
UNION ALL
SELECT mi.id,
  purchaseDate,
  ((qty * price) + stt + brokerage + otherCharges) AS purchasePrice,
  broker,
  (mf.currentPrice * qty) AS currentAmount
FROM MutualFundInvestments mi
  JOIN MutualFunds mf on mf.id = mi.mutualFundID
WHERE exchange = 'NSE'
