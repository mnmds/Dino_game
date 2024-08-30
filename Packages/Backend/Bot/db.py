import pymysql


class DataBase:
    def connection__cose(self):
        self.connection.close()

    def connection__open(self):
        self.connection = pymysql.connect(
            host='127.0.0.1',
            port=3306,
            user='root',
            password='',
            database='Dino_game',
            cursorclass=pymysql.cursors.DictCursor
        )

        # print('Успешное подключение...')
        # print('#' * 20)

    def db__clear(self):
        with self.connection.cursor() as cursor:
            tables = ['Referrals', 'Server', 'User_heroes', 'User_newsletter', 'User_quests', 'Newsletter', 'Quests',
                      'Users', 'Products']

            for table in tables:
                # print('--' + table)
                cursor.execute(f'delete from `{table}`')

            self.connection.commit()

    def init(self):
        with self.connection.cursor() as cursor:
            cursor.execute('set session query_cache_type = off;')

            self.connection.commit()

    def user__add(self, tg_id):
        with self.connection.cursor() as cursor:
            insert_query = f'''
                insert into `Users` (
                    tg_id
                )
                values (
                    {tg_id}
                );
            '''

            cursor.execute(insert_query)
            self.connection.commit()

    def user__get(self, tg_id):
        with self.connection.cursor() as cursor:
            select_all_rows = f'''
                select `id`
                from `Users`
                where tg_id = {tg_id};
            '''
            cursor.execute(select_all_rows)
            user = cursor.fetchone()

            return user

    def user__get_info(self, tg_id):
        with self.connection.cursor() as cursor:
            select_all_rows = f'''
                select balance, date_registration,  level, hero_name
                from `Users`
                where `tg_id` = {tg_id};
            '''
            cursor.execute(select_all_rows)
            user_info = cursor.fetchone()

            return user_info

    def users__get_all(self):
        with self.connection.cursor() as cursor:
            select_all_rows = f'''
                select `tg_id`
                from `Users`;
            '''
            cursor.execute(select_all_rows)
            users = cursor.fetchall()

            return users

    def users__get_col_for_date(self, interval=0):
        with self.connection.cursor() as cursor:
            if interval:
                select_all_rows = f'''
                    select count(*) as `col` 
                    from `Users` 
                    where `date_registration` >= now() - interval {interval} day; 
                '''
            else:
                select_all_rows = f'''
                    select count(*) as `col` 
                    from `Users`; 
                '''
            cursor.execute(select_all_rows)
            user = cursor.fetchone()

            return user

    def users__get_col_for_level(self, level):
        with self.connection.cursor() as cursor:
            select_all_rows = f'''
                select count(*) as `col` 
                from `Users` 
                where `level` = {level}; 
            '''

            cursor.execute(select_all_rows)
            user = cursor.fetchone()

            return user

    def referral__get(self, tg_id):
        with self.connection.cursor() as cursor:
            select_all_rows = f'''
                select `id`
                from `Referrals`
                where referral_tg_id = {tg_id};
            '''
            cursor.execute(select_all_rows)
            referral = cursor.fetchone()

            return referral

    def referral__add(self, host_tg_id, referral_tg_id):
        with self.connection.cursor() as cursor:
            insert_query = """
            INSERT INTO Referrals (host_tg_id, referral_tg_id)
            VALUES (%s, %s)
            """
            cursor.execute(insert_query, (host_tg_id, referral_tg_id))

            # update_query_host = f'''
            #     update `Users`
            #     set `passive_bonuses_balanse` = `passive_bonuses_balanse` + {payment}
            #     where`tg_id` = {host_tg_id};
            # '''
            # cursor.execute(update_query_host)
            #
            # update_query_referal = f'''
            #     update `Users`
            #     set `passive_bonuses_balanse` = `passive_bonuses_balanse` + {payment}
            #     where`tg_id` = {referral_tg_id};
            # '''
            # cursor.execute(update_query_referal)

            self.connection.commit()

    def quests__add_quest(self, name, description, url):
        with self.connection.cursor() as cursor:
            insert_query = f'''
                insert into `Quests` (
                    `name`,
                    `description`,
                    `url`
                )
                values (
                    '{name}',
                    '{description}',
                    '{url}'
                );
            '''
            cursor.execute(insert_query)

            self.connection.commit()

    def quests__get(self):
        with self.connection.cursor() as cursor:
            select_all_rows = f'''
                select name, description, url
                from `Quests`;
            '''
            cursor.execute(select_all_rows)
            return cursor.fetchall()

    def promocodes__add_promocode(self, name):
        with self.connection.cursor() as cursor:
            insert_query = f'''
                insert into `PromoCodes` (
                    `name`
                )
                values (
                    '{name}'
                );
            '''
            cursor.execute(insert_query)

            self.connection.commit()

    def promocodes__get(self):
        with self.connection.cursor() as cursor:
            select_all_rows = f'''
                select name
                from `PromoCodes`;
            '''
            cursor.execute(select_all_rows)
            return cursor.fetchall()

    def products__add_product(self, name, price):
        with self.connection.cursor() as cursor:
            insert_query = f'''
                insert into `Products` (
                    `name`,
                    `price`
                )
                values (
                    '{name}',
                    '{price}'
                );
            '''
            cursor.execute(insert_query)

            self.connection.commit()

    def products__get(self):
        with self.connection.cursor() as cursor:
            select_all_rows = f'''
                select price, description, name, resource_url
                from `Products`;
            '''
            cursor.execute(select_all_rows)
            return cursor.fetchall()

    def newsletters__add_newsletter(self, description, name, url):
        with self.connection.cursor() as cursor:
            insert_query = f'''
                insert into `Newsletter` (
                    `name`,
                    `description`,
                    `url`
                )
                values (
                    '{name}',
                    '{description}',
                    '{url}'
                );
            '''
            cursor.execute(insert_query)

            self.connection.commit()

    def newsletters__get(self):
        with self.connection.cursor() as cursor:
            select_all_rows = f'''
                select description, name, url
                from `Newsletter`;
            '''
            cursor.execute(select_all_rows)
            return cursor.fetchall()

    # def table__get_for_name(self, table):
    #     with self.connection.cursor() as cursor:
    #         select_all_rows = f'''
    #             select *
    #             from `{table}`;
    #         '''
    #         cursor.execute(select_all_rows)
    #         quests = cursor.fetchall()
    #
    #         return quests

    def table__remove_for_name(self, table, name):
        with self.connection.cursor() as cursor:
            insert_query = f'''
                delete from `{table}` where `name` = '{name}';
            '''
            cursor.execute(insert_query)

            self.connection.commit()

    def __del__(self):
        self.connection__cose()

    def __init__(self):
        self.connection__open()
