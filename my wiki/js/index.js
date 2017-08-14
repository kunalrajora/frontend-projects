
var app = angular.module('wikiApp', []);

//wiki call

app.factory('wikiService', function($http) {
      var api = 'http://en.wikipedia.org/w/api.php?format=json&action=query&generator=search&gsrnamespace=0&gsrlimit=10&prop=pageimages|extracts&pilimit=max&exintro&explaintext&exsentences=1&exlimit=max&gsrsearch=';
    var cb = '&callback=JSON_CALLBACK';
 
    var wikiService = {
        get: function(title) {
            return $http.jsonp(api + title.name.toLowerCase() + cb);
        }
    };
    
    return wikiService;
});
    

app.controller('MainController', function($scope, wikiService) {
  $scope.wikiData = [];
  
  var page = 'http://en.wikipedia.org/?curid=';
 //call for data 
  $('button').click(function(){
     
    var input = $('input').val();
      
    wikiService.get({name: input}).then(function(data) {
      
      var tmp_wikiData = Object.keys(data.data.query.pages)
      var results = tmp_wikiData.map(key => data.data.query.pages[key])  
      angular.forEach(results, function(v,k)  {
      $scope.wikiData.push({title: v.title, body: v.extract, page: page + v.pageid})
      })
        console.log($scope.wikiData);
    });
  }) 
      
});