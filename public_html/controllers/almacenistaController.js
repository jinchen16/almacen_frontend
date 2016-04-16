//Modulo Angular
var app = angular.module('appAlmacenista', ['LocalStorageModule']);

app.config(function (localStorageServiceProvider) {
  localStorageServiceProvider
    .setPrefix('Almacen');
});

//Controlador
app.controller('almacenistaController', function($scope, $http, localStorageService) {
	var codigo = localStorageService.get("codigo");
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
		$scope.contador = 0;
		if($scope.seleccion.length > 0){
			if (window.confirm("¿Desea aprobar las solicitudes seleccionadas?")) {
				$scope.seleccion.forEach(function(prestamoID){
					$http.get('https://almacen-backend-orejuelajd.c9users.io/read/Prestamos/_id/' + prestamoID)
					.success(function(data){
						console.log("Solicitud obtenida - " + data.value[0].idUsuario);
						$http.get('https://almacen-backend-orejuelajd.c9users.io/update/Prestamos/' + data.value[0].idUsuario + '/' + data.value[0].fechaEntrega + '/' + data.value[0].fechaVencimiento + '/aprobado/'+ data.value[0].elementos +'/a/a/'+ prestamoID)
						.success(function(data){
							console.log("Prestamo aprobado" + prestamoID);
							$scope.contador ++;
							if($scope.contador == $scope.seleccion.length){
								window.location.reload();
							}
						}).error(function(data){
							console.log(data);
						});	
					}).error(function(data){
						console.log(data);
					});	
				});
			}
		}else{
			window.alert('No hay solicitudes seleccionadas');
		}
	};
	
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
	};
	
	$scope.salir = function(){
			var confirmar = confirm("¿Está seguro que desea salir?");
			if(confirmar){
				localStorageService.set("codigo","");
				window.location.href = '../index.html';
			}
	};
});