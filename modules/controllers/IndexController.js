var module = angular.module("storyModule");

module.controller("IndexController", ['$scope', '$rootScope', '$state', function($scope, $rootScope, $state){

    $scope.showModal = false;

    //Static vars (used by other js too)
    var episode;
    var character;
    var contentDiv;
    var titleHead;
    var characterStatDiv;


    /**
     * Saves important user data to sessionStorage before leaving the page
     */
    $rootScope.$on('$stateChangeStart',
        function(event, toState, toParams, fromState, fromParams, options){
            if( typeof(Storage) !== undefined ) {
                sessionStorage.episode = episode;
                saveCharacter(sessionStorage, character);
            }
            toState.data.episode = episode;
    });
    /**
     * Initialize page's dynamic contents
     */
    $scope.windowLoaded = function() {

       //creating dynamic content containers
       titleHead = $("<h3>", {id: "title_Div"});
       contentDiv = $("<div>", {id: "content_Div"});
       var storyContainer = $("#story_container");
       storyContainer.css({"cursor": "default"});
       storyContainer.prepend(titleHead, contentDiv);

       //as for the rest of the code need to be simple element
       titleHead = document.getElementById("title_Div");
       contentDiv = document.getElementById("content_Div");

       characterStatDiv = document.getElementById( "character_stat" );

       //loading data, and showing it
       episode = (typeof(Storage) !== undefined) ? ((sessionStorage.episode > 0) ? Number(sessionStorage.episode) : 0) : 0;
       character =  (typeof(Storage) !== undefined) ?
                         (sessionStorage.character !== undefined) ?
                            loadCharacter(sessionStorage) : new Character()
                         : new Character();
       if (episode > 0) {
          indexStoryState();
          loadStory(episode);
       } else {
          $state.go('story.newGame');
       }

//TODO: these are needed in html
//       addEvent(document.getElementById("answer_row"), "click", answerClicked);
//       addEvent(document.getElementById("story_container"), "click", toggleNav);
    }


}]);