MYAPP.controller('ProductsListController', ['$scope', '$location','$routeParams', 'Products', '$sce',
function($scope, $location, $routeParams, Products, $sce) {

    $scope.current_page = $scope.$parent.current_page || 1;

    function refreshLoadStatus(counter){
        counter = counter || 0;
        if(counter < 50 && ($a.blank($scope.$parent) || $a.blank($scope.$parent.products))){
            setTimeout(function(){
                refreshLoadStatus(counter++);
            },100);
        } else {
            $scope.admin = $scope.$parent.admin;
            $scope.product_list = $scope.$parent.product_list;
        }
    }
    refreshLoadStatus();

    $scope.remember_page = function(page_n){
        $scope.$parent.current_page = page_n;
        console.log(['remember_page, page_n == ',page_n]);
    };

    $scope.gen_prod_params = function(prod){
        var search = $location.search();
        var hash_params = {category: search.category, sub_cat: search.sub_cat, firm: search.firm, prod_id: prod.id};
        return hash_to_string_params(hash_params);
    };

}]);