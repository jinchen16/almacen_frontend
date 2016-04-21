//Modulo Angular
var app = angular.module('appAlmacenista', ['LocalStorageModule']);

//Generalizar url
var urlBack = getURL("http","localhost",8080);
var urlFront = getURL("http","localhost",80);

app.config(function (localStorageServiceProvider) {
  localStorageServiceProvider
    .setPrefix('Almacen');
});

//Controlador
app.controller('almacenistaController', function($scope, $http, localStorageService) {
	var codigo = localStorageService.get("codigo");
	
	$scope.seleccionSolicitud = [];
	$scope.toggleSeleccionSolicitud = function toggleSolicitud(idSolicitud) {
		//$scope.idElementos[i] = data.value[0]._id;
		var idx = $scope.seleccionSolicitud.indexOf(idSolicitud);
	    // is currently selected
	    if (idx > -1) {
	     	$scope.seleccionSolicitud.splice(idx, 1);     	
	    }
	    // is newly selected
	    else {
	     	 $scope.seleccionSolicitud.push(idSolicitud);
	    }
	    console.log($scope.seleccionSolicitud);
	};
	
	$scope.seleccionPrestamo = [];
	$scope.toggleSeleccionPrestamo = function toggleSeleccionPrestamo(idSolicitud) {
		//$scope.idElementos[i] = data.value[0]._id;
		var idx = $scope.seleccionPrestamo.indexOf(idSolicitud);
	    // is currently selected
	    if (idx > -1) {
	     	$scope.seleccionPrestamo.splice(idx, 1);     	
	    }
	    // is newly selected
	    else {
	     	 $scope.seleccionPrestamo.push(idSolicitud);
	    }
	    console.log($scope.seleccionPrestamo);
	};
	
	$scope.nombresSolicitantes = [];
	$scope.solicitudes = [];
	$scope.mostrarSolicitudes = function() {
		var url = urlBack + 'read/Prestamos/estado/pendiente';
	    $http({
			method: 'GET',
			url: url
		}).then(function success(respuesta) {
				$scope.solicitudes = respuesta.data.value;
			}, function error(err) {
				console.log('error');
		});
	};

	$scope.elementosSolicitud = [];
	$scope.solicitudID;
	$scope.mostrarElementosSolicitud = function(solicitudID) {
		$scope.solicitudID = solicitudID;
		var url = urlBack + 'read/Prestamos/_id/'+solicitudID; 
	    $http({
		 	method: 'GET',
		 	url: url
		 }).then(function success(prestamo) {
		 		$scope.elementosSolicitud = prestamo.data.value[0].elementos;
	 	}, function error(err) {
	 		console.log('error');
	 	});
	};
	
	aprobarSolicitud = function (){
		var solicitudID = $scope.solicitudID;
		var contador = 0;
		if($scope.seleccionSolicitud.length > 0){
			if (window.confirm("¿Desea aprobar la solicitud con los elementos selecionados?")) {
				$http.get( urlBack + 'read/Prestamos/_id/' + solicitudID)
				.success(function(prestamo){
					console.log(prestamo.value);
					var fechaEntrega = new Date().getTime()
					var fechaVencimiento = (fechaEntrega + (3*(8.64*Math.pow(10,7))));
			 		$http.get( urlBack + 'update/Prestamos/' + prestamo.value[0].idUsuario + '/' + fechaEntrega + '/' + fechaVencimiento + '/aprobado/a/a/a/'+ solicitudID)
					.success(function(data){
						console.log("Prestamo aprobado" + solicitudID);
						$scope.seleccionSolicitud.forEach(function(nombreElemento){
							$http.get( urlBack + 'agregarElemento/Prestamos/'+ solicitudID +'/'+ nombreElemento)
					    	.success(function(data) {
					    	   console.log(data);
					    	   contador ++;
					    	   if(contador == $scope.seleccionSolicitud.length){
									window.location.reload();
								}
					    	}).error(function(data) {
					    	   console.log(data); 
					    	});
						})
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
	
	$scope.prestamosAprobados = []; 
	$scope.prestamosCaducados = [];
	$scope.prestamosSancionados = [];
	$scope.prestamosEnProgreso = []; 
	$scope.mostrarPrestamos = function(){
		$http.get( urlBack + 'read/Prestamos/estado/aprobado')
		.success(function(data){
			$scope.prestamosAprobados = data.value;
			$http.get( urlBack + 'read/Prestamos/estado/vencido')
			.success(function(data){
				$scope.prestamosCaducados = data.value;
				$scope.prestamosEnProgreso = $scope.prestamosCaducados.concat($scope.prestamosAprobados);
				$http.get( urlBack + 'read/Prestamos/estado/sancionado')
				.success(function(data) {
					$scope.prestamosSancionados = data.value;
				    $scope.prestamosEnProgreso = $scope.prestamosCaducados.concat($scope.prestamosAprobados)
				    .concat($scope.prestamosSancionados);
				}).error(function(data) {
				    console.log(data);
				})
			}).error(function(data){
				
			});
		}).error(function(data){
			console.log(data);
		});	
	};
	
	$scope.elementosPrestamo = [];
	$scope.prestamoID;
	$scope.mostrarElementosPrestamo = function(prestamoID) {
		$scope.prestamoID = prestamoID;
		var url = urlBack + 'read/Prestamos/_id/'+ prestamoID; 
	    $http({
		 	method: 'GET',
		 	url: url
		 }).then(function success(prestamo) {
		 		$scope.elementosPrestamo = prestamo.data.value[0].elementos;
	 	}, function error(err) {
	 		console.log('error');
	 	});
	};
	
	terminarPrestamo = function (){
		var prestamoID = $scope.prestamoID;
		var contador = 0;
		if($scope.seleccionPrestamo.length > 0){
			if (window.confirm("¿Desea terminar el prestamo con los elementos selecionados?")) {
				$http.get( urlBack + 'read/Prestamos/_id/' + prestamoID)
				.success(function(prestamo){
					if($scope.seleccionPrestamo.length == prestamo.value[0].elementos.length){						
						if(prestamo.value[0].estado === "sancionado"){
							$http.get( urlBack + 'update/Prestamos/' + prestamo.value[0].idUsuario + '/' + (new Date().getTime() + (4*(8.64*Math.pow(10,7)))) + '/' + prestamo.value[0].fechaVencimiento + '/sancionado-terminado/a/a/a/'+ prestamoID)
							.success(function(data){
								window.location.reload();
								console.log("Prestamo terminado" + prestamoID);
							}).error(function(data){
								console.log(data);
							});	
						}else{
							$http.get( urlBack + 'update/Prestamos/' + prestamo.value[0].idUsuario + '/' + prestamo.value[0].fechaEntrega + '/' + prestamo.value[0].fechaVencimiento + '/terminado/a/a/a/'+ prestamoID)
							.success(function(data){
								window.location.reload();
								console.log("Prestamo terminado" + prestamoID);
							}).error(function(data){
								console.log(data);
							});
						}
					}else{
						$scope.seleccionPrestamo.forEach(function(nombreElemento){
							$http.get( urlBack + 'eliminarElemento/Prestamos/'+ prestamoID +'/'+ nombreElemento)
					    	.success(function(data) {
					    	   console.log(data);
					    	   contador ++;
					    	   if(contador == $scope.seleccionPrestamo.length){
									window.location.reload();
								}
					    	}).error(function(data) {
					    	   console.log(data); 
					    	});
						})
					}
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

//Funcion para devolver la URL general
function getURL(protocol, host, port){
	return protocol + '://' + host + ':' + port + '/';
}
