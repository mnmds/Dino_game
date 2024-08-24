# 17.08.2024

import pymysql


class Db(pymysql):
    _connection = None
    _db_name = ''
    _db_port = 0
    _db_url = ''
    _user_name = ''
    _user_password = ''


    def connection__cose(self):
        self._connection.close()

    def connection__open(self):
        self._connection = self.connect(
            cursorclass = self.cursors.DictCursor,
            database = self._db_name,
            host = self._db_url,
            password = self._user_password,
            port = self._db_port,
            user = self._user_name,
        )

        cursor = self._connection.cursor()
        cursor.execute('set session query_cache_type = off;')
        self._connection.commit()


    def _statement__get(self, key):
        if not this._statements[key]:
            with open(f'{self.statements_dir}/{key}.sql', 'r') as query:
                self._statements[key] = query.read()

        return this._statements[key]


    def execute(self, key, parameters = {}):
        with self._connection.cursor() as statement_prepared:
            statement_prepared.execute(self._statement__get(key), parameters)
            self._connection.commit()

    def fetch(self, key, parameters = {}):
        with self._connection.cursor() as statement_prepared:
            statement_prepared.execute(self._statement__get(key), parameters)
            result = statement_prepared.fetchall()

            return result


    def __del__(self):
        self.connection__cose()

    def __init__(self, db_name, db_port, db_url, user_name, user_password):
        self._db_name = db_name
        self._db_port = db_port
        self._db_url = db_url
        self._user_name = user_name
        self._user_password = user_password
        self._statements = {}

        self.statements_dir = ''

        self.connection__open()
