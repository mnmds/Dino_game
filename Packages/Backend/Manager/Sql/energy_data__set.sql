update `Game`
set
    `energy_date_refresh` = :energy_date_refresh,
    `energy` = :energy
where `tg_id` = :tg_id;
