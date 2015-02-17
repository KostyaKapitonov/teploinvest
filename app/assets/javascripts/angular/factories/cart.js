MYAPP.factory('Cart', ['$resource', function($resource) {
    return $resource('/carts/:action/:id', {format: 'json'},
        {
            'all':              {isArray: true},
            'statuses':         {params: {action:'statuses'}, isArray: true},
            'view':             {params: {action:'view', format:'json'}},
            'add_position':     {method: 'POST', params: {action: 'add_position'}},
            'remove_position':  {method: 'DELETE', params: {action: 'remove_position'}},
            'confirm':          {method: 'POST', params: {action: 'confirm'}},
            'proceed':          {method: 'POST', params: {action: 'proceed'}},
            'destroy':          {method: 'DELETE'},
            'zones':            {params: {action: 'zones'}, isArray: true},
            'add_zone':         {method: 'POST', params: {action: 'add_zone'}},
            'del_zone':         {method: 'DELETE', params: {action: 'del_zone'}}
        });
}]);