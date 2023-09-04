<?php

namespace Penta\Controller;

use Penta\Model\Database;
use Penta\Model\User;

class UserController
{
    private $db;
    private $user;

    public function __construct()
    {
        $this->db = (new Database())->getConnection();
        $this->user = new User($this->db);
    }

    public function getMinecraftSkin($username)
    {
        $uuid = $this->fetchUuid($username);
        if (!$uuid) {
            return null;  // Return null if UUID isn't fetched
        }

        $skinData = $this->fetchSkinData($uuid);
        if (!$skinData) {
            return null;  // Return null if skin data isn't fetched
        }

        // This is the logic from your old function to decode the base64 skin URL
        $decodedData = json_decode(base64_decode($skinData['properties'][0]['value']));
        if (!$decodedData || !isset($decodedData->textures->SKIN->url)) {
            return null;  // Return null if URL is not found in the decoded data
        }

        // Given the error, it seems this is already a base64 encoded image, so you can just return it.
        return $decodedData->textures->SKIN->url;
    }

    public function getOrFetchMinecraftSkin($username)
    {
        // Try to get the skin URL from the database
        $skinUrl = $this->user->getSkinData($username);

        if (!$skinUrl) {
            $skinUrl = $this->getMinecraftSkin($username);
            if ($skinUrl) {
                $imageData = base64_encode(file_get_contents($skinUrl));
                $this->user->saveSkinData($username, $imageData);
            }
        }

        return $skinUrl;
    }

    private function fetchUuid($username)
    {
        $response = file_get_contents("https://api.mojang.com/users/profiles/minecraft/{$username}");
        $data = json_decode($response, true);
        return $data['id'] ?? null;
    }

    private function fetchSkinData($uuid)
    {
        $response = file_get_contents("https://sessionserver.mojang.com/session/minecraft/profile/{$uuid}");
        return json_decode($response, true);
    }

 

    public function login($username, $password)
    {
        $user = $this->user->login($username, $password);

        if ($user) {
            $_SESSION['loggedin'] = true;
            $_SESSION['username'] = $user['username'];
            return [
                "status" => true,
                "message" => "Login successful"
            ];
        }

        return [
            "status" => false,
            "message" => "Invalid credentials"
        ];
    }

    public function logout()
    {
        if (isset($_SESSION['loggedin'])) {
            unset($_SESSION['loggedin']);
            unset($_SESSION['username']);
            session_destroy();
            // reload page to clear session variables
            header('Location: /');
            return ["status" => true, "message" => "Logged out successfully"];
        } else {
            return ["status" => false, "message" => "Not logged in"];
        }
    }

    public function getDashboardData()
    {
        if (!isset($_SESSION['loggedin']) || !$_SESSION['loggedin']) {
            return ['error' => 'Not authorized'];
        }

        $skinUrl = $this->getOrFetchMinecraftSkin($_SESSION['username']);
        return [
            'username' => htmlspecialchars($_SESSION['username'], ENT_QUOTES, 'UTF-8'),
            'skinUrl' => $skinUrl,
            'loggedIn' => true
        ];
    }
}
