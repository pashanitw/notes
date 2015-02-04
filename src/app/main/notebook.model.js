function DeleteUnnecessaryKeys(ob, type) {
  var duplicate = {}, data;
  copy(ob, duplicate);
  switch (type) {
    case "Notebook":
      data = {
        "notebook": deleteKeys(duplicate, "page")
      };
      break;
    case "Page":
      data = {
        "page": deleteKeys(duplicate, "note")
      };
      break;
    case "Note":
      data = {
        "note": deleteKeys(duplicate, "data")
      };
      break;
  }
  return x2js.json2xml_str(data);
}
function deleteKeys(ob,escape){
 for(var key in ob){
   if(ob.hasOwnProperty(key)){
     if(!key.match(/^_.+/)){
       if(key!=escape){
         delete ob[key];
       }
     }
   }
 }
  return ob;
}


function copy(source, destination) {
  for (var key in source) {
    if (source.hasOwnProperty(key)) {
      destination[key] = source[key];
    }
  }
}
var data;
angular.module('notes')
  .factory("sendRequest",function($q,$http){
    return function(url,methodType,config,data){
      if(methodType=="POST"){
        debugger;
       return $http.post(url,data,config)
      }
    }
  })
  .factory("Notes", function ($http, alertMesssages, $timeout, x2js,$q,$http) {
    var baseUrl="http://192.168.11.82:8080/";
    var alerts = [];

    function Notes() {
      this._id = "";
      this._name = "";
      this._lastUpdatedDate = "";
      this._type = "";
      this._iconX = "";
      this._iconY = "";
      this._windowX = "";
      this._windowY = "";
      this._windowWidth = "";
      this._windowHeight = "";
      this._isWindowExpanded = true;
      this._slideId = "";
      this._index = "";
      this._lessonId = "";
      this.data = {__cdata: ""}
      this.zIndex = 0;
      this.type="Note";
    }
    Notes.prototype.minimize = function () {
      this._isWindowExpanded = false;
    };
    Notes.prototype.save = function () {
      var ob = {
        note: {}
      };
      angular.copy(this, ob.note);
      /*delete  ob.$$hashKey;
      var j = x2js.json2xml_str(ob);
      void 0;*/
    };
    Notes.prototype.create = function () {
      var data=DeleteUnnecessaryKeys(this,this.type);
      var config={
        params :{
          data:data
        }
      }
      this.get();
    };
    Notes.prototype.delete = function () {
      void 0
    };
    Notes.prototype.get=function(){
      var xml="<note id='' name='sadfasdfsdf' lastUpdatedDate='' type='' iconX='1120' iconY='278' windowX='628' windowY='163' windowWidth='378' windowHeight='' isWindowExpanded='true' slideId='' index='' lessonId=''><data><![CDATA[<p>sdfasdfsdfsadf asdfsadf asdfasdf asdfasdfasdf</p>]]></data></note>"
         var ob=x2js.xml_str2json(xml);

    }
    Notes.prototype.toggle = function () {
      this._isWindowExpanded = !this._isWindowExpanded;
    };
    Notes.prototype.closeAlert = function () {
      alerts.splice(this.alerts.indexOf(this), 1);
    };
    Notes.prototype.increaseIndex = function () {
    /*  console.log("in increase index....");
      this.zIndex = window.maxIndex + 1;
      window.maxIndex = this.zIndex;
      console.log(window.maxIndex);*/
    };
    Notes.prototype.autoClose = function () {
      var k = this;
      $timeout(function () {
        k.closeAlert();
      }, 3000)
    };
    return Notes;
  })
  .factory('Page', function (Notes,$q) {
    function Page() {
      this._id = "";
        this._index = "";
        this._name = "";
        this.note = [];
    }

    Page.prototype.save = function () {
      void 0;
    };
      Page.prototype.delete = function () {
        void 0;
      };
      Page.prototype.getAllNotes = function () {
        var formattedData=[],sampleData=[];

        angular.copy(this.note,sampleData);
        void 0;

        for(var i= 0;i<sampleData.length;i++){
          var page=new Notes();
          copy(sampleData[i],page);
          formattedData.push(page);
        }
        void 0;
        this.note=formattedData;
      };
      Page.prototype.deleteAllNotes = function () {

      };
      Page.prototype.createNewNote = function () {

      };
    Page.prototype.create = function () {
      var url="data/44624/noteBook/Syllabus/0.app";
      this._id=0;
      var data=DeleteUnnecessaryKeys(this,this.type);
      var config={
        params :{
          data:data
        }
      };
     return  sendRequest(url,"POST",config,data).then(function(){
      });
    };
    return Page;

  })
  .factory('Notebook', function (Page,$q,$http,sendRequest) {
    function Notebook() {
      this._id = "";
      this._syllabusName = "";
      this._syllabusId = "";
      this._type = "";
      this._status = "";
      this._index = "";
        this._name = "";
      this.page = [];
      this.type="Notebook"
    }

    Notebook.prototype.create = function () {

      var url="data/44624/noteBook/Syllabus/0.app";
      var data=DeleteUnnecessaryKeys(this,this.type);
      var config={
        params :{
          data:data
        }
      };
      return sendRequest(url,"POST",config,data).then(function(){

      });
    };
    Notebook.prototype.save = function () {
      var deferred= $q.defer();

      void 0;
      deferred.resolve();
      return deferred.promise;
    };
      Notebook.prototype.delete = function () {
        void 0;
      };
      Notebook.prototype.getAllPages = function () {
        var formattedData=[],sampleData=[];

        angular.copy(this.page,sampleData);
        void 0;

        for(var i= 0;i<sampleData.length;i++){
          var page=new Page();
          copy(sampleData[i],page);
          formattedData.push(page);
        }
        void 0;
        this.page=formattedData;
      };
      Notebook.prototype.deleteAllPages = function () {

      };
      Notebook.prototype.createNewNoteBook = function () {

      };
    return Notebook;
  })
  .service("x2js", function () {
    x2js = new X2JS({});
    return x2js;
  })
  .factory("notesService", function (Notes, x2js,Notebook) {

    function copy(source, destination) {
      for (var key in source) {
        if (source.hasOwnProperty(key)) {
          destination[key] = source[key];
        }
      }
    }
    getNoteBooks=function(){
/*      var formattedData=[];
      window.sampleData.list[0].notebook.forEach(function(notebook){
       // delete notebook.page;
          var book=new Notebook();
          angular.copy(notebook,book);
        delete book.page;
          formattedData.push(book)
 });*/
      var formattedData=[];
      var data= window.sampleData.list[0].notebook.forEach(function(item){
        var mydata=new Notebook();
        copy(item,mydata);
    //    console.log(mydata)
        formattedData.push(mydata)
      });

      return formattedData;
    }
    function getData() {

    }
    return {
      getData: getData,
      getNoteBooks:getNoteBooks
    }
  });


