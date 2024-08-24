# 14.08.2024

import json


class Json:
    @staticmethod
    def parse(string):
        return json.loads(string)

    @staticmethod
    def stringify(object):
        return json.dumps(object, ensure_ascii = False)
