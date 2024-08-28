update `Users`
join `Game` on `Game`.`tg_id` = `Users`.`tg_id`
set
    `Game`.`energy_date_collect` = %(energy_date_collect)s,
    `Game`.`energy_date_refresh` = %(energy_date_refresh)s,
    `Game`.`energy` = %(energy)s,
    `Users`.`balance` = `Users`.`balance` + %(profit)s
where
    `Users`.`tg_id` = %(tg_id)s;
