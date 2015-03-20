MYAPP.factory('Products', ['$resource', function($resource) {
    return $resource('/products/:id/:action', {id: '@id'},
        {
            update: {method: 'PUT'},
            getAll: {params: {format:'json'}, isArray: false},
            main: {params: {format:'json',action: 'main_content'}, isArray: false},
            del_image: {method: 'POST',params: {format:'json',action: 'del_image'}},
            get_images: {params: {format:'json',action: 'get_images'}, isArray: true}
        });
}]);