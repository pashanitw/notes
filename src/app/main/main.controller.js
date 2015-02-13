'use strict';

angular.module('notes')
  .controller('MainCtrl', function ($scope,alertMesssages,$timeout,notesService,Notes,$rootScope) {

var note=new Notes();
    //note.data.__cdata="<p><input value='something' contenteditable='false'></p>";
    $scope.items=[];
    void 0;
    window.maxIndex=200;
    $scope.callFromTitle=function($event){
      $event.preventDefault();
      $event.stopPropagation();
      void 0;
    };
      $scope.addNotes=function(){
      var item=new Notes();
        setIconPosition(item);
        notesPosition(item);
      $scope.items.push(item);
    };
    $scope.isDraggableMode=true;
    $scope.line={
      x1:0,
      y1:0,
      x2:200,
      y2:200,
      visible:false
    }

    $rootScope.$on('draw-line', function (event, line) {
      $scope.line=line;
    });
    /* calculation for the displaying icons and notes for fist time*/
    function isCollide(a, b) {
      return !(
      ((a.y + a.height) < (b.y)) ||
      (a.y > (b.y + b.height)) ||
      ((a.x + a.width) < b.x) ||
      (a.x > (b.x + b.width))
      );
    }
    var iconX=$(document).width()-50,
      iconY= 0,
      iconWidth=50,
      iconHeight=50,
      iconPadding=5;

    function setIconPosition(newNotes){

      newNotes._iconX=iconX;
      newNotes._iconY=iconY;
      if(!$scope.items.length){
        return;
      }
      var isFound=false;
      while(!isFound){
        isFound=true;
        var a={
          y:newNotes._iconY,
          x:newNotes._iconX,
          width:iconWidth-iconPadding,
          height:iconHeight
        };
        for(var i= 0,length=$scope.items.length;i<length;i++){
          var item=$scope.items[i];

          var b={
            y:item._iconY,
            x:item._iconX,
            width:iconWidth-iconPadding,
            height:iconHeight
          };
          if(isCollide(a,b)){
            isFound=false;
            break;
          }


        }
        if(!isFound){
          newNotes._iconX-=iconWidth;
        }

      }

    }
    //From Here it will be notes position
    var notesPadding=50,
      notesWidth=378,
      notesHeight=200;
    var findMidPoint=function(x1,y1,x2,y2){
      return ({x:(x1 + x2)/2, y:(y1 + y2)/2})
    }
    // Cx = Ax * (1-t) + Bx * t
    //Cy = Ay * (1-t) + By * t
    var maxWidth=$(document).width()-notesWidth;
    var maxHeight=$(document).height()-notesHeight;
    function setPointForNotes(){
      var midPoint=findMidPoint(maxWidth,maxHeight,0,maxHeight),
        index= 0,initialPoint;
      return function(notes){
        var t,point,maxIndex=17;
        if(index<8){
          initialPoint={
            x:maxWidth,
            y:-notesPadding
          };
          t=-(index+1)*0.10;
          point={
            x:initialPoint.x+(1-t)+midPoint.x*t,
            y:-(initialPoint.y+(1-t)+midPoint.y*t)
          };
        }
        if(index>=8){
          initialPoint={
            x:maxWidth,
            y:notesPadding
          }
          t= (maxIndex-index)*0.10;
          point={
            x:((1-t)+midPoint.x*t),
            y:(notesPadding-(1-t)+midPoint.y*t)
          };
        }
        index++;
        notes._windowX = point.x;
        notes._windowY = point.y;
      }
    }
    var notesPosition=setPointForNotes();

  });
