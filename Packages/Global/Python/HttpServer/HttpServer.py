# 15.08.2024

from http.server import BaseHTTPRequestHandler

from Json.Json import Json


class HttpServer(BaseHTTPRequestHandler):
    @property
    def request_method(self):
        return self.command


    def _get_request__parse(self, get_request):
        object = {}

        if ('?' in get_request):
            query = get_request.split('?')[1]
            params = query.split('&')

            for param in params:
                [key, value] = param.split('=')

                object[key] = value

        return object

    def _request_data__get(self):
        result = None

        if self.request_method == 'POST':
            content_length = int(self.headers['Content-Length'])
            request_body = self.rfile.read(content_length)

            result = Json.parse(request_body)
        else:
            result = self._get_request__parse(self.path)

        return result


    def do_GET(self): pass

    def do_POST(self): pass

    def echo(self, value):
        value = Json.stringify(value)

        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Content-Type', 'application/json')
        self.end_headers()

        try:
            self.wfile.write(value.encode())
        except ConnectionAbortedError:
            pass
