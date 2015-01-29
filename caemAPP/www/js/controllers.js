angular.module('starter.controllers', [])

.constant('angularMomentConfig', {
    preprocess: 'unix', // optional
    timezone: 'Europe/PARIS' // optional
})
.controller('AppCtrl', function($rootScope ,$scope, $ionicModal, $timeout, $http, $ionicLoading,$ionicPopup,$location,$state) {
  /***************************************************************
  *
  *                 Création d'un fichier interne pour conserver
  *                 les données de session utilisateur après une
  *                 authentification réussie !!
  *
  * **************************************************************/
   $scope.user={};

 var statut = sessionStorage.getItem('isAuth');
 if(statut =='true'){

      $scope.auth = true;
      $scope.user.nom = localStorage.nom;
      $scope.user.prenom = localStorage.getItem('prenom');
      $rootScope.token = localStorage.token;
      console.log($scope.user.nom);
      console.log($rootScope.token);
      console.log($scope.auth);
      console.log('Contenu de statut '+statut);
      console.log('session :'+$scope.auth);
 }

    $scope.isAuth = false;
    /***************************************************************
  *                                    Login Alert!
  *        Ce Popup est appelé lorsque le serveur repond
  *        avec une erreur lors de la connexion d'un client
  *        Il informe le client sur la nature de l'erreur.
  *         Il prend en argument le message d'erreur: mess
  *
  * **************************************************************/
    $scope.loginAlert = function(mess) {
     var alertPopup = $ionicPopup.alert({
       title: 'Erreur !',
       template: 'Message ' +mess
     });
     alertPopup.then(function(res) {
       console.log('Erreur'+ mess);
     });
   };

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

       $http.post('http://localhost:1337/client/login?email='+$scope.loginData.email+'&motdepasse='+$scope.loginData.password).
            success(function(data, status, headers, config) {
                  // this callback will be called asynchronously
                  // when the response is available
                  console.log(data);
                  console.log('response status: '+status);
                  if(data.isAuthenticate){
                      sessionStorage.setItem('isAuth', 'true');
                      localStorage.setItem('token',data.token);
                      localStorage.setItem('nom',data.nom);
                      localStorage.setItem('prenom',data.prenom);
                      localStorage.id = data.idclient;
                      $rootScope.token = localStorage.getItem('token');
                      console.log('Token recu :'+$rootScope.token);
                      console.log('session storage :'+sessionStorage.getItem('isAuth'));
                      console.log('Connexion effectuée avec succes :');
                      $scope.client = data;
                      console.log($scope.client);
                      $scope.auth = true;
                       $scope.user.nom = localStorage.getItem('nom');
                      $scope.user.prenom = localStorage.getItem('prenom');
                       console.log($scope.auth);
                      $scope.closeLogin();
                  }
                  if(data.notAuthenticate){
                    $scope.loginAlert(data.erreur);
                  }
             }).
            error(function(data, status, headers, config) {
                  console.log('error :'+status);
                  console.log('error data : '+data);
                   // called asynchronously if an error occurs
                  // or server returns response with an error status.
                  });
    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    //$timeout(function() {
   //   $scope.closeLogin();
  //  }, 1000);
  };
  $scope.doLogout = function(){
    localStorage.clear();
    sessionStorage.clear();
    $scope.auth = false;

  }
/***************************************************************
  *
  *                 logon modal
  *
  * **************************************************************/
// Create the login modal that we will use later
  $scope.logonData = {};
  $ionicModal.fromTemplateUrl('templates/logon.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modalLogon = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogon = function() {
    $scope.modalLogon.hide();
  };

  // Open the login modal
  $scope.logon = function() {
    $scope.modalLogon.show();
    $scope.closeLogin();
  };
  $scope.selectTabWithIndex = function(index) {
    $ionicTabsDelegate.select(index);
    $scope.modalLogon.hide();
  }

  // Perform the login action when the user submits the login form
  $scope.doLogon = function() {

    console.log('Doing logon', $scope.logonData);
                        $http.post('http://localhost:1337/client/createClient', $scope.logonData).
                            success(function(data, status, headers, config) {
                              // this callback will be called asynchronously
                              // when the response is available
                              console.log('response status: '+status);
                              console.log('Création de compte effectuée avec succes :'+data);
                            }).
                            error(function(data, status, headers, config) {
                              console.log('error :'+status);
                              console.log('error data : '+data);
                              // called asynchronously if an error occurs
                              // or server returns response with an error status.
                            });

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogon();
    }, 1000);
  };
   /***************************************************************
  *                                    Profil Alert!
  *        Ce Popup est appelé lorsque un client essaie de modifier son plofil
  *        alors qu'il n'est pas connecté! elle le redirige soit vers la page de connexion soit vers l
  *        l'accueil.
  *
  * **************************************************************/
  $scope.profilAlert = function() {
   var confirmPopup = $ionicPopup.confirm({
     title: 'Une erreur est survenue !',
     template: 'Vous devez être connecté! Connectez-vous maintenant ?'
   });
   confirmPopup.then(function(res) {
     if(res) {
       console.log('Se connecter');
       $scope.login();
     } else {
       console.log('Retour à l\'accueil');
       $state.go('app.home');
       //$location.path("#app/tutu");
     }
   });
 };
 /***************************************************************
  *                                   Session expirée
  *        Ce Popup est appelé lorsque la session d'un client est expirée.
  *       Elle invite l'utilisateur à se reconnecter afin d'effection l'action
  *       souhaitée.
  *
  * **************************************************************/
$scope.SessionExpire = function() {
   var confirmPopup = $ionicPopup.confirm({
     title: 'Une erreur est survenue !',
     template: 'Votre session est expirée! Connectez-vous maintenant ?'
   });
   confirmPopup.then(function(res) {
     if(res) {
       console.log('Se connecter');
       $scope.login();
     } else {
       console.log('Retour à l\'accueil');
       $state.go('app.home');
       //$location.path("#app/tutu");
     }
   });
 };

/*************************************************************************************************************
  *
  *                                                 Edit Profil Function:
  *                            Cette fonction permet de modifier le profil du client.
  *                  Elle verifie que le client qui souhaite effectuer la manipulation
  *   est bien connecté et authentifier. une fois le formulaire rempli elle appelle une fonction
  *   qui envoi une requette qu serveur pour la maj du client.
  *
  *
  * ***********************************************************************************************************/
  $scope.profilEdit = {};
   // Create the login modal that we will use later

  $ionicModal.fromTemplateUrl('templates/profil.html', {
    scope: $scope,
    animation: 'slide-right-left'
  }).then(function(modal) {
    $scope.profilModal = modal;
  });

// goHome function
  $scope.goHome = function(){
     $scope.profilModal.hide();
  }

// majProfil function
   $scope.majProfil = function(){
    var id = localStorage.id;
    console.log($scope.profilEdit);
     var req = {
              method:'POST',
              url:'http://localhost:1337/client/updateClient',
              headers:{
                token: $rootScope.token,
              },
             params:{'idclient':id},
             data: $scope.profilEdit
            };
            $http(req).success(function(data, status, headers, config){
                console.log(data);
                if(data.erreur == 'Session expire'){
                  $scope.SessionExpire();
                }
                else{
                    $scope.loginAlert(data.update);
                }
                $scope.profilModal.hide();
            }).error(function(data, status, headers, config){
              $scope.loginAlert(data);
            });

  }

  //editProfil function
  $scope.editProfil = function(){
    var statut = sessionStorage.getItem('isAuth');
        if( statut == 'true' ){
          var id = localStorage.id;
          console.log(id);
           var req = {
              method:'GET',
              url:'http://localhost:1337/client/findClient',
              headers:{
                token: $rootScope.token,
              },
             params:{'idclient':id}
            };
            $http(req).success(function(data, status, headers, config){
                $scope.profil = data;
                console.log($scope.profil);
            }).error(function(data, status, headers, config){
              $scope.loginAlert(data);
            });
           $scope.profilModal.show();
          }
     else{
            $scope.profilAlert()
        }
  }
  /***************************************************************
  *
  *                 Search controler
  *
  * **************************************************************/
  $scope.searchMap = {center: {latitude: 47.5098397, longitude: 6.798546900000019 }, zoom: 16 };

  $scope.messageMap = "Afficher la carte";
  $scope.listActive = true;
  $scope.recherche = function(){
     $scope.listActive = true;
     $scope.messageMap = "Afficher la carte";
  };
  $scope.mapOn = function() {
    if($scope.listActive){$scope.listActive = false;}
    else{$scope.listActive = true;}
    if($scope.messageMap == "Afficher la carte"){
      $scope.messageMap = "Afficher dans une liste";
    }
    else{
        $scope.messageMap = "Afficher la carte";
    }
    console.log($scope.listActive);
  };

  /***************************************************************
  *
  *                 Ici on recupère la liste des catégorie de
  *                                     commerces.
  *
  * **************************************************************/
  $scope.searchMarker=[];
   $scope.tmp = {
     coords:{
          latitude: 47.508901,
          longitude: 6.797135
    },
    key:{
        id:0
    }
  };

$scope.cat = function(){
      $ionicLoading.show({
                  template: 'chargement . . . '
                });
     $http.get('http://localhost:1337/categorie_com/findCategorie_com').
          success(function(data, status, headers, config) {
                   if(status == 200) $ionicLoading.hide();
                  $scope.categorie = data;

            }).
          error(function(data, status, headers, config) {
                  $ionicLoading.show({
                              template: 'Erreur de connexion !  Veuillez verifier votre connexion internet '
                            });
                  console.log('error'+status);
            });

};


$scope.getCommerce = function(categorie){
        $scope.cat = categorie;
        console.log('cat '+$scope.cat);
        $ionicLoading.show({
                  template: 'chargement . . . '
                });
        $http.get('http://localhost:1337/commerce?categorie='+$scope.cat).
          success(function(data, status, headers, config) {
                  $scope.comCat = data;
                   if(status == 200) $ionicLoading.hide();
                   console.log($scope.comCat);
                   if($scope.comCat.length >0){
                     console.log($scope.comCat.length);
                       for(var i=0; i<$scope.comCat.length; i++){
                         // console.log($scope.comCat[i].latitude);
                         // console.log($scope.comCat[i].longitude);
                           $scope.tmp.coords.latitude = $scope.comCat[i].latitude;
                            $scope.tmp.coords.longitude = $scope.comCat[i].longitude;
                            $scope.tmp.key.id = i;
                            $scope.searchMarker[i] = $scope.tmp;
                       }

                   }
                   console.log($scope.searchMarker);
                  console.log('Liste des catégories :');
                  console.log($scope.comCat);
            }).
          error(function(data, status, headers, config) {
                  $ionicLoading.show({
                              template: 'Erreur de connexion !  Veuillez verifier votre connexion internet '
                            });
                  console.log('error'+status);
            });
      };
/***************************************************************
  *
  *                 Favoris client
  *
  * **************************************************************/
$scope.getFav = function(){
  var idclient = parseInt(localStorage.id);
  $http.get('http://localhost:1337/favorie?client_idclient='+idclient).
          success(function(data, status, headers, config) {
                $scope.favoris = data ;
                 console.log($scope.favoris);
            }).
          error(function(data, status, headers, config) {
                    console.log($scope.favoris);
            });

}


})
/***************************************************************
  *
  *                            Home controller
  *
  * **************************************************************/
.controller('HomeCtrl', function($rootScope,$scope, $http, $ionicLoading) {
      $http.get('http://localhost:1337/commerce/findCommerce').
          success(function(data, status, headers, config) {
                  $scope.commerces = data;
            }).
          error(function(data, status, headers, config) {
                  console.log('error'+status);
            });

      $rootScope.comId = function(id){
          $rootScope.id = id;
          console.log($rootScope.id);
      };
      $rootScope.getNews = function(){
        $ionicLoading.show({
                  template: 'chargement . . . '
                });
         $http.get('http://localhost:1337/news/findNews').
          success(function(data, status, headers, config) {
                  $rootScope.news = data;
                  if(status == 200) $ionicLoading.hide();
                  console.log($rootScope.news);

            }).
          error(function(data, status, headers, config) {
                  $ionicLoading.show({
                              template: 'Erreur de connexion !  Veuillez verifier votre connexion internet '
                            });
                  console.log('error'+status);
                  console.log(data);
            })
          .finally(function() {
                           // Stop the ion-refresher from spinning
                            $scope.$broadcast('scroll.refreshComplete');
                   });
        };

})

.controller('BonPlanCtrl',function($rootScope,$scope, $ionicModal, $timeout,$http, $templateCache){

  /***************************************************************
  *
  *                 Bon Plan Modal
  *
  * **************************************************************/

  $ionicModal.fromTemplateUrl('templates/bonPlanModal.html', {
    scope: $scope,
    animation: 'slide-right-left'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Permet de fermer le modal
  $scope.closeBonPlan = function() {
    $scope.modal.hide();
  };

  // Ouvre le modal Bon Plam
  $scope.bonPlan = function(id) {
    $scope.idbp = id;
    $http.get('http://localhost:1337/bonplan?idbonplan='+$scope.idbp).
          success(function(data, status, headers, config) {
                  $scope.res = null;
                  $scope.res = data;
                  console.log('statut : '+status);
                  console.log('reponse : '+data);
                  console.log($scope.res);
                  if($scope.res)
                  {
                    $scope.modal.show();
                  }
            }).
          error(function(data, status, headers, config) {
                 console.log('error'+status);
            });
  };


  $http.get('http://localhost:1337/bonplan').
          success(function(data, status, headers, config) {
                  $scope.bonplan = data;
                  console.log($scope.bonplan);
            }).
          error(function(data, status, headers, config) {
                  console.log('error'+status);
            });

$scope.modal.remove();
})



   /****************************************************************
  *
  *                             Playlist controler
  *
  * **************************************************************/

.controller('PlaylistCtrl', function($scope,$rootScope, $stateParams, $ionicModal, $timeout, $http,$ionicPopup, $ionicLoading) {

   $scope.idclient = parseInt(localStorage.id);
   console.log($scope.idclient);
  $scope.map = {center: {latitude: 47.508901, longitude: 6.797135 }, zoom: 16 };
  $scope.options = {scrollwheel: false};
  $scope.marker ={
       coords:{
        latitude: 47.508901,
        longitude: 6.797135
       }
  };

/****************************************************************
  *               addToFav( var idcommerce, var idclient)
  *   Cette fonction permet d'ajouter à la liste de favorie
  *   d'un client  le commerce dont l'id est passé en params
  *
  *
  * **************************************************************/
  $scope.addToFav = function(idcommerce, idclient){
    var fav = {};
    fav.idcommerce = idcommerce;
    fav.client_idclient = idclient;
    console.log(fav);
     var req = {
              method:'POST',
              url:'http://localhost:1337/favorie/createFavorie',
              headers:{
                token: $rootScope.token,
              },
             data:fav
            };
            $http(req).success(function(data, status, headers, config){

            }).error(function(data, status, headers, config){
              $scope.loginAlert(data);
            });


  }

  /*****************************************************************************************************************/
  // Number popup
  $scope.showAlert = function(num) {
     var alertPopup = $ionicPopup.alert({
       title: 'Contact',
       template: 'Fixe : +33 ' +num
     });
     alertPopup.then(function(res) {
       console.log('contact '+ num);
     });
   };

  var id = $rootScope.id;
  console.log("reference :"+id);
  $http.get('http://localhost:1337/commerce?idcommerce='+id).
          success(function(data, status, headers, config) {
            if(status == 200) $ionicLoading.hide();
                  $rootScope.com = data;
                  $scope.marker.coords.latitude = $rootScope.com[0].latitude;
                  $scope.marker.coords.longitude = $rootScope.com[0].longitude;
                  $scope.map.center.latitude =  $rootScope.com[0].latitude;
                  $scope.map.center.longitude = $rootScope.com[0].longitude;
                   console.log($scope.marker);
                   console.log($rootScope.com);
            }).
          error(function(data, status, headers, config) {
                  console.log('error'+status);
            });



          // La requette suivant recupere les bonplans du commerce
          $scope.getComBP = function(){
              $http.get('http://localhost:1337/bonplan/?commerce_idcommerce='+id).
                    success(function(data, status, headers, config) {
                            $rootScope.comBP = data;
                             console.log($rootScope.comBP);
                      }).
                    error(function(data, status, headers, config) {
                            console.log('error'+status);
                      });
          };
          //La requette suivante recupère les conseils du commerce
          $scope.getConseil = function(){
                $ionicLoading.show({
                      template: 'Chargement . . . '
                    });
              $http.get('http://localhost:1337/conseils?Com_idcommerce='+id).
                success(function(data, status, headers, config) {
                         if(status == 200) $ionicLoading.hide();
                        $rootScope.tips = data;
                         console.log($rootScope.tips);
                  }).
                error(function(data, status, headers, config) {
                        console.log('error'+status);
                         $ionicLoading.show({
                              template: 'Erreur de connexion !  Veuillez verifier votre connexion internet '
                            });
                  })
                .finally(function() {
                           // Stop the ion-refresher from spinning
                            $scope.$broadcast('scroll.refreshComplete');
                   });
          };
          // affiche le details complèt du commerce
          $scope.more = function(){
                $ionicLoading.show({
                  template: 'Chargement . . . '
                });
                $http.get('http://localhost:1337/commerce?idcommerce='+id).
                    success(function(data, status, headers, config) {
                       if(status == 200) $ionicLoading.hide();
                            $rootScope.com1 = data;
                             console.log($rootScope.com);
                      }).
                    error(function(data, status, headers, config) {
                            console.log('error'+status);
                             $ionicLoading.show({
                              template: 'Erreur de connexion !  Veuillez verifier votre connexion internet '
                            });

                      })

          };


          $scope.loadAvis = function(){
                $ionicLoading.show({
                  template: 'chargement . . . '
                });
                $http.get('http://localhost:1337/avis/?commerce_idcommerce='+id).
                    success(function(data, status, headers, config) {
                            if(status == 200) $ionicLoading.hide();
                            $rootScope.comAvis = data;
                             console.log($rootScope.comAvis);
                      }).
                    error(function(data, status, headers, config) {
                            $ionicLoading.show({
                              template: 'Erreur de connexion !  Veuillez verifier votre connexion internet '
                            });
                            $timeout(function() {
                               $ionicLoading.hide(); //close the popup after 3 seconds for some reason
                            }, 3000);
                            console.log('error'+status);
                      })
                    .finally(function() {
                           // Stop the ion-refresher from spinning
                            $scope.$broadcast('scroll.refreshComplete');
                         });
          };


   /****************************************************************
  *
  *                             Galerie Modal
  *
  * **************************************************************/


  $ionicModal.fromTemplateUrl('templates/album.html', {
    scope: $scope,
    animation: 'slide-right-left'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Permet de fermer le modal
  $scope.closeGalerie = function() {
    $scope.modal.hide();
  };

  // Ouvre le modal Bon Plam
  $scope.galerie = function() {
    $scope.modal.show();
  };
  $scope.selectTabWithIndex = function(index) {
    $ionicTabsDelegate.select(index);
  }
  $scope.nextSlide = function() {
    $ionicSlideBoxDelegate.next();
  }

   /****************************************************************
  *
  *                             Rédiger un avis  Modal
  *
  * **************************************************************/


$ionicModal.fromTemplateUrl('templates/createAvis.html', {
            scope: $scope,
            animation: 'slide-in-up'
          }).then(function(modal) {
            $scope.avisModal = modal;
      });

  // Permet de fermer le modal AvisModal
  $scope.closeAvisModal = function() {
    $scope.avisModal.hide();
  };

  // Ouvre le modal create Avis
  $scope.createAvis = function() {
    $scope.avis ={};
    $scope.avisModal.show();
  };
  $scope.selectTabWithIndex = function(index) {
    $ionicTabsDelegate.select(index);
  };

 /****************************************************************
  *               LaisserAvis()
  * Cette fontion est appelée lorsque un avis est créée.
  * elle recupère les données du formulaire par un post les
  * propulse au serveur pour être enrégistrer dans la BD
  *
  * **************************************************************/
  $scope.laisserAvis = function(idcommerce){
    if($scope.avis.titre && $scope.avis.titre){
      $scope.erreur = false;
      $scope.avis.client_idclient = localStorage.id;
      $scope.avis.commerce_idcommerce = idcommerce;
      console.log('Appercue de votre avis : ');
      console.log('idclient : '+$scope.avis.client_idclient);
      console.log('idcommerce: '+$scope.avis.commerce_idcommerce);
      console.log('Titre : '+$scope.avis.titre);
      console.log('Contenue : ['+$scope.avis.contenuAvis+' ]');
      var req = {
              method:'POST',
              url:'http://localhost:1337/avis/createAvis',
              headers:{
                token: $rootScope.token,
              },
             data: $scope.avis
            };
            $http(req).success(function(data, status, headers, config){
                console.log(data);
                if(data.erreur == 'Session expire'){
                  $scope.SessionExpire();
                }
                else{

                    //$scope.loginAlert();
                }
                $scope.profilModal.hide();
            }).error(function(data, status, headers, config){
              var mess = 'Une erreur est survenue veuillez recommencer !'
              $scope.loginAlert(data);
            });
      $scope.closeAvisModal();
    }
    else{
      $scope.erreur = true;
      console.log('Vous devez remplir tous les champs !');
    }

  }


});
