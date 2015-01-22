// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers','angular.filter','uiGmapgoogle-maps' ])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    var div = document.getElementById("map_canvas");

  });

})


.config(function($stateProvider, $urlRouterProvider,uiGmapGoogleMapApiProvider) {
  uiGmapGoogleMapApiProvider.configure({
       key: 'AIzaSyDA2Bx_sVUKiVHKB8PUlVCunJea6ND9zK0',
        v: '3.17',
        libraries: 'weather,geometry,visualization'
    });
  $stateProvider

    .state('app', {
      url: "/app",
      abstract: true,
      templateUrl: "templates/menu.html",
      controller: 'AppCtrl'
    })

    .state('app.search', {
      url: "/search",
      views: {
        'menuContent' :{
          templateUrl: "templates/search.html"

        }
      }
    })
    .state('app.categories', {
      url: "/catCommerce/:ref",
      views: {
        'menuContent' :{
          templateUrl: "templates/catCommerce.html",
          controller: 'AppCtrl'
        }
      }
    })

    .state('app.commerce', {
      url: "/commerce",
      views: {
        'menuContent' :{
          templateUrl: "templates/commerce.html",
          controller: 'HomeCtrl'
        }
      }
    })
    .state('app.bonplan', {
      url: "/bonplan",
      views: {
        'menuContent' :{
          templateUrl: "templates/bp.html",
          controller: 'BonPlanCtrl'
        }
      }
    })
    .state('app.news', {
      url: "/news",
      views: {
        'menuContent' :{
          templateUrl: "templates/news.html",
          controller: 'HomeCtrl'
        }
      }
    })

    .state('app.home', {
      url: "/home",
      views: {
        'menuContent' :{
          templateUrl: "templates/home.html",
          controller: 'HomeCtrl'
        }
      }
    })
      .state('app.single', {
      url: "/commerce/:commerceId",
      views: {
        'menuContent' :{
          templateUrl: "templates/playlist.html",
          controller: 'PlaylistCtrl'
        }
      }
    })
      .state('app.tips', {
      url: "/commerce/:commerceId/conseils",
      views: {
        'menuContent' :{
          templateUrl: "templates/conseil.html",
          controller: 'PlaylistCtrl'
        }
      }
    })
      .state('app.plusInfos', {
      url: "/commerce/:commerceId/plusInfos",
      views: {
        'menuContent' :{
          templateUrl: "templates/plusInfos.html",
          controller: 'PlaylistCtrl'
        }
      }
    })
       .state('app.avis', {
      url: "/commerce/:commerceId/avis",
      views: {
        'menuContent' :{
          templateUrl: "templates/avis.html",
          controller: 'PlaylistCtrl'
        }
      }
    });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
});

