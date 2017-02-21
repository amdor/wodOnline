var app = angular.module("storyModule");

app.factory('AuthService', ['$http' , function( $http ) {

    function login( username, pass, success ) {
        $.post("/", {username: username, password: pass})
        .then(
        function(response) {
            success(response);
        },
        function( jqXHR, textStatus, errorThrown){
           $scope.$apply(function() {showAlert("Request resulted in error");});
        });
    }

    function logout() {}

    return {
        login: login,
        logout: logout
    };
}]);