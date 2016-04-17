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
		
		$http.get('https://almacen-backend-orejuelajd.c9users.io/read/Elementos/nombre/' + idSolicitud)
					.success(function(data){
						//$scope.idElementos[i] = data.value[0]._id;
						var idx = $scope.seleccion.indexOf(data.value[0]._id);
					    // is currently selected
					    if (idx > -1) {
					     	$scope.seleccion.splice(idx, 1);     	
					    }
					    // is newly selected
					    else {
					     	 $scope.seleccion.push(data.value[0]._id);
					    }
					     console.log($scope.seleccion);
					}).error(function(data){
						console.log(data.value[0].nombre);
		});
		
	};
	
	$scope.nombresSolicitantes = [];
	$scope.mostrarSolicitudes = function() {
			var url = "https://almacen-backend-orejuelajd.c9users.io/read/Prestamos/estado/pendiente";
		    $http({
				method: 'GET',
				url: url
			}).then(function success(respuesta) {
					$scope.solicitudes = respuesta.data.value;
					
					// for(var i=0; i<$respuesta.data.value.length; i++){
				 //		$http.get('https://almacen-backend-orejuelajd.c9users.io/read/Usuario/_id/' + respuesta.data.value[0].idUsuario)
					// 	.success(function(data){
					// 		$scope.nombresSolicitantes[i] = data.value[0].nombre;
					// 	}).error(function(data){
					// 		console.log(data.value[0].nombre);
					// 	});
		 		// 	}
					
				}, function error(err) {
					console.log('error');
				});
	};
	
	
	$scope.idElementos = [];
	$scope.nombreElementos = [];
	$scope.solicitudID;
	$scope.mostrarItems = function(solicitudID) {
		$scope.solicitudID = solicitudID;
		var url = "https://almacen-backend-orejuelajd.c9users.io/read/Prestamos/_id/"+solicitudID; 
	    $http({
		 	method: 'GET',
		 	url: url
		 }).then(function success(prestamo) {
		 		$scope.idElementos = prestamo.data.value[0].elementos;
		 		for(var i=0; i<$scope.idElementos.length; i++){
			 		$http.get('https://almacen-backend-orejuelajd.c9users.io/read/Elementos/_id/' + $scope.idElementos[i])
					.success(function(data){
						$scope.nombreElementos[i] = data.value[0].nombre;
					}).error(function(data){
						console.log(data.value[0].nombre);
					});
		 		}
	 	}, function error(err) {
	 		console.log('error');
	 	});
	};
	
	aprobarSolicitud = function (){
		if($scope.seleccion.length > 0){
			if (window.confirm("¿Desea aprobar la solicitud con los elementos selecionados?")) {
				$http.get('https://almacen-backend-orejuelajd.c9users.io/read/Prestamos/_id/' + $scope.solicitudID)
				.success(function(data){
					$http.get('https://almacen-backend-orejuelajd.c9users.io/update/Prestamos/' + data.value[0].idUsuario + '/' + data.value[0].fechaEntrega + '/' + data.value[0].fechaVencimiento + '/aprobado/'+ $scope.seleccion +'/a/a/'+ $scope.solicitudID)
					.success(function(data){
						console.log("Prestamo aprobado" + $scope.solicitudID);
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
			}
		}else{
			window.alert('No hay solicitudes seleccionadas');
		}
	};
	
	$scope.salir = function(){
			var confirmar = confirm("¿Está seguro que desea salir?");
			if(confirmar){
				localStorageService.set("codigo","");
				window.location.href = '../index.html';
			}
	};
});