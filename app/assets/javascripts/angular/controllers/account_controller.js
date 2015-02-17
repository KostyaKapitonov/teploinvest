MYAPP.controller('AccountController', ['$scope', '$location', 'User',
function($scope, $location, User) {

    $scope.showErrors = false; //User.account()
    $scope.currentUser = $scope.$parent.currentUser;

    function isFormInvalid(){
        $scope.showErrors = true;
        if($scope.form.$invalid) {
            $a.err('Пожалуйста проверьте правильность заполнения всех полей.');
            return true;
        }
    }

    $scope.applyData = function(){
        if(isFormInvalid()) return;
        $a.wait();
        User.account({user: $scope.currentUser}, function(res){
            $a.done();
            if(res.success){
                $a.info('Ваши данные сохранены');
                $scope.$parent.currentUser = $scope.currentUser;
                $location.path('/');
            } else {
                cl(res);
                $a.err('неизвестная ошибка');
            }
        });
    }

}]);