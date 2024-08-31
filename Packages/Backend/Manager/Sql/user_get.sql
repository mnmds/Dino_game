select
    `Game`.`energy` as `energy`,
    `Users`.`level` as `level`,
    `Users`.`balance` as `balance`,
from
    `Users`
    left join `Game` on `Game`.`tg_id` = `Users`.`tg_id`
where
    `Users`.`tg_id` = :tg_id;
