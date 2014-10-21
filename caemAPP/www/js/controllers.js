angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };
  $scope.selectTabWithIndex = function(index) {
    $ionicTabsDelegate.select(index);
  }

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('homeCtrl', function($scope) {
  $scope.commerces = [
    { nom: 'Reggae', id: 1, categorie:'Une categorie', note:4.5, adresse:'28 rue Adolphe Thiers', desc:'une description rapide ....'},
    { nom: 'Chill', id: 2, categorie:'Une categorie', note:4.5, adresse:'28 rue Adolphe Thiers', desc:'une description rapide ....'},
    { nom: 'Dubstep', id: 3,categorie:'Une categorie', note:4.5, adresse:'28 rue Adolphe Thiers', desc:'une description rapide ....' },
    { nom: 'Indie', id: 4, categorie:'Une categorie', note:4.5, adresse:'28 rue Adolphe Thiers', desc:'une description rapide ....' },
    { nom: 'Rap', id: 5, categorie:'Une categorie', note:4.5, adresse:'28 rue Adolphe Thiers', desc:'une description rapide ....' },
    { nom: 'Cowbell', id: 6, categorie:'Une categorie', note:4.5, adresse:'28 rue Adolphe Thiers', desc:'une description rapide ....'}
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
});
