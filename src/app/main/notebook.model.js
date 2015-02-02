/*
 [
 '{{repeat(5, 7)}}',{
 "list":[
 '{{repeat(5, 7)}}',{
 "notebook": [
 '{{repeat(5, 7)}}',
 {
 "_id": "{{integer(1000, 6000)}}",

 "_syllabusName": "CBSE-XII-{{firstName()}}",
 "_syllabusId": "{{integer(10, 100)}}",
 "_type": "Syllabus",
 "_status": "Active",
 "_index":"{{index()}}",
 "_name":"Notebook_{{index()}}",
 "page": {
 "_id": "Page_{{guid()}}",
 "_index": "{{index()}}",
 "_name": "LearnNext-Page-{{index()}}",
 note:[
 '{{repeat(5, 7)}}',
 {
 _id: 'Note_N-{{guid()}}',
 _index:'{{index()}}',
 name: '{{firstName()}} {{surname()}}',
 _type:"Syllubus",
 _iconX:'{{integer(0, 1000)}}',
 _iconY:'{{integer(0, 600)}}',
 _windowX:'{{integer(0, 1000)}}',
 _windowY:'{{integer(0, 600)}}',
 _windowWidth:'{{integer(300, 600)}}',
 _windowHeight:'{{integer(200, 600)}}',
 _isWindowExpanded: '{{bool()}}',
 _slideId:'{{integer(1000, 6000)}}',
 _lessonId:'{{integer(1000, 6000)}}',
 data:'{__cdata:"<p>something</p>"}'

 }
 ]
 }
 }
 ]
 }

 ]
 }
 ]
 * */

function copy(source, destination) {
  for (var key in source) {
    if (source.hasOwnProperty(key)) {
      destination[key] = source[key];
    }
  }
}
var data;
angular.module('notes')
  .factory("Notes", function ($http, alertMesssages, $timeout, x2js) {
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
    };
    Notes.prototype.minimize = function () {
      this.isWindowExpanded = false;
    };
    Notes.prototype.save = function () {
      var ob = {
        note: {}
      };
      angular.copy(this, ob.note);
      delete  ob.$$hashKey;
      //ob.note.data={__cdata:this.data};
      //  var k=JSON.stringify(ob);
      var j = x2js.json2xml_str(ob);
      //var k=x2js.xml_str2json(j);
      console.log("saving...", j);
    };
    Notes.prototype.delete = function () {
      console.log("delete...")
    };
    Notes.prototype.minimize = function () {
      this.isWindowExpanded = false;
    };
    Notes.prototype.toggle = function () {
      this.isWindowExpanded = !this.isWindowExpanded;
    };
    Notes.prototype.closeAlert = function () {
      alerts.splice(this.alerts.indexOf(this), 1);
    };
    Notes.prototype.increaseIndex = function () {
      console.log("in increase index....");
      this.zIndex = window.maxIndex + 1;
      window.maxIndex = this.zIndex;
      console.log(window.maxIndex);
    };
    Notes.prototype.autoClose = function () {
      var k = this;
      $timeout(function () {
        k.closeAlert();
      }, 3000)
    };
    return Notes;
  })
  .factory('Page', function () {
    function Page() {
      this._id = "";
        this._index = "";
        this._name = "";
        this.note = [];
    }

    Page.prototype.save = function () {
      console.log("...saving page");
    };
      Page.prototype.delete = function () {
        console.log("...delete page");
      };
      Page.prototype.getAllNotes = function () {
       console.log("1");
         //  return this.note;
      };
      Page.prototype.deleteAllNotes = function () {

      };
      Page.prototype.createNewNote = function () {

      };
    return Page;

  })
  .factory('Notebook', function (Page) {
    function Notebook() {
      this._id = "";
      this._syllabusName = "";
      this._syllabusId = "";
      this.type = "";
      this.status = "";
      this._index = "";
        this._name = "";
      this.page = [];

    };

    Notebook.prototype.save = function () {
      console.log("...saving page");
    };
      Notebook.prototype.delete = function () {
        console.log("...delete page");
      };
      Notebook.prototype.getAllPages = function () {
        var formattedData=[],sampleData=[];

        angular.copy(this.page,sampleData);
        console.log(sampleData);
        this.page=[];
        for(var i= 0;i<=sampleData.length;i++){
          var page=new Page();
          copy(sampleData[i],page);
          formattedData.push(page);

        }
        console.log(formattedData);
        return formattedData;
      };
      Notebook.prototype.deleteAllPages = function () {

      };
      Notebook.prototype.createNewNoteBook = function () {

      };
    return Notebook;

  })
  .service("x2js", function () {
    x2js = new X2JS({});
    ;
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
      var formattedData = [];
      data.forEach(function (item) {
        var dest = new Notebook();
        copy(item, dest);
        console.log(dest);
        formattedData.push(dest);
      });
      return formattedData;
    }
    return {
      getData: getData,
      getNoteBooks:getNoteBooks
    }
  });


