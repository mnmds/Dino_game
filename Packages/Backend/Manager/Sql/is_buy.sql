select
    case
        when exists (
            select 1
            from `Products` as `Products`
            where Products.name = :product
        )
        and not exists (
            select 1
            from `User_buy` as `User_buy`
            where User_buy.product_name = :product and User_buy.tg_id = :tg_id
        )
        and exists (
            select 1
            from `Users` as `Users`
            where Users.tg_id = :tg_id and Users.balance >= (
                select Products.price
                from Products Products
                where Products.name = :product
            )
        )
        then true
        else false
    end as `result`
;
