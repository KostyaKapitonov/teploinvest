MYAPP.controller('ProductsListController', ['$scope', '$location','$routeParams', 'Products', '$sce', 'ngDialog',
function($scope, $location, $routeParams, Products, $sce, ngDialog) {

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

    $scope.open_view_popup = function(prod_id){
        $scope.prod_id = prod_id;
        ngDialog.open({template: '/products/1.html', controller: 'ProductViewController',
            appendTo: '.content .main', scope: $scope});
    };

}]);