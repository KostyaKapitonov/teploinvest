MYAPP.controller('CustomPagesController', ['$scope', '$location', 'CustomPages',
function($scope, $location, CustomPages) {

    $scope.showErrors = false;
    $scope.is_new = false;

    $scope.init = function(){
        $scope.page = $scope.page_to_edit || {};
        if($a.blank($scope.page.color)){
            $scope.page.color = '#999999';
            $scope.is_new = true;
        }
    };

    function is_invalid(){
        $scope.showErrors = true;
        cl(['$scope.pageForm.invalid',$scope.pageForm.$invalid]);
        return $scope.pageForm.$invalid;
    }

    $scope.save_page = function(){
        if(is_invalid()) return;
        $scope.ng_dialog.close({is_new: $scope.is_new,page: $scope.page});
        $scope.page = null;
    };

    $scope.cancel = function(){
        $scope.ng_dialog.close(null);
        $scope.page = null;
    };

    $scope.init();
}]);