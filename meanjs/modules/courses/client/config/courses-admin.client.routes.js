(function () {
  'use strict';

  angular
    .module('courses.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.courses', {
        abstract: true,
        url: '/courses',
        template: '<ui-view/>'
      })
      .state('admin.courses.list', {
        url: '',
        templateUrl: '/modules/courses/client/views/admin/list-courses.client.view.html',
        controller: 'CoursesAdminListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        }
      })
      .state('admin.courses.create', {
        url: '/create',
        templateUrl: '/modules/courses/client/views/admin/form-article.client.view.html',
        controller: 'CoursesAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          articleResolve: newArticle
        }
      })
      .state('admin.courses.edit', {
        url: '/:articleId/edit',
        templateUrl: '/modules/courses/client/views/admin/form-article.client.view.html',
        controller: 'CoursesAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin'],
          pageTitle: '{{ articleResolve.title }}'
        },
        resolve: {
          articleResolve: getArticle
        }
      });
  }

  getArticle.$inject = ['$stateParams', 'CoursesService'];

  function getArticle($stateParams, CoursesService) {
    return CoursesService.get({
      articleId: $stateParams.articleId
    }).$promise;
  }

  newArticle.$inject = ['CoursesService'];

  function newArticle(CoursesService) {
    return new CoursesService();
  }
}());
