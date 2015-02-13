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
function deleteKeys(ob, escape) {
  for (var key in ob) {
    if (ob.hasOwnProperty(key)) {
      if (!key.match(/^_.+/)) {
        if (key != escape) {
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
  .factory("helperService", function () {
    function getUniqueId(type) {
      var date = new Date();
      return type + "_" + getCreds().ucid + "_" + date.getFullYear() + "_" + ("0" + (date.getMonth() + 1)).slice(-2) + "_" + ("0" + date.getDate()).slice(-2) + "_" + date.getHours() + "_" + date.getMinutes() + "_" + date.getSeconds();
    }

    function getCreds() {
      return JSON.parse(localStorage.getItem("credentials"));
    }

    return {
      getUniqueId: getUniqueId,
      getCreds: getCreds
    }
  })
  .factory("sendRequest", ["$q", "$http", function ($q, $http) {
    return function (url, methodType, config, data) {
      console.log("data is", data);
      if (methodType == "POST") {
        debugger;
        return $http.post(url, data, config)
      }
      if (methodType == "GET") {
        if (config) {
          return $http.get(url, config);
        }
        return $http.get(url)
      }
    }
  }])
  .factory("Notes", ["alertMesssages", "$timeout", "x2js", "$q", "$http", "sendRequest", "helperService", "$rootScope", "usSpinnerService", "toaster",
    function (alertMesssages, $timeout, x2js, $q, $http, sendRequest, helperService, $rootScope, usSpinnerService, toaster) {
      var baseUrl = "http://192.168.11.82:8080/";
      var alerts = [];

      function Notes() {
        this._id = "";
        this._name = "";
        this._lastUpdatedDate = "";
        this._type = "";
        this._iconX = 0;
        this._iconY = 0;
        this._windowX = 0;
        this._windowY = 0;
        this._windowWidth = 0;
        this._windowHeight = 0;
        this._isWindowExpanded = true;
        this._slideId = "";
        this._index = 0;
        this._lessonId = "";
        this.data = {__cdata: ""}
        this.zIndex = 10;
        this.type = "Note";
        this.alert = [];
        this.isAccordionExpanded = false;
        this.isFetched = false;
        this.isSpinnerVisible=false;
        this.selectedList=[]
      }

      Notes.prototype.minimize = function () {
        this._isWindowExpanded = false;
        this.isAccordionExpanded = false;
      };
      Notes.prototype.maximize = function (page) {
        var url = "data/" + helperService.getCreds().userId + "/note/" + this._id + ".app";
        var data = DeleteUnnecessaryKeys(this, this.type);
        if (!this.isFetched) {
          var config = {
            headers: {
              'IConcept-Method': 'fetch'
            },
            params: {
              data: data
            }
          }
          this.isAccordionExpanded = true;
          var cdataRegex = /\<\!\[CDATA\[(.*)\]\]\>/;
          this.handleSpinner(true);
          var notes=this;
          //url,methodType,config,data
          sendRequest(url, "POST", config, {}).then(function (resp) {

            if (resp.data) {
              var jsonob = x2js.xml_str2json(resp.data);

              var myNote = new Notes();
              copy(jsonob.note, myNote);
              if (myNote.data) {
                var cdata = myNote.data.match(cdataRegex);
                myNote.data = {__cdata: cdata[1]};
              }
              jsonob.note.data.delete
              copy(jsonob.note,notes)
              notes.data=myNote.data;

              notes.isFetched = true;
              notes.handleSpinner(false);
              // page.note.push(myNote);
            }
          }, function () {
            console.log("error");
            notes.handleSpinner(false);
          });
        }
      };
      Notes.prototype.save = function (externalUrl) {
        var deferred = $q.defer();
        if (!this._id) {
          this._id = helperService.getUniqueId(this.type);
          this._lessonId = currLessonId;
        }
        var url;
        if(!externalUrl){
          url= "data/" + helperService.getCreds().userId + "/note/" + this._id + ".app";
        }else{
          url=externalUrl;
        }


        var data = DeleteUnnecessaryKeys(this, this.type);

        var config = {
          params: {
            data: data
          },
          headers: {
            'IConcept-Method': 'store'
          }
        }
        var notes = this;
        this.handleSpinner(true);
        //url,methodType,config,data
        sendRequest(url, "POST", config, data).then(function (resp) {
          if (resp.statusText == "OK" && resp.data) {
            notes.setAlert(alertMesssages.saveSuccess);
            notes.handleSpinner(false);
            deferred.resolve();
          }
        }, function () {
          notes._id = undefined;
          notes.setAlert(alertMesssages.saveFail);
          notes.handleSpinner(false);
          deferred.reject();
        });
        return deferred.promise;
      };
      Notes.prototype.deleteItem = function (index, items) {
        var deferred = $q.defer();
        var url = "data/" + helperService.getCreds().userId + "/note/" + this._id + ".app";
        var data = DeleteUnnecessaryKeys(this, this.type);

        var config = {
          params: {
            data: data
          },
          headers: {
            'IConcept-Method': 'delete'
          }
        };
        var notes = this;
        notes.handleSpinner(true);
        sendRequest(url, "POST", config, data).then(function (resp) {
          if (resp.data == "success" && resp.statusText == "OK") {
            items.splice(index, 1);
            notes.handleSpinner(false);
            toaster.pop('success', "title", "Notes deleted");
            deferred.resolve();
          } else {
            notes.handleSpinner(false);
            toaster.pop('success', "title", "Notes delete Failed");
          }

        }, function () {
          notes.handleSpinner(false);
          notes.setAlert(alertMesssages.deleteFail);
          deferred.reject();
        });

        return deferred.promise;
      };
      Notes.prototype.get = function () {
        var xml = "<note id='' name='sadfasdfsdf' lastUpdatedDate='' type='' iconX='1120' iconY='278' windowX='628' windowY='163' windowWidth='378' windowHeight='' isWindowExpanded='true' slideId='' index='' lessonId=''><data><![CDATA[<p>sdfasdfsdfsadf asdfsadf asdfasdf asdfasdfasdf</p>]]></data></note>"
        var ob = x2js.xml_str2json(xml);

      };
      Notes.prototype.toggle = function () {
        this._isWindowExpanded = !this._isWindowExpanded;
      };
      Notes.prototype.closeAlert = function () {
        this.alert.splice(0, 1);
      };
      Notes.prototype.onMouseLeave=function(){
        var line={
          x1:0,
          y1:0,
          x2:0,
          y2:0,
          visible:false
        }
        this.drawLine(line);
      };
      Notes.prototype.increaseIndex = function () {
        this.zIndex = window.maxIndex + 1;
        window.maxIndex = this.zIndex;
        console.log(window.maxIndex);
      };
      Notes.prototype.onMouseHover=function($event){
        $event.stopPropagation();
        var line={
          x1:this._iconX,
          y1:this._iconY,
          x2:this._windowX,
          y2:this._windowY,
          visible:true

        }
        this.drawLine(line);
      }
      Notes.prototype.drawLine=function(line){
        var notes=this;
        $rootScope.$broadcast('draw-line', line);
      };
      Notes.prototype.setAlert = function (alert) {
        this.alert.push(alert);
        this.autoClose();
      }
      Notes.prototype.autoClose = function () {
        var k = this;
        $timeout(function () {
          k.closeAlert();
        }, 3000)
      };
      Notes.prototype.handleSpinner=function(value){
        if(value){
          usSpinnerService.spin(this._id);
          this.isSpinnerVisible=true;
        }else{
          usSpinnerService.stop(this._id);
          this.isSpinnerVisible=false;
        }
      };
      return Notes;

    }])
  .factory('Page', ["Notes", "$q", "sendRequest", "helperService", "toaster","notesService",
    function (Notes, $q, sendRequest, helperService, toaster,notesService) {
    function Page() {
      this._id = "";
      this._index = "";
      this._name = "";
      this.note = [];
      this.type = "Page";
      this.selectedList=[];
    }
    Page.prototype.deleteSelectedNotes=function(){
      var page=this;
      notesService.deleteSelectedItems(page.selectedList).then(function(){
        angular.forEach(page.selectedList,function(item,index){
          page.note.splice(item.index);
        })
      })

    }
    Page.prototype.save = function (notebook) {
      var deferred = $q.defer();
      if (!this._id) {
        this._id = helperService.getUniqueId(this.type);
        var url = "data/" + helperService.getCreds().userId + "/page/"+this._type+"/" + this._id + ".app";

        var note=new Notes();
        note._name="Note #1";
        note._id=helperService.getUniqueId(note.type);
        note._type=this._type;
        var model={
          _notebookId:notebook._id,
          _pageName:this._name,
          _pageId:this._id
        };
        angular.extend(note,model);
        note.save(url).then(function(){

        },function(){

        });
      }

      /*
       var page=this;
       var url = "data/" + helperService.getCreds().userId + "/page/"+this._type+"/" + this._id + ".app";

       var data = DeleteUnnecessaryKeys(notebook, notebook.type);

       var config = {
       params: {
       data: data
       },
       headers: {
       'IConcept-Method': 'store'
       }
       }
       var notebook = this;
       //url,methodType,config,data
       sendRequest(url, "POST", config, data).then(function (resp) {
       if (resp.statusText == "OK" && resp.data) {
       deferred.resolve();
       console.log("successfully saved");
       }

       }, function () {
       deferred.reject();
       });
       */

      return deferred.promise;
    };
    Page.prototype.deleteItem = function () {
      var deferred = $q.defer();
      var url = "data/" + helperService.getCreds().userId + "/page/"+this._type+"/" + this._id + ".app";

      var data = DeleteUnnecessaryKeys(this, this.type);

      var config = {
        params: {
          data: data
        },
        headers: {
          'IConcept-Method': 'delete'
        }
      }
      var notebook = this;
      //url,methodType,config,data
      sendRequest(url, "POST", config, data).then(function (resp) {
        if (resp.statusText == "OK" && resp.data) {
          deferred.resolve();
          console.log("successfully saved");
        }

      }, function () {
        deferred.reject();
      });

      return deferred.promise;


    };
    Page.prototype.getAllNotes = function () {
      var formattedData = [], sampleData = [];

      angular.copy(this.note, sampleData);
      void 0;

      for (var i = 0; i < sampleData.length; i++) {
        var page = new Notes();
        copy(sampleData[i], page);
        formattedData.push(page);
      }
      void 0;
      this.note = formattedData;
    };
    return Page;

  }])
  .factory('Notebook', ["Page", "$q", "$http", "sendRequest", "helperService", "toaster","notesService", function (Page, $q, $http, sendRequest, helperService, toaster,notesService) {
    function Notebook() {
      this._id = "";
      this._syllabusName = "";
      this._syllabusId = "";
      this._type = "";
      this._status = "";
      this._index = "";
      this._name = "";
      this.page = [];
      this.type = "Notebook";
      this.selectedList=[];
    }
    Notebook.prototype.deleteSelectedPages = function () {
      var notebook=this;
      notesService.deleteSelectedItems(notebook.selectedList).then(function(){
        angular.forEach(notebook.selectedList,function(item,index){
          notebook.page.splice(item.index);
        })
      });
    };

    Notebook.prototype.save = function () {
      var deferred = $q.defer();

      if (!this._id) {
        this._id = helperService.getUniqueId(this.type);

      }
      var url = "data/" + helperService.getCreds().userId + "/noteBook/"+this._type+"/" + this._id + ".app";

      var data = DeleteUnnecessaryKeys(this, this.type);

      var config = {
        params: {
          data: data
        },
        headers: {
          'IConcept-Method': 'store'
        }
      }
      var notebook = this;
      sendRequest(url, "POST", config, data).then(function (resp) {
        if (resp.statusText == "OK" && resp.data) {
          deferred.resolve();
        }

      }, function () {
        deferred.reject();
      });

      return deferred.promise;
    };
    Notebook.prototype.deleteItem = function () {
      var deferred = $q.defer();

      var url = "data/" + helperService.getCreds().userId + "/noteBook/"+this._type+"/" + this._id + ".app";

      var data = DeleteUnnecessaryKeys(this, this.type);

      var config = {
        params: {
          data: data
        },
        headers: {
          'IConcept-Method': 'delete'
        }
      }
      var notebook = this;
      sendRequest(url, "POST", config, data).then(function (resp) {
        if (resp.statusText == "OK" && resp.data) {
          deferred.resolve();
        }

      }, function () {
        deferred.reject();
      });

      return deferred.promise;
    };
    Notebook.prototype.getAllPages = function () {
      var formattedData = [], sampleData = [];

      angular.copy(this.page, sampleData);
      void 0;

      for (var i = 0; i < sampleData.length; i++) {
        var page = new Page();
        copy(sampleData[i], page);
        formattedData.push(page);
      }
      void 0;
      this.page = formattedData;
    };
    return Notebook;
  }])
  .service("x2js", function () {
    x2js = new X2JS({});
    return x2js;
  })
  .factory("helperData",function($injector){
    var cdataRegex = /\<\!\[CDATA\[(.*)\]\]\>/;
    var Notes,Page,Notebook;

    var getFetchList=function(notebookdata){
      if(!Notebook){
        Notebook=$injector.get("Notebook");
      }
      if(!Page){
        Page=$injector.get("Page");
      }
      if(!Notes){
        Notes=$injector.get("Notes");
      }
      var notebooks=[]
      getArray(notebookdata).forEach(function (notebook) {
        var mydata = new Notebook();
        copy(notebook, mydata);
        mydata.page = [];
        if(notebook.page){
          getArray(notebook.page).forEach(function (page) {
            var myPage = new Page();
            copy(page, myPage);
            myPage.note = [];
            if (page.note) {
              getArray(page.note).forEach(function (note) {
                var myNote = new Notes();
                copy(note, myNote);
                if (myNote.data && angular.isString(myNote.data)) {
                  var cdata = myNote.data.match(cdataRegex);
                  myNote.data = {__cdata: cdata[1]};
                }

                myPage.note.push(myNote)
              });
            }

            mydata.page.push(myPage);
          })
        }

        //    console.log(mydata)
        notebooks.push(mydata)
      });
      return notebooks;
    };
    function getArray(item) {
      return angular.isArray(item) ? item : [item];
    }


    var getNotebooks=function(notebookdata,slideId){
      if(!Notebook){
        Notebook=$injector.get("Notebook");
      }
      if(!Page){
        Page=$injector.get("Page");
      }
      if(!Notes){
        Notes=$injector.get("Notes");
      }
      var notebooks=[];
      getArray(notebookdata).forEach(function (notebook) {
        var mydata = new Notebook();
        copy(notebook, mydata);
        mydata.page = [];
        getArray(notebook.page).forEach(function (page) {
          var myPage = new Page();
          copy(page, myPage);
          myPage.note = [];
          if(page && page._id==slideId){

            if (page.note) {
              getArray(page.note).forEach(function (note) {
                //_isWindowExpanded
                //TODO : have to remove below line
                note._isWindowExpanded = false;
                var myNote = new Notes();
                copy(note, myNote);
                if (myNote.data) {
                  var cdata = myNote.data.match(cdataRegex);
                  myNote.data = {__cdata: cdata[1]};
                }

                myPage.note.push(myNote)
              });
            }

          }
          mydata.page.push(myPage);
        });
        //    console.log(mydata)
        notebooks.push(mydata)
      });
      return notebooks;
      };
      function getData(){
        if(!Notebook){
          Notebook=$injector.get("Notebook");
        }
        if(!Page){
          Page=$injector.get("Page");
        }
        if(!Notes){
          Notes=$injector.get("Notes");
        }
      var formattedData=[];
      var data= window.sampleData.list[0].notebook.forEach(function(item){
        var mydata=new Notebook();
        copy(item,mydata);
        //    console.log(mydata)
        formattedData.push(mydata)});
      return formattedData;
    }
    return{
      getFetchList:getFetchList,
      getNotebooks:getNotebooks,
      getData:getData

    }
  })
  .factory("notesService", [ "x2js", "helperService", "sendRequest", "$q", "toaster","helperData",
    function ( x2js, helperService, sendRequest, $q, toaster,helperData) {

      function copy(source, destination) {
        for (var key in source) {
          if (source.hasOwnProperty(key)) {
            destination[key] = source[key];
          }
        }
      }

      var getNoteBooks = function (slideId) {
        var url = "data/" + helperService.getCreds().userId + "/note/" + slideId + "/noteDataList.app";
        var notebooks = [];
        var deferred = $q.defer();
        var cdataRegex = /\<\!\[CDATA\[(.*)\]\]\>/;
        sendRequest(url, "GET").then(function (response) {
          var xml = response.data;
          var jsonData = x2js.xml_str2json(xml);
          var data = helperData.getNoteBooks(jsonData.list.notebook,slideId)
          deferred.resolve(data);
        }, function () {
          deferred.reject("error in xml")
        });

        return deferred.promise;

      }

      function fetchNoteList() {
        var url = "data/" + helperService.getCreds().userId + "/note/noteList.app";
        var notebooks = [];
        var deferred = $q.defer();
        var cdataRegex = /\<\!\[CDATA\[(.*)\]\]\>/;
        sendRequest(url, "GET").then(function (response) {
          var xml = response.data;
          var jsonData = x2js.xml_str2json(xml);
          if(!jsonData.list) {
            deferred.resolve([]);
            return;
          }
          var data = helperData.getFetchList(jsonData.list.notebook);
          deferred.resolve(data);
        }, function () {
          deferred.reject("error in xml")
        });

        return deferred.promise;
      }

      function getData() {
       return helperData.getData();
      }

      var deleteSelectedItems = function (items) {
        var promises = [];
        var deffered=$q.defer();
        for (var i = 0; i < items.length; i++) {
          promises.push(items[i].deleteItem());
        }
        return $q.all(promises);

      }

      return {
        getData: getData,
        getNoteBooks: getNoteBooks,
        fetchNoteList: fetchNoteList,
        deleteSelectedItems: deleteSelectedItems
      }
    }]);
