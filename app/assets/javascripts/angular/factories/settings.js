MYAPP.factory('Setting', ['$resource', function($resource) {
    return $resource('/settings/:action', {format: 'json'},
        {
            'update': {method: 'POST'}
        });
}]);