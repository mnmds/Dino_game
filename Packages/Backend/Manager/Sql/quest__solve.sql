update `Users`
set `balance` = `balance` + :value
where `tg_id` = :tg_id;
