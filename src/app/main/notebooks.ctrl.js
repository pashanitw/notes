'use strict';

angular.module('notes')
  .controller('NotebooksCtrl', ["$scope", "alertMesssages", "$timeout", "notesService", "Notes", "Notebook", "$modal", "Page",
    function ($scope, alertMesssages, $timeout, notesService, Notes, Notebook, $modal, Page) {


      $scope.notebooks=notesService.getData();
        /*fetchNoteList().then(function (response) {
        $scope.notebooks = response;
      }, function () {
        console.log("fetch failed ")
      });*/
      //  console.log($scope.notebooks);
      $scope.viewModel = {
        isPageView: false
      }
     $scope.notebookList = {
        list:[]
      }
      $scope.deleteSelectedNotebooks = function () {

        notesService.deleteSelectedItems($scope.notebookList.list).then(function(){
          angular.forEach($scope.notebookList.list,function(item,index){
            $scope.notebooks.splice(item.index,1);
          })
        })
      };
      $scope.deleteSelectedPages = function () {
        notesService.deleteSelectedItems($scope.curre.list).then(function(){
          angular.forEach($scope.currentNotebook.selectedList,function(item,index){
            $scope.currentNotebook.page.splice(item.index);
          })

        });
      };
      $scope.deleteSelectedNotes = function () {
        notesService.deleteSelectedItems($scope.noteList.list);
      };
      $scope.changeCurrentNotebook = function (notebook) {

        $scope.currentNotebook = notebook;
        $scope.viewModel.isPageView = true;
        notebook.getAllPages();
        void 0;
      };
      $scope.goBack = function () {
        $scope.viewModel.isPageView = false;
      }
      $scope.noteBook = {
        name: ''
      };
      $scope.handelAccordionCheckBox = function ($event) {
        $event.stopPropagation();
      }
      $scope.createNotebook = function (size) {

        var modalInstance = $modal.open({
          templateUrl: 'myModalContent.html',
          controller: 'ModalInstanceCtrl',
          size: "sm",
          resolve: {
            items: function () {
              return $scope.items;
            }
          }
        });

        modalInstance.result.then(function (selectedItem) {
          var notebook = new Notebook();
          notebook._name = selectedItem.name;
          notebook._type="User defined";
          notebook.save().then(function(){
            $scope.notebooks.push(notebook);
          });
        }, function () {
          console.log("cancelled")
        });
      };
      $scope.pageCreate = function (size) {

        var modalInstance = $modal.open({
          templateUrl: 'myModalContent.html',
          controller: 'ModalInstanceCtrl',
          size: "sm",
          resolve: {
            items: function () {
              return $scope.items;
            }
          }
        });

        modalInstance.result.then(function (selectedItem) {

          var page = new Page();
          page._name = selectedItem.name;
          page._type="User defined"
          page.save($scope.currentNotebook);
        }, function () {
          $log.info('Modal dismissed at: ' + new Date());
        });
      };


    }])
  .controller('ModalInstanceCtrl', ["$scope", "$modalInstance", "items", function ($scope, $modalInstance, items) {

    $scope.model = {
      name: ''
    };
    $scope.ok = function () {
      $modalInstance.close($scope.model);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

  }])
  .controller('PageCtrl', ["$scope", "alertMesssages", "$timeout", "notesService", "Notes", "Page", function ($scope, alertMesssages, $timeout, notesService, Notes, Page) {

    $scope.pages = [];
    $scope.isAccordianPage = true;
    $scope.pageModel = {
      name: ''
    };
    $scope.notesModel = {
      name: ''
    };

    $scope.noteCreate = function (noteCollection) {
      var notes = new Notes();
      notes._name = $scope.notesModel.name;
      notes.create().then(function () {
        noteCollection.push(notes);
      }, function () {
        void 0;
      });
    };
    $scope.getPages = function (id) {
      // $scope.pages=notesService.getPages(id);
    };
    $scope.pageClicked = function (page) {
      void 0;
      page.getAllNotes();
    };

  }]);
