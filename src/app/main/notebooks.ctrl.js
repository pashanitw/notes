'use strict';

angular.module('notes')
  .controller('NotebooksCtrl', function ($scope,alertMesssages,$timeout,notesService,Notes) {


    $scope.notebooks=notesService.getNoteBooks();
    $scope.currentNotebook=$scope.notebooks[0];
  //  console.log($scope.notebooks);
    $scope.changeCurrentNotebook=function(notebook){
      $scope.currentNotebook=notebook;
      notebook.getAllPages();
      console.log(notebook);
    }

  })
  .controller('PageCtrl', function ($scope,alertMesssages,$timeout,notesService,Notes) {

    $scope.pages=[];
    $scope.getPages=function(id){
     // $scope.pages=notesService.getPages(id);
    }

  });
