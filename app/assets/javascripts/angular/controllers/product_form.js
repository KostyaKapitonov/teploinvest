MYAPP.controller('ProductFormController', ['$scope', '$routeParams', 'Products', '$location', 'Global', 'ngDialog',
function($scope, $routeParams, Products, $location, Global, ngDialog) {
    $scope.isNew = false;
    $scope.usd_rate = $scope.$parent.setting.usd_rate;
    $scope.refreshAssortimentList = false;
    $scope.valutes = ['RUB', 'USD', 'EUR'];
    $scope.tabs = [];
    $scope.img_to_destroy = [];
    ngDialog.closeAll();

    function get_field_label(field){
        if(field == 'short_desc') return 'Краткое описание';
        if(field == 'description') return 'Описание';
        if(field == 'technical_desc') return 'Технические характеристики';
        return '???';
    }

    function loadFormData(){
        if($scope.product != null) return;
        if(!$scope.$parent.products) {
            setTimeout(function(){
                loadFormData();
            },50);
            return;
        } else if($routeParams.id) {
            $scope.$parent.products.each(function(p, i){
                if(p.id == $routeParams.id) {
                    $scope.product = p;
                }
            });
        }  else $scope.isNew = true;

        $scope.categories = $scope.$parent.categories;
        $scope.firms = $scope.$parent.firms;
        $scope.sub_cats = [{id:null,name:'-Отсутствует-'}];
        $scope.$parent.sub_cats.each(function(sc){$scope.sub_cats.push(sc)});
        if($scope.isNew){
            $scope.product = {exist: true};
            $scope.product.valute = 'RUB';
            if( $scope.categories.length) $scope.product.category_id = $routeParams.category ?
                $scope.categories.whereId($routeParams.category).id : $scope.categories[0].id;
            if( $scope.firms.length) $scope.product.firm_id = $routeParams.firm ?
                $scope.firms.whereId($routeParams.firm).id : $scope.firms[0].id;
            if( $scope.sub_cats.length) $scope.product.sub_cat_id = $routeParams.sub_cat ?
                $scope.sub_cats.whereId($routeParams.sub_cat).id : $scope.sub_cats[0].id;
        }

        if($a.blank($scope.product.images)) {
            Products.get_images({id: $scope.product.id},function(res){
                $scope.product.images = res;
            });
        }

        w('short_desc description technical_desc').each(function(field){
            $scope.tabs.push({status: '', name: field, label: get_field_label(field),
                content: $scope.product[field]})
        });
        $scope.tabs[1].status = 'active';
    }

    $scope.new_img = function(){
        $scope.product.images.push({product_id: $scope.product.id});
    };

    $scope.del_img = function(idx){
        var img = $scope.product.images[idx];
        if (img.id) $scope.img_to_destroy.push(img.id);
        $scope.product.images.splice(idx,1);
    };

    $scope.choose_tab = function(idx){
        $scope.tabs.each(function(tab){
            tab.status = '';
        });
        $scope.tabs[idx].status = 'active';
    };

    $scope.priceChanged = function(){
        $scope.product.price = $a.toFloat($scope.product.price);
        $scope.blank = $a.toFloat($scope.product.price) == 0;
    };

    $scope.edit_desc = function(desc_name){
        $scope.html_to_edit = $scope.product[desc_name];
        var dialog = ngDialog.open({template: '/html_popup_editor',  scope: $scope});
        dialog.closePromise.then(function (data) {
            if(data.value != '$document' && data.value != '$closeButton') $scope.product[desc_name] = data.value;
            $scope.tabs.where('name',desc_name).content = $scope.product[desc_name];
        });
    };

    function isFormInvalid(){
        $scope.showErrors = true;
        if($scope.productForm.$invalid) return true;
        return $scope.blank = $a.toFloat($scope.product.price) == 0;
    }

    $scope.save = function(){
        if(isFormInvalid()) { $a.err('Пожалуйста проверьте правильность заполнения всех полей'); return;}
        var on_success = function(){
            if($scope.product.valute == 'RUB') $scope.product.rub_price = $scope.product.price;
            if($scope.product.valute == 'USD') $scope.product.rub_price = $scope.product.price * $scope.$parent.setting.usd_rate;
            if($scope.product.valute == 'EUR') $scope.product.rub_price = $scope.product.price * $scope.$parent.setting.eur_rate;
        };
        $scope.product.images_attributes = $scope.product.images;
        if($scope.product.id){
            //$scope.img_to_destroy
            console.log($scope.img_to_destroy);
            Products.del_image({id: $scope.product.id, img_ids: $scope.img_to_destroy});
            Products.update({product: $scope.product, id: $scope.product.id, action:'update'}, function(data){
                if(data.success){
                    on_success();
                    $scope.$parent.bindAssortment();
                    $a.info('Изменения сохранены');
                    $location.path('/products').search({prod_id: $scope.product.id});
                }
            });
        } else {
            Products.save({product: $scope.product}, function(data){
                if(data.success){
                    $scope.product = data.product;
                    on_success();
                    $scope.$parent.products.push($scope.product);
                    $scope.$parent.bindAssortment();
                    $a.info('Добавлен новый товар');
                    $location.path('/products').search({category: $scope.product.category_id,
                        sub_cat: $scope.product.sub_cat_id, firm: $scope.product.firm_id, prod_id: $scope.product.id});
                    $location.hash('glob');
                }
            });
        }
    };

    $scope.cancel = function(){
        if($scope.isNew) $location.path('/products');
        else {
            $location.path('/products');
            $location.search('prod_id', $scope.product.id);
        }
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
        if(!$scope.new_category_name || $scope.new_category_name == '') {
            $a.err('Заполните название категории');
            return;
        }
        Global.create_category_or_firm_option({category: {name: $scope.new_category_name}},function(data){
            if(data.success){
                $scope.$parent.categories = data.categories;
                $scope.categories = $scope.$parent.categories;
                $scope.product.category_id = data.category.id;
                $scope.new_category_name = null;
                $a.info('Добавлена новая категория');
            }
        });
    };

    $scope.cancel_category = function(){
        $scope.new_category_name = null;
    };

    // sub categories
    $scope.new_sub_cat = function(){
        $scope.new_sub_cat_name = '';
    };

    $scope.delete_sub_cat = function(){
        if($scope.product.sub_cat_id == null) return;
        var cat_name = $scope.sub_cats.whereId($scope.product.sub_cat_id).name;
        $a.confirm('<b>Вы действительно хотите удалить<br/>эту подкатегорию?</b><br/><b style="font-size: 20px;">"'+cat_name+'"</b><br/>Пожалуйста убедитесь ' +
            'что в этой подкатегории отсутствуют какие-либо товары',function(){
            Global.delete_category_or_firm_option({sub_cat: $scope.product.sub_cat_id},function(data){
                if(data.success){
                    $scope.$parent.sub_cats = data.sub_cats;
                    $scope.sub_cats = $scope.$parent.sub_cats;
                    if($scope.sub_cats.length) {
                        $scope.product.sub_cat_id = $scope.sub_cats[0].id;
                    } else $scope.product.sub_cat_id = null;
                    $scope.$parent.bindAssortment();
                    $a.info('Подкатегория успешно удалена');
                } else {
                    $a.alert('Невозможно удалить эту подкатегорию, т.к. она указана для некоторых товаров.<br/>' +
                        'Для начала необходимо либо удалить эти товары, либо указать для них другую подкатегорию.');
                }
            });
        });
    };

    $scope.add_sub_cat = function(){
        if(!$scope.new_sub_cat_name || $scope.new_sub_cat_name == '') {
            $a.err('Заполните название подкатегории');
            return;
        }
        Global.create_category_or_firm_option({sub_cat: {name: $scope.new_sub_cat_name}},function(data){
            if(data.success){
                $scope.$parent.sub_cats = data.sub_cats;
                $scope.sub_cats = $scope.$parent.sub_cats;
                $scope.product.sub_cat_id = data.sub_cat.id;
                $scope.new_sub_cat_name = null;
                $a.info('Добавлена новая категория');
            }
        });
    };

    $scope.cancel_sub_cat = function(){
        $scope.new_sub_cat_name = null;
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
        if(!$scope.new_firm_name || $scope.new_firm_name == '') {
            $a.err('Заполните название фирмы');
            return;
        }
        Global.create_category_or_firm_option({firm: {name: $scope.new_firm_name}},function(data){
            if(data.success){
                $scope.$parent.firms = data.firms;
                $scope.firms = $scope.$parent.firms;
                $scope.product.firm_id = data.firm.id;
                $scope.new_firm_name = null;
                $a.info('Добавлена новая фирма');
            }
        });
    };

    $scope.cancel_firm = function(){
        $scope.new_firm_name = null;
    };

    loadFormData();
}]);