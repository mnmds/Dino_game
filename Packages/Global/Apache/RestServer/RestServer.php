<?php

// 13.04.2022


namespace Apache;

require_once __dir__ . '/../Json/Json.php';


class RestServer {
    static public $errorTrace = false;
    static public $gzip_level = 0;
    static public $request_method = '';
    static public $timeLimit = 60;


    public $_data = [];
    public $_method = '';
    public $_method_args = [];
    public $_timeStamp = 0;


    public function _init() {}

    public function _request__parse() {
        if (static::$request_method && $_SERVER['REQUEST_METHOD'] != static::$request_method) {
            throw new \Exception('Request_method');
        }

        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $request_body = file_get_contents('php://input');
            $request_data = Json::parse($request_body);

            $this->_data = $request_data['data'] ?? [];
            $this->_method = $request_data['method'] ?? '';
            $this->_method_args = $request_data['method_args'] ?? [];
        }
        else {
            $this->_method = $_GET['method'] ?? '';
            $this->_method_args = $_GET['method_args'] ?? [];
        }

        if (!$this->_method || str_starts_with($this->_method, '_')) {
            throw new \Exception('Method');
        }
    }

    public function _run() {
        $result = null;

        try {
            $this->_request__parse();
            $this->_init();

            $result = $this->{$this->_method}(...$this->_method_args);
            $result = ['result' => $result];
        }
        catch (\Error $error) {
            $result = ['error' => $error->getMessage()];

            if (static::$errorTrace) {
                $result['errorTrace'] = $error->getTrace();
            }
        }
        catch (\Exception $exception) {
            $result = ['exception' => $exception->getMessage()];

            if (static::$errorTrace) {
                $result['errorTrace'] = $exception->getTrace();
            }
        }

        $result = Json::stringify($result);

        if (static::$gzip_level) {
            $result = gzEncode($result, static::$gzip_level);
            header('Content-Encoding: gzip');
        }

        echo $result;
    }

    public function _timeLimit__check() {
        return microTime(true) - $this->_timeStamp <= static::$timeLimit;
    }


    public function __construct() {
        set_time_limit(0);

        $this->_timeStamp = microTime(true);
        $this->_run();
    }
}
