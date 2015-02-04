'use strict';

angular.module('notes')
  .controller('NotebooksCtrl', function ($scope,alertMesssages,$timeout,notesService,Notes,Notebook) {


    $scope.notebooks=notesService.getNoteBooks();
    $scope.currentNotebook=$scope.notebooks[0];
  //  console.log($scope.notebooks);
    $scope.changeCurrentNotebook=function(notebook){
      $scope.currentNotebook=notebook;
      notebook.getAllPages();
      void 0;
    }
    $scope.noteBook={
      name:''
    };
    $scope.createNotebook=function(){
      var notebook=new Notebook();
      notebook._name=$scope.noteBook.name;
      notebook.create().then(function(){
        void 0;
        $scope.notebooks.push(notebook);
      },function(){
        void 0;
      });
    };

  })
  .controller('PageCtrl', function ($scope,alertMesssages,$timeout,notesService,Notes,Page) {

    $scope.pages=[];
    $scope.isAccordianPage=true;
    $scope.pageModel={
      name:''
    };
    $scope.notesModel={
      name:''
    };
    $scope.pageCreate =function(){
      var page=new Page();
      page._name=$scope.pageModel.name;
      page.create().then(function(){
        $scope.currentNotebook.page.push(page);
      },function(){
        void 0;
      });
    };
    $scope.noteCreate =function(noteCollection){
      var notes=new Notes();
      notes._name=$scope.notesModel.name;
      notes.create().then(function(){
        noteCollection.push(notes);
      },function(){
        void 0;
      });
    };
    $scope.getPages=function(id){
     // $scope.pages=notesService.getPages(id);
    };
    $scope.pageClicked=function(page){
      void 0;
      page.getAllNotes();
    };
      $scope.createPage=function(){

      }
  });
