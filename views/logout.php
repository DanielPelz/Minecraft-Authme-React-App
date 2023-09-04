<?php
session_start();
unset($_SESSION['loggedin']);
unset($_SESSION['username']);
session_destroy();
header('Location: login.php');
exit;
?>