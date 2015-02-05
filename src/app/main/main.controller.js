'use strict';

angular.module('notes')
  .controller('MainCtrl', function ($scope,alertMesssages,$timeout,notesService,Notes) {

var note=new Notes();
    //note.data.__cdata="<p><input value='something' contenteditable='false'></p>";
    $scope.items=[new Notes(),note];
    void 0;
    window.maxIndex=200;
    $scope.callFromTitle=function($event){
      $event.preventDefault();
      $event.stopPropagation();
      void 0;
    }
    $scope.isDraggableMode=true;

  });
