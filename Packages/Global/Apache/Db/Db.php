<?php

// 17.05.2024


namespace Apache;


class Db extends \Pdo {
    public $_statements = [];
    public $_statements_prepared = [];


    public $statements_dir = '';


    public function _statement__get($key) {
        $this->statement__add($key);

        return $this->_statements[$key];
    }

    public function _statement_prepared__get($key) {
        if (!$this->_statements_prepared[$key]) {
            $statement = $this->_statement__get($key);
            $this->_statements_prepared[$key] = $this->prepare($statement);
        }

        return $this->_statements_prepared[$key];
    }


    public function __construct($dsn, $user_name = '', $user_password = '', $opts = []) {
        $opts += [static::MYSQL_ATTR_LOCAL_INFILE => true];
        parent::__construct($dsn, $user_name, $user_password, $opts);

        $this->setAttribute(static::ATTR_DEFAULT_FETCH_MODE, static::FETCH_ASSOC);
        $this->setAttribute(static::ATTR_ERRMODE, static::ERRMODE_EXCEPTION);
        $this->setAttribute(static::ATTR_STRINGIFY_FETCHES, false);
    }

    public function execute($key, $parameters = []) {
        $statement_prepared = $this->_statement_prepared__get($key);
        $statement_prepared->execute($parameters);

        return $statement_prepared;
    }

    public function execute_raw($key) {
        return $this->exec($this->_statement__get($key));
    }

    public function fetch($key, $parameters = []) {
        $statement_prepared = $this->execute($key, $parameters);
        $data = $statement_prepared->fetchAll();

        return $data;
    }

    public function statement__add($key, $statement = '') {
        if ($this->_statements[$key]) return;

        $this->_statements[$key] = $statement ?: file_get_contents("$this->statements_dir/$key.sql");
    }
}
