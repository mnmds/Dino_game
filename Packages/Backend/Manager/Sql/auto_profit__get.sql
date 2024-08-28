select
    `Game`.`energy_date_collect` as `energy_date_collect`,
    `Game`.`energy` as `energy`,
    `Users`.`balance` as `balance`,
    `Users`.`level` as `level`,
    `Users`.`offline_delivery` as `offline_delivery`
from
    `Users`
    left join `Game` on `Game`.`tg_id` = `Users`.`tg_id`
where
    `Users`.`tg_id` = :tg_id;
