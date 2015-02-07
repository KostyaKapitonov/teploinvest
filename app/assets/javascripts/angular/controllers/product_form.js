ANTALEX.controller('ProductFormController', ['$scope', '$routeParams', 'Products', '$location', 'Global',
function($scope, $routeParams, Products, $location, Global) {
    $scope.isNew = false;
    $scope.usd_rate = $scope.$parent.setting.usd_rate;
    $scope.refreshAssortimentList = false;

    function loadFormData(){
        if($scope.product != null) return;
        if(!$scope.$parent.products) {
            setTimeout(function(){
                loadFormData();
            },50);
            return;
        }
        if($routeParams.id) {
            $scope.$parent.products.each(function(p, i){
                if(p.id == $routeParams.id) {
                    $scope.product = p;
                }
            });
        }  else $scope.isNew = true;

        $scope.categories = $scope.$parent.categories;
        $scope.firms = $scope.$parent.firms;
        if($scope.isNew){
            $scope.product = {exist: true};
            if( $scope.categories.length) $scope.product.category_id = $routeParams.category ?
                $scope.categories.whereId($routeParams.category).id : $scope.categories[0].id;
            if( $scope.firms.length) $scope.product.firm_id = $routeParams.firm ?
                $scope.firms.whereId($routeParams.firm).id : $scope.firms[0].id;
        }

    }

    $scope.priceChanged = function(valute){
        if(valute == 'usd'){
            $scope.product.usd_price = $a.toFloat($scope.product.usd_price);
            $scope.product.price = $a.toFloat(($scope.product.usd_price-0)*($scope.usd_rate-0));
        }else{
            $scope.product.price = $a.toFloat($scope.product.price);
            $scope.product.usd_price = $a.toFloat(($scope.product.price-0)/($scope.usd_rate-0));
        }
        $scope.blank = $a.toFloat($scope.product.usd_price) == 0;
    };

    function isFormInvalid(){
        $scope.showErrors = true;
        if($scope.productForm.$invalid) return true;
        return $scope.blank = $a.toFloat($scope.product.usd_price) == 0;
    }

    $scope.save = function(){
        if(isFormInvalid()) { $a.err('Пожалуйста проверьте правильность заполнения всех полей'); return;}
        if($scope.product.id){
            Products.update({product: $scope.product, id: $scope.product.id, action:'update'}, function(data){
                if(data.success){
                    $location.path('/products/'+$scope.product.id);
                    $location.search($scope.$parent.selectedSearch);
                    $location.hash('glob');
                    $scope.$parent.bindAssortment();
                    $a.info('Изменения сохранены');
                }
            });
        } else {
            Products.save({product: $scope.product}, function(data){
                if(data.success){
                    $scope.product = data.product;
                    $location.path('/products/'+$scope.product.id);
                    $location.search($scope.$parent.selectedSearch);
                    $location.hash('glob');
                    $scope.$parent.products.push($scope.product);
                    $scope.$parent.bindAssortment();
                    $a.info('Добавлен новый товар');
                }
            });
        }
    };

    $scope.cancel = function(){
        $location.path('/products/'+$scope.product.id);
        $location.search($scope.$parent.selectedSearch);
        $location.hash('glob');
        $scope.product = null;
    };

    // categories
    $scope.new_category = function(){
        $scope.new_category_name = '';
    };

    $scope.delete_category = function(){
        if($scope.product.category_id == null) return;
        var cat_name = $scope.categories.whereId($scope.product.category_id).name;
        $a.confirm('<b>Вы действительно хотите удалить<br/>эту категорию?</b><br/><b style="font-size: 20px;">"'+cat_name+'"</b><br/>Пожалуйста убедитесь ' +
            'что в этой категории отсутствуют какие-либо товары',function(){
            Global.delete_category_or_firm_option({category: $scope.product.category_id},function(data){
                if(data.success){
                    $scope.$parent.categories = data.categories;
                    $scope.categories = $scope.$parent.categories;
                    if($scope.categories.length) {
                        $scope.product.category_id = $scope.categories[0].id;
                    } else $scope.product.category_id = null;
                    $scope.$parent.bindAssortment();
                    $a.info('Категория успешно удалена');
                } else {
                    $a.alert('Невозможно удалить эту категорию, т.к. она указана для некоторых товаров.<br/>' +
                        'Для начала необходимо либо удалить эти товары, либо указать для них другую категорию.');
                }
            });
        });
    };

    $scope.add_category = function(){
        if(!$scope.new_category_name || $scope.new_category_name == '') return;
        Global.create_category_or_firm_option({category: {name: $scope.new_category_name}},function(data){
            if(data.success){
                $scope.$parent.categories = data.categories;
                $scope.categories = $scope.$parent.categories;
                $scope.product.category_id = data.category.id;
                $scope.new_category_name = null;
                $scope.needToRebuild = true;
                $a.info('Добавлена новая категория');
            }
        });
    };

    $scope.cancel_category = function(){
        $scope.new_category_name = null;
    };

    // firms
    $scope.new_firm = function(){
        $scope.new_firm_name = '';
    };

    $scope.delete_firm = function(){
        if($scope.product.firm_id == null) return;
        var firm_name = $scope.firms.whereId($scope.product.firm_id).name;
        $a.confirm('<b>Вы действительно хотите удалить<br/>эту фирму?</b><br/><b style="font-size: 20px;">"'+firm_name+'"</b><br/>Пожалуйста убедитесь ' +
            'что в этой фирме отсутствуют какие-либо товары',function(){
            Global.delete_category_or_firm_option({firm: $scope.product.firm_id},function(data){
                if(data.success){
                    $scope.$parent.firms = data.firms;
                    $scope.firms = $scope.$parent.firms;
                    if($scope.firms.length) {
                        $scope.product.firm_id = $scope.firms[0].id;
                    } else $scope.product.firm_id = null;
                    $scope.$parent.bindAssortment();
                    $a.info('Фирма успешно удалена');
                } else {
                    $a.alert('Невозможно удалить эту фирму, т.к. она указана для некоторых товаров.<br/>' +
                        'Для начала необходимо либо удалить эти товары, либо указать для них другую фирму.');
                }
            });
        });
    };

    $scope.add_firm = function(){
        if(!$scope.new_firm_name || $scope.new_firm_name == '') return;
        Global.create_category_or_firm_option({firm: {name: $scope.new_firm_name}},function(data){
            if(data.success){
                $scope.$parent.firms = data.firms;
                $scope.firms = $scope.$parent.firms;
                $scope.product.firm_id = data.firm.id;
                $scope.new_firm_name = null;
                $scope.needToRebuild = true;
                $a.info('Добавлена новая фирма');
            }
        });
    };

    $scope.cancel_firm = function(){
        $scope.new_firm_name = null;
    };

    loadFormData();
}]);