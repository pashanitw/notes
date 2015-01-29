'use strict';

angular.module('notes', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ngResource', 'ngRoute', 'ui.bootstrap', 'textAngular','colorpicker.module'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .config(function($provide){
   $provide.decorator('taOptions', ['taRegisterTool', '$delegate', function(taRegisterTool, taOptions){
   // $delegate is the taOptions we are decorating
   // register the tool with textAngular
   /*taRegisterTool('save', {
   iconclass: "fa fa-floppy-o",
   action: function(){
   this.$parent.$parent.showHtml=false;
   // return false;
   }
   });
   taRegisterTool('delete', {
   iconclass: "fa fa-times",
   action: function(){
   return false;
   }
   });
   taRegisterTool('minimize', {
   iconclass: "fa fa-minus-square",
   action: function(){
   return false;
   }
   });*/
     taRegisterTool('color', {
       display: "<span style='padding: 0'><button type='button' colorpicker='rgba' ng-init='color.color=\"#000\"' ng-model='color.color' class='btn btn-default' ng-class='displayActiveToolClass(active)' ng-disabled='showHtml()'><i class='fa fa-font'></i></button></span>",
       action: function () {
         var scope=this;
         if(!scope.color || !scope.color.color){
           scope.color={
             color:"#000"
           }
         }

         scope.$watch('color.color', function (oldval,newVal) {
           console.log(scope.color);
           return scope.$editor().wrapSelection('foreColor',newVal)
         });
          // return this.$editor().wrapSelection('foreColor', this.$editor().color);
       }
     });
     taRegisterTool('fontsize', {
       display: "<span style='padding: 0' class='dropdown' dropdown>" +
       "<button type='button' dropdown-toggle  ng-init='fontsize.model=3'  class='btn btn-default' ng-class='displayActiveToolClass(active)' ng-disabled='showHtml()'>" +
       "<i class='fa fa-header'></i></button>" +
       '<ul class="dropdown-menu">'+
     '<li ng-repeat="size in sizes" ng-click="fontsize.model={{size+1}}">'+
     '<a href>{{size}}</a>'+
   '</li>'+
   '</ul></span>',
       action: function () {
         var scope=this;
         scope.sizes=[1,2,3,4,5,6,7];
         if(!scope.fontsize || !scope.fontsize.model){
           scope.fontsize={
             model:3
           }
         }

         scope.$watch('fontsize.model', function (oldval,newVal) {
           console.log(newVal);
           return scope.$editor().wrapSelection('fontSize',newVal)
         });
       }
     });

   // add the button to the default toolbar definition
   taOptions.toolbar[1].push('save');/*
   taOptions.toolbar[2].push('delete');
   taOptions.toolbar[2].push('minimize');*/
   return taOptions;
   }]);
   })
  .directive('crudCommands', function () {
    return {
      restrict: 'AC',
      replace:true,
      template: "<div class='btn-group'>" +
      '<button type="button" class="btn btn-default"  tabindex="-1" ng-click="saveData()"><i class="fa fa-floppy-o"></i></button>' +
      '<button type="button" class="btn btn-default"  tabindex="-1"><i class="fa fa-times" ng-click="delete()"></i></button>' +
      '<button type="button" class="btn btn-default"  tabindex="-1" ng-click="minimize()"><i class="fa fa-minus-square"></i></button>' +
      "</div>",
      link: function (scope, elem, attr) {

      }
    }
  })
  .directive('droppable', function () {
    return {
      restrict: 'AC',
      link: function (scope, elem, attr) {
        elem.droppable({
          drop: function(event, ui) {
            ui.draggable.draggable("option", "revert", false);
          }

        });
      }
    }
  })
  .directive('draggable1', function (positionService) {
    return {
      restrict: 'AC',
      link: function (scope, elem, attr) {
 /*      elem.attr('data-draggable',{options:{scroll: false,obstacle: ".notes-icon",preventCollision: true,containment: ".notes-icon"}});*/
        elem.draggable({
          revert:'invalid',
          obstacle: ".notes-icon",
          preventCollision: true,
          containment: ".container",
          drag:function(){
/*            var offset = $(this).offset();
            var xPos = offset.left;
            var yPos = offset.top;*/
            //console.log(xPos,yPos,$(this).parent().offset().left,$(this).parent().offset().top);
          },
          stop:function(){
            /*if($(this).hasClass("notes-icon")){
              var offset = $(this).offset();
              var xPos = offset.left;
              var yPos = offset.top;
              var pos=positionService.returnPosition(xPos,yPos,$('.container').offset().left,$('.container').offset().top,
                $('.container').width(),$('.container').height(),elem.siblings().width(),elem.siblings().height());
              if(pos){
                elem.siblings().css("left",(pos.a-elem.siblings().width())+"px")
                elem.siblings().css("top",pos.b+"px");
                if(pos.pos=="br"){
                  elem.siblings().css("transform-origin","100% 0%");
                }
              }else{
                console.log("cannotfit");
              }
            }*/

          }
        });
      }
    }
  })
  .factory('positionService',function(){
    function calThePosition(x,y,parentX,parentY){
      return {
        a:x-parentX,
        b:y-parentY
      }
    };
    function returnPosition(x,y,parentX,parentY,parentWidth,parentHeight,itemWidth,itemHeight){
      var ob=calThePosition(x,y,parentX,parentY,parentWidth,parentHeight);
      var x1,y1;
      x1=parentWidth-ob.a;
      y1=parentHeight-ob.b;
      if(itemWidth<=ob.a&&itemHeight<y1){
        ob.pos="br";
        return ob;
      }
      return undefined

    }
    return {
      returnPosition:returnPosition
    }
  })
  .directive('notesIcon', function () {
    return {
      restrict: 'E',
      scope:{},
      require: "^notesWidget",
      replace:true,
      template: '<div  class="notes-icon">' +
      '<div class="bubble">' +
      '<hr style="color:#000;width:28px;"/>' +
      '<hr style="color:#000;width:25px;"/>' +
      '<hr style="color:#000;width:20px;"/>' +
      '</div>' +
      '</div>',
      link: function (scope, elem, attr,ctrl) {
        ctrl.makeAnnouncement("this is from parent");

      }
    }
  })
  .directive('notesWidget', function () {
    return {
      restrict: 'E',
      scope:{},
      replace:true,
      controller: function () {
        this.makeAnnouncement = function (message) {
          console.log("Country says: " + message);
        };
      },
      templateUrl:'components/templates/noteswidget.html' ,
      link: function (scope, elem, attr) {
        var ob=getRandomInt();
        elem.find(".notes-icon").css("top",ob.x+"px");
        elem.find(".notes-icon").css("left",ob.y+"px");

        elem.find(".notes-widget").css("top",ob.x+"px");
        elem.find(".notes-widget").css("left",ob.y+"px");
        setTimeout(function(){
          elem.find(".notes-widget").css("transform","scale(1)");
        })
        elem.css("left",ob.y+"px");
        elem.find('.notes-icon').click(function(evt){
          $(this).css();
        });
        scope.minimize=function(){
          elem.find('.notes-widget').removeClass('active');
        }
      }
    }
  });
function getRandomInt() {
  var max1=$(".container").height(),
    min1= 0,
    min2= 0,
    max2=$(".container").width();
  return{
    x:Math.floor(Math.random() * (max1 - min1)) + min1,
    y:Math.floor(Math.random() * (max2 - min2)) + min2
  }
}
