'use strict';

angular.module('notes')
  .controller('MainCtrl', function ($scope) {

    $scope.items=[
      {
        model:'something',
        isMinimized:false
      },
      {
        model:'something',
        isMinimized:false
      }

    ];
    $scope.addItem=function(){

      var model={model:''};
      $scope.items.push(model);
    }
  });
