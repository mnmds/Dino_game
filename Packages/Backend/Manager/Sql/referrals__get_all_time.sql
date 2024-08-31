select
    referrals.referral_tg_id as referral_tg_id,
    referrals_count.referrals_count
from
    referrals
left join (
    select
        referrals.host_tg_id as referral,
        count(referrals.host_tg_id) as referrals_count
    from
        referrals
    where
        referrals.active = true
    group by referrals.host_tg_id
) as referrals_count on referrals_count.referral = referrals.referral_tg_id
where
    referrals.host_tg_id = :tg_id
    and referrals.active = true;
