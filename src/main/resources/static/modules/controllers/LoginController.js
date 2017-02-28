var module = angular.module("storyModule");

module.controller('LoginController', ['$scope', '$state', 'notifications', 'AuthService',
                    function ($scope, $state, notifications, AuthService) {

    $scope.credentials = {
        username: "",
        password: ""
    };

    $scope.login = function() {
        AuthService.login( $scope.credentials.username, $scope.credentials.password,
            function(response) {
                $state.go('story');
            }
        );
    }

    $scope.register = function() {
        $state.go('register');
    }
}]);