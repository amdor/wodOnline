var module = angular.module("storyModule");

module.controller("IndexController", ['$scope', '$rootScope', '$state', 'characterUtils',
                    function($scope, $rootScope, $state, characterUtils) {

    $rootScope.loggedIn = false;

    /**
     * Initialize page's dynamic contents
     */
    var character =  characterUtils.loadCharacter();
    if (character.episode > 0) {
        $state.go('story');
    } else {
        $state.go('story.newGame');
    }

}]);

module.run(function ($rootScope, $state, AuthService) {
  $rootScope.$on('$stateChangeStart',
                    function (event, toState, toParams, fromState, fromParams, options) {

        if( toState.name !== 'login' ) {
            $rootScope.loggedIn = true;
        } else {
            $rootScope.loggedIn = false;
        }
  });
})