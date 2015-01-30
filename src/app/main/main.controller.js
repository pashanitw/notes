'use strict';

angular.module('notes')
  .controller('MainCtrl', function ($scope,alertMesssages,$timeout,notesService) {


    $scope.items=notesService.getData();
    //console.log(items);

    $scope.addItem=function(){

      var model={model:''};
      $scope.items.push(model);
    }
  });
