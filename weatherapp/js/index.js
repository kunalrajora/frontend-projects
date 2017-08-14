
var app = angular.module("WeatherApp", []);

app.controller("WeatherController", ["$scope", "$http", function($scope, $http){
  $scope.test = "hello";
  $scope.city = "";
  $scope.countryCode = "";
  $scope.description = "";
  $scope.sym = "°C";
  $scope.temp = "";
  $http.get("http://ipinfo.io/json")
              .then(
              function success(response){
                $scope.city = response.data.city;
                $scope.countryCode = response.data.country;
                
  $scope.getTemp($scope.city, $scope.countryCode);
              },
              function failure(response){
                $scope.test = "Error " + response.status + response.statusText;
              });
  
  $scope.getTemp = function(city, country){
    var api =  "http://api.openweathermap.org/data/2.5/weather?q=" + country + "&units=metric&appid=19bd064b6c3a18668b3257b1ca21fb93";
    
    $http.get(api).then(
      function success(response){
        $scope.test = response.data;
        $scope.temp = response.data.main.temp;
        $scope.description = response.data.weather[0].description;
        checkStatus($scope.description);
      },
      function failure(response){
        $scope.test = "Error - " + response.status + response.statusText;
      });
    
  }
  
  $scope.celciusToFahrenheit = function(celcius){
    return (9/5)*celcius + 32;
  }
 $scope.fahrenheitToCelcius = function(fah){
    return (5/9)*(fah - 32);
  }
  $scope.change = function(){
    if ($scope.sym == "°C"){
      $scope.temp = Math.round($scope.celciusToFahrenheit($scope.temp)*100)/100;
      $scope.sym = "°F";
    }
    else {
      $scope.temp = Math.round($scope.fahrenheitToCelcius($scope.temp)*100)/100;
      $scope.sym = "°C";
    }
  }
  
  // sets the image at "imageURL" as the background image
function changeBackground(imageURL){
  $("body").css('background', "url(" + imageURL + ")");
  $("body").addClass('.img-responsive');
}
 
function checkStatus(description){
  if (description.search("cloudy") != -1){
    changeBackground("https://i.ytimg.com/vi/61BLn00AN_w/maxresdefault.jpg");
  }
  else if (description.search("fog") != -1){
    changeBackground("https://i.imgur.com/Bcu44gH.jpg");
  }
  else if (description.search("haze") != -1){
  changeBackground("http://www.pamper.my/news/wp-content/uploads/2015/09/haze-in-malaysia.jpg");
  }
  else if (description.search("rain") != -1){  changeBackground ("https://images6.alphacoders.com/310/thumb-1920-310146.jpg");
  }
  else if (description.search("snow") != -1){changeBackground ("http://wallpapersrage.com/wp-content/uploads/2016/05/EWB0010984-Winter-Storm-HD-Desktop-Wallpaper-Wide-And-Dark-Cold-Weather-Free-Download.jpg");
  }
  else if (description.search("thunderstorm") != -1){
    changeBackground("http://farmersalmanac.com/wp-content/uploads/2015/06/Thunderstorm-5best.jpg");
  }
  else {
    changeBackground("https://i.imgur.com/Bcu44gH.jpg");
  }  
}
}]);