<?php

namespace App;

require_once __dir__ . '/../../Global/Apache/Apache.php';


class Manager extends \Apache\RestServer {
    static public $bot_token = '7439740472:AAGQcG63Uq0iPOFEaVUm1bh5FPUeXT5UEnw';
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

    public function _file_url_telegram__get($file_id) {
        $url = 'https://api.telegram.org/bot' . static::$bot_token . "/getFile?file_id=$file_id";
        $response = file_get_contents($url);
        $data = \Apache\Json::parse($response);

        if (!$data) return;

        $url = 'https://api.telegram.org/file/bot' . static::$bot_token . '/' . $data['result']['file_path'];

        return $url;
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

    public function _user_telegram__get($user_id) {
        $url = 'https://api.telegram.org/bot' . static::$bot_token . "/getChat?chat_id=$user_id";
        $response = file_get_contents($url);
        $data = \Apache\Json::parse($response);

        if (!$data) return;

        return $data['result'];
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
        $data = \Apache\Json::parse($response);

        if (!$data) return;

        $status = $data['result']['status'];

        if ($status != 'member' || $status != 'administrator' || $status != 'creator') return;

        $request_data = [
            'tg_id' => $tg_id,
            'quest_name' => $chanall_url,
        ];
        $user_quests = $this->_db->fetch('user_quests__get', $request_data);

        if (!$user_quests) {
            $request_data = [
                'quest_name' => $chanall_url,
            ];
            $value = $this->_db->fetch('quest_get', $request_data);
            $request_data = [
                'tg_id' => $tg_id,
                'value' => $value,
            ];
            $this->_db->execute('quest__solve', $request_data);
            $request_data = [
                'tg_id' => $tg_id,
                'quest_name' => $chanall_url,
            ];
        }

        return true;
    }

    public function bonus_check($url, $tg_id) {
        $request_data = [
            'tg_id' => $tg_id,
            'quest_name' => $url,
        ];
        $user_quests = $this->_db->fetch('user_quests__get', $request_data);

        if (!$user_quests) {
            $request_data = [
                'quest_name' => $url,
            ];
            $value = $this->_db->fetch('quest_get', $request_data);
            $request_data = [
                'tg_id' => $tg_id,
                'value' => intval($value),
            ];
            $this->_db->execute('quest__solve', $request_data);
            $request_data = [
                'tg_id' => $tg_id,
                'quest_name' => $url,
            ];
            $this->_db->execute('user_quests__add', $request_data);
        }

        return true;
    }

    public function time_quest($tg_id) {
        $request_data = [
            'tg_id' => $tg_id,
            'quest_name' => 'timeQuest',
        ];
        $user_quests = $this->_db->fetch('user_quests__get', $request_data);

        if (!$user_quests) {
            $request_data = [
                'quest_name' => 'timeQuest',
            ];
            $request_data = [
                'tg_id' => $tg_id,
                'value' => 1000,
            ];
            $this->_db->execute('quest__solve', $request_data);
            $request_data = [
                'tg_id' => $tg_id,
                'quest_name' => 'timeQuest',
            ];
            $this->_db->execute('user_quests__add', $request_data);
        }
        else {
            $date = $user_quests[0]['date_quest'];
            $date = new \DateTime($date);
            $newDate = $date->format('Y-m-d');
            date_default_timezone_set("Europe/Moscow");
            $today = date('Y-m-d');
            if ($newDate !== $today) {
                return $today;
            } else {
                $request_data = [
                    'tg_id' => $tg_id,
                    'value' => 1000,
                ];
                $this->_db->execute('quest__solve', $request_data);
                $request_data = [
                    'tg_id' => $tg_id,
                    'quest_name' => 'timeQuest',
                ];
                $this->_db->execute('user_quests__add', $request_data);
            }
        }

        return true;
    }

    public function referrals__get($tg_id) {
        $request_data = [
            'tg_id' => $tg_id,
        ];
        $referrals = $this->_db->fetch('referrals__get', $request_data);

        foreach ($referrals as &$referral) {
            $user_telegram = $this->_user_telegram__get($referral['tg_id']);
            $file_url = $this->_file_url_telegram__get($user_telegram['photo']['big_file_id']);

            $referral += [
                'image_url' =>$file_url,
                'user_name' => trim($user_telegram['first_name'] . ' ' . $user_telegram['last_name']),
            ];
        }

        return $referrals;
    }

    public function user_get($tg_id) {
        $this->game__sync($tg_id);

        $request_data = [
            'tg_id' => $tg_id,
        ];

        $result = [];
        $result = $this->_db->fetch('user_get', $request_data)[0];
        $quests_get = $this->_db->fetch('quests_get');

        $result += [
            'quests' => $quests_get,
            'referrals' => $this->referrals__get($tg_id),
            'shop' => $this->products__get($tg_id),
        ];

        return $result;
    }

    public function newsletter_set($tg_id, $key) {
        $request_data = [
            'tg_id' => $tg_id,
            'key' => (int)$key,
        ];
        $this->_db->execute('newsletter_data__set', $request_data);

        return true;
    }
}


new Manager();
