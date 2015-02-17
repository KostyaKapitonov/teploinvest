MYAPP.controller('MainPageController', ['$scope', '$location',
function($scope, $location) {

    $scope.refreshLoadStatus = function(counter){
        counter = counter || 0;
        if(counter < 20 && ($a.blank($scope.setting) &&
            ($a.blank($scope.$parent) || $a.blank($scope.$parent.setting)))){
            setTimeout(function(){
                $scope.refreshLoadStatus(++counter);
            },200);
        } else {
            $scope.setting = $scope.setting || $scope.$parent.setting;
            if($location.path() == '/'){
                $scope.setting.current_page_html = $scope.setting.main_page_text;
//            } else if($location.path() == '/contacts'){
//                $scope.setting.current_page_html = $scope.setting.contacts_text;
            } else {
                $scope.setting.current_page_html =  $scope.setting[$location.path().substr(1)+'_text'];
            }
        }
    };
    $scope.refreshLoadStatus();
}]);

