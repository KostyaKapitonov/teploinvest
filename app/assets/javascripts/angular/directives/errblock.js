MYAPP.directive('errblock', ['$compile', function($compile){
    return {
        restrict: 'C',
        link: function(scope, element, attrs) {
            var td = element.parent();
            var elements = td.prev().find('input, select');
            elements.after(element);
            elements.on('focus', function(e){
                if(!element.hasClass('editing')) element.addClass('editing');
            });
            elements.on('blur', function(e){
                if(element.hasClass('editing')) element.removeClass('editing');
            });
            element.click(function(e){
                if(elements.length)elements[0].focus();
            });
            setTimeout(function(){
                td.remove();
            },0);
        }

    };
}]);