import sys, os, time
sys.path.append(os.path.abspath(os.path.join(os.path.dirname('Game_manager.py'), '../../Global/Python')))

from Python import WebSocketServer, Db


class Game_manager(WebSocketServer):
    _clients__data = {}
    _db = None
    _refresh_interval = 10
    _save_interval = 30


    def _energy__refresh(self, tg_id):
        recovery_factor = (100 * self._clients__data[tg_id]['level']) / 60
        time_profit = (self._timeStamp - self._clients__data[tg_id]['energy_date_refresh']) * recovery_factor
        energy = self._clients__data[tg_id]['energy'] + time_profit
        energy_max = 1000 * self._clients__data[tg_id]['level']

        self._clients__data[tg_id]['energy'] = energy if energy < energy_max else energy_max
        self._clients__data[tg_id]['energy_date_refresh'] = self._timeStamp

    def _user__get(self, tg_id):
        self._clients__data[tg_id] = self._db.fetch('user__get', {'tg_id': tg_id})[0]

    def _user__save(self, tg_id):
        request_data = {
            'energy': self._clients__data[tg_id]['energy'],
            'energy_date_refresh': self._clients__data[tg_id]['energy_date_refresh'],
            'profit': self._clients__data[tg_id]['tap'],
            'tg_id': tg_id,
        }
        self._db.execute('user__save', request_data)

        self._clients__data[tg_id]['date_save'] = self._timeStamp
        self._clients__data[tg_id]['tap'] = 0


    def clients_count__get(self):
        return self.clients_count

    def points__ping(self, tg_id):
        if not tg_id in self._clients__data:
            self._user__get(tg_id)
            self._clients__data[tg_id]['tap'] = 0
            self._clients__data[tg_id]['date_save'] = self._timeStamp
            self._clients__data[tg_id]['energy_date_refresh'] = self._timeStamp

        if self._clients__data[tg_id]['energy'] - 1 >= 0:
            self._clients__data[tg_id]['energy'] -= 1
            self._clients__data[tg_id]['tap'] += self._clients__data[tg_id]['level']

        if (self._timeStamp - self._clients__data[tg_id]['energy_date_refresh']) >= self._refresh_interval:
            self._energy__refresh(tg_id)

        if (self._timeStamp - self._clients__data[tg_id]['date_save']) >= self._save_interval:
            self._user__save(tg_id)

        response = {
            'energy': self._clients__data[tg_id]['energy'],
            'profit': self._clients__data[tg_id]['tap'],
        }

        return response


    def __init__(self):
        super().__init__('localhost', 8000)

        self._db = Db(
            'Dino_game',
            3306,
            '127.0.0.1',
            'root',
            '',
        )

        self._db.statements_dir = os.path.abspath(os.path.join(os.path.dirname('Game_manager.py'), './Sql'))
        self.run()


Game_manager()
