# 15.08.2024

import cgi
import gzip
import time
import traceback
import sys

from HttpServer.HttpServer import HttpServer
from Json.Json import Json


class RestServer(HttpServer):
    error_trace = False
    gzip_level = 0
    request_method_server = ''
    time_limit = 60


    def _init(self): pass

    def _request__parse(self):
        if self.request_method_server and self.request_method != self.request_method_server:
            raise Exception('Request_method')

        request_data = self._request_data__get()
        self._data = request_data
        # self._data = request_data.get('data', [])
        self._method = request_data.get('method', '')
        self._method_args = request_data.get('method_args', [])
        self._method_args = Json.parse(self._method_args) if isinstance(self._method_args, str) else self._method_args



        if not self._method or self._method.startswith('_'):
            raise Exception('Method')

    def _run(self):
        result = None
        self._time_stamp = time.time()

        try:
            self._request__parse()
            self._init()

            method = getattr(self, self._method, None)

            if callable(method):
                result = method(*self._method_args)
            else:
                raise Exception('Method')

            result = {'result': result}
        except Exception as exception:
            result = {'exception': str(exception)}

            if self.error_trace:
                result['errorTrace'] = traceback.format_exc()

        if self.gzip_level:
            result = gzip.compress(Json.stringify(result).encode(), self.gzip_level)
            self.send_header('Content-Encoding', 'gzip')

        self.echo(result)


    def do_GET(self):
        self._run()

    def do_POST(self):
        super().do_POST()
        self._run()


    def __init__(self, *args):
        super().__init__(*args)

        self._data = []
        self._method = ''
        self._method_args = []
        self._time_stamp = 0

