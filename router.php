<?php
require __DIR__ . '/vendor/autoload.php';

use Symfony\Component\Routing\Route;
use Symfony\Component\Routing\RouteCollection;
use Symfony\Component\Routing\RequestContext;
use Symfony\Component\Routing\Matcher\UrlMatcher;
use Symfony\Component\Routing\Exception\ResourceNotFoundException;

use Penta\Controller\UserController;

$userController = new UserController();

$routes = createRoutes();

$context = new RequestContext();
$context->fromRequest(\Symfony\Component\HttpFoundation\Request::createFromGlobals());

$matcher = new UrlMatcher($routes, $context);

try {
    $parameters = $matcher->match($_SERVER['REQUEST_URI']);
    $handler = $parameters['_controller'];
    executeHandler($handler);
} catch (ResourceNotFoundException $e) {
    include 'views/login.php';
} catch (Exception $e) {
    // Handle other exceptions as needed, e.g., logging the error
    echo "An error occurred: " . $e->getMessage();
}

function createRoutes(): RouteCollection
{
    $routes = new RouteCollection();

    $routes->add('show_login', new Route('/login', ['_controller' => 'show_login'], [], [], '', [], ['GET']));
    $routes->add('handle_login', new Route('/login', ['_controller' => 'handle_login'], [], [], '', [], ['POST']));
    $routes->add('handle_logout', new Route('/logout', ['_controller' => 'handle_logout'], [], [], '', [], ['GET']));
    $routes->add('show_dashboard', new Route('/dashboard', ['_controller' => 'show_dashboard'], [], [], '', [], ['GET']));
    $routes->add('api_dashboard_data', new Route('/api/dashboard/data', ['_controller' => 'api_dashboard_data'], [], [], '', [], ['GET']));
    $routes->add('show_homepage', new Route('/', ['_controller' => 'show_homepage'], [], [], '', [], ['GET']));
    return $routes;
}

function executeHandler(string $handler): void
{
    global $userController;

    switch ($handler) {
        case 'show_login':
            if (isset($_SESSION['loggedin']) && $_SESSION['loggedin']) {
                include 'views/dashboard.php';
            } else {
                include 'views/login.php';
            }
            break;
        case 'show_homepage':
            include 'views/homepage.php';
            break;
        case 'handle_login':
            $data = json_decode(file_get_contents("php://input"), true);
            $username = isset($data['username']) ? $data['username'] : '';
            $password = isset($data['password']) ? $data['password'] : '';
            $response = $userController->login($username, $password);

            if ($response["status"] === true) {
                // Send a success JSON instead of redirecting here
                header('Content-Type: application/json');
                echo json_encode(["success" => true]);
                exit;
            } else {
                header('Content-Type: application/json');
                echo json_encode($response);
                exit;
            }
            break;

        case 'handle_logout':
            $userController->logout();
            header('Location: /login');
            exit;
            break;

        case 'show_dashboard':
            if (!isset($_SESSION['loggedin']) || !$_SESSION['loggedin']) {
                header('Location: /login');
                exit;
            }
            include 'views/dashboard.php';
            break;
        case 'api_dashboard_data':
            header('Content-Type: application/json');
            echo json_encode($userController->getDashboardData());
            exit;
            break;
    }
}
