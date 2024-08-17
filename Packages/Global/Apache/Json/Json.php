<?php

// 04.11.2022


namespace Apache;


class Json {
    static public function parse($string) {
        return json_decode($string, true, 512, JSON_BIGINT_AS_STRING);
    }

    static public function stringify($object, $indents = false) {
        $flags = JSON_NUMERIC_CHECK | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE;

        if ($indents) {
            $flags |= JSON_PRETTY_PRINT;
        }

        return json_encode($object, $flags);
    }
}
