SELECT
    Referrals.referral_tg_id,
    Users.balance,
    Users.week_balance,
    Users.week_prev_balance
FROM
    Referrals as Referrals
JOIN
    Users as Users ON Referrals.referral_tg_id = Users.tg_id
WHERE
    Referrals.host_tg_id = 1;
