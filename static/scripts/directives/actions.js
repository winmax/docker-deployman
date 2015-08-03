'use strict';

angular.module('composeUiApp')
  .directive('actions', function ($resource) {

    return {
      restrict: 'E',
      scope: {
        project: '=',
        projectId: '=',
        working: '='
      },
      templateUrl: 'views/actions.html',
      controller: function($scope) {

        var Project = $resource('api/v1/projects/:id', null, {
          'update': { method:'PUT' },
          'build': {
            url: 'api/v1/build',
            method: 'POST'
          }
        });


        $scope.kill = function () {
          $scope.working = true;
          var id = $scope.projectId;
          Project.delete({id: id}, function () {
            alertify.success(id + ' killed');
            $scope.working = false;
            $scope.project = Project.get({id: id});
          }, function (err) {
            $scope.working = false;
            alertify.alert(err.data);
          });
        };
        $scope.pull = function () {
          $scope.working = true;
          var id = $scope.projectId;
          Project.update({id: id}, function () {
            alertify.success(id + ' pull terminated');
            $scope.working = false;
          }, function (err) {
            $scope.working = false;
            alertify.alert(err.data);
          });
        };
        $scope.up = function () {
          $scope.working = true;
          var id = $scope.projectId;
          Project.save({id: id}, function (data) {
            alertify.success(data.containers.length + ' container(s) started');
            $scope.working = false;
            $scope.project = Project.get({id: id});
          }, function (err) {
            $scope.working = false;
            alertify.alert(err.data);
          });
        };

        $scope.build = function () {
          $scope.working = true;
          var id = $scope.projectId;
          Project.build({id: id}, function () {
            alertify.success(id + ' build terminated');
            $scope.working = false;
          }, function (err) {
            $scope.working = false;
            alertify.alert(err.data);
          });
        };


      }
    };
  });