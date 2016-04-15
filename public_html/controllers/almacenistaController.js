//Modulo Angular
var app = angular.module('appAlmacenista', []);

//Controlador
app.controller('almacenistaController', function($scope, $http) {

$scope.seleccion = [];
$scope.toggleSeleccion = function toggleSeleccion(idSolicitud) {
			var idx = $scope.seleccion.indexOf(idSolicitud);
		    // is currently selected
		    if (idx > -1) {
		     	$scope.seleccion.splice(idx, 1);     	
		    }
		    // is newly selected
		    else {
		     	 $scope.seleccion.push(idSolicitud);
		    }
		     console.log($scope.seleccion);
};

$scope.aprobarSolitudes = function(){
		var prestamoID;
		if($scope.seleccion.length > 0){
			for(var i=0; i<$scope.seleccion.length; i++){
				prestamoID = $scope.seleccion[i];
				$http.get('https://almacen-backend-orejuelajd.c9users.io/read/Prestamos/_id/' + prestamoID)
				.success(function(data){
					console.log("Solicitud obtenida - " + data.value[0].idUsuario);
					$http.get('https://almacen-backend-orejuelajd.c9users.io/update/Prestamos/' + data.value[0].idUsuario + '/' + data.value[0].fechaEntrega + '/' + data.value[0].fechaVencimiento + '/aprobado/a/a/a/'+ prestamoID)
					.success(function(data){
					console.log("Prestamo aprobado" + prestamoID);
				}).error(function(data){
					console.log(data);
				});	
				}).error(function(data){
					console.log(data);
				});	
			}
		}else{
			window.alert('No hay solicitudes seleccionados');
		}		
}

$scope.mostrarSolicitudes = function() {
		var url = "https://almacen-backend-orejuelajd.c9users.io/read/Prestamos/estado/pendiente";
	    $http({
			method: 'GET',
			url: url
		}).then(function success(respuesta) {
				$scope.solicitudes = respuesta.data.value;
			}, function error(err) {
				console.log('error');
			});
	}
});