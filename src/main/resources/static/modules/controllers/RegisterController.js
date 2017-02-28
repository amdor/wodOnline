var module = angular.module("storyModule");

module.controller('RegisterController', ['$scope', '$state', 'AuthService',
                    function ($scope, $state, AuthService) {

    $scope.userName = "";
    $scope.password = "";
    $scope.password2 = "";
    $scope.email = "";

    $scope.enter = function(e) {
        var key = e.keyCode ? e.keyCode : e.which;
        if (key == 13) {
            register();
        }
    }


    $scope.register = function() {
        var valid = true;
        $('form input').each(function(){
            valid = valid ? this.checkValidity() : valid; //change to false but to true never
        });
        if( $scope.password == $scope.password2 && valid )
        {
            var registerData = {
                name: $scope.userName,
                password: $scope.password
            };
            AuthService.register( registerData.name, registerData.password,
            function(response) {
                $state.go('login');
            });
        }
    }

    $scope.back = function(){
        $state.go('login');
    }
}]);