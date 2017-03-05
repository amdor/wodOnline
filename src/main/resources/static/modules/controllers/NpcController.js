var module = angular.module("storyModule");

module.controller('NpcController', ['$scope', 'notifications', '$http',
            function($scope, notifications, $http) {

    $scope.npcs = [];
    var showAlert = notifications.showAlert;

    /**
     * Gets npcs from the database
     */
    $scope.$on('$viewContentLoaded', function(event){
        $http.get("/npcs")
        .then(
        function(response){
            $scope.npcs = response.data;
        },
        function(){
           showAlert("Request resulted in error");
        });
    });
}]);
