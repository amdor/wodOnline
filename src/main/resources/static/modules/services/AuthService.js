var app = angular.module("storyModule");

app.factory('AuthService', ['$http', '$httpParamSerializer', 'notifications',
            function( $http, $httpParamSerializer, notifications ) {

    function login( username, pass, success ) {
        $http.post("/login",
            $httpParamSerializer({username: username, password: pass}),
            {headers: {
                    'Content-Type': "application/x-www-form-urlencoded"
            }}
        )
        .then(
        function(response) {
            success(response);
        },
        function( jqXHR, textStatus, errorThrown){
            notifications.showAlert("Request resulted in error");
        });
    }

    function register( username, pass, success ) {
        $http.post("/register",
            {username: username, password: pass},
            {headers: {
                    'Content-Type': "application/json"
            }}
        )
        .then(
        function(response) {
            success(response);
        },
        function( jqXHR, textStatus, errorThrown){
            notifications.showAlert("Request resulted in error");
        });
    }

    function logout( success, failure ) {
        $http.post( "/logout" )
        .then( success, failure );
    }

    return {
        login: login,
        logout: logout,
        register: register
    };
}]);