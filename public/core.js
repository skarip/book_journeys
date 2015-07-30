var bookJourneys = angular.module('bookJourneys', ['ui.bootstrap', 'ngRoute']);

function MainCtrl($scope, $http) {
  $scope.navbarCollapsed = true;
  $http.get('/v1/books').success(function(data) {
    $scope.books = data;
    console.log(data);
  }).error(function(data) {
    console.log('Error: ' + data);
  });
}
MainCtrl.$inject = ['$scope', '$http'];
bookJourneys.controller('MainCtrl', MainCtrl);

function NavCtrl($scope, $location) {
  $scope.isActive = function(loc) {
    return loc == $location.path();
  }
}
NavCtrl.$inject = ['$scope', '$location'];
bookJourneys.controller('NavCtrl', NavCtrl);

function BookShowCtrl($scope, $http) {
}
BookShowCtrl.$inject = ['$scope', '$http'];
bookJourneys.controller('BookShowCtrl', BookShowCtrl);

function BookCreateCtrl($scope, $http, $filter) {
  $scope.status = {
    isAddBookOpened: true,
    isAddBookDisabled: false,
    isStartBookOpened: false,
    isStartBookDisabled: true
  }

  $scope.getBook = function(val) {
    return $http.get('https://www.googleapis.com/books/v1/volumes', {
      params: {
        q: val
      }
    }).then(function(resp) {
      //transform the data from google api to our model
      return resp.data.items.map(function(item) {
        var tryGet = function(obj, field, defaultVal) {
          return obj && obj.hasOwnProperty(field) ? obj[field] : defaultVal
        };

        return {
          title: tryGet(item.volumeInfo, "title", ""),
          author: tryGet(item.volumeInfo, "authors", [])[0],
          // don't look at me, I'm hideous
          ISBN10: tryGet($filter('filter')(tryGet(item.volumeInfo, "industryIdentifiers", {}), {type: "ISBN_10" })[0], "identifier", undefined),
          ISBN13: tryGet($filter('filter')(tryGet(item.volumeInfo, "industryIdentifiers", {}), {type: "ISBN_13" })[0], "identifier", undefined),
          // can use large thumbnail if we follow the selflink
          coverImageUrl: tryGet(item.volumeInfo, "imageLinks", {}).thumbnail,
          googleURI: item.selfLink
        };
      });
    });
  };

  //get rid of this when done debugging
  $scope.populateBook = function(details) {
    $scope.newBook = details;
    console.log("details: " + details.author);
  };

  var validate = function(book) {
    //validation logic goes here
    return true;
  }

  $scope.validateAndContinue = function() {
    var isValid = validate($scope.newBook);
    if(isValid) {
      $scope.status.isAddBookOpened = false;
      $scope.status.isStartBookOpened = true;
      $scope.status.isStartBookDisabled = false;
    } else {
      // show info?
    }
  }
}
BookCreateCtrl.$inject = ['$scope', '$http', '$filter'];
bookJourneys.controller('BookCreateCtrl', BookCreateCtrl);


bookJourneys.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
    when('/book/:bookId', {
      templateUrl: 'partials/book.html',
      controller: 'BookShowCtrl'
    }).
    when('/new_book', {
      templateUrl: 'partials/new_book.html',
      controller: 'BookCreateCtrl'
    }).
    otherwise({
      redirectTo: '/'
    });
}]);
