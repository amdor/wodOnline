var module = angular.module("storyModule");

module.controller('NpcController', ['$scope', 'notifications', '$http',
            function($scope, notifications, $http) {

    $scope.npcs = [];
    var showAlert = notifications.showAlert;

    /**
     * Gets npcs from the database
     */
    $scope.$on('$viewContentLoaded', function(event){
        $http.get("/npcs", fillTable)
        .fail(function(){
           $scope.$apply(function() {showAlert("Request resulted in error");});
        });
    });

    /**
     * Handle response, fill table
     */
    function fillTable(data) {
        $scope.$apply(function() {$scope.npcs = data;});
    }
}]);
