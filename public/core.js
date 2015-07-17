var bookJourneys = angular.module('bookJourneys', []);

function MainController($scope, $http) {
  $http.get('/v1/books').success(function(data) {
    $scope.books = data;
    console.log(data);
  }).error(function(data) {
    console.log('Error: ' + data);
  });
}

MainController.$inject = ['$scope', '$http'];
bookJourneys.controller('MainController', MainController);
