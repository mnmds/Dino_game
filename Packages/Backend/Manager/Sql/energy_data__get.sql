select
    `Game`.`energy_date_refresh` as `energy_date_refresh`,
    `Game`.`energy` as `energy`,
    `Users`.`level` as `level`
from
    `Users`
    left join `Game` on `Game`.`tg_id` = `Users`.`tg_id`
where
    `Users`.`tg_id` = :tg_id;

