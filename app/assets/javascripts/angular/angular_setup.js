var ANTALEX = angular.module('antalex', ['ngRoute', 'ngResource', 'ngSanitize', 'Devise','angularUtils.directives.dirPagination']);
ANTALEX.controller('MainController',['$scope', '$routeParams', '$location', 'Global', 'Products', 'User', 'Auth', 'Cart', '$sce', '$anchorScroll',
    function($scope, $routeParams, $location, Global, Products, User, Auth, Cart, $sce, $anchorScroll) {

        $scope.loadFinished = false;
        $scope.loadFinishedCompletly = false;
        $scope.loadInfo = {};
        $scope.form_displayed = false;
        $scope.cartNotEmpty = false;
        $scope.asc = true;
        $scope.sortTypes = [{name: 'фирма', val: 'firm'},{name: 'категория', val: 'cat'}];
        $scope.calbacks_q = [];
        $scope.$parent.selectedSearch = {};
        $scope.users = [];
        $scope.first_load = true;

        function checkLS(){
            var pathname = localStorage.getItem('pathname');
            var search = localStorage.getItem('search');
            var hash = localStorage.getItem('hash');
            localStorage.removeItem('pathname');
            localStorage.removeItem('search');
            localStorage.removeItem('hash');
            waitForLoadingComplete(pathname || '/', search || '', hash || '');
        }

        function someLoadFinished(name){
            $scope.loadInfo[name] = true;
            var allFinished = true;
            Object.keys($scope.loadInfo).each(function(key){
                if(!$scope.loadInfo[key]) allFinished = false;
            });
            $scope.loadFinished = allFinished;
        }

        function someLoadStarted(name){
            $scope.loadInfo[name] = false;
        }

        function isAllFinished(){
            var allFinished = true;
            Object.keys($scope.loadInfo).each(function(key){
                if(!$scope.loadInfo[key]) allFinished = false;
            });
            return allFinished;
        }

        function waitForLoadingComplete(pathname, search, hash){
            $a.wait();
            var refresh = function(i){
                i = ++i || 0;
                setTimeout(
                    function(){
                        if(!isAllFinished() && i < 30) refresh(i);
                        else {
                            if(i == 30) cl(['ERROR: $scope.loadInfo ',$scope.loadInfo]);
                            setTimeout(function(){ $scope.$apply(function(){ $scope.loadFinishedCompletly = true; $a.done(); }); },1000);
                            $location.path(pathname).search(search).hash(hash);
                        }
                    },100);
            };
            refresh();
        }

        $scope.$on('$routeChangeSuccess', function () {
            $scope.form_displayed =(/(^\/products\/new$|^\/products\/\d+\/edit$)/.test($location.path()));
            $scope.selectedFirm = $location.search().firm;
            $scope.selectedCategory = $location.search().category;
            $scope.paramsPart = ($scope.selectedFirm ? '?firm='+$scope.selectedFirm : '')+
                ($scope.selectedCategory ? '&category='+$scope.selectedCategory : '');
            $anchorScroll();
        });

        function bindPositionDataFromProduct(carts){
            $scope.products.each(function(prod){
                carts.each(function(cart){
                    cart.positions.each(function(pos){
                        if(pos.product_id == prod.id){
                            pos.prod = prod;
                        }
                    });
                });
            });
            return carts;
        }

        $scope.addCartToList = function(data){
            $scope.products.each(function(p){
                if(data.position.product_id == p.id) {
                    data.position.prod = p;
                    console.log('prod found');
                }
            });
            if(!$scope.carts){
                $scope.load_carts(function(){
                    $scope.addCartToList(data);
                });
            } else if($scope.carts.length == 0){
                data.cart.positions = [data.position];
                $scope.carts.push(data.cart);
            } else {
                var exist = false;
                $scope.carts.each(function(c){
                    if(data.cart.id == c.id) {
                        console.log('exist!');
                        exist = true;
                        if(c.positions && c.positions.length > 0) c.positions.push(data.position);
                        else c.positions = [data.position];
                    }
                });
                if(!exist){
                    data.cart.positions = [data.position];
                    $scope.carts.push(data.cart);
                }
            }
            if(!$scope.actual_cart)$scope.lookForActual();
        };

        $scope.goToViewCartPage = function(){
            if($a.any($scope.currentUser)) $location.path('/carts/edit');
            else $a.alert('<b>Ваша корзина пуста.</b>','Корзина');
        };

        $scope.lookForActual = function(){
            $scope.carts.each(function(cart){
                if(!cart.confirmed){
                    $scope.actual_cart = cart;
                    if(cart.positions.length > 0){
                        $scope.cartNotEmpty = true;
                    }
                }
            });
        };

        $scope.loadStatuses = function(callback){
            callback = callback || function(){};
            if($scope.statuses){
                callback($scope.statuses);
            } else {
                if(addToCalbacksQ('loadStatuses', callback)){
                    someLoadStarted('loadStatuses');
                    Cart.statuses(function(res){
                        $scope.statuses = res;
                        callback($scope.statuses);
                        respondToAllCalbacks('loadStatuses',$scope.statuses);
                        someLoadFinished('loadStatuses');
                    });
                }
            }
        };

        $scope.getCountOfPandingCarts = function(){
            $scope.pendingCount = $scope.carts.countWhere('status','pending');
        };

        $scope.load_carts = function(callback){
            $scope.loadStatuses();
            callback = callback || function(){};
            if($scope.carts){
                callback($scope.carts);
            } else {
                if(addToCalbacksQ('load_carts', callback)){
                    someLoadStarted('load_carts');
                    if($scope.first_load) {
                        $scope.first_load = false;
                        $scope.period = $scope.currentUser && $scope.currentUser.is_admin ? 30 : null;
                    }
                    Cart.all({days_before: $scope.period},function(res) {
                        $scope.load_products(function () {
                            $scope.carts = bindPositionDataFromProduct(res);
                            $scope.lookForActual();
                            console.log(['period', $scope.period]);
                            respondToAllCalbacks('load_carts', $scope.carts);
                            someLoadFinished('load_carts');
                            if($scope.currentUser && $scope.currentUser.is_admin) $scope.getCountOfPandingCarts();
                        });
                    });
                }
            }
        };

        $scope.loadCurrentUser = function(callback){
            callback = callback || function(){};
            if($scope.currentUser){
                callback($scope.currentUser);
            } else {
                if(addToCalbacksQ('loadCurrentUser',callback)){
                    Auth.currentUser().then(function(user) {
                        $scope.currentUser = user;
                        respondToAllCalbacks('loadCurrentUser', $scope.currentUser);
                    }, function(error) {
                        respondToAllCalbacks('loadCurrentUser', null);
                        cl(error);
                    });
                }
            }
        };

        $scope.getUser = function(from){
            someLoadStarted('getUser');
            $scope.loadCurrentUser(function(user){
                if(user){
                    $scope.currentUser = user;
                    if($a.blank($scope.setting)) $scope.getSettings();
                    $scope.load_carts();
                    someLoadFinished('getUser');
                    $scope.userRequestComplete = true; // used in template
                    if(from == 'uLogin') $scope.bindAssortment();
                } else {
                    someLoadFinished('getUser');
                    if($a.blank($scope.setting)) $scope.getSettings();
                    $scope.userRequestComplete = true; // used in template
                }
            });
//            Auth.currentUser().then(function(user) {
//                $scope.currentUser = user;
//                if($a.blank($scope.setting)) $scope.getSettings();
//                $scope.load_carts();
//                someLoadFinished('getUser');
//                $scope.userRequestComplete = true; // used in template
//                if(from == 'uLogin') $scope.bindAssortment();
//            }, function(error) {
//                cl(error);
//                someLoadFinished('getUser');
//                if($a.blank($scope.setting)) $scope.getSettings();
//                $scope.userRequestComplete = true; // used in template
//            });
        };

        $scope.logout = function(){
            someLoadStarted('logout');
            $a.wait();
            Auth.logout().then(function(oldUser) {
                $scope.currentUser = null;
                $scope.cartNotEmpty = false;
                $scope.carts = null;
                $scope.actual_cart = null;
                $scope.users = [];
                $scope.bindAssortment();
                $location.path('/');
                $a.info('Вы успешно покинули свой аккаунт');
                $a.done();
                someLoadFinished('logout');
            }, function(error) {
                $a.err('Что-то пошло не так...');
                cl(error);
                $a.done();
                someLoadFinished('logout');
            });
        };

        $scope.uLogin = function(token){
            someLoadStarted('uLogin');
            $a.wait();
            User.uLogin({u_token: token},function(res){
                if(res.authorized === true){
                    if(res.provider == 'welcome'){
                        $scope.getUser('uLogin');
                        $a.info('Интернет-магазин Antalex<br/>приветствует Вас!');
                        $location.path('/');
                    } else if (res.provider == 'added'){
                        $a.alert('Вы успешно прикрепили аккаунт своей социальной сети к аккаунту нашего интернет магазина. Теперь вам доступен быстрый вход через свою соц сеть (без ввода пароля от аккаунта интернет-магазина Antalex).');
                    } else if (res.provider == 'already'){
                        $a.err('Ваш аккаунт уже прикреплён.');
                    }
                    $a.done();
                }
                else if(res.authorized === false && res.data.identity){
                    $('<div><p class="dialog_msg">'+
                        'Для входа через социальную сеть, вам необходимо для начала зарегистрироватся на нашем сайте<br/>'+
                        'Если вы уже зарегистрированы, то после входа вы сможете привязать аккаунт вашей соц сети к аккаунту нашего сайта'+
                        '</p><div>').dialog(
                        { modal: true, position: 'top', buttons: [
                            { text: "Вход", click: function() {
                                $( this ).dialog( "close" );
                                $location.path('/users/login').search({than: 'add_snl'});
                                $scope.$apply();
                            }},
                            { text: "Регистрация", click: function() {
                                $( this ).dialog( "close" );
                                $location.path('/users/create');
                                $scope.$apply();
                            }}
                        ] });
                    $a.done();
                } else {
                    cl(res);
                    $a.done();
                    $a.err('неизвестная ошибка');
                }
                someLoadFinished('uLogin');
            });
        };

        $scope.load_products = function(callback){
            callback = callback || function(){};
            if($scope.products){
                callback($scope.products);
            } else {
                if(addToCalbacksQ('load_products',callback)){
                    someLoadStarted('load_products');
                    Products.getAll(function(data){
                        $scope.products = data.products;
                        $scope.categories = data.categories;
                        $scope.firms = data.firms;
                        $scope.bindAssortment(true);
                        respondToAllCalbacks('load_products',$scope.products);
                        someLoadFinished('load_products');
                        if($scope.currentUser && $scope.currentUser.is_admin) $scope.load_carts();
                    });
                }
            }
        };

        $scope.handleRebuild = function(){
            $scope.bindAssortment();
        };

        $scope.bindAssortment = function(first_build){
            $scope.admin = $a.any($scope.currentUser) && $scope.currentUser.is_admin;
            if($scope.admin) $scope.product_list = $scope.products;
            else {
                $scope.product_list = [];
                $scope.products.each(function(p){
                    if(!p.hidden) $scope.product_list.push(p);
                });
            }

            $scope.assortment = {};
            $scope.assortmentList = [];
            if($scope.setting.default_sort_type == 'firm'){
                $scope.product_list.each(function(p){
                    $scope.categories.each(function(c){
                        if(p.category_id == c.id){
                            p.category_name = c.name;
                            $scope.firms.each(function(f){
                                if(p.firm_id == f.id){
                                    p.firm_name = f.name;
                                    if(!$scope.assortment[f.name]){
                                        $scope.assortment[f.name] = {id: f.id};
                                    }
                                    if(!$scope.assortment[f.name][c.name]){
                                        $scope.assortment[f.name][c.name] = {id: c.id};
                                    }
                                }
                            })
                        }
                    });
                });
            } else {
                $scope.product_list.each(function(p){
                    $scope.firms.each(function(f){
                        if(p.firm_id == f.id){
                            p.firm_name = f.name;
                            $scope.categories.each(function(c){
                                if(p.category_id == c.id){
                                    p.category_name = c.name;
                                    if(!$scope.assortment[c.name]){
                                        $scope.assortment[c.name] = {id: c.id};
                                    }
                                    if(!$scope.assortment[c.name][f.name]){
                                        $scope.assortment[c.name][f.name] = {id: f.id};
                                    }
                                }
                            })
                        }
                    });
                });
            }
            if($scope.setting.default_sort_type == 'firm') {
                Object.keys($scope.assortment).each(function (key) {
                    var cats = [];
                    Object.keys($scope.assortment[key]).each(function (subKey) {
                        if (subKey != 'id') {
                            cats.push({
                                name: subKey,
                                id: $scope.assortment[key][subKey].id
                            });
                        }
                    });
                    $scope.assortmentList.push(
                        {
                            name: key,
                            id: $scope.assortment[key].id,
                            catigories: cats
                        }
                    );
                });
            } else {
                Object.keys($scope.assortment).each(function (key) {
                    var firms = [];
                    Object.keys($scope.assortment[key]).each(function (subKey) {
                        if (subKey != 'id') {
                            firms.push({
                                name: subKey,
                                id: $scope.assortment[key][subKey].id
                            });
                        }
                    });
                    $scope.assortmentList.push(
                        {
                            name: key,
                            id: $scope.assortment[key].id,
                            firms: firms
                        }
                    );
                });
            }
        };

        $scope.getSettings = function(){
            someLoadStarted('getSettings');
            Global.main(function(res){
                $scope.setting = res;
                $scope.load_products();
                someLoadFinished('getSettings');
            });
        };

        if($location.search().confirm_msg == 'invalid_token') {
            $('<div><p class="dialog_msg">Скорее всего вы уже завершили регистрацию<br/>Если вы забыли пароль, вы можете воспользоватся восстановлением пароля.</p><div>').dialog(
                { modal: true, position: 'top', buttons: [
                    { text: "Восстановить пароль", click: function() {
                        $( this ).dialog( "close" );
                        $location.path('/users/email_to_reset_pass');
                        $scope.$apply();
                    }},
                    { text: "Отмена", click: function() {
                        $( this ).dialog( "close" );
                    }}
                ] });
        } else if($location.search().confirm_msg == 'thx') {
            localStorage.setItem('pathname','/users/account');
            $a.alert('Cпасибо за регистрацию. Заполните пожалуйста недостающие данные.');
        }

        function addToCalbacksQ(name,callback){
            callback = callback || function(){};
            $scope.queue = [];
            var isFirstRequest = $scope.queue[name] == null;
            if(isFirstRequest){
                $scope.queue[name] = [];
            }
            $scope.queue[name].push(callback);
            return isFirstRequest;
        }

        function respondToAllCalbacks(name, response){
            if($scope.queue[name] != null && $scope.queue[name].length > 0){
                $scope.queue[name].each(function(cb){
                    if(typeof cb == 'function') cb(response);
                });
                $scope.queue[name] = null;
            }
        }

        $scope.loadZones = function(callback){
            if($a.blank($scope.zones) && typeof callback == 'function'){
                if(addToCalbacksQ('loadZones',callback)){
                    Cart.zones(function(res){
                        $scope.zones = res;
                        respondToAllCalbacks('loadZones',$scope.zones);
                    });
                }
            } else if(typeof callback == 'function'){
                callback($scope.zones);
            }

        };

        $scope.lodadUserInfo = function(user_id, callback){
            callback = callback || function(){};
            if($scope.users.whereId(user_id)){
                callback($scope.users.whereId(user_id));
            } else {
                User.show({id: user_id, action: 'view'}, function(res){
                    $scope.users.push(res);
                    callback(res);
                });
            }
        };

        $scope.htmlSafe = function(html_code) {
            return $sce.trustAsHtml(html_code);
        };

        checkLS();

        if(!$scope.currentUser) $scope.getUser();
    }]);

ANTALEX.config([
    "$httpProvider", function($httpProvider) {
        $httpProvider.defaults.headers.common['X-CSRF-Token'] = $('meta[name=csrf-token]').attr('content');
    }
]);
ANTALEX.config(['AuthProvider', function(AuthProvider) {
    AuthProvider.ignoreAuth(true);
}]);

