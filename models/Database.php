<?php 
namespace Penta\Model;

class Database {
    private $host;
    private $db_name;
    private $username;
    private $password;
    public $conn;

    public function __construct() {
        $this->host = $_ENV['DB_HOST'] ?? throw new \Exception("DB_HOST not set in .env file");
        $this->db_name = $_ENV['DB_NAME'] ?? throw new \Exception("DB_NAME not set in .env file");
        $this->username = $_ENV['DB_USERNAME'] ?? throw new \Exception("DB_USERNAME not set in .env file");
        $this->password = $_ENV['DB_PASSWORD'] ?? throw new \Exception("DB_PASSWORD not set in .env file");
        
    }

    public function getConnection() {
        $this->conn = null;
        try {
            $this->conn = new \PDO("mysql:host=" . $this->host . ";dbname=" . $this->db_name, $this->username, $this->password);
            $this->conn->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
        } catch(\PDOException $e) {
            echo "Connection error: " . $e->getMessage();
        }
        return $this->conn;
    }
}
