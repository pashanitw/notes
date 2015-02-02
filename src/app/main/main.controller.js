'use strict';

angular.module('notes')
  .controller('MainCtrl', function ($scope,alertMesssages,$timeout,notesService,Notes) {


    $scope.items=notesService.getData();
    console.log($scope.items);
    window.maxIndex=200;

    $scope.addItem=function(){
      var note=new Notes();
      $scope.items.push(note);
    }
  });
