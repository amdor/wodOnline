var module = angular.module("storyModule");

module.controller("IndexController", ['$scope', '$state', 'characterUtils',
                    function($scope, $state, characterUtils){

    $scope.showModal = false;
    var episode;
    var character;

    /**
     * Initialize page's dynamic contents
     */
    $scope.windowLoaded = function() {

        //loading data, and showing it
        episode = (typeof(Storage) !== undefined) ? ((sessionStorage.episode > 0) ? Number(sessionStorage.episode) : 0) : 0;
        character =  characterUtils.loadCharacter();/*(typeof(Storage) !== undefined) ?
                         (sessionStorage.character !== undefined) ?
                            characterUtils.loadCharacter(sessionStorage) : characterUtils.newCharacter()
                         : characterUtils.newCharacter();*/
        if (episode > 0) {
            $state.go('story', {episode: episode});
        } else {
            $state.go('story.newGame');
        }

//TODO: these are needed in html
//       addEvent(document.getElementById("story_container"), "click", toggleNav);
    }

}]);