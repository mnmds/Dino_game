# 17.08.2024

import pymysql


class Db(pymysql.connect):
    _db_name = ''
    _db_port = 0
    _db_url = ''
    _user_name = ''
    _user_password = ''


    def _statement__get(self, key):
        if (not key in self._statements):
            with open(f'{self.statements_dir}/{key}.sql', 'r') as query:
                self._statements[key] = query.read()

        return self._statements[key]


    def execute(self, key, parameters = {}):
        with self.cursor() as statement_prepared:
            statement_prepared.execute(self._statement__get(key), parameters)
            self.commit()

    def fetch(self, key, parameters = {}):
        with self.cursor() as statement_prepared:
            statement_prepared.execute(self._statement__get(key), parameters)
            result = statement_prepared.fetchall()
            self.commit()

            return result


    def __init__(self, db_name, db_port, db_url, user_name, user_password):
        self._db_name = db_name
        self._db_port = db_port
        self._db_url = db_url
        self._user_name = user_name
        self._user_password = user_password
        self._statements = {}

        super().__init__(
            cursorclass = pymysql.cursors.DictCursor,
            database = self._db_name,
            host = self._db_url,
            password = self._user_password,
            port = self._db_port,
            user = self._user_name
        )

        self.statements_dir = ''
