var module = angular.module("storyModule");

module.controller("IndexController", ['$scope', '$rootScope', '$state', 'characterUtils',
                    function($scope, $rootScope, $state, characterUtils) {

    $rootScope.loggedIn = $rootScope.loggedIn ? $rootScope.loggedIn : false;

    /**
     * Initialize page's dynamic contents
     */
     if( $rootScope.loggedIn ) {
        characterUtils.loadCharacter( function(character){
            if (character.episode > 0) {
                $state.go('story');
            } else {
                $state.go('story.newGame');
            }
        });
     }

}]);

module.run(function ($rootScope, $state, AuthService) {
  $rootScope.$on('$stateChangeStart',
                    function (event, toState, toParams, fromState, fromParams, options) {

        if( toState.name !== 'login' && toState.name !== 'register' ) {
            $rootScope.loggedIn = true;
        } else {
            $rootScope.loggedIn = false;
        }
  });
})