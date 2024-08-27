start transaction;
insert into `User_buy` (
    `product_name`,
    `tg_id`
)
values (
    :product,
    :tg_id
);

update `Users`
set balance = balance - (
    select Products.`price`
    from `Products` as `Products`
    where Products.name = :product
)
where tg_id = :tg_id;
commit;
