MYAPP.factory('CustomPages', ['$resource', function($resource) {
    return $resource('/custom_pages/:id/:action', {format: 'json'},
        {
            set_order: {params:{action:'set_order'}}
        }
    )
}]);