ANTALEX.factory('Global', ['$resource', function($resource) {
    return $resource('/:action', null,
        {
            main: {params: {format:'json', action: 'main_content'}},
            get_category_and_firm_options: {params: {action: 'get_category_and_firm_options'}},
            create_category_or_firm_option: {method:'POST', params: {action: 'create_category_or_firm_option'}},
            delete_category_or_firm_option: {method:'DELETE', params: {action: 'delete_category_or_firm_option'}},
            update_settings: {method:'POST', params: {action: 'update_settings'}},
            captcha: {params: {action:'captcha'}}
        });
}]);