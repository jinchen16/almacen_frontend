var app = angular.module('appFuncionario', ['LocalStorageModule']);

app.config(function (localStorageServiceProvider) {
  localStorageServiceProvider
    .setPrefix('Almacen');
});

app.controller('funcionarioCtrl', function($scope, $http, localStorageService){
	var codigo = localStorageService.get("codigo");
	var fecha = new Date().getTime();
	var dia = 8.64*Math.pow(10,7);
	
	$scope.vencidos = [];
	$scope.mostrarVencidos = function(){
	    $http.get('https://almacen-backend-orejuelajd.c9users.io/read/Prestamos')
	    .success(function(prestamos){
	        prestamos.value.forEach(function(prestamo){
	        	console.log(prestamos);
	        		var fechaAux = parseInt(prestamo.fechaVencimiento);
		            if(fecha > fechaAux && prestamo.estado != "vencido" && prestamo.estado != "terminado" && prestamo.estado != "sancionado-terminado"){
		                // console.log("usuario: " + prestamo.idUsuario + "...fecha actual: " + fecha + "...fecha vencimiento"+prestamo.fechaVencimiento);
		                $http.get('https://almacen-backend-orejuelajd.c9users.io/read/Usuario/_id/' + prestamo.idUsuario)
	        	        .success(function(vencido){
	        	        	console.log(vencido);
	        	        	if(vencido.value[0].estado != "sancionado"){
	        	        		var usuario = {
	        	        		idPrestamo: prestamo._id,
	        	        		id: vencido.value[0]._id,
	        	        		nombre: vencido.value[0].nombre, 
	        	        		apellido: vencido.value[0].apellido,
	        	        		codigo: vencido.value[0].codigo,
	        	        		fecha: prestamo.fechaVencimiento
		        	        	};
		        	            $scope.vencidos.push(usuario);//añado el usuario vencido a la lista de usuarios vencidos
		        	            console.log(usuario);
	        	        	}
	        	        }).error(function(data){
	        	        
	        	        });
		            }
	        });
	    }).error(function(){
	        
	    });
	};

	$scope.seleccion = [];
	$scope.toggleSeleccion = function toggleSeleccion(elementoNombre) {
   		var idx = $scope.seleccion.indexOf(elementoNombre);
	    // is currently selected
	    if (idx > -1) {
	     	$scope.seleccion.splice(idx, 1);
	     	console.log($scope.seleccion);
	    }
	    // is newly selected
	    else {
	    	$scope.seleccion.push(elementoNombre);	
	    	console.log($scope.seleccion);
	    }
	};
	
	$scope.inicio = function(){
		$http.get('https://almacen-backend-orejuelajd.c9users.io/read/Prestamos')
		.success(function(data){
			data.value.forEach(function(prestamo){
				//Convertir la fecha vencimiento de string a int y hacer el calculo
				var fechaAux = parseInt(prestamo.fechaVencimiento) + dia;
				//Condicion para cuando es mayor a 4 dias
				if(fecha > fechaAux && prestamo.estado == "vencido"){
					$http.get('https://almacen-backend-orejuelajd.c9users.io/cambiarCampo/Usuario/' 
					+ prestamo.idUsuario + '/sancionado').success(function(data){
						console.log("sancionado");
					}).error(function(data){
						console.log(data);
					});
					$http.get('https://almacen-backend-orejuelajd.c9users.io/cambiarCampo/Prestamos/' 
					+ prestamo._id + '/sancionado').success(function(data){
						console.log("sancionado");
					}).error(function(data){
						console.log(data);
					});
				}
			});
		}).error(function(data){
			console.log(data);
		});
		
	};
	
		// $http.get('https://almacen-backend-orejuelajd.c9users.io/read/Usuario/_id/' + obj.id)
	 //   	        .success(function(sancionado){
	 //   	            $http.get('https://almacen-backend-orejuelajd.c9users.io/update/Usuario/'+ sancionado.value[0].nombre +'/'
	 //   	            + sancionado.value[0].apellido +'/'+ sancionado.value[0].codigo +'/'+ sancionado.value[0].correo +'/'+ 
	 //   	            sancionado.value[0].contrasena +'/Estudiante/sancionado/'+sancionado.value[0]._id)
	 //   	            .success(function(data){
	 //   	                contador ++;
		// 		    	    if(contador == $scope.seleccion.length){
		// 						// window.location.reload();
		// 					}
	 //   	            }).error(function(data){
	 //   	                console.log(data);
	 //   	            });
	 //   	        }).error(function(data){
	 //   	            console.log(data);
	 //   	        });	
	
			
		// //};
	
	
	$scope.sancionarSeleccionados = function(){
	    var contador = 0;
	    if($scope.seleccion.length > 0){
		    if(confirm('¿Quieres generar la alerta para los estudiantes?')){
		    	//Trabajar con base a los usuarios dentro de la seleccion
		    	$scope.seleccion.forEach(function(obj){
	    	        /*Se pone la logica para poner los prestamos vencidos*/
	    	         $http.get('https://almacen-backend-orejuelajd.c9users.io/cambiarCampo/Prestamos/'+ obj.idPrestamo +'/vencido')
	    	            .success(function(data){
	    	                contador ++;
				    	    if(contador == $scope.seleccion.length){
								window.location.reload();
							}
	    	            }).error(function(data){
	    	                console.log(data);
	    	            });
		        });
		    }
	    }
	    else{
	    	window.alert('Selecciona estudiantes antes de continuar');
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