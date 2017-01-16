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

module.config(function($stateProvider){
    $stateProvider
        .state('story',
        {
            views: {
                'ContentView': {
                    templateUrl: 'modules/views/StoryViewTemplate.html',
                    controller: 'StoryController',
                    params: {
                        episode: 1
                    }
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
                episode: 1,
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
});

