update `Users`
join `Game` on `Game`.`tg_id` = `Users`.`tg_id`
set
    `Game`.`energy_date_collect` = :energy_date_collect,
    `Users`.`balance` = `Users`.`balance` + :balance
where
    `Users`.`tg_id` = :tg_id;
