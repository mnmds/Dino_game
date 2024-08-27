select not `offline_delivery` as `result`
from `Users`
where
    `tg_id` = :tg_id
    and `balance` >= 50000
;
