MYAPP.controller('CartsController', ['$scope', '$location', 'Cart', 'Global',
function($scope, $location, Cart, Global) {

    $scope.$parent.load_carts(function(){
        $scope.carts = $scope.$parent.carts;
        $scope.actual_cart = $scope.$parent.actual_cart;
        if($scope.actual_cart) {
            $scope.actual_cart.self_delivery = false;
            $scope.$parent.loadCurrentUser(function(res){
                $scope.actual_cart.address = res.address;
            });
            Global.captcha(function(res){
                $scope.c_data = res;
                angular.element('#code').attr('src', $scope.c_data.url);
            })
        }
    });
    $scope.mapCode = $scope.$parent.setting.map_code;
    $scope.zonesDesc = '';
    $scope.delivery_types = [
        {name:'Доставка на дом',val:false},
        {name:'Самовывоз',val:true}
    ];

    $scope.show_delivery_zones = function(){
        $a.confirm($scope.zonesDesc,function(){
            var map = '<div>'+$scope.mapCode+'</div>';
            window.open().document.write(map);
        },{width:500});
    };

    $scope.calculateTotal = function(){
        $scope.actual_cart.zone_id = $scope.zone.id;
        $scope.total_sum = 0;
        $scope.actual_cart.positions.each(function(pos){
            $scope.total_sum += pos.sum;
        });
        if(!$scope.actual_cart.self_delivery && $scope.zone && $scope.zone.price){
            if(!$scope.zone.free_if_sum || ($scope.zone.free_if_sum && $scope.zone.free_if_sum > $scope.total_sum)){
                $scope.total_sum += $scope.zone.price;
                $scope.delivery_free = false;
            } else $scope.delivery_free = true;
        }
    };

    $scope.to_int = function(idx){
        var pos = $scope.actual_cart.positions[idx];
        pos.count = $a.toInt(pos.count);
        pos.sum = pos.prod.price*pos.count;
        $scope.calculateTotal();
    };

    $scope.setDefaultSums = function(){
        $scope.actual_cart.positions.each(function(pos){
            pos.sum = pos.count * pos.prod.price;
        });
        $scope.calculateTotal();
    };

    $scope.$parent.loadZones(function(res){
        $scope.zones = res;
        $scope.zones.each(function(z, i){
            $scope.zonesDesc += 1+i+') Зона доставки: "'+ z.name+'" ';
            $scope.zonesDesc += '(цвет: "'+ z.color + '")';
            $scope.zonesDesc += ', стоимость: '+ z.price + ' руб.<br/>';
        });
        $scope.zonesDesc += '<br/>Открыть карту?';
        $scope.zone = $scope.zones[0] || null;
        if($scope.actual_cart && $scope.actual_cart.positions && $scope.actual_cart.positions.length > 0)
            $scope.setDefaultSums();
    });

    $scope.delPos = function(idx){
        var posToDel = $scope.actual_cart.positions[idx];
        $a.confirm('Удалить этот товар из корзины?<br/><br/><b>'+posToDel.prod.name+'</b>',function(){
            Cart.remove_position({id: posToDel.id},function(res){
                if(res.success){
                    $scope.actual_cart.positions.splice(idx,1);
                    $scope.calculateTotal();
                    $a.info('Товар удалён из корзины.');
                    if($scope.actual_cart.positions.length == 0) $scope.$parent.cartNotEmpty = false;
                } else $a.err();
            });
        });
    };

    function noMoreExist(ids){
        var prods = $scope.$parent.products.whereId(ids);
        console.log(prods);
        var msg = 'Приносим вам свои извинения, но некоторые товары, среди тех что вы добавили в корзину,' +
            ' уже исчесли с прилавка нашего магазина:';
        prods.each(function(prod,i){
            msg += '<br/>'+(i+1)+') <b>'+prod.name+'</b>';
        });
        msg += '<br/><br/>Но, тем не менее, вы всё еще можете заказать те, что есть в наличии.';
        $a.alert(msg,'Заказ не оформлен');
        $scope.$parent.products = null;
        $scope.$parent.carts = null;
        $scope.$parent.load_products(function(){
            $scope.load_carts(function(){
                $scope.actual_cart.positions = $scope.$parent.actual_cart.positions;
                $scope.setDefaultSums();
            })
        });
    }

    function is_pos_invalid(){
        var invalid = false;
        $scope.actual_cart.positions.each(function(p){
            if(!p.count || p.count < 1) invalid = true;
        });
        return invalid;
    }

    function isFormInvalid(){
        $scope.showErrors = true;
        if($scope.cartForm.$invalid || is_pos_invalid()) {
            $a.err('введённые вами данные содержат <br/>ошибки. Пожалуйста, исправьте их');
            return true;
        }
        return false;
    }

    $scope.confirm_order = function(){
        if(isFormInvalid()) return;
        $a.confirm('<b>Оформить заказ?</b>',function(){
            $a.wait();
            Cart.confirm({cart:$scope.actual_cart,
                captcha: $scope.captcha,
                captcha_id: $scope.c_data.captcha},function(res){
                if(res.success){
                    $scope.$parent.cartNotEmpty = false;
                    $scope.$parent.carts = null;
                    $scope.$parent.actual_cart = null;
                    $scope.load_carts(function(){
                        $scope.$parent.lookForActual();
                        $location.path('/carts/view/'+res.cart_id);
                        $a.alert('<b>Заказ успешно оформлен!<b/><br/><br/>Наш сотрудник вскоре с вами свяжется, по указанному вами телефону.','Заказ',800);
                    });
                } else if(res.success === false && res.new_captcha) {
                    $scope.c_data = res.new_captcha;
                    angular.element('#code').attr('src', $scope.c_data.url);
                    $a.err('Неверно введён код с картинки');
                    $scope.captcha = '';
                    $scope.showErrors = false;
                    $scope.cartForm.captcha.$touched = false;
                } else {
                    if(res.ids && res.ids.length > 0){
                        $a.err('заказ <b>НЕ оформлен</b>');
                        noMoreExist(res.ids);
                    } else {
                        $a.err('Неизвестная ошибка');
                        cl(res);
                    }
                }
                $a.done();
            });
        });
    };

}]);

