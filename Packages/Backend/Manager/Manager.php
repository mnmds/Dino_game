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


    public function _buy($tg_id, $product) {
        $request_data = [
            'tg_id' => $tg_id,
            'product' => $product,
        ];

        $buy = $this->_db->fetch('is_buy', $request_data)[0]['result'];

        if (!$buy) {
            throw new \Exception('buy_failed');
        }

        $statement = $this->_db->execute('buy', $request_data);
        $statement->closeCursor();
    }

    public function _init() {
        static::$sql_dsn =
            'mysql:host=' . static::$sql_host .';' .
            'dbname=' . static::$sql_db_name .';' .
            'charset=' . static::$sql_charset.';'
        ;

        $this->_db = new \Apache\Db(static::$sql_dsn, static::$sql_user_name, static::$sql_user_password);
        $this->_db->statements_dir = static::$sql_dir;
    }


    public function hero__buy($tg_id, $hero_name) {
        try {
            $this->_buy($tg_id, $hero_name);

            $request_data = [
                'hero_name' => $hero_name,
                'tg_id' => $tg_id,
            ];
            $this->_db->execute('user_hero__replace', $request_data);
        }
        catch (\Exception $exception) {
            throw new \Exception($exception->getMessage());
        }

        return true;
    }

    public function hero__replace($tg_id, $hero_name) {
        $request_data = [
            'hero_name' => $hero_name,
            'tg_id' => $tg_id,
        ];
        $hero = $this->_db->fetch('user_hero__get', $request_data)[0];

        if (!$hero) {
            throw new \Exception('hero_select_failed');
        }
        $this->_db->execute('user_hero__replace', $request_data);

        return true;
    }

    public function init($password, $test_data = false) {
        if ($password != 'AdminBigBog124') return;

        $this->_db->execute_raw('init');

        if ($test_data) {
            $this->_db->execute_raw('test_data');
        }

        return true;
    }

    public function level__buy($tg_id, $level) {
        try {
            $user_level = $this->_db->fetch('user_level__get', ['tg_id' => $tg_id])[0]['level'];

            if ($level - $user_level != 1) {
                throw new \Exception('level_buy_failed');
            }

            $this->_buy($tg_id, $level);
            $this->_db->execute('user_level__replace', ['tg_id' => $tg_id]);
        }
        catch (\Exception $exception) {
            throw new \Exception($exception->getMessage());
        }

        return true;
    }

    public function offline_delivery__buy($tg_id) {
        $offline_delivery = $this->_db->fetch('is__offline_delivery', ['tg_id' => $tg_id])[0]['result'];

        if (!$offline_delivery) {
            throw new \Exception('buy_failed');
        }
        $this->_db->fetch('offline_delivery__buy', ['tg_id' => $tg_id]);

        return true;
    }

    public function products__get($tg_id) {
        $request_data = [
            'tg_id' => $tg_id
        ];
        $products = $this->_db->fetch('products__get', $request_data);

        return $products;
    }
}


new Manager();
