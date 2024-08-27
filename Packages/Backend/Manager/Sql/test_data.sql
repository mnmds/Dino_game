insert into `Products`
    (`price`, `name`)
values
    (1000, 'Dino'),
    (1001, '1'),
    (1002, '2'),
    (1003, '3'),
    (1004, '4'),
    (1005, '5'),
    (1006, '6'),
    (1007, '7'),
    (1008, '8'),
    (1009, '9');

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
