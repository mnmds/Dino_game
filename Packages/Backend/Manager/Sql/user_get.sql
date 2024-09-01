select
    `Game`.`energy` as `energy`,
    `Users`.`balance` as `balance`,
    `Users`.`hero_name` as `hero_name`,
    `Users`.`level` as `level`,
    `Users`.`offline_delivery` as `offline_delivery`,
    `Users`.`newsletter` as `newsletter`
from
    `Users`
    left join `Game` on `Game`.`tg_id` = `Users`.`tg_id`
where
    `Users`.`tg_id` = :tg_id;
