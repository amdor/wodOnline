var module = angular.module("storyModule", ['ui.router']);

module.directive("navbar", function(){
       return {
           restrict: 'E',
           templateUrl: 'modules/directives/navbar/NavBarTemplate.html'
       }
});

module.directive("modal", function(){
    return {
        restrict: 'E',
        templateUrl: 'modules/directives/modal/ModalTemplate.html'
    }
});

module.config(function($stateProvider){
    $stateProvider
        .state('story',
        {
            data: {
                episode: 1
            },
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
});

