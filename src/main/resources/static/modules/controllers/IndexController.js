var module = angular.module("storyModule");

module.controller("IndexController", ['$scope', '$state', 'characterUtils',
                    function($scope, $state, characterUtils){

    /**
     * Initialize page's dynamic contents
     */
    $scope.windowLoaded = function() {

        //loading data, and showing it
        var character =  characterUtils.loadCharacter();
        if (character.episode > 0) {
            $state.go('story');
        } else {
            $state.go('story.newGame');
        }
    }

}]);