//Modulo Angular
var app = angular.module('appPrestamo', []);

//Controlador
app.controller('prestamoController', function() {

	$scope.hacerPrestamo = function() {
			//var url = 'http://ingenieria.uao.edu.co:4000/buscar/RegistroDato/nombre/' + $scope.nombreHTML;
			var url = "http://localhost:3000/hacerPrestamo/Registro/usuario/" + $scope.nombreHTML;
		$http({
				method: 'GET',
				url: url
			}).then(function success(respuesta) {
					$scope.resultadosHTML = respuesta.data.value;
				}, function error(err) {
					console.log('error');
				});
	}

});
