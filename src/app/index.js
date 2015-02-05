
angular.module('notes', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ngResource', 'ngRoute', 'ui.bootstrap', 'textAngular','colorpicker.module'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'app/main/notebooks.html',
        controller: 'NotebooksCtrl'
      })
      .when('/video', {
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .config(function($compileProvider){
   // $compileProvider.debugInfoEnabled(false);
  })
  .run(['$http', function($http) {
    //IConcept-Method - store
   $http.defaults.headers.common['IConcept-Method'] = 'store';
}])
  .config(function($provide){
   $provide.decorator('taOptions', ['taRegisterTool', '$delegate', function(taRegisterTool, taOptions){
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
           void 0;
           return scope.$editor().wrapSelection('foreColor',scope.color.color)
         });
          // return this.$editor().wrapSelection('foreColor', this.$editor().color);
       }
     });
     taRegisterTool('fontsize', {
       display: "<div style='padding: 0' class='fontsize'>" +
       "<button type='button' ng-init='fontsize.model=3' ng-click='toggle($event)'  class='btn btn-default' ng-class='displayActiveToolClass(active)' ng-disabled='showHtml()'>" +
       "<i class='fa fa-header'></i>" +
       "<div class='dropdown'>"+
       '<ul class="dropdown-menu" ng-class="{\'visible\':visible,\'no-visible\':!visible}">'+
       '<li ng-repeat="size in sizes"  ng-click="fontsize.model={{size}};toggle($event);">'+
       '<a href>{{size}}</a>'+
       '</li>'+
       '</ul></div></button>'+
      '</div>',
       disabled: function() {

         var self = this;


         this.isDisabled = function() {
           return false;
         };


       },
       action: function () {

       /*  this.focusHack = function() {
           $('.ta-scroll-window [contenteditable]')[0].focus();
         };*/

         var scope=this;
         scope.visible=true;
         scope.toggle=function($event){
           if($event){
             $event.stopPropagation();
           }
           scope.visible=!scope.visible;
         }
         scope.sizes=[1,2,3,4,5,6,7];
         if(!scope.fontsize || !scope.fontsize.model){
           scope.fontsize={
             model:3
           }
         }

         scope.$watch('fontsize.model', function (oldval,newVal) {
           void 0;
           return scope.$editor().wrapSelection('fontSize',scope.fontsize.model)
         });
       }
     });

   return taOptions;
   }]);
   })
  .directive('crudCommands', function () {
    return {
      restrict: 'AC',
      replace:true,
      template: "<div class='btn-group'>" +
      '<button type="button" class="btn btn-default save"  tabindex="-1" ng-click="notes.create()" title="{{notes.name}}"><i class="fa fa-floppy-o"></i></button>' +
      '<button type="button" class="btn btn-default delete"  tabindex="-1" ng-click="notes.delete()"><i class="fa fa-times"></i></button>' +
      '<button type="button" class="btn btn-default minus"  tabindex="-1" ng-click="notes.minimize()" class="minus"><i class="fa fa-minus-square"></i></button>' +
      '<button type="button" class="btn btn-default plus"  tabindex="-1"  ng-click="notes.maximize()"><i class="fa fa-plus"></i></button>' +
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
         //   ui.draggable.draggable("option", "revert", false);
          }

        });
      }
    }
  })
.directive('zIndex', function(){
  return function(scope, element, attrs){
    attrs.$observe('zIndex', function(value) {
      element.css({
        'z-index': value
      });
    });
  };
})
  .directive('resizable', function ($parse) {
    return {
      restrict: 'A',
      link: function (scope, elem, attr) {
        var isResizable=$parse(attr.resizable)(scope);
        var isolateScope=elem.isolateScope();
        if(isResizable){
          elem.resizable({
            start: function () {

            },
            stop:function(){
              if(isolateScope){
                if(attr.hasOwnProperty("windowWidth")&&attr.hasOwnProperty("windowHeight")){
                  isolateScope.windowWidth=elem.width();
                  isolateScope.windowHeight=elem.height();
                }
              }

            }
          });
        }

      }
    }
  })
  .directive('draggable', function (positionService,$parse) {
    return {
      restrict: 'A',
      compile: function(tElement, tAttrs, transcludeFn) {

        return function (scope, el, tAttrs) {
         var isDraggable=$parse(tAttrs.draggable)(scope);
          var isolateScope=el.isolateScope();
          var setPositions=function(isolateScope){
            if(isolateScope){
              var offset = el.offset();
              var xPos = offset.left;
              var yPos = offset.top;
              isolateScope.posx = xPos;
              isolateScope.posy = yPos;
              if(tAttrs.hasOwnProperty("windowWidth")&&tAttrs.hasOwnProperty("windowHeight")){
                isolateScope.windowWidth=el.width();
                isolateScope.windowHeight=el.height();
              }
            }
          };
          setPositions(isolateScope);
          if(isDraggable){
            el.draggable({
              revert: 'invalid',
              obstacle: ".notes-icon",
              preventCollision: true,
              containment: ".container",
              drag: function () {

              },
              stop:function(){
                setPositions(isolateScope);

              }
            });
          }
        };
      }
      /*,
      link: function (scope, elem, attr) {
 *//*      elem.attr('data-draggable',{options:{scroll: false,obstacle: ".notes-icon",preventCollision: true,containment: ".notes-icon"}});*//*

      }*/
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
  .directive('position', function () {
    return {
      restrict: 'A',
      scope:{
        posx:"=",
        posy:"=",
        windowWidth:"=",
        windowHeight:"="
      },
      link: function (scope, elem, attr,ctrl) {
      }
    }
  })
  .directive('notesIcon', function () {
    return {
      restrict: 'E',
      scope:{
        posx:"=",
        posy:"="
      },
      replace:true,
      template: '<div  class="notes-icon" >' +
      '<div class="bubble">' +
      '<hr style="color:#000;width:28px;"/>' +
      '<hr style="color:#000;width:25px;"/>' +
      '<hr style="color:#000;width:20px;"/>' +
      '</div>' +
      '</div>',
      link: function (scope, elem, attr,ctrl) {
      }
    }
  })
  .directive('textEditor', function () {
    return {
      restrict: 'A',
      scope:{
        posx:"=",
        posy:"="
      },
      link: function (scope, elem, attr,ctrl) {

      }
    }
  })
  .service("alertMesssages",function(){
    this.saveSuccess="Succcessfully Saved";
    this.saveFail="Save Failed";
    this.deleteSuccess="Succcessfully Deleted";
    this.deleteFail="Save Failed";
  })
  .directive('notesWidget', function ($compile) {
    return {
      restrict: 'E',
      scope:{},
      replace:true,
      controller: function () {
        this.makeAnnouncement = function (message) {
          void 0;
        };
      },
      templateUrl:'components/templates/noteswidget.html' ,
      link: function (scope, elem, attr) {

               scope.minimize=function(){
          elem.find('.notes-widget').removeClass('active');
        }
      }
    }
  })

  .directive('transcludeElement', function() {
  return {
    restrict: 'A',
    transclude: true,
    compile: function(tElement, tAttrs, transcludeFn) {
      return function (scope) {
        transcludeFn(scope, function cloneConnectFn(cElement) {
          tElement.append(cElement);
        });
      };
    }
  };
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
