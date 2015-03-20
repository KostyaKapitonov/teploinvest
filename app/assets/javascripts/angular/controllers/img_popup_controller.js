MYAPP.controller('ImgPopupController', ['$scope',
function($scope) {

//    $scope.popup_images = $scope.$parent.popup_images;
    $scope.next_img = function(cursor){
        $scope.popup_images.current_idx += cursor;
        if($scope.popup_images.current_idx == $scope.popup_images.all.length)
            $scope.popup_images.current_idx = 0;
        else if($scope.popup_images.current_idx < 0)
            $scope.popup_images.current_idx = $scope.popup_images.all.length-1;
        $scope.popup_images.current_src = $scope.popup_images.all[$scope.popup_images.current_idx].src;
    }

}]);