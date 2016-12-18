var module = angular.module("storyModule");

module.controller("IndexController", ['$scope', '$rootScope', '$state', 'characterUtils',
                    function($scope, $rootScope, $state, characterUtils){

    $scope.showModal = false;
    var episode;
    var character;

    /**
     * Saves important user data to sessionStorage before leaving the page
     */
    $rootScope.$on('$stateChangeStart',
        function(event, toState, toParams, fromState, fromParams, options){
            if( typeof(Storage) !== undefined ) {
                sessionStorage.episode = episode;
                characterUtils.saveCharacter(sessionStorage, character);
            }
            toState.data.episode = episode;
    });
    /**
     * Initialize page's dynamic contents
     */
    $scope.windowLoaded = function() {

        //loading data, and showing it
        episode = (typeof(Storage) !== undefined) ? ((sessionStorage.episode > 0) ? Number(sessionStorage.episode) : 0) : 0;
        character =  (typeof(Storage) !== undefined) ?
                         (sessionStorage.character !== undefined) ?
                            characterUtils.loadCharacter(sessionStorage) : characterUtils.newCharacter()
                         : characterUtils.newCharacter();
        if (episode > 0) {
            $state.go('story');
        } else {
            $state.go('story.newGame');
        }

//TODO: these are needed in html
//       addEvent(document.getElementById("story_container"), "click", toggleNav);
    }

}]);