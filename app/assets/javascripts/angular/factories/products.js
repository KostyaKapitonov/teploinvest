ANTALEX.factory('Products', ['$resource', function($resource) {
    return $resource('/products/:id/:action', {id: '@id'},
        {
           'update': {method: 'PUT'},
           'getAll': {params: {format:'json'}, isArray: false},
           'main': {params: {format:'json',action: 'main_content'}, isArray: false}
        });
}]);