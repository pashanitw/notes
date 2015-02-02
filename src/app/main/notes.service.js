
var module=angular.module('notes')

module.factory('myInterceptor', ['$q', 'someAsyncService', function($q, someAsyncService) {
  var responseInterceptor = {
    response: function(response) {
      var deferred = $q.defer();
      someAsyncService.doAsyncOperation().then(function() {
        // Asynchronous operation succeeded, modify response accordingly
       // ...
        deferred.resolve(response);
      }, function() {
        // Asynchronous operation failed, modify response accordingly
        //...
        deferred.resolve(response);
      });
      return deferred.promise;
    }
  };

  return responseInterceptor;
}]);
/**
 * Created by space on 2/1/15.
 */
