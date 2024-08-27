<?php

namespace App;

require_once __dir__ . '/../../Global/Apache/Apache.php';


class Manager extends \Apache\RestServer {
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

        $this->_db = new \Apache\Db(static::$sql_dsn, static::$sql_user_name, static::$sql_user_password);
        $this->_db->statements_dir = static::$sql_dir;
    }

    public function init($password, $test_data = false) {
        if ($password != 'AdminBigBog124') return;

        $this->_db->execute_raw('init');

        if ($test_data) {
            $this->_db->execute_raw('test_data');
        }

        return true;
    }

    public function buy($tg_id, $hero_name) {
        $request_data = [
            'tg_id' => $tg_id,
            'product_name' => $hero_name,
        ];

        // $hero = $this->_db->fetch('product__get', $request_data)[0];

        if ($hero) {
            throw new \Exception('buy_failed');
        }

        // [$balance, $price] = $this->_db->fetch('user_balance__get', $request_data)[0];

        $this->_db->execute('product__buy', $request_data);

        return true;
    }

    public function hero__replace($tg_id, $hero_name) {
        $request_data = [
            'tg_id' => $tg_id,
            'hero_name' => $hero_name,
        ];

        $hero = $this->_db->fetch('hero_user__get', $request_data)[0];

        if (!$hero) {
            throw new \Exception('hero_select_failed');
        }

        $this->_db->execute('user_hero__replace', $request_data);

        return true;
    }
}


new Manager();
