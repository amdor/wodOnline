var module = angular.module("storyModule", ['ui.router']);

module.directive("navbar", function(){
       return {
           restrict: 'E',
           controller: "NavBarController",
           templateUrl: 'modules/directives/navbar/NavBarTemplate.html'
       }
});

module.directive("modal", function(){
    return {
        restrict: 'E',
//        controller: "NavBarController",
        templateUrl: 'modules/directives/modal/ModalTemplate.html'
    }
});

module.config(function( $stateProvider, $locationProvider ) {
    $locationProvider.html5Mode( { enabled: true, requireBase: false } );

    $stateProvider
        .state('story',
        {
            url: "/",
            views: {
                'ContentView': {
                    templateUrl: 'modules/views/StoryViewTemplate.html',
                    controller: 'StoryController'
                }
            }
        })
        .state('story.newGame',
        {
            views: {
                'ContentView@': {
                    templateUrl: 'modules/views/NewGameTemplate.html',
                    controller: 'NewGameController'
                }
            }
        })
        .state('story.answered',{
            views: {
                'ContentView@': {
                    templateUrl: 'modules/views/AnswerViewTemplate.html',
                    controller: 'AnswerController'
                }
            },
            params: {
                answer: null
            }
        })
        .state('npc',
        {
            views: {
                'ContentView': {
                    templateUrl: 'modules/views/NPCViewTemplate.html',
                    controller: 'NpcController'
                }
            }
        })
        .state('login',
        {
            url: "/login",
            views: {
                'ContentView': {
                    templateUrl: 'modules/views/LoginTemplate.html',
                    controller: 'LoginController'
                }
            }
        })
        .state('register',
        {
            views: {
                'ContentView': {
                    templateUrl: 'modules/views/RegisterTemplate.html',
                    controller: 'RegisterController'
                }
            }
        })
});

