'use strict';

angular.module('notes')
  .controller('NotebooksCtrl', function ($scope,alertMesssages,$timeout,notesService,Notes,Notebook,$modal) {


    $scope.notebooks=notesService.getNoteBooks();
  //  console.log($scope.notebooks);
    $scope.viewModel={
      isPageView:false
    }
    $scope.changeCurrentNotebook=function(notebook){
      
      $scope.currentNotebook=notebook;
      $scope.viewModel.isPageView=true;
      notebook.getAllPages();
      void 0;
    }
    $scope.goBack=function(){
      $scope.viewModel.isPageView=false;
    }
    $scope.noteBook={
      name:''
    };
/*    $scope.createNotebook=function(){
      var notebook=new Notebook();
      notebook._name=$scope.noteBook.name;
      notebook.create().then(function(){
        void 0;
        $scope.notebooks.push(notebook);
      },function(){
        void 0;
      });
    };*/
    $scope.handelAccordionCheckBox=function($event){
      $event.stopPropagation();
    }
    $scope.createNotebook = function (size) {

      var modalInstance = $modal.open({
        templateUrl: 'myModalContent.html',
        controller: 'ModalInstanceCtrl',
        size: size,
        resolve: {
          items: function () {
            return $scope.items;
          }
        }
      });

      modalInstance.result.then(function (selectedItem) {
        void 0;
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };


  })
  .controller('ModalInstanceCtrl', function ($scope, $modalInstance, items) {

    $scope.noteBook={
      name:''
    };
  $scope.ok = function () {
    $modalInstance.close($scope.noteBook);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
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
