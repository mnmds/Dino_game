select
    Referrals.referral_tg_id as `tg_id`,
    coalesce(Referrals_count__all.referrals_count, 0) as `referrals_count__all`,
    coalesce(Referrals_count__this_week.referrals_count, 0) as `referrals_count__this_week`,
    coalesce(Referrals_count__week.referrals_count, 0) as `referrals_count__week`,
    coalesce(Users.balance, 0) as `balance`,
    coalesce(Users.week_balance, 0) as `week_balance`,
    coalesce(Users.week_prev_balance, 0) as `week_prev_balance`
from
    Referrals as `Referrals`
    left join (
        select
            Referrals.host_tg_id as `referral`,
            count(Referrals.host_tg_id) as `referrals_count`
        from Referrals
        where
            Referrals.date_invite >= now() - interval 14 day and Referrals.date_invite < now() - interval 7 day
            and Referrals.active = true
        group by Referrals.host_tg_id
    ) as `Referrals_count__week` on Referrals_count__week.referral = Referrals.referral_tg_id
    left join (
        select
            Referrals.host_tg_id as `referral`,
            count(Referrals.host_tg_id) as `referrals_count`
        from Referrals
        where
            Referrals.date_invite >= now() - interval 7 day
            and Referrals.active = true
        group by Referrals.host_tg_id
    ) as `Referrals_count__this_week` on Referrals_count__this_week.referral = Referrals.referral_tg_id
    left join (
        select
            Referrals.host_tg_id as `referral`,
            count(Referrals.host_tg_id) as `referrals_count`
        from Referrals
        where Referrals.active = true
        group by Referrals.host_tg_id
    ) as `Referrals_count__all` on Referrals_count__all.referral = Referrals.referral_tg_id
    left join Users as `Users` on Users.tg_id = Referrals.referral_tg_id
where
    Referrals.host_tg_id = :tg_id
    and Referrals.active = true
order by referrals_count__this_week desc;
