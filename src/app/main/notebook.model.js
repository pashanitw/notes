/*
{
  "note": {
  "-id": "Note_N-4e779c8f-1253-11e0-ac5d-001d7d21caf5_30_01_2015_18_07_58",
    "-name": "note on bank",
    "-lastUpdatedDate": "1422621975",
    "-type": "Syllabus",
    "-iconX": "0.4562",
    "-iconY": "0.0909",
    "-windowX": "0.3462",
    "-windowY": "0.5383",
    "-windowWidth": "0.4006",
    "-windowHeight": "0.2215",
    "-isWindowExpanded": "true",
    "-slideId": "3486224_00",
    "-index": "0",
    "-lessonId": "1821690",
    "data": "<TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Verdana\" SIZE=\"10\" COLOR=\"#000000\" LETTERSPACING=\"0\" KERNING=\"0\">banks compute compound interest</FONT></P></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><P ALIGN=\"LEFT\"><FONT FACE=\"Verdana\" SIZE=\"10\" COLOR=\"#000000\" LETTERSPACING=\"0\" KERNING=\"0\">formula:</FONT></P></TEXTFORMAT>"
}
}*/
/*
 id: 'Note_N-{{guid()}}',
 index:'{{index()}}',
 name: '{{firstName()}} {{surname()}}',
 type:"Syllubus",
 iconX:'{{integer(0, 1000)}}',
 iconY:'{{integer(0, 600)}}',
 windowX:'{{integer(0, 1000)}}',
 windowY:'{{integer(0, 600)}}',
 windowWidth:'{{integer(300, 600)}}',
 windowHeight:'{{integer(200, 600)}}',
 isWindowExpanded: '{{bool()}}',
 slideId:'{{integer(1000, 6000)}}',
 lessonId:'{{integer(1000, 6000)}}',
 data:'{{html()}}',
* */

var data;
 angular.module('notes')
.factory("Notes",function($http,alertMesssages,$timeout){
    var alerts=[];
    function Notes() {
      this.id = "";
      this.name = "";
      this.lastUpdatedDate = "";
      this.type = "";
      this.iconX = "";
      this.iconY = "";
      this.windowX = "";
      this.windowY="";
      this.windowWidth = "";
      this.windowHeight = "";
      this.isWindowExpanded = true;
      this.slideId = "";
      this.index = "";
      this.lessonId = "";
      this.data = ""
    };
    Notes.prototype.minimize=function(){
      this.isWindowExpanded=false;
    };
     Notes.prototype.save=function(){
        console.log("saving...");
    };
     Notes.prototype.delete=function(){
      console.log("delete...")
    };
     Notes.prototype.minimize=function(){
      this.isWindowExpanded=false;
    };
     Notes.prototype.toggle=function(){
      this.isWindowExpanded=!isWindowExpanded;
    };
     Notes.prototype.closeAlert=function(){
        alerts.splice(this.alerts.indexOf(this), 1);
    };
     Notes.prototype.autoClose=function(){
      var k=this;
      $timeout(function(){
        k.closeAlert();
      },3000)
    };
    return Notes;
  })
.factory("notesService",function(Notes){
     var data=[
       {
         "id": "Note_N-df6a3e8b-2bf4-44cd-aaed-8190f1e0e7b2",
         "index": 0,
         "name": "Johanna Mcclure",
         "type": "Syllubus",
         "iconX": 586,
         "iconY": 519,
         "windowX": 909,
         "windowY": 192,
         "windowWidth": 519,
         "windowHeight": 440,
         "isWindowExpanded": true,
         "slideId": 4281,
         "lessonId": 4533,
         "data": "<ReferenceError: html is not defined>"
       },
       {
         "id": "Note_N-c9bd1704-e763-4216-85b1-ae8902ac0aeb",
         "index": 1,
         "name": "Russo Chase",
         "type": "Syllubus",
         "iconX": 575,
         "iconY": 189,
         "windowX": 106,
         "windowY": 148,
         "windowWidth": 469,
         "windowHeight": 340,
         "isWindowExpanded": true,
         "slideId": 3135,
         "lessonId": 3331,
         "data": "<ReferenceError: html is not defined>"
       },
       {
         "id": "Note_N-0f9165a5-43af-43df-aa57-fe9b9a90bcbf",
         "index": 2,
         "name": "Lorrie Abbott",
         "type": "Syllubus",
         "iconX": 120,
         "iconY": 1,
         "windowX": 56,
         "windowY": 393,
         "windowWidth": 320,
         "windowHeight": 285,
         "isWindowExpanded": true,
         "slideId": 1501,
         "lessonId": 1974,
         "data": "<ReferenceError: html is not defined>"
       },
       {
         "id": "Note_N-fe900cc8-7c88-43f7-b4f9-aa05f1851989",
         "index": 3,
         "name": "Jensen Conrad",
         "type": "Syllubus",
         "iconX": 35,
         "iconY": 3,
         "windowX": 353,
         "windowY": 591,
         "windowWidth": 428,
         "windowHeight": 454,
         "isWindowExpanded": false,
         "slideId": 2770,
         "lessonId": 5485,
         "data": "<ReferenceError: html is not defined>"
       },
       {
         "id": "Note_N-f4c1c26b-83b8-465a-8474-619b65b62cc4",
         "index": 4,
         "name": "Monique Wells",
         "type": "Syllubus",
         "iconX": 125,
         "iconY": 553,
         "windowX": 812,
         "windowY": 88,
         "windowWidth": 517,
         "windowHeight": 229,
         "isWindowExpanded": true,
         "slideId": 2155,
         "lessonId": 5435,
         "data": "<ReferenceError: html is not defined>"
       },
       {
         "id": "Note_N-ad534ad6-b2be-4292-87a3-1f3cb73ea06d",
         "index": 5,
         "name": "Mack Brooks",
         "type": "Syllubus",
         "iconX": 388,
         "iconY": 456,
         "windowX": 755,
         "windowY": 464,
         "windowWidth": 308,
         "windowHeight": 239,
         "isWindowExpanded": true,
         "slideId": 3487,
         "lessonId": 2549,
         "data": "<ReferenceError: html is not defined>"
       },
       {
         "id": "Note_N-b9332961-d502-4a85-9f9f-ba17c71f0391",
         "index": 6,
         "name": "Weaver Michael",
         "type": "Syllubus",
         "iconX": 803,
         "iconY": 443,
         "windowX": 899,
         "windowY": 199,
         "windowWidth": 600,
         "windowHeight": 430,
         "isWindowExpanded": true,
         "slideId": 2460,
         "lessonId": 5156,
         "data": "<ReferenceError: html is not defined>"
       },
       {
         "id": "Note_N-0f56d10a-687b-4b03-95af-95f2f18edc34",
         "index": 7,
         "name": "Hardin Ford",
         "type": "Syllubus",
         "iconX": 544,
         "iconY": 347,
         "windowX": 722,
         "windowY": 26,
         "windowWidth": 377,
         "windowHeight": 287,
         "isWindowExpanded": true,
         "slideId": 5654,
         "lessonId": 1233,
         "data": "<ReferenceError: html is not defined>"
       },
       {
         "id": "Note_N-03876fe8-1167-4658-8a26-142c00d12541",
         "index": 8,
         "name": "Lester Welch",
         "type": "Syllubus",
         "iconX": 779,
         "iconY": 481,
         "windowX": 899,
         "windowY": 404,
         "windowWidth": 415,
         "windowHeight": 215,
         "isWindowExpanded": false,
         "slideId": 4576,
         "lessonId": 1482,
         "data": "<ReferenceError: html is not defined>"
       },
       {
         "id": "Note_N-1fc0f52e-5e64-4cfa-bb3d-ade54b36ca47",
         "index": 9,
         "name": "Becker Meyers",
         "type": "Syllubus",
         "iconX": 233,
         "iconY": 269,
         "windowX": 998,
         "windowY": 559,
         "windowWidth": 320,
         "windowHeight": 311,
         "isWindowExpanded": true,
         "slideId": 4666,
         "lessonId": 4798,
         "data": "<ReferenceError: html is not defined>"
       }
     ];
     function copy(source,destination){
       for ( var key in source) {
         if (source.hasOwnProperty(key)) {
           destination[key] = source[key];
         }
         }
     }
     function getData(){
       var formattedData=[];
       data.forEach(function(item){
         var dest=new Notes();
         copy(item,dest);
         formattedData.push(dest);
       });
       return data;
     }
     return {
       getData:getData
     }
   });


