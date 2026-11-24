-- Load PaySim into DuckDB (run inside Colab after kagglehub.dataset_download("ealaxi/paysim1"))
CREATE TABLE tx AS SELECT * FROM read_csv_auto('/kaggle/input/paysim1/*.csv');

-- 1. Fraud by transaction type
SELECT type,
       COUNT(*)                                   AS transactions,
       SUM(isFraud)                               AS fraud_count,
       ROUND(100.0 * SUM(isFraud) / COUNT(*), 3)  AS fraud_rate_pct,
       ROUND(SUM(CASE WHEN isFraud = 1 THEN amount ELSE 0 END) / 1e6, 1) AS fraud_value_millions
FROM tx
GROUP BY type
ORDER BY fraud_count DESC;

-- 2. Do fraudsters empty the account?
SELECT isFraud,
       COUNT(*) AS transactions,
       ROUND(100.0 * AVG(CASE WHEN oldbalanceOrg > 0 AND newbalanceOrig = 0 THEN 1 ELSE 0 END), 1) AS pct_account_emptied
FROM tx
WHERE type IN ('TRANSFER', 'CASH_OUT')
GROUP BY isFraud;

-- 3. Score one rule (replace <RULE> with a condition, e.g.
--    type IN ('TRANSFER','CASH_OUT') AND amount > 0 AND (amount = oldbalanceOrg OR amount = 10000000))
SELECT
  ROUND(100.0 * SUM(CASE WHEN (<RULE>) AND isFraud = 1 THEN 1 ELSE 0 END) / SUM(isFraud), 1)       AS pct_fraud_caught,
  ROUND(100.0 * SUM(CASE WHEN (<RULE>) AND isFraud = 1 THEN amount ELSE 0 END)
              / SUM(CASE WHEN isFraud = 1 THEN amount ELSE 0 END), 1)                             AS pct_fraud_money_saved,
  SUM(CASE WHEN (<RULE>) AND isFraud = 0 THEN 1 ELSE 0 END)                                        AS good_customers_blocked,
  ROUND(10000.0 * SUM(CASE WHEN (<RULE>) AND isFraud = 0 THEN 1 ELSE 0 END) / SUM(1 - isFraud), 1) AS blocked_per_10k_good
FROM tx;

-- 4. What does the full-balance rule miss?
SELECT COUNT(*) AS missed_frauds,
       SUM(CASE WHEN amount = 10000000 THEN 1 ELSE 0 END) AS missed_at_exactly_10M,
       ROUND(MIN(amount)) AS smallest, ROUND(MAX(amount)) AS largest
FROM tx
WHERE isFraud = 1 AND NOT (amount > 0 AND amount = oldbalanceOrg);
