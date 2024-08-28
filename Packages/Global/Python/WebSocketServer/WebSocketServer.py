# 28.08.2024

import sys, os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname('WebSocketServer.py'), '../')))

import base64
import hashlib
import socket
import threading
import time

from Json.Json import Json


class WebSocketServer:
    clients_count = 0


    def __init__(self, host, port):
        self._client_count_lock = threading.Lock()
        self._host = host
        self._method = ''
        self._method_args = []
        self._port = port
        self._server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self._timeStamp = 0


    def _handshaking__close(self, client_socket):
        # print('Client requested to close the connection.')

        close_frame = bytearray([0x88, 0x00])
        client_socket.send(close_frame)

    def _handshaking__open(self, client_socket):
        request = client_socket.recv(1024).decode('utf-8')
        headers = request.split('\r\n')
        key = None

        for header in headers:
            if ('Sec-WebSocket-Key' in header):
                key = header.split(': ')[1]
                break

        accept_key = base64.b64encode(hashlib.sha1((key + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11').encode()).digest()).decode()

        response = (
            'HTTP/1.1 101 Switching Protocols\r\n'
            'Upgrade: websocket\r\n'
            'Connection: Upgrade\r\n'
            f'Sec-WebSocket-Accept: {accept_key}\r\n'
            '\r\n'
        )
        client_socket.send(response.encode('utf-8'))

    def _init(self):
        pass

    def _message__decode(self, data):
        length = data[1] & 127
        start = 2

        if (length == 126):
            length = int.from_bytes(data[2:4], 'big')
            start = 4
        elif (length == 127):
            length = int.from_bytes(data[2:10], 'big')
            start = 10

        masks = data[start:start + 4]
        message = bytearray()

        for i in range(length):
            message.append(data[start + 4 + i] ^ masks[i % 4])

        return message.decode('utf-8')

    def _message__get(self, client_socket):
        with self._client_count_lock:
            self.clients_count += 1
            # print(f'Client connected. Total clients: {self.clients_count}')

        while True:
            try:
                data = client_socket.recv(1024)

                if not data: break

                if (data[0] == 0x88):
                    self._handshaking__close(client_socket)
                    break

                self._init()

                request_data = self._message__decode(data)
                request_data = Json.parse(request_data)
                self._method = request_data.get('method', '')
                self._method_args = request_data.get('method_args', [])
                self._timeStamp = time.time()

                # print(f'method: {self._method}', f'method_args: {self._method_args}')
                method = getattr(self, self._method, None)

                if callable(method):
                    result = method(*self._method_args)
                else:
                    raise Exception('Method')

                result = {'result': result}

                self._message__send(client_socket, result)
            except Exception as exception:
                print(f'Exception: {exception}')
                result = {'exception': str(exception)}
                self._message__send(client_socket, result)

                # break

        with self._client_count_lock:
            self.clients_count -= 1
            # print(f'Client disconnected. Total clients: {self.clients_count}')

        client_socket.close()

    def _message__send(self, client_socket, message):
        message = Json.stringify(message)
        message_bytes = message.encode('utf-8')
        length = len(message_bytes)

        if (length <= 125):
            frame = bytearray([129]) + bytearray([length]) + message_bytes
        elif (length >= 126 and length <= 65535):
            frame = bytearray([129]) + bytearray([126]) + length.to_bytes(2, 'big') + message_bytes
        else:
            frame = bytearray([129]) + bytearray([127]) + length.to_bytes(8, 'big') + message_bytes

        client_socket.send(frame)


    def run(self):
        self._server_socket.bind((self._host, self._port))
        self._server_socket.listen(5)

        print(f'Echo server started on {self._host}:{self._port}')

        while (True):
            client_socket, client_address = self._server_socket.accept()
            self._handshaking__open(client_socket)
            threading.Thread(target=self._message__get, args=(client_socket,)).start()
            # print(f'New connection from {client_address}')
