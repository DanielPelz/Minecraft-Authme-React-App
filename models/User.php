<?php

namespace Penta\Model;

class User
{
    private $conn;
    private $table_name = "authme";
    private $CHARS;

    const SALT_LENGTH = 16;

    private static function initCharRange()
    {
        return array_merge(range('0', '9'), range('a', 'f'));
    }

    protected function hash($password)
    {
        $salt = $this->generateSalt();
        return '$SHA$' . $salt . '$' . hash('sha256', hash('sha256', $password) . $salt);
    }

    /**
     * @return string randomly generated salt
     */
    private function generateSalt()
    {
        $maxCharIndex = count($this->CHARS) - 1;
        $salt = '';
        for ($i = 0; $i < self::SALT_LENGTH; ++$i) {
            $salt .= $this->CHARS[mt_rand(0, $maxCharIndex)];
        }
        return $salt;
    }
    public function __construct($db)
    {
        $this->conn = $db;
        $this->CHARS = self::initCharRange();
    }
    public function passwordCompare($rawHash, $password)
    {
        $parts = explode('$', $rawHash);

        if (count($parts) === 4) {
            $hash = hash('sha256', $password);
            $hash = hash('sha256', $hash . $parts[2]);

            return $hash === $parts[3];
        }

        return FALSE;
    }


    public function getSkinData($username)
    {
        $query = "SELECT skin_data FROM minecraft_skins WHERE username = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $username);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $row = $stmt->fetch(\PDO::FETCH_ASSOC);
            return $row['skin_data'];
        }
        return null;
    }

    public function saveSkinData($username, $skinData)
    {
        $query = "INSERT INTO minecraft_skins (username, skin_data) VALUES (?, ?) ON DUPLICATE KEY UPDATE skin_data = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $username);
        $stmt->bindParam(2, $skinData);
        $stmt->bindParam(3, $skinData);
        $stmt->execute();
    }

    public function login($username, $password)
    {
        try {
            // Only select necessary columns (username and password)
            $query = "SELECT username, password FROM " . $this->table_name . " WHERE username = ?";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(1, $username);
            $stmt->execute();

            if ($stmt->rowCount() > 0) {
                $row = $stmt->fetch(\PDO::FETCH_ASSOC);
                $storedHash = $row['password'];
                // Use password_verify or an equivalent secure method to compare passwords
                if ($this->passwordCompare($storedHash, $password)) {
                    return $row;  // or just return true since login was successful
                }
            }
        } catch (\PDOException $e) {
            // Handle DB errors, possibly log them
            error_log($e->getMessage());
        }

        return false;
    }
}
