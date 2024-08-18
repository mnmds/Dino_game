<?php

namespace App;

require_once __dir__ . '/../../Global/Apache/Apache.php';

use Apache\RestServer;
use Apache\Db;

class Game_manager extends RestServer {
    static public $request_method = '';
    static public $sql_charset = 'utf8';
    static public $sql_db_name = 'Dino_game';
    static public $sql_dir = __dir__ . '/Sql';
    static public $sql_dsn = '';
    static public $sql_host = '127.0.0.1';
    static public $sql_user_name = 'root';
    static public $sql_user_password = '';


    public $_db = null;


    public function _init() {
        static::$sql_dsn =
            'mysql:host=' . static::$sql_host .';' .
            'dbname=' . static::$sql_db_name .';' .
            'charset=' . static::$sql_charset.';'
        ;

        // $this->_db = new Db(static::$sql_dsn, static::$sql_user_name, static::$sql_user_password);
        // $this->_db->statements_dir = static::$sql_dir;
    }

    public function on_tap($tg_id) {
        // $request_data = [
        //     'tg_id' => $tg_id,
        // ];

        // $user_date = $this->_db->fetch('user__get', $request_data)[0];

        return true;
    }
}


new Game_manager();
