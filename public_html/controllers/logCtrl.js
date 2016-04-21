var app = angular.module('appLog', ['ngResource', 'LocalStorageModule']);

//Generalizar url
var urlBack = getURL("http","localhost",8080);
var urlFront = getURL("http","localhost",80);

app.config(function (localStorageServiceProvider) {
  localStorageServiceProvider
    .setPrefix('Almacen');
});

app.controller('logCtrl', function($scope, $http, localStorageService){
	var codigo = localStorageService.get("codigo");
	
	$scope.inicio = function(){
		$scope.estado;
		$scope.vencido;
		$scope.sancion;
		var dia = + 6*(8.64*Math.pow(10,7));
		var fecha = new Date().getTime(); // para adelantar en el tiempo y mirar si al pasar la fecha de sancion, se activa nuevamente + (6*(8.64*Math.pow(10,7)))
				
		if(codigo !== '' && codigo !== undefined){
			//Buscar datos del estudiante
			$http.get( urlBack+'read/Usuario/codigo/' + codigo).success(function(data){			
				$scope.usuarioNombre = data.value[0].nombre;
				$scope.usuarioApellido = data.value[0].apellido;
				var id =data.value[0]._id;
				if(data.value[0].estado === "activo"){
					$scope.estado = true;
					$http.get( urlBack + 'buscarPrestamo/Prestamos/idUsuario/'+id+'/estado/vencido')
					.success(function(data) {
					    if(data.value.length > 0){
					    	$scope.vencido = true;
					    	var elementosArr = [];
							for(var i = 0; i < data.value.length; i++){
								for(var j =0; j < data.value[i].elementos.length; j++){
									var elemento = {fecha:data.value[i].fechaEntrega, nombre:data.value[i].elementos[j].nombre};
									elementosArr.push(elemento);
								}
							}
							$scope.elementosVencidos = elementosArr;
					    }
					    else{
					    	$scope.vencido = false;
					    }
					}).error(function(data) {
					    console.log(data);
					})
				}
				else if(data.value[0].estado === "sancionado"){
					$scope.estado = false;
				}
				
				if($scope.estado){
					//Buscar los elementos prestados
					$http.get( urlBack + 'buscarPrestamo/Prestamos/idUsuario/'+id+'/estado/aprobado')
					.success(function(data){
						var elementosArr = [];
						for(var i = 0; i < data.value.length; i++){
							for(var j =0; j < data.value[i].elementos.length; j++){
								var elemento = {fecha:data.value[i].fechaEntrega, nombre:data.value[i].elementos[j].nombre};
								elementosArr.push(elemento);
							}
						}
						$scope.elementos = elementosArr;
					}).error(function(data){
						console.log(data.value);
					});
				}
				else{//Condicion para cuando el estado es sancionado, en donde solo muestra los elementos dados por la sancion
					//Buscar elementos prestados y que aun falta por entregar
					$http.get( urlBack + 'buscarPrestamo/Prestamos/idUsuario/'+id+'/estado/sancionado')
					.success(function(data) {
						//Poner las condiciones para el array elementosSancionados
						var elementosArr = [];
						for(var i = 0; i < data.value.length; i++){
							for(var j =0; j < data.value[i].elementos.length; j++){
								var elemento = {fecha:data.value[i].fechaEntrega, nombre:data.value[i].elementos[j].nombre};
								elementosArr.push(elemento);
							}
						}
						$scope.elementosSancionados = elementosArr;
					$http.get( urlBack + 'buscarPrestamo/Prestamos/idUsuario/'+id+'/estado/sancionado-terminado')
					.success(function(data){
						if(data.value.length > 0){
					    	if(fecha <= data.value[data.value.length-1].fechaEntrega){
					    		$scope.estado = false;
					    		$scope.sancion = true;
								$scope.fechaSancion = data.value[data.value.length-1].fechaEntrega;
					    	}else{
					   			$scope.estado = true;
					   			$http.get( urlBack + 'cambiarCampo/Usuario/'+ id +'/activo').success(function(data) {
					   			    console.log(data);
					   			}).error(function(data) {
				   				    console.log(data);
				   				});
					    	}
				    	}
						else{
							$scope.sancion = false;
						}
					}).error(function(data){
						console.log(data);
					});
					}).error(function(data) {
					    console.log(data);
					    
					});
				}
			}).error(function(data){
				console.log(data);
			});				
		}
	}

	$scope.salir = function(){
		var confirmar = confirm("¿Está seguro que desea salir?");
		logout(confirmar, localStorageService);
	}
	

	$scope.solicitarPrestamo = function(){
		var confirmar = confirm("¿Quieres generar el prestamo?");
		if(confirmar){
			window.location.href = './prestamo.html';
		}
	}

}).controller('prestarCtrl', function($scope, $http, localStorageService){	
	var codigo = localStorageService.get("codigo");

	//Mostrar los elementos presentes cuando se inicia
	$scope.inicio = function(){
		$http.get( urlBack + 'read/Elementos').success(function(data){
			$scope.elementos = data.value;								
		}).error(function(data){
			console.log(data);
		});		
	}

	//Para salirse del perfil	
	$scope.salir = function(){
		var confirmar = confirm("¿Está seguro que desea salir?");
		logout(confirmar, localStorageService);
	}

	//Para volver al perfil
	$scope.volver = function(){
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
		var elementosSeleccionados = $scope.seleccion;
		
		if($scope.seleccion.length > 0){
			$http.get( urlBack + 'read/Usuario/codigo/' + codigo).success(function(data){
				usuarioID = data.value[0]._id;
				$http.get( urlBack + 'create/Prestamos/' + usuarioID + '/' + new Date().getTime() + '/' 
				+ (new Date().getTime() + (3*(8.64*Math.pow(10,7)))) + '/pendiente/' + elementosSeleccionados +'/a/a').
				success(function(data){
					console.log(data);
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
		$http.get( urlBack + 'read/Usuario/codigo/' + codigo).success(function(data){
			usuarioID = data.value[0]._id;
			$http.get( urlBack + 'read/Prestamos/idUsuario/' + usuarioID).success(function(data) {
				prestamoID = data.value[data.value.length-1]._id;
			    for(var i=0; i<$scope.seleccion.length; i++){
			    	$http.get( urlBack + 'agregarElemento/Prestamos/'+ prestamoID +'/'+ $scope.seleccion[i])
			    	.success(function(data) {
			    	   console.log(data);
			    	}).error(function(data) {
			    	   console.log(data); 
			    	});
			    }
			    var confirmar = confirm("¿Deseas validar este préstamo?");
				if(confirmar){
					window.location.href = './perfilEstudiante.html?codigo='+localStorageService.get('codigo');
				}
			}).error(function(data) {
			    console.log(data);
			})
		}).error(function(data) {
			console.log(data);
		});
	}
});

//Funcion para devolver la URL general
function getURL(protocol, host, port){
	return protocol + '://' + host + ':' + port + '/';
}

function logout(confirmar, localStorageService){
		if(confirmar){
			localStorageService.set("codigo","");
			window.location.href = '../index.html';
	}
}
