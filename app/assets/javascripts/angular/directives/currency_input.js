ANTALEX.directive('zoneprice', ['$compile', function($compile){
    return {
        restrict: 'C',
        link: function(scope, element, attrs) {
            var splited = attrs.ngModel.split('.');
            var model = splited[splited.length-1];
            element.on('blur',function(){
                setTimeout(function(){scope.$apply(function(){
                    scope.zones[element.data('index')][model] = $a.toFloat(element.val());
                })},0);
            });
        }
    };
}]);


//$a.toFloat($scope.product.usd_price);