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

        print('Успешное подключение...')
        print('#' * 20)

    def db__clear(self):
        with self.connection.cursor() as cursor:
            tables = ['Referrals', 'Server', 'User_heroes', 'User_newsletter', 'User_quests', 'Newsletter', 'Quests',
                      'Users', 'Products']

            for table in tables:
                print('--' + table)
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

    def __del__(self):
        self.connection__cose()

    def __init__(self):
        self.connection__open()
