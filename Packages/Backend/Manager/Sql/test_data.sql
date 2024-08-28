insert into `Products`
    (`price`, `name`, `resource_url`)
values
    (1000, 'Dino', './Storage/Images/Heroes/Dino.png'),
    (10, 'Duck', './Storage/Images/Heroes/Duck.png'),
    (1001, '1', null),
    (1002, '2', null),
    (1003, '3', null),
    (1004, '4', null),
    (1005, '5', null),
    (1006, '6', null),
    (1007, '7', null),
    (1008, '8', null),
    (1009, '9', null);

insert into `Users`
    (`balance`, `hero_name`, `tg_id`, `level`)
values
    (20001,'Dino', 509815216, 3),
    (20002,'Dino', 1571127511, 1);

insert into `Referrals`
    (`host_tg_id`, `referral_tg_id`)
values
    (509815216, 1571127511);

insert into `User_buy`
    (`product_name`, `tg_id`)
values
    ('1', 509815216),
    ('2', 509815216),
    ('3', 509815216),
    ('Dino', 1571127511),
    ('1', 1571127511);

insert into `Game`
    (`tg_id`)
values
    ('509815216'),
    ('1571127511');
