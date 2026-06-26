> Cabe recalcar que se resolvió la máquina en un entorno de pivoting personalizado, por lo que pueden encontrarse varias referencias de pivoting como proxychains entre otros términos.

## Escaneo mediante netcat y un script de BASH

Ahora tendríamos que enumerar un poco la máquina final a comprometer, se podría usar nmap, u otras herramientas, pero para cambiar un poco y por mayor compatibilidad ya que nos encontramos ante varios proxies que irán re-enviando información lo que podría provocar que herramientas como nmap no funcionen del todo bien, podemos usar netcat para detectar puertos abiertos.

Podemos crear un pequeño script que haga un bucle con algunos puertos comunes y pruebe a realizar una conexión mediante netcat:

<img width="907" height="234" alt="image" src="https://github.com/user-attachments/assets/511e27ce-4472-420a-889c-7d384f6efb06" />

Le damos permisos de ejecución:

<img width="908" height="54" alt="image" src="https://github.com/user-attachments/assets/c4091f95-6d12-4eb0-a092-73308ad82633" />

Lo ejecutamos y vemos que detecta los puertos SSH, HTTP, y LDAP:

<img width="906" height="114" alt="image" src="https://github.com/user-attachments/assets/9b408279-a038-4eff-bd45-31a855dd6dc5" />

## Reconocimiento HTTP 

Comprobamos si dispone de una página web expuesta el puerto 80. Mediante curl vemos que si es el caso:

<img width="906" height="255" alt="image" src="https://github.com/user-attachments/assets/1810c44e-e145-4c15-9fa3-b55d80138962" />

## Fuzzing de Directorios mediante FFUF

Ahora podemos empezar a fuzzer mediante ffuf para encontrar directorios y/o archivos que nos puedan servir. En esta caso encontramos un directorios interesantes como /static o el archivo llamado admin.php:

<img width="906" height="449" alt="image" src="https://github.com/user-attachments/assets/72084e34-bdb5-4fe6-86e3-5d657a3de399" />

En /static vemos que son solo un directorio con imágenes alojadas sin importancia:

<img width="907" height="382" alt="image" src="https://github.com/user-attachments/assets/250b2431-d1c4-496c-9864-ab135da11a2b" />

Pero en cuanto a admin.php vemos que se nos muestra un panel de login:

<img width="910" height="278" alt="image" src="https://github.com/user-attachments/assets/d8a60a95-6398-44a9-9cb7-862e0bd0f764" />

## Explotación LDAP Injection y Local File Inclusion 

Probamos varios tipos de inyecciones (SQLi, XSS, ..) pero sin éxito hasta que se decide probar LDAP Injection al haber encontrado anteriormente los puertos de LDAP abiertos, en este caso si es vulnerable a LDAPi y con simplemente un * en ambos campos se hace un bypass del panel de login:

<img width="908" height="328" alt="image" src="https://github.com/user-attachments/assets/02822f03-313d-42b3-b9b6-bbd1889ca77c" />

<img width="912" height="313" alt="image" src="https://github.com/user-attachments/assets/76790c91-181c-4b0f-ba8a-8187e5ca3b87" />

Accedemos a los paneles de la página web, entre ellos el portraits.php que parece solo una muestra de imágenes, pero si nos fijamos en la url vemos que dispone de un parámetro ?url= el cuál si no está bien configurado en el servidor se podría acontecer un Local File Inclusion:

<img width="912" height="394" alt="image" src="https://github.com/user-attachments/assets/150dff49-1656-4aa7-a671-0dcb26f079b2" />

En este caso es así, y si especificamos en la url el directorio /etc/passwd logramos ver por pantalla el contenido de este:

<img width="908" height="229" alt="image" src="https://github.com/user-attachments/assets/a6fac8bf-7656-4c48-98bf-17c761849eeb" />

Como parece muy mal configurado en cuanto a seguridad la página web, podemos intentar listar el código fuente de la página aprovechando el LFI, solo tendremos que especificar un wrapper de php a base64 para que no lo interprete y nos muestre una cadena que luego podamos decodificar:

<img width="911" height="223" alt="image" src="https://github.com/user-attachments/assets/37537d9f-2af3-42e5-b4cd-67bdfb39a368" />

Nos copiamos toda la cadena y la decodificamos en una terminal:

<img width="908" height="288" alt="image" src="https://github.com/user-attachments/assets/2b14b682-1a14-4952-a44d-283fabc9d4f4" />

Al revisar vemos que hay información sobre el dominio ldap y una cadena que parece la contraseña del dominio ldap:

<img width="911" height="538" alt="image" src="https://github.com/user-attachments/assets/1e2d0abc-909b-4ded-ac09-55de589c97c7" />

Mediante la utilidad de ldapsearch intentamos listar el árbol ldap del dominio que hemos descubierto junto con la clave y vemos que nos devuelve varios resultados:

<img width="909" height="153" alt="image" src="https://github.com/user-attachments/assets/cd3f9dfa-a8b7-48f5-807c-92e030f0a6e5" />

En este caso vemos dos credenciales, tanto del usuario admin de ldap como un usuario perteneciente del dominio llamado zeus, en ambos casos están las contraseñas codificadas en principio en base64:

<img width="906" height="479" alt="image" src="https://github.com/user-attachments/assets/b758a78d-b301-4e7e-ad28-72a61d42bc2b" />

Intentamos decodificarlas pero en el caso del administrador ldap dispone un cifrado más complejo por lo que no podemos decodificarla, en el caso del usuario zeus sí que hemos conseguido decodificarla al ser más simple:

<img width="912" height="97" alt="image" src="https://github.com/user-attachments/assets/d1d865b2-661d-4a9f-a295-94798851f3a7" />

Como anteriormente sabíamos que el servicio ssh está activo en el sistema podemos intentar acceder por ssh mediante las credenciales que hemos descubierto, en este caso nos deja acceder, además vemos que dispone de varias interfaces lo que hace probable que sus servicios estén sobre contenedores docker al ser interfaces típicas que usar docker:

<img width="909" height="268" alt="image" src="https://github.com/user-attachments/assets/12ac85a5-3551-47ef-8f19-073d86073f1c" />

## Escalada de Privilegios mediante SUDO SHELL ESCAPING

Listamos los comandos que puede ejecutar zeus como root y vemos que puede usar dpkg sin contraseña y como sudo:

<img width="911" height="132" alt="image" src="https://github.com/user-attachments/assets/1c9a9182-ae79-495a-96ba-0466e59891de" />

Si buscamos posibles payloads en gtfobins vemos que podemos usar dpkg -l:

<img width="908" height="152" alt="image" src="https://github.com/user-attachments/assets/6b686af3-e2e4-4174-b5d8-41e94df0e510" />

Lo ejecutamos como sudo ya que no nos pide contraseña y usamos el parámetro -l:

<img width="911" height="51" alt="image" src="https://github.com/user-attachments/assets/cdd38f69-11b2-4186-8832-7e1dea7565c3" />

Se ejecuta el comando y nos muestra esta lista:

<img width="910" height="227" alt="image" src="https://github.com/user-attachments/assets/ca071724-b878-4dec-8d8c-a6491732f42f" />

Si tecleamos ! y escribimos /bin/sh:

<img width="913" height="53" alt="image" src="https://github.com/user-attachments/assets/0fb28990-1092-4e5a-b5f0-3973616209c2" />

Nos proporciona una shell como el usuario que ejecuta dpkg que es root:

<img width="916" height="124" alt="image" src="https://github.com/user-attachments/assets/32cdd5e0-f2a1-49c3-86ce-3f8e2909e779" />

PWNED ! :)

