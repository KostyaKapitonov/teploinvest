MYAPP.controller('CustomPagesController', ['$scope', '$location', 'CustomPages',
function($scope, $location, CustomPages) {

    $scope.init = function(){
        $scope.page = $scope.page_to_edit || {};
        if($a.blank($scope.page.color)){
            $scope.page.color = '#999999';
        }
    };

    $scope.save_page = function(){

        $scope.ng_dialog.close($scope.page);
        $scope.page = null;
    };

    $scope.cancel = function(){
        $scope.ng_dialog.close(null);
        $scope.page = null;
    };

    $scope.init();
}]);