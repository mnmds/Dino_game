update `Users`
set
    `balance` = balance - 50000,
    `offline_delivery` = true
where `tg_id` = :tg_id;
