var MYAPP = angular.module('myapp', ['ngRoute', 'ngResource', 'ngSanitize', 'Devise','angularUtils.directives.dirPagination', 'ngAnimate', 'ngDialog']);
MYAPP.controller('MainController',['$scope', '$routeParams', '$location', 'Global', 'Products', 'User', 'Auth', 'Cart', '$sce', '$anchorScroll', 'ngDialog', '$rootScope',
    function($scope, $routeParams, $location, Global, Products, User, Auth, Cart, $sce, $anchorScroll, ngDialog, $rootScope) {

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
        $scope.current_cat = null;
        $scope.current_sub_cat = null;
        $scope.current_firm = null;
        $scope.cats_list = [];

        $scope.default_meta_keywords = null;
        $scope.default_meta_description = null;
        $rootScope.meta_keywords = null;
        $rootScope.meta_description = null;

        function set_meta_tags(){
            var path = $location.path();
            $rootScope.meta_keywords = '';
            $rootScope.meta_description = '';
            $rootScope.title = 'ТеплоИнвест';
            if(path != '/products'){
                if($scope.default_meta_keywords) $rootScope.meta_keywords = $scope.default_meta_keywords;
                if($scope.default_meta_description) $rootScope.meta_description = $scope.default_meta_description;
            } else {
                var search = $location.search();
                [{o: 'category', m: 'categories_names'},
                {o: 'sub_cat', m: 'sub_cats_names'},
                {o: 'firm', m: 'firms_names'}].each(function(d){
                    if(search[d.o]) {
                        if($rootScope.title == 'ТеплоИнвест') {
                            $rootScope.title += ': ';
                            $rootScope.title +=  $scope[d.m][search[d.o]];
                        } else $rootScope.title +=  ' - '+$scope[d.m][search[d.o]];
                        $rootScope.meta_keywords += ($rootScope.meta_keywords ? ', ' : '')
                            + $scope[d.m][search[d.o]];
                        $rootScope.meta_description += $scope[d.m][search[d.o]] + '. ';
                    }
                });
            }

        }

        $scope.refresh_div_visibility = function() {
            setTimeout(function(){
                var search = $location.search();
                $scope.current_cat = search.category;
                $scope.current_sub_cat = search.sub_cat;
                $scope.current_firm = search.firm;

                var assortment = angular.element('.assortment');
                var other_firms = assortment.find('li.active_firm');
                other_firms.removeClass('active_firm');
                assortment.find('h5.active, h4.active').removeClass('active');

                if ($scope.current_cat) {
                    var current_cat_wrapper = assortment.find('.cats_block.cat_' + $scope.current_cat);
                    var current_cat_button = current_cat_wrapper.find('h4');
                    current_cat_button.addClass('active');
                    var current_cat = current_cat_wrapper.find('.slider');
                    if (current_cat.is(':hidden')) current_cat.slideToggle();
                    var current_sub_cat = null;
                    if ($scope.current_sub_cat) {
                        var current_sub_cat_wrapper = current_cat.find('.sub_cats_block.sub_cat_' + $scope.current_sub_cat);
                        var current_sub_cat_button = current_sub_cat_wrapper.find('h5');
                        current_sub_cat_button.addClass('active');
                        current_sub_cat = current_sub_cat_wrapper.find('.sub_slider');
                        if (current_sub_cat.is(':hidden')) current_sub_cat.slideToggle();
                    }
                    if ($scope.current_firm) {
                        var current_firm = (current_sub_cat ? current_sub_cat : current_cat).find('li.firm_' + $scope.current_firm);
                        if (!current_firm.hasClass('active_firm')) current_firm.addClass('active_firm');
                    }
                }

                var other_cats = assortment.find('.cats_block:not(.cat_' + $scope.current_cat + ') .slider:visible');
                var other_sub_cats = assortment.find('.sub_cats_block:not(.sub_cat_' + $scope.current_sub_cat + ') .sub_slider:visible');
                other_sub_cats.slideToggle();
                other_cats.slideToggle();
            },150);
        };

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
                        if(!isAllFinished() && i < 120) refresh(i);
                        else {
                            if(i == 120) cl(['ERROR: $scope.loadInfo ',$scope.loadInfo]);
                            setTimeout(function(){ $scope.$apply(function(){
                                $scope.loadFinishedCompletly = true;
                                $a.done();
                                setTimeout(function(){$scope.refresh_div_visibility();},100);
                            }); },1000);
                            $location.path(pathname).search(search).hash(hash);
                        }
                    },100);
            };
            refresh();
        }

        $scope.$on('$routeChangeSuccess', function () {
            $scope.form_displayed =(/(^\/products\/new$|^\/products\/\d+\/edit$)/.test($location.path()));
            var search = $location.search();
            $scope.selectedFirm = search.firm;
            $scope.selectedSubCat = search.sub_cat;
            $scope.selectedCategory = search.category;
            $scope.paramsPart = ($scope.selectedCategory ? '?category='+$scope.selectedCategory : '')+
                ($scope.selectedSubCat ? '&sub_cat='+$scope.selectedSubCat : '')+
                ($scope.selectedFirm ? '&firm='+$scope.selectedFirm : '');
            if(search.prod_id) {
                $scope.open_view_product_popup(search.prod_id);
            } else {
                set_meta_tags();
            }

            $scope.refresh_div_visibility();
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
                        $a.info('Интернет-магазин Теплоинвест<br/>приветствует Вас!');
                        $location.path('/');
                    } else if (res.provider == 'added'){
                        $a.alert('Вы успешно прикрепили аккаунт своей социальной сети к аккаунту нашего интернет магазина. Теперь вам доступен быстрый вход через свою соц сеть (без ввода пароля от аккаунта интернет-магазина Теплоинвест).');
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
                        $scope.products = format_price_to_rubles(data.products);
                        $scope.categories = data.categories;
                        $scope.firms = data.firms;
                        $scope.sub_cats = data.sub_cats;
                        $scope.bindNames();
                        $scope.bindAssortment();
                        respondToAllCalbacks('load_products',$scope.products);
                        someLoadFinished('load_products');
                        if($scope.currentUser && $scope.currentUser.is_admin) $scope.load_carts();
                    });
                }
            }
        };

        function format_price_to_rubles(products){
            products.each(function(p){
                if(p.valute == 'RUB') p.rub_price = p.price;
                if(p.valute == 'USD') p.rub_price = p.price * $scope.setting.usd_rate;
                if(p.valute == 'EUR') p.rub_price = p.price * $scope.setting.eur_rate;
            });
            return products;
        }

        $scope.bindNames = function(){
            w('categories firms sub_cats').each(function(current_list){
                $scope[current_list+'_names'] = {};
                $scope[current_list].each(function(ob){
                    $scope[current_list+'_names'][ob.id] = ob.name;
                });
            });
        };

        $scope.bindAssortment = function(){
            $scope.product_list = null;
            $scope.cats_list = [];
            $scope.admin = $a.any($scope.currentUser) && $scope.currentUser.is_admin;
            if($scope.admin) $scope.product_list = $scope.products;
            else {
                $scope.product_list = [];
                $scope.products.each(function(p){
                    if(!p.hidden) $scope.product_list.push(p);
                });
            }

            $scope.product_list.each(function(p){
                var cat = $scope.cats_list.whereId(p.category_id);
                var new_cat = false;
                var new_sub_cat = false;
                var new_firm = false;
                if(!cat || !cat.id){
                    cat = $scope.categories.whereId(p.category_id);
                    cat = {id: cat.id, name: cat.name, sub_cats: [], firms: []};
                    new_cat = true;
                }
                var sub_cat = cat.sub_cats.whereId(p.sub_cat_id);
                if((!sub_cat || !sub_cat.id) && p.sub_cat_id){
                    sub_cat = $scope.sub_cats.whereId(p.sub_cat_id);
                    sub_cat = {id: sub_cat.id, name: sub_cat.name, firms: []};
                    new_sub_cat = true;
                }
                var firm = sub_cat ? sub_cat.firms.whereId(p.firm_id) : cat.firms.whereId(p.firm_id);
                if(!firm || !firm.id){
                    firm = $scope.firms.whereId(p.firm_id);
                    firm = {id: firm.id, name: firm.name, count: 0/*, products: [p]*/};
                    new_firm = true;
                } else {
                    firm.count++;
//                    firm.products.push(p);
                }
                if(new_firm){
                    if(sub_cat) sub_cat.firms.push(firm);
                    else cat.firms.push(firm);
                }
                if(new_sub_cat) cat.sub_cats.push(sub_cat);
                if(new_cat) $scope.cats_list.push(cat);
            });

        };

        $scope.getSettings = function(){
            someLoadStarted('getSettings');
            Global.main(function(res){
                $scope.setting = res;
                $scope.load_products();
                $scope.default_meta_keywords = $scope.setting.meta_keywords;
                $scope.default_meta_description = $scope.setting.meta_description;
                $rootScope.meta_keywords = $scope.default_meta_keywords;
                $rootScope.meta_description = $scope.default_meta_description;
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

        $scope.open_view_product_popup = function(prod_id){
            $scope.products.each(function(p){
                if(p.id == prod_id) {
                    $scope.selected_product = p;
                }
            });
            $scope.ng_dialog = ngDialog.open({template: '/products/1.html', 
                controller: 'ProductViewController', scope: $scope, 
                className: 'ngdialog-theme-default product_popup'});
        };

        $scope.$on('ngDialog.closed', function (data, el) {
            if(el.hasClass('product_popup'))
            $scope.$apply(function(){
                $scope.selected_product = null;
                $scope.product = null;
                $location.search('prod_id', null);
            });
        });

        // DEMO! css start
        $scope.get_menu_button_shadow_style = function(color){
            return get_menu_button_shadow_style(color);
        };
        //var colors = w('red orange yellow green blue indigo violet grey white');
        angular.element('.head_panel a div.head_spacer span').each(function(i,el){
            el = angular.element(el);
            var prefix = 'custom_'+/*colors[i]*/ 'grey';
            el.addClass(prefix);
            add_style('.'+prefix+':hover { background-color: #000000;'+get_menu_button_shadow_style(/*colors[i]*/'grey')+'}');
        });
        // DEMO! css end

        checkLS();

        if(!$scope.currentUser) $scope.getUser();
    }]);

MYAPP.config([
    "$httpProvider", '$locationProvider',function($httpProvider, $locationProvider) {
        $httpProvider.defaults.headers.common['X-CSRF-Token'] = $('meta[name=csrf-token]').attr('content');
        $locationProvider.html5Mode(true);
    }
]);
MYAPP.config(['AuthProvider', function(AuthProvider) {
    AuthProvider.ignoreAuth(true);
}]);

