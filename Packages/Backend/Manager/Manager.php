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


    public function _auto_profit__sync($tg_id) {
        $request_data = [
            'tg_id' => $tg_id,
        ];
        $energy_data = $this->_db->fetch('auto_profit__get', $request_data)[0];

        if (!$energy_data['offline_delivery'] || $energy_data['energy'] <= 0) return;

        $recovery_factor = 1000 / (3600 * 3) * $energy_data['level'];
        $time_profit = ($this->_timeStamp - $energy_data['energy_date_collect']) * $recovery_factor;

        $request_data += [
            'balance' => intval($time_profit),
            'energy_date_collect' => $this->_timeStamp,
        ];
        $statement = $this->_db->execute('auto_profit__set', $request_data);
        $statement->closeCursor();

        return true;
    }

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

    public function _energy__sync($tg_id) {
        $request_data = [
            'tg_id' => $tg_id,
        ];
        $energy_data = $this->_db->fetch('energy_data__get', $request_data)[0];

        $recovery_factor = (100 * $energy_data['level']) / 60;
        $time_profit = ($this->_timeStamp - $energy_data['energy_date_refresh']) * $recovery_factor;
        $energy = $energy_data['energy'] + $time_profit;
        $energy_max = 1000 * $energy_data['level'];

        $request_data += [
            'energy' => $energy < $energy_max ? $energy : $energy_max,
            'energy_date_refresh' => $this->_timeStamp,
        ];
        $statement = $this->_db->execute('energy_data__set', $request_data);
        $statement->closeCursor();

        return true;
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


    public function game__sync($tg_id) {
        $this->_auto_profit__sync($tg_id);
        $this->_energy__sync($tg_id);

        return true;
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
        $hero = $this->_db->fetch('user_hero__get', $request_data)[0]['id'];

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

    public function tg_subscribe__check($chanall_url, $tg_id) {
        $parsedUrl = parse_url($chanall_url);
        $path = $parsedUrl['path'];
        $chanall_url = ltrim($path, '/');

        $url = 'https://api.telegram.org/bot' . static::$bot_token . "/getChatMember?chat_id=@$chanall_url&user_id=$tg_id";
        $response = file_get_contents($url);
        $data = \Json::parse($response);

        if (!$data) return;

        $status = $data['result']['status'];

        if ($status != 'member' || $status != 'administrator' || $status != 'creator') return;

        $request_data = [
            'tg_id' => $tg_id,
        ];
        $user_quests = $this->_db->fetch('user_quests__get', $request_data);

        if (!$user_quests) {
            $this->_db->execute('user_quests__add', $request_data);
        }

        $this->_db->execute('quest_tg__solve', $request_data);

        return true;
    }

    public function referrals__get($tg_id, $interval, $type) {
        $request_data = [
            'tg_id' => $tg_id,
        ];
        $result = [];

        if ($type == 'referral') {
            if ($interval == 'this_week') {
                $result = $this->_db->fetch('referrals__get_this_week', $request_data);
            }
            else if ($interval == 'last_week') {
                $result = $this->_db->fetch('referrals__get_prew_week', $request_data);
            }
            else if ($interval == 'this_week') {
                $result = $this->_db->fetch('referrals__get_all_time', $request_data);
            }

        }
        else {
            $result = $this->_db->fetch('income__get', $request_data);
        }

        return $result;
    }

    public function user_get($tg_id) {
        $this->game__sync($tg_id);

        $request_data = [
            'tg_id' => $tg_id,
        ];

        $result = $this->_db->fetch('user_get', $request_data);
        $quests_get = $this->_db->fetch('quests_get');

        $result += [
            'quests' => $quests_get,
            'shop' => $this->products__get($tg_id),
        ];

        return $result;
    }
}


new Manager();
