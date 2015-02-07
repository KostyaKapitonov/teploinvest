ANTALEX.controller('ProductViewController', ['$scope', '$location','$routeParams', 'Products', '$sce', '$anchorScroll', '$filter', 'Cart',
function($scope, $location, $routeParams, Products, $sce, $anchorScroll, $filter, Cart) {

    $scope.searchProcessing = false;
    $scope.curentPos = 0;
    $scope.$parent.selectedSearch = $location.search();

    function loadViewData(){
        if($scope.product != null) return;
        if($routeParams.id && $scope.$parent && $scope.$parent.products && $scope.$parent.products.length) {
            $scope.actual_cart = $scope.$parent.actual_cart;
            $scope.$parent.products.each(function(p){
                if(p.id == $routeParams.id) {
                    $scope.product = p;
                    prepareFilteredList();
                    checkCartToAddablity();
                }
            });
            $scope.currentUser = $scope.$parent.currentUser;
            $scope.admin = $a.any($scope.currentUser) && $scope.currentUser.is_admin;
            $anchorScroll();
        }
        else {
            setTimeout(function(){
                loadViewData();
            },50);
        }
    }

    function checkCartToAddablity(){
        if($scope.actual_cart && $scope.actual_cart.positions && $scope.actual_cart.positions.length>0){
            $scope.actual_cart.positions.each(function(pos){
                if(pos.product_id == $scope.product.id){
                    $scope.addedToCart = true;
                }
            });
        }
    }

    function prepareFilteredList(){
        $scope.filredProducts = $filter('onlySelected')($scope.$parent.product_list,
            $scope.$parent.selectedFirm,$scope.$parent.selectedCategory);
        $scope.cntrls = $scope.filredProducts.length > 1;
        $scope.filredProducts.each(function(p,i){
            if(p.id == $scope.product.id) $scope.curentPos = i;
        });
    }

    $scope.next = function(i){
        $scope.curentPos+= i;
        if($scope.curentPos < 0) $scope.curentPos+= $scope.filredProducts.length;
        if($scope.curentPos == $scope.filredProducts.length) $scope.curentPos-= $scope.filredProducts.length;
        $location.path('/products/'+$scope.filredProducts[$scope.curentPos].id);
    };

    $scope.htmlSafe = function(html_code) {
        return $sce.trustAsHtml(html_code);
    };

    $scope.back = function(){
        $scope.product = null;
        $location.path('/products');
    };

    $scope.delete_product = function(id){
        $a.confirm('<b>Вы действительно хотите<br/>удалить этот товар?</b><br/><br/>Если ' +
            'ваша цель временно скрыть его от покупателей, вы можете сделать это через ' +
            'установку опции "Скрыть" при редактировании товара.',function(){
            Products.delete({id: id}, function(data){
                if(data.success){
                    $scope.$parent.products.splice($scope.products.whereId(id, true),1);
                    $scope.$parent.bindAssortment();
                    $a.info("Товар удалён");
                    $location.path('/products');
                }
            })
        });
    };

    function isAllRequiredInfoComplete(){
        var completed = true;
        'first_name last_name father_name mobile address'.split(' ').each(function(prop){
            if($a.blank($scope.currentUser[prop])) {
                completed = false;
            }
        });
        return completed;
    }

    $scope.addToCart = function(){
        $a.wait();
        if(!$scope.currentUser){
            $a.done();
            $('<div><p class="dialog_msg">Оформление заказа доступно только зарегистрированным пользователям.' +
                'Если вы уже зарегистрированы - войдите пожалуйста в свой аккаунт.</p><div>').dialog({ modal: true, position: 'top',
                buttons: [ { text: "Вход", click: function() {
                    $location.path('/users/login');
                    $scope.$apply();
                    $( this ).dialog( "close" ); } },
                { text: "Регистрация", click: function() {
                    $location.path('/users/create');
                    $scope.$apply();
                    $( this ).dialog( "close" ); } }
                ], title: 'Добавление в корзину невозможно'});
        } else if($scope.currentUser && isAllRequiredInfoComplete()){
            Cart.add_position({product_id: $scope.product.id}, function(res){
                $a.done();
                if(res.success){
                    $scope.$parent.addCartToList(res);
                    $a.info('Товар добавлен в корзину');
                    $scope.addedToCart = true;
                    $scope.$parent.cartNotEmpty = true;
                } else if(res.reason == 'already'){
                    $('<div><p class="dialog_msg"><b>Данный товар уже добавлен в корзину.</b><br/>Если вы хотите заказать несколько одних и тех же ' +
                    'товаров, их количество вы сможете указать при утверждении заказа.<br/>Сейчас вы можете продолжить выбор товаров,<br/>' +
                    'либо перейти к утверждению заказа</p><div>').dialog({ modal: true, position: 'top', width: 440,
                        buttons: [ { text: "Приступить к утверждению заказа", click: function() {
                            $location.path('/carts/edit');
                            $scope.$apply();
                            $( this ).dialog( "close" ); } },
                            { text: "Продолжить выбор товаров", click: function() {
                                $( this ).dialog( "close" ); } }
                        ], title: 'Выберите действие'});
                    $scope.addedToCart = true;
                    $scope.$parent.cartNotEmpty = true;
                } else if (res.reason == 'invalid product'){
                    $a.alert('Извините, но данный товар более не доступен для покупки.');
                    $scope.$parent.products = null;
                    $scope.$parent.load_products(function(){
                        if(res.hide) $location.path('/products');
                        else{
                            $scope.product = null;
                            loadViewData();
                        }
                    });
                } else {
                    $a.err('неизвестная ошибка');
                    cl(res);
                }
            });
        } else {
            $a.done();
            $a.confirm('К сожалению вы ещё не заполнили все необходимые данные о себе.<br/>' +
                'А без этого невозможно оформить заказ.<br/>Хотите заполнить недостающую информацию сейчас?',
            function(){
                $location.path('/users/account');
                $scope.$apply();
            });
        }
    };

    loadViewData();
}]);