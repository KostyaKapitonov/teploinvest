ANTALEX.controller('MainPageController', ['$scope', '$location',
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
            } else if($location.path() == '/contacts'){
                $scope.setting.current_page_html = $scope.setting.contacts_text;
//                ymaps.ready(function(){
//                    $a.getMapData(null,function(res) {
//                        var map = new ymaps.Map("y_map", {center: res.center, zoom: res.zoom});
//                        res.geoObjects.each(function (go) {
//                            cl('go.style.split(1)', go.style.substr(1));
//                            cl('res.styles[go.style.split(1)]', res.styles[go.style.substr(1)]);
//                            var new_go = new ymaps.GeoObject(go, res.styles[go.style.substr(1)]);
//                            map.geoObjects.add(new_go);
//                        });
//                        window.mp = map;
//                        window.rs = res;
//                    });
//                });
            }
        }
    };
    $scope.refreshLoadStatus();
}]);

