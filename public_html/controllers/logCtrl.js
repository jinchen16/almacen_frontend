var app = angular.module('appLog', ['ngResource', 'LocalStorageModule']);

app.config(function (localStorageServiceProvider) {
  localStorageServiceProvider
    .setPrefix('Almacen');
});

app.controller('logCtrl', function($scope, $http, localStorageService){
	var codigo = localStorageService.get('codigo');
	console.log(codigo);

	$scope.inicio = function(){
		if(codigo !== '' && codigo !== undefined){
			//Buscar datos del estudiante
			$http.get('https://almacen-elementos-orejuelajd.c9users.io:8081/read/Usuario/codigo/' + codigo).success(function(data){			
				$scope.usuarioNombre = data.value[0].nombre;
				$scope.usuarioApellido = data.value[0].apellido;
				var id =data.value[0]._id;
				//Buscar los elementos prestados
				$http.get('https://almacen-elementos-orejuelajd.c9users.io:8081/read/Prestamos/idUsuario/'+id).success(function(data){
					
				}).error(function(data){

				});
			}).error(function(data){
				console.log(data);
			});				
		}
	}

	$scope.salir = function(){
		window.alert('¿Está seguro que desea salir?');
		localStorageService.set('codigo','');
		window.location.href = '../index.html';
	};
	

	$scope.solicitarPrestamo = function(){
		window.alert('¿Quieres de generar el prestamo?');
		window.location.href = './prestamo.html';
	}

}).controller('prestarCtrl', function($scope, $http, localStorageService){	
	var codigo = localStorageService.get('codigo');

	//Mostrar los elementos presentes cuando se inicia
	$scope.inicio = function(){
		$http.get('https://almacen-elementos-orejuelajd.c9users.io:8081/read/Elementos').success(function(data){
			$scope.elementos = data.value;								
		}).error(function(data){
			console.log(data);
		});		
	}

	//Para salirse del perfil
	$scope.salir = function(){
		window.alert('¿Deseas salir?');
		localStorageService.set('codigo','');
		window.location.href = '../index.html';
	};

	//Para volver al perfil
	$scope.volver = function(){
		window.alert('¿Deseas volver a tu perfil?');
		window.location.href = './perfilEstudiante.html?codigo='+localStorageService.get('codigo');
	}

	//Array de elementos seleccionados
	$scope.seleccion = [];
	$scope.toggleSeleccion = function toggleSeleccion(elementoNombre) {
    			var idx = $scope.seleccion.indexOf(elementoNombre);
			    // is currently selected
			    if (idx > -1) {
			     	$scope.seleccion.splice(idx, 1);     	
			    }
			    // is newly selected
			    else {
			     	 $scope.seleccion.push(elementoNombre);			     	 			     	 
			    }
	};

	//Para hacer la solicitud
	$scope.solicitar = function(){
		var usuarioID;		
		if($scope.seleccion.length > 0){
			$http.get('https://almacen-elementos-orejuelajd.c9users.io:8081/read/Usuario/codigo/' + codigo).success(function(data){
				usuarioID = data.value[0]._id;
				$http.get('https://almacen-elementos-orejuelajd.c9users.io:8081/create/Prestamos/' + usuarioID + '/' + new Date() + '/' + new Date() 
				+ '/pendiente' + '/a/a/a').
				success(function(data){
					console.log("Solicitud realizada");
				}).error(function(data){
					console.log(data);
				});						
			}).error(function(data){
				console.log(data);
			});			
		}else{
			window.alert('No hay elementos seleccionados');
		}		
	}
	
	$scope.ingresarElementos = function(){
		var usuarioID;
		var prestamoID;
		$http.get('https://almacen-elementos-orejuelajd.c9users.io:8081/read/Usuario/codigo/' + codigo).success(function(data){
			usuarioID = data.value[0]._id;
			$http.get('https://almacen-elementos-orejuelajd.c9users.io:8081/read/Prestamos/idUsuario/' + usuarioID).success(function(data) {
				prestamoID = data.value[data.value.length-1]._id;
			    for(var i=0; i<$scope.seleccion.length; i++){
			    	$http.get('https://almacen-elementos-orejuelajd.c9users.io:8081/create/Item/' + prestamoID + '/' + $scope.seleccion[i] + '/a/a/a/a/a')
			    	.success(function(data) {
			    	   console.log(data);
			    	}).error(function(data) {
			    	   console.log(data); 
			    	});
			    }
			}).error(function(data) {
			    console.log(data);
			})
		}).error(function(data) {
			console.log(data);
		});
	}
});
