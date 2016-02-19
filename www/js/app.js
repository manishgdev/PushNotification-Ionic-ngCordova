var testApp = angular.module('starter', ['ionic', 'ngCordova']);

testApp.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});

testApp.controller('myAppCtrl', function($rootScope ,$scope, $ionicPopup, $cordovaDevice,$cordovaPushV5){
    $scope.testVar = 2342334;
    $scope.serverKey = "My_GCM_SERVER_KEY";
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
    
    var unregisterSuccess = function(res) {
        showAlertPopup("<b>Un-Register Success</b>", res);
    };
    
    var unregisterFailed = function(err) {
        showAlertPopup("<b>Un-Register Failed</b>", err);
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
            
            showAlertPopup("Register Init","Done with Initialization!!!!!");
            
            $scope.regID="Before Register Function.......";
            
//            $cordovaPushV5.unregister().then(unregisterSuccess, unregisterFailed, unregisterNotify);
            $cordovaPushV5.register().then(registerSuccess, registerFailed);
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