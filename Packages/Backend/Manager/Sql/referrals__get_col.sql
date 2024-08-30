select
    count(`Referrals`.`referral_tg_id`) as referral_count
from
    `Referrals`
where
    `Referrals`.`host_tg_id` = :tg_id;
