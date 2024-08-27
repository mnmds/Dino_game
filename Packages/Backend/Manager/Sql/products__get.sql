-- select distinct
select
    Products.`price`,
    Products.`description`,
    Products.`name`,
    Products.`resource_url`,

    case
        when
            Users.hero_name = Products.name
            or Users.level = Products.name
        then 'selected'
        when
            User_buy.product_name is null
        then 'sale'
        else 'sold'
    end as `status`

from
    `Products` as `Products`
left join
    `User_buy` as `User_buy` on
        Products.name = User_buy.product_name
        AND User_buy.tg_id = :tg_id
left join
    `Users` as `Users` on
        (Users.hero_name = Products.name
        or Users.level = Products.name)
        AND Users.tg_id = User_buy.tg_id
order by
    Products.name asc;
