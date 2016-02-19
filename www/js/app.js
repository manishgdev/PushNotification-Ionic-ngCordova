// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var testApp = angular.module('starter', ['ionic', 'ngCordova']);

testApp.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});

testApp.controller('myAppCtrl', function($rootScope ,$scope, $ionicPopup, $cordovaDevice,$cordovaPushV5){
    $scope.testVar = 2342334;
    $scope.serverKey = "AIzaSyBXVoPrcbYyjLRLgDEPgt0oZbIjRQLi1GE";
    $scope.regID = "Not yet recieved from server";
    
    $scope.showDeviceInfo = function() {
        console.log("Opening the Popup");
        var popupTemplate = null;
        try{
            var mobDevice = $cordovaDevice.getDevice();
            var cordova = $cordovaDevice.getCordova();
            var model = $cordovaDevice.getModel();

            var platform = $cordovaDevice.getPlatform();
            var uuid = $cordovaDevice.getUUID();
            var version = $cordovaDevice.getVersion();  
            
            popupTemplate = "Model : "+model+"<br/>Platform : "+platform+"<br/>UUID : "+uuid+"Version :  "+version;
        }
        catch(err){
            console.error("Got Error in Getting Device variable!!! May be the app is running in browser"); 
            popupTemplate = "Sorry, you are not connected to the device <br/>Server Key: "+$scope.serverKey;
        }
        
        showAlertPopup("<b>Test Alert</b>", popupTemplate);
        
    };
    
    var showAlertPopup = function(title, template) {
        var alertPopup = $ionicPopup.alert({
            title : title,
            template : template
        });
        
        alertPopup.then(function(res) {
            console.log("Alert Popup Closed : "+title);
        });
    };
    
    var registerSuccess = function(regID) {
        $scope.regID="Inside Register Token Fetch......";
        console.log('$cordovaPushV5:REGISTERED', regId);
        $scope.regID = regId;
        title="<b>Registration Success</b>"
        template = "Registration ID Recieved : "+regId;
        showAlertPopup("Test","Register Success");
    };
    
    var registerFailed = function(err) {
        $scope.regID="Register Function Error Occured.......";
        console.error('$cordovaPushV5:REGISTER_ERROR');
        title="<b>Registration Error</b>"
        template="<b>Registration Error :</b> <br/>";
    };
    
    var registerNotify = function(notifyText) {
        showAlertPopup("<b>Register Notify</b>", notifyText);
    };
    
    var unregisterSuccess = function(res) {
        showAlertPopup("<b>Un-Register Success</b>", res);
    };
    
    var unregisterFailed = function(err) {
        showAlertPopup("<b>Un-Register Failed</b>", err);
    };
    
    var unregisterNotify = function(msg) {
        showAlertPopup("<b>Un-Register Notify</b>", msg);
    };
    
    var notifySuccess = function(successMessage) {
        showAlertPopup("<b>Initialisation Success</b>", successMessage);
    };

    var notifyError = function(errorMessage) {
        showAlertPopup("<b>Initialisation Failed</b>", errorMessage);
    };
    
    var notifyNotify = function(notifyMessage) {
        showAlertPopup("<b>Initialisation Notification</b>", notifyMessage);
    };
    
    $scope.registerDeviceToGCM = function() {
        var template = null;
        var title = "<b>Registration Default</b>";
        $scope.regID="Trying to fetch......";
        try {
            var options = {
                "android": { "senderID": $scope.serverKey },
                "ios": { "alert": true, "badge": true, "sound": true }
            };
            
            $cordovaPushV5.initialize(options);
            
            $rootScope.$on('$cordovaPushV5:notificationReceived', function(event, notification) {
               alert("Got a notification for you");
            });

            $rootScope.$on('$cordovaPushV5:errorOccurred', function(event, error) {
                alert("Error Occurred in Push Notification : "+error);
            });
            
            showAlertPopup("Register Init","Done with Initialization!!!!!");
            
            $scope.regID="Before Register Function.......";
            
//            $cordovaPushV5.unregister().then(unregisterSuccess, unregisterFailed, unregisterNotify);
            $cordovaPushV5.register().then(registerSuccess, registerFailed, registerNotify);
        }
        catch(err) {
            $scope.regID="Register Function Exception Occurred.......";
            $scope.regID="Inside Register Token Fetch......";
            title = "<b>Registration Exception</b>"
            template="<b>Device Not Found Error :</b> <br/>"+err;
        }
        
//        showAlertPopup("Test","Register Function Execution Complete");
        showAlertPopup(title, template);
        
    };
    
});