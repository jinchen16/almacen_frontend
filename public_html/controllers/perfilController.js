//Modulo Angular
var app = angular.module('appPerfil', ['ngResource', 'LocalStorageModule']);

app.config(function (localStorageServiceProvider) {
  localStorageServiceProvider
    .setPrefix('Almacen');
});

//Controlador
app.controller('perfilController', function($scope, $http, $resource, localStorageService) {
	$scope.nombreHTML = '';
	$scope.nombreResource = '';
	$scope.name = "";


	$scope.desplegarRegistrosUsuario = function() {
		if($scope.nombreHTML !== '' && $scope.nombreHTML !== undefined) {
			//var url = 'http://ingenieria.uao.edu.co:4000/buscar/RegistroDato/nombre/' + $scope.nombreHTML;
			var url = "http://localhost:3000/buscar/Registro/usuario/" + $scope.nombreHTML;
		$http({
				method: 'GET',
				url: url
			}).then(function success(respuesta) {
					$scope.resultadosHTML = respuesta.data.value;
				}, function error(err) {
					console.log('error');
				});
		};
	}

  $scope.desplegarLogins = function() {
			//var url = 'http://ingenieria.uao.edu.co:4000/buscar/RegistroDato/nombre/' + $scope.nombreHTML;
			var url = "http://localhost:3000/buscar/Registro/tipo/login";
		$http({
				method: 'GET',
				url: url
			}).then(function success(respuesta) {
					$scope.resultadosHTML = respuesta.data.value;
				}, function error(err) {
					console.log('error');
				});
	}

  $scope.desplegarLogerrors = function() {
			//var url = 'http://ingenieria.uao.edu.co:4000/buscar/RegistroDato/nombre/' + $scope.nombreHTML;
			var url = "http://localhost:3000/buscar/Registro/tipo/logerror";
		$http({
				method: 'GET',
				url: url
			}).then(function success(respuesta) {
					$scope.resultadosHTML = respuesta.data.value;
				}, function error(err) {
					console.log('error');
				});
	}

  $scope.desplegarLogouts = function() {
			//var url = 'http://ingenieria.uao.edu.co:4000/buscar/RegistroDato/nombre/' + $scope.nombreHTML;
			var url = "http://localhost:3000/buscar/Registro/tipo/logout";
		$http({
				method: 'GET',
				url: url
			}).then(function success(respuesta) {
					$scope.resultadosHTML = respuesta.data.value;
				}, function error(err) {
					console.log('error');
				});
	}

  $scope.desplegarUsuarios = function() {
			//var url = 'http://ingenieria.uao.edu.co:4000/buscar/RegistroDato/nombre/' + $scope.nombreHTML;
			var url = "http://localhost:3000/buscarUsuarios/Usuario";
		$http({
				method: 'GET',
				url: url
			}).then(function success(respuesta) {
					$scope.resultadosHTML = respuesta.data.value;
					console.log(respuesta.data.value);
				}, function error(err) {
					console.log('error');
				});
	}

  $scope.logout = function() {
		$http.defaults.useXDomain = true;
		$scope.name = "undefined";
    var url = "http://localhost:3000/crear/Registro/logout/" + localStorageService.get("username") + "/cierreSesionOK";
		$http({
        method: 'GET',
        url: url
      })
			.then(function success(respuesta) {
							if(respuesta.data.value.length > 0){
								console.log("Sesion cerrada");
								window.location.href = "http://localhost:4000/vistas/login.html";
							}else{
								console.log("Error al cerrar sesion");
							}
			 			}, function error(err) {
			 				console.log('error');
			 			});
  }

});
