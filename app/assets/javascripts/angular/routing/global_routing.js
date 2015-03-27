// Set available routes to prevent 404 or forcing redirect
MYAPP.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider
        .when('/products', {
            templateUrl: 'products.html',
            controller: 'ProductsListController'
        })
        .when('/products/new', {
            templateUrl: '/products/new.html',
            controller: 'ProductFormController'
        })
        .when('/products/:id/edit', {
            templateUrl: '/products/:id/edit.html',
            controller: 'ProductFormController'
        })
        .when('/products/:id', {
            templateUrl: '/products/:id.html',
            controller: 'ProductViewController'
        })
        .when('/', {
            templateUrl: '/main_content.html',
            controller: 'MainPageController'
        })
        .when('/contacts', {
            templateUrl: '/main_content.html',
            controller: 'MainPageController'
        })
        .when('/about', {
            templateUrl: '/main_content.html',
            controller: 'MainPageController'
        })
        .when('/price_list', {
            templateUrl: '/main_content.html',
            controller: 'MainPageController'
        })
        .when('/payment_and_delivery', {
            templateUrl: '/main_content.html',
            controller: 'MainPageController'
        })
        .when('/installation', {
            templateUrl: '/main_content.html',
            controller: 'MainPageController'
        })
        .when('/users/login', {
            templateUrl: '/users/login.html',
            controller: 'UsersController'
        })
        .when('/users/create', {
            templateUrl: '/users/create.html',
            controller: 'UsersController'
        })
        .when('/users/password_reset', {
            templateUrl: '/users/password_reset.html',
            controller: 'UsersController'
        })
        .when('/users/email_to_reset_pass', {
            templateUrl: '/users/email_to_reset_pass.html',
            controller: 'UsersController'
        })
        .when('/users/account', {
            templateUrl: '/users/account.html',
            controller: 'AccountController'
        })
        .when('/settings/global', {
            templateUrl: '/settings/global.html',
            controller: 'SettingController'
        })
        .when('/settings/page_editor', {
            templateUrl: '/settings/page_editor.html',
            controller: 'SettingController'
        })
        .when('/carts/edit', {
            templateUrl: '/carts/edit.html',
            controller: 'CartsController'
        })
        .when('/carts/view/:id', {
            templateUrl: '/carts/view/:id.html',
            controller: 'CartViewController'
        })
        .when('/carts', {
            templateUrl: '/carts.html',
            controller: 'CartListController'
        })
        .otherwise({
            redirectTo: '/'
        })
        .when('/custom_pages/:id', {
            templateUrl: '/products/:id.html',
            controller: 'CustomPagesController'
        });

//    $locationProvider.html5Mode(true);

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
}]);