var bookJourneys = angular.module('bookJourneys', ['ui.bootstrap', 'ngRoute']);

function MainController($scope, $http) {
  $scope.navbarCollapsed = true;
  $http.get('/v1/books').success(function(data) {
    $scope.books = data;
    console.log(data);
  }).error(function(data) {
    console.log('Error: ' + data);
  });
}

MainController.$inject = ['$scope', '$http'];
bookJourneys.controller('MainController', MainController);

bookJourneys.config(['$routeProvider', function($routeProvider) {
  /*$routeProvider.
    when('/book/:bookId', {
      templateUrl: 'partials/book.html',
      controller: 'BookShowCtrl'
    }).
    when('/book/new', {
      templateUrl: 'partials/new_book.html',
      controller: 'BookCreateCtrl'
    }).
    otherwise({
      redirectTo: '/'
    });*/
}]);
