drop table if exists `Referrals`;
drop table if exists `Server`;
drop table if exists `User_buy`;
drop table if exists `User_quests`;
drop table if exists `Game`;
drop table if exists `PromoCodes`;
drop table if exists `Quests`;
drop table if exists `Users`;
drop table if exists `Products`;


create table if not exists `Products` (
    `id` int auto_increment,
    `price` int default 0,
    `description` text,
    `name` varchar(255) not null,
    `resource_url` text,

    primary key (`id`),
    unique key (`name`)
);

create table if not exists `Users` (
    `balance` int default 0,
    `date_registration` dateTime default current_timeStamp,
    `hero_name` varchar(255) default 'Dino',
    `id` int auto_increment,
    `level` int default 1,
    `newsletter` boolean default false,
    `offline_delivery` boolean default false,
    `taps` int default 0,
    `tg_id` int not null,
    `week_balance` int default 0,
    `week_prev_balance` int default 0,

    foreign key (`hero_name`) references Products(`name`),
    primary key (`id`),
    unique key (`tg_id`)
);

create table if not exists `Game` (
    `energy_date_collect` real default -1,
    `energy_date_refresh` real default -1,
    `energy` real default 1000,
    `id` int auto_increment,
    `tg_id` int not null,

    foreign key (`tg_id`) references Users(`tg_id`),
    primary key (`id`),
    unique key (`tg_id`)
);

create table if not exists `PromoCodes` (
    `description` text,
    `id` int auto_increment,
    `name` varchar(255) not null,
    `url` text,
    `used` boolean default false,

    primary key (`id`),
    unique key (`name`)
);

create table if not exists `Quests` (
    `description` text,
    `id` int auto_increment,
    `name` varchar(255) not null,
    `url` text not null,

    primary key (`id`),
    unique key (`name`)
);

create table if not exists `Referrals` (
    `active` boolean default false,
    `date_invite` dateTime default current_timeStamp,
    `host_tg_id` int not null,
    `id` int auto_increment,
    `referral_tg_id` int not null,

    foreign key (`host_tg_id`) references Users(`tg_id`),
    foreign key (`referral_tg_id`) references Users(`tg_id`),
    primary key (`id`)
);

create table if not exists `Server` (
    `id` int auto_increment,
    `key` varchar(255) not null,
    `value` text not null,

    primary key (`id`),
    unique key (`key`)
);

create table if not exists `User_buy` (
    `date_buy` dateTime default current_timeStamp,
    `id` int auto_increment,
    `product_name` varchar(255) not null,
    `tg_id` int not null,

    foreign key (`product_name`) references Products(`name`),
    foreign key (`tg_id`) references Users(`tg_id`),
    primary key (`id`)
);

create table if not exists `User_quests` (
    `date_quest` dateTime default current_timeStamp,
    `id` int auto_increment,
    `quest_name` varchar(255) not null,
    `tg_id` int not null,

    foreign key (`tg_id`) references Users(`tg_id`),
    primary key (`id`)
);

insert into `Products`
    (`price`, `name`, `resource_url`)
values
    (0, 'Dino', './Storage/Images/Heroes/Dino.png'),
    (0, '1', null),
    (100000, '2', null),
    (200000, '3', null),
    (500000, '4', null),
    (1000000, '5', null),
    (5000000, '6', null),
    (10000000, '7', null),
    (100000000, '8', null),
    (1000000000, '9', null);
