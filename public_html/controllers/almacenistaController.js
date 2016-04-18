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
		//$scope.idElementos[i] = data.value[0]._id;
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
	
	$scope.nombresSolicitantes = [];
	$scope.solicitudes = [];
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

	$scope.elementos = [];
	$scope.solicitudID;
	$scope.mostrarElementos = function(solicitudID) {
		$scope.solicitudID = solicitudID;
		var url = "https://almacen-backend-orejuelajd.c9users.io/read/Prestamos/_id/"+solicitudID; 
	    $http({
		 	method: 'GET',
		 	url: url
		 }).then(function success(prestamo) {
		 		$scope.elementos = prestamo.data.value[0].elementos;
	 	}, function error(err) {
	 		console.log('error');
	 	});
	};
	
	aprobarSolicitud = function (){
		var solicitudID = $scope.solicitudID;
		var contador = 0;
		if($scope.seleccion.length > 0){
			if (window.confirm("¿Desea aprobar la solicitud con los elementos selecionados?")) {
				$http.get("https://almacen-backend-orejuelajd.c9users.io/read/Prestamos/_id/"+solicitudID)
				.success(function(prestamo){
					console.log(prestamo.value);
			 		$http.get('https://almacen-backend-orejuelajd.c9users.io/update/Prestamos/' + prestamo.value[0].idUsuario + '/' + prestamo.value[0].fechaEntrega + '/' + prestamo.value[0].fechaVencimiento + '/aprobado/a/a/a/'+ solicitudID)
					.success(function(data){
						console.log("Prestamo aprobado" + solicitudID);
						$scope.seleccion.forEach(function(nombreElemento){
							$http.get('https://almacen-backend-orejuelajd.c9users.io/agregarElemento/Prestamos/'+ solicitudID +'/'+ nombreElemento)
					    	.success(function(data) {
					    	   console.log(data);
					    	   contador ++;
					    	   if(contador == $scope.seleccion.length){
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
	$scope.prestamosEnProgreso = []; 
	$scope.mostrarPrestamos = function(){
		$http.get('https://almacen-backend-orejuelajd.c9users.io/read/Prestamos/estado/aprobado')
		.success(function(data){
			//$scope.prestamosEnProgreso = data.value;
			$scope.prestamosAprobados = data.value;
			$http.get('https://almacen-backend-orejuelajd.c9users.io/read/Prestamos/estado/caducado')
			.success(function(data){
				$scope.prestamosCaducados = data.value;
				$scope.prestamosEnProgreso = $scope.prestamosCaducados.concat($scope.prestamosAprobados);
			}).error(function(data){
				
			});
		}).error(function(data){
			console.log(data);
		});	
	};
	
	
	$scope.cancelaPrestamo = function(){
		
	};
	
	$scope.salir = function(){
			var confirmar = confirm("¿Está seguro que desea salir?");
			if(confirmar){
				localStorageService.set("codigo","");
				window.location.href = '../index.html';
			}
	};
});