MYAPP.directive('ckEditor', [function () {
    return {
        require: '?ngModel',
        restrict: 'C',
        link: function (scope, elm, attr, model) {
            CKEDITOR.config.uiColor = '#dfc9c0'; // COLOR
            CKEDITOR.config.allowedContent = true; // to allow JS
            var isReady = false;
            var data = [];
            var ck = CKEDITOR.replace(elm[0]);

            function setData() {
                if (!data.length) {
                    return;
                }

                var d = data.splice(0, 1);
                ck.setData(d[0] || '<span></span>', function () {
                    setData();
                    isReady = true;
                });
            }

            ck.on('instanceReady', function (e) {
                if (model) {
                    setData();
                }
            });

            elm.bind('$destroy', function () {
                ck.removeAllListeners();
                CKEDITOR.remove(ck);
            });

            if (model) {
                ck.on('change', function () {
                    scope.$apply(function () {
                        var data = ck.getData();
                        if (data == '<span></span>') {
                            data = null;
                        }
                        model.$setViewValue(data);
                    });
                });

                model.$render = function (value) {
                    if (model.$viewValue === undefined) {
                        model.$setViewValue(null);
                        model.$viewValue = null;
                    }

                    data.push(model.$viewValue);

                    if (isReady) {
                        isReady = false;
                        setData();
                    }
                };
            }

        }
    };
}]);