select
    `Referrals`.`active` as `active`,
    `Referrals`.`date_invite` as `date_invite`,
    `Referrals`.`referral_tg_id` as `referral_tg_id`,
    `Referrals`.`host_tg_id` as `host_tg_id`
from
    `Referrals`
where
    `Referrals`.`host_tg_id` = :tg_id;

