(function () {
  'use strict';

  angular
    .module('courses.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('courses', {
        abstract: true,
        url: '/courses',
        template: '<ui-view/>'
      })
      .state('courses.list', {
        url: '',
        templateUrl: '/modules/courses/client/views/list-courses.client.view.html',
        controller: 'CoursesListController',
        controllerAs: 'vm'
      })
      .state('courses.view', {
        url: '/:articleId',
        templateUrl: '/modules/courses/client/views/view-article.client.view.html',
        controller: 'CoursesController',
        controllerAs: 'vm',
        resolve: {
          articleResolve: getArticle
        },
        data: {
          pageTitle: '{{ articleResolve.title }}'
        }
      });
  }

  getArticle.$inject = ['$stateParams', 'CoursesService'];

  function getArticle($stateParams, CoursesService) {
    return CoursesService.get({
      articleId: $stateParams.articleId
    }).$promise;
  }
}());
