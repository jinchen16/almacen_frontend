//Modulo Angular
var app = angular.module('appAlmacenista', []);

//Controlador
app.controller('almacenistaController', function($scope, $http) {
    
$scope.mostrarSolicitudes = function() {
		var url = "https://almacen-elementos-orejuelajd.c9users.io:8081/read/Prestamos/estado/pendiente";
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