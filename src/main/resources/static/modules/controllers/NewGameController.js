var module = angular.module("storyModule");

module.controller('NewGameController', ['$scope', '$state', function ($scope, $state){

     $scope.$on('$viewContentLoaded', function(event){
        sessionStorage.clear();
        var $downloadingImage = $("<img>");
        var $image = $("#startingImage");
        $downloadingImage.on('load', function(){
          $image.attr("src", $(this).attr("src"));
        });
        $downloadingImage.attr( "src", window.location + '/img/start.png' );
    });

    $scope.loadFirstChapter = function() {
        $state.go('story')
    }
}]);