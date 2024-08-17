<?php

// 29.07.2024


namespace Apache;


class Http {
    static public $_cache = [];


    static function _fetch_opts__proc($fetch_opts) {
        $fetch_opts_processed = [
            CURLOPT_HEADER => true,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_SSL_VERIFYPEER => false,
        ];

        if ($fetch_opts['body']) {
            $fetch_opts_processed[CURLOPT_POSTFIELDS] = $fetch_opts['body'];
        }

        if (is_array($fetch_opts['headers'])) {
            $f = fn ($key, $value) => "$key: $value";
            $fetch_opts_processed[CURLOPT_HTTPHEADER] = array_map($f, array_keys($fetch_opts['headers']), array_values($fetch_opts['headers']));
        }

        if ($fetch_opts['method']) {
            $fetch_opts_processed[CURLOPT_CUSTOMREQUEST] = mb_strToUpper($fetch_opts['method']);
        }

        return $fetch_opts_processed;
    }

    static function _fetch_response__proc($response_raw) {
        $response_raw_parts = explode("\r\n\r\n", $response_raw, 2);
        $response_headers_strings = explode("\r\n", $response_raw_parts[0]);
        $response_status_string = array_shift($response_headers_strings);

        $response = [
            'body' => $response_raw_parts[1],
            'headers' => [],
            'status' => explode(' ', $response_status_string)[1],
        ];

        forEach ($response_headers_strings as $response_header_string) {
            $response_header_string_parts = explode(': ', $response_header_string);
            $response_header_key = mb_strToLower($response_header_string_parts[0]);
            $response_header_value = $response_header_string_parts[1];
            $response['headers'][$response_header_key] = $response_header_value;
        }

        return $response;
    }


    static function fetch($url, $cache = false, $opts = []) {
        if ($cache && static::$_cache[$url]) {
            return static::$_cache[$url];
        }

        $curl_handle = curl_init($url);
        $opts_processed = static::_fetch_opts__proc($opts);
        curl_setopt_array($curl_handle, $opts_processed);

        $response_raw = curl_exec($curl_handle);

        if (!$response_raw) return null;

        $response = static::_fetch_response__proc($response_raw);

        if ($cache) {
            static::$_cache[$url] = $response;
        }

        return $response;
    }
}
