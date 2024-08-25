select `id`
from `User_buy`
where
    `product_name`  = :hero_name and
    `tg_id` = :tg_id
