MYAPP.controller('SettingController', ['$scope', '$location', 'Setting', 'Cart', 'ngDialog',
function($scope, $location, Setting, Cart, ngDialog) {

    $scope.page_name = $location.search().page;
    $scope.new_default_sort_type = $scope.$parent.setting.default_sort_type;
    $scope.zones = [];

    if($scope.page_name && $scope.$parent.setting) $scope.page = $scope.$parent.setting[$scope.page_name];
    $scope.$parent.loadZones(function(res){
        $scope.zones = res;
    });

    $scope.hide_menu = function(){
        $scope.$parent.form_displayed = true;
    };

    $scope.genUnicId = function(){
        if(!$scope.idCounter)$scope.idCounter=0;
        $scope.idCounter++;
        return $scope.idCounter;
    };

    $scope.save_page = function(){
        var params = {setting: {}};
        params.setting[$scope.page_name] = $scope.page;
        Setting.update(params,function(data){
            if(data.success){
                $scope.$parent.setting[$scope.page_name] = $scope.page;
                $a.info('Изменения сохранены');
                $location.path('/settings/global');
            }
        });
    };

    $scope.toggle_ra = function(){
        $a.wait();
        Setting.update({setting: {recalculatable: $scope.$parent.setting.recalculatable}},function(data){
            if(data.success){
                $a.alert($scope.$parent.setting.recalculatable ? '<b>Включено</b> автоматическое обновление курса $' :
                    'Автоматическое обновление курса $ было <b>отключено</b>', 'Обновление курса валют');
                $location.path('/settings/global');
                $a.done();
            }
        });
    };

    $scope.toggle_dst = function(){
        $a.wait();
        Setting.update({setting: {default_sort_type: $scope.new_default_sort_type}},function(data){
            if(data.success){
                $a.info('По умолчанию выбрана сортировка по '+
                    ($scope.new_default_sort_type == 'firm' ? '<b>фирме</b>':'<b>категории</b>'));
//                $location.path('/settings/global');
                $a.done();
            }
        });
    };

    $scope.newZone = function(){
        $scope.showErrors = false;
        $scope.zones.push({});
    };

    $scope.saveZones = function(){
        $scope.showErrors = true;
        if($scope.zonesForm.$invalid){
            $a.err('Пожалуйста проверьте правильность<br/>заполнения всех полей');
        } else {
            $a.wait();
            Cart.add_zone(prepareToSave(),function(res){
                if(res.success){
                    $a.info('Зоны доставки сохранены.');
                } else {
                    $a.err('Ошибка сохранения.');
                    cl(res);
                }
                $a.done();
            })
        }
    };
    function prepareToSave(){
        var newZones = [],
            existZones = [];
        $scope.zones.each(function(z){
            if($a.any(z.id)) existZones.push(z);
            else newZones.push(z);
        });
        return {new_zones: newZones, existed_zones: existZones};
    }

    $scope.deleteZone = function(idx){
        $scope.showErrors = false;
        if($scope.zones[idx].id){
            $a.confirm('Вы действительно хотите удалить<br/>эту зону доставки?<br/><br/><b>'+$scope.zones[idx].name+'</b>',
                function(){
                    $a.wait();
                    Cart.del_zone({id: $scope.zones[idx].id},function(res){
                        if(res.success){
                            $a.info('Зона удалена.');
                            rebindZonesTable(idx);
                        } else {
                            $a.err('Ошибка удаления.');
                            cl(res);
                        }
                        $a.done();
                    });
                });
        } else rebindZonesTable(idx);
    };

    $scope.applyNewMap = function(){
        $a.wait();
        $scope.setting.map_code = $scope.setting.map_code.replace(/(\&width\=\d+|\&height\=\d+)/g,'');
        Setting.update({setting: {map_code: $scope.$parent.setting.map_code}},function(data){
            if(data.success){
                $a.confirm('Код карты успешно сохранён.<br/>Хотите проверить работоспособность ' +
                    'кода, открыв сейчас карту?',function(){
                    window.open().document.write('<div>'+$scope.$parent.setting.map_code+'</div>');
                })
            } else {
                cl(data);
                $a.err('Ошибка сохранения кода карты');
            }
            $a.done();
        });
    };

    $scope.applyNewAddress = function(){
        Setting.update({setting: {self_delivery_address: $scope.$parent.setting.self_delivery_address}},function(data){
            if(data.success){
                $a.info('Новый адрес сохранён')
            } else {
                cl(data);
                $a.err('Ошибка сохранения нового адреса самовывоза');
            }
        });
    };

    $scope.applyPaginate = function(type){
        var setting = {};
        if(isNaN($scope.$parent.setting[type])){
            $a.err('Ошибка сохранения кол-ва строк!<br/>Необходимо вводить только цифры!');
            $scope.$parent.setting[type] = type == 'orders_per_page' ? 3 : 10;
            return;
        } else if ($scope.$parent.setting[type] < 3){
            $a.err('Ошибка сохранения кол-ва строк!<br/>Должно быть более 3 строк!');
            $scope.$parent.setting[type] = type == 'orders_per_page' ? 3 : 10;
            return;
        }
        setting[type] = $scope.$parent.setting[type];
        Setting.update({setting: setting},function(data){
            if(data.success){
                $a.info('Кол-во строк сохранено.')
            } else {
                cl(data);
                $a.err('Ошибка сохранения кол-ва строк!');
            }
        });
    };

    function rebindZonesTable(idx){
        $scope.zones.splice(idx,1);
        var tmp_z = $scope.zones;
        $scope.zones = null;
        setTimeout(function(){$scope.$apply(function(){
            $scope.zones = tmp_z;
        })},0);
    }

    $scope.open_cp_editor = function(){
        console.log('open_cp_editor');
        $scope.ng_dialog = ngDialog.open({template: '/custom_pages/new.html',
            controller: 'CustomPagesController', scope: $scope,
            className: 'ngdialog-theme-default page_editor'});
        $scope.ng_dialog.closePromise.then(function (data) {
            if(data.value != '$document' && data.value != '$closeButton') {
                console.log(['data.value',data.value]);
            }
        });
    }

}]);