> REFLECTED XSS

Este tipo de XSS se produce cuando los datos proporcionados por el usuario se reflejan en la respuesta HTTP sin ser verificados adecuadamente.
Esto permite a un atacante inyectar código malicioso en la respuesta, que luego se ejecuta en el navegador del usuario.

> STORED XSS

Este tipo de XSS se produce cuando un atacante es capaz de almacenar código malicioso en una base de datos o en el servidor web que aloja una página web vulnerable.
Este código se ejecuta cada vez que se carga la página.

> DOM-BASED XSS

Este tipo de XSS se produce cuando el código malicioso se ejecuta en el navegador del usuario a través del DOM (Modelo de Objetos del Documento). Esto se produce cuando el código JavaScript en una página web modifica el DOM en una forma que es vulnerable a la inyección de código malicioso.

> Basic XSS examples
```
"><script> alert(1) </script>
```
```
javascript:alert('XSS-Hacker')
```
```
<img src=x onerror=alert('XSS-Hacker')>
```
```
<script> alert(String.fromCharCode(88,83,83)) </script>
```
```
<script> alert("XSS hacker") </script>
```

