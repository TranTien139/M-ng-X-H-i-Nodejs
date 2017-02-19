var app = angular.module('profileApp',[]);
app.controller('profileController',function($scope,$http){

    $scope.checkIsFollow = function ($me,$id_user) {
        // for(var i=0; i<$scope.user.followers.length; i++){
        //     if($scope.user.followers[i].userId === $id_user){
        //         return true;
        //     }
        // }
         return true;
    }
});