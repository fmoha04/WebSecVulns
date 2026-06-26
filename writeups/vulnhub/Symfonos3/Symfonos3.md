## Escaneo Inicial mediante ARP-SCAN & NMAP

Primero realizamos un escaneo de la red local mediante el comando arp-scan, de esta manera intentamos detectar posibles hosts activos en la propia red del atacante (kali-linux), en este caso detectamos un host activo con ip 192.168.133.130:

<img width="756" height="211" alt="image" src="https://github.com/user-attachments/assets/7d6254c8-41cf-40bc-88fd-bdaf3d884e98" />

Comprobamos la conexión con el host mediante el comando ping, y aparte de que nos responde y por tanto tenemos conectividad, vemos que tiene un TTL de 64, lo que quiere decir que su sistema operativo es con gran probabilidad un sistema Linux:

<img width="753" height="191" alt="image" src="https://github.com/user-attachments/assets/601b0e84-54b6-4ad4-b3bf-de230313d3d8" />

Realizamos un escaneo de puertos mediante el comando nmap, usaremos las opciones de -p- para especificar todo el rango de puertos, -sS para realizar un escaneo TCP SYN, --min-rate par establecer un ratio mínimo de paquetes, -n para la desactivación de resolución DNS, -Pn para desactivar el descubrimiento de hosts, y mediante -oG exportamos todo a un archivo grepeable. En este caso encontramos tres puertos abiertos, los correspondientes a ftp, ssh y http:

<img width="756" height="168" alt="image" src="https://github.com/user-attachments/assets/8e2aaf8c-4284-4a74-9d75-ab9b50ec764d" />

Una vez encontrados los puertos abiertos, ahora podremos escanear de manera más optimizada al incluir solo los puertos abiertos. Volvemos a usar el comando nmap para realizar el escaneo y esta vez usaremos las opciones -p<PORT> para especificar puertos específicos, -sCV para realizar un escaneo de versiones y lanzamiento de scripts NSE, y -oN para exportar los resultados en un archivo:

<img width="754" height="289" alt="image" src="https://github.com/user-attachments/assets/8f4eda13-16cc-4125-9733-79d586026fa7" />

Para empezar podríamos buscar información sobre la versiones de los servicios en internet:

<img width="756" height="298" alt="image" src="https://github.com/user-attachments/assets/61c56f72-8601-4303-a859-60f7b3f9b8a7" />

Encontramos que los servicios ssh y apache2 disponen de una versión basada en Debian Stretch y el servicio ftp en una versión de ubuntu trusty, con esta información quizás nos podría ayudar posteriormente:

<img width="755" height="284" alt="image" src="https://github.com/user-attachments/assets/0609f896-295f-4df1-be42-335ba4d97e0f" />
<img width="752" height="332" alt="image" src="https://github.com/user-attachments/assets/eedf64c3-4852-4c2d-8bb9-7f9fde8aafa5" />
<img width="755" height="82" alt="image" src="https://github.com/user-attachments/assets/ede44637-776d-4a71-a0e4-03be9a3c77f6" />

## Análisis del Servicio FTP 

Probamos a acceder al servicio ftp, usamos el comando ftp <IP>, y vemos que nos deja acceder, al no disponer de un usuario y password de momento probamos a acceder mediante el usuario anonymous, el cual es una mala práctica dejar activado en servicios ftp, y de momento nos deja acceder como anonymous. Probamos a consultar los comandos disponibles mediante el comando help y vemos los comandos disponibles.

<img width="755" height="302" alt="image" src="https://github.com/user-attachments/assets/657b6353-6902-4fda-8ea3-0fb9da79f1ef" />

Vemos que dispone de un comando llamado site, el cual podemos usar junto al parámetro CPFR y una ruta del posible sistema atacado, lo que intentará descargar el archivo que le pasamos, aunque vemos que antes tendríamos que conectarnos con user+pass, por lo que de momento no podemos hacer nada con el servicio FTP:

<img width="755" height="328" alt="image" src="https://github.com/user-attachments/assets/7b03c54a-e274-40a9-9b8e-8bef7dcecfd5" />

## Análisis del Servicio HTTP

### Reconocimiento de Tecnologías Web mediante WAPPALYZER

Probamos a acceder a la url objetivo y comprobamos las tecnologías usadas mediante la extensión de wappalyzer, donde vemos que nos indica que usa apache y debian lo que concuerda con el escaneo nmap realizado anteriormente:

<img width="757" height="269" alt="image" src="https://github.com/user-attachments/assets/e99c0462-dc25-4228-9039-5427f60ec1e2" />

### Fuzzing de Directorios mediante FFUF

Ahora realizaremos un reconocimiento de directorios, para ello usaremos el comando ffuf, en este caso usaremos los parámetros: -u <url> para especificar la dirección URL objetivo, -w <wordlist> para especificar un diccionario en este caso de seclists, -t <X> para especificar un número de hilos para acelerar la búsqueda de directorios ocultos, y -fc <X> para ocultar resultados con código de estado que no consideremos relevantes. En este caso encontramos dos directorios: gate y server-status:

<img width="757" height="287" alt="image" src="https://github.com/user-attachments/assets/f237c9fc-1f69-4da2-9621-b2b8ce22e433" />

Intentemos acceder a ambos directorios, y vemos que con /gate nos salta una web con una imagen, mientras que con /server-status nos salta un acceso denegado con código 403:

<img width="755" height="445" alt="image" src="https://github.com/user-attachments/assets/98869c79-4249-43d8-b8e0-7e709a5ef5bc" />

<img width="760" height="312" alt="image" src="https://github.com/user-attachments/assets/392821f2-f7ac-436c-a808-c470190fdae7" />

Probamos a fuzzear por el directorio encontrado /gate mediante ffuf y encontramos un directorio llamado /cerberus:

<img width="753" height="266" alt="image" src="https://github.com/user-attachments/assets/fd302234-b495-4ae5-bb77-fb0d9a0c9cb4" />

Probamos a acceder y vemos otra vez con una imagen de fondo sin nada más:

<img width="757" height="422" alt="image" src="https://github.com/user-attachments/assets/5e310a7e-51bf-4ed7-9bdc-1b95299841b6" />

Volvemos a probar a fuzzer desde /cerberus y encontramos un directorio llamado /tartarus:

<img width="754" height="253" alt="image" src="https://github.com/user-attachments/assets/50f81484-f409-4702-8334-5bceec772793" />

Probamos a acceder y nos volvemos a encontrar con una web estática:

<img width="758" height="437" alt="image" src="https://github.com/user-attachments/assets/4e6be52d-8d35-4871-88ec-271062157bd2" />

Viendo que continuamente nos lleva a otras páginas con imágenes puede que sea una distracción (llamado rabbit-holes en ctfs), por lo que volvemos a fuzzear el directorio raíz con la diferencia que ahora usaremos una barra después del fuzz además de agregar un diccionario más amplio. En este caso encontramos dos directorios que no encontramos anteriormente: /cgi-bin y /icons: 

<img width="755" height="306" alt="image" src="https://github.com/user-attachments/assets/cafce1c0-3df2-4e48-b9cf-3c30621badb1" />

Accedemos a ambos y vemos que tenemos denegado el acceso con código 403:

<img width="757" height="281" alt="image" src="https://github.com/user-attachments/assets/2787f93d-53cb-4532-ada3-58a89393ede3" />

<img width="757" height="266" alt="image" src="https://github.com/user-attachments/assets/e6ff35b4-d4a3-4ae8-aca2-89376dd62a92" />

Fuzzeamos el directorio /cgi-bin mediante el comando ffuf y encontramos un subdirectorio llamado underworld:

<img width="755" height="243" alt="image" src="https://github.com/user-attachments/assets/e013365d-9bcc-45dd-bd72-44769a7f1743" />

## Reconocimiento de Vulnerabilidad Shellshock mediante SHELLSHOCKER

Accedemos y vemos que esta vez carga una página con elementos dinámicos como horas-segundos y carga media. También cabe recalcar que existe una vulnerabilidad, shellshock que se basa en aprovecharse de una shell bash antigua o vulnerable, que suele encontrarse en casos de páginas con ese tipo de contenido:

<img width="756" height="174" alt="image" src="https://github.com/user-attachments/assets/352101b9-63f5-466e-903f-b559f8ad0203" />

Para confirmar que es vulnerable a shellshock podemos usar una herramienta disponible en github llamada shellshocker que nos indicará si el objetivo es vulnerable a shellshock. Para instalarla solo necesitamos clonar el repositorio de github y con llamar a la herramienta y especificarle la url a testear nos dirá si es vulnerable o no, en este caso lo és:

<img width="757" height="71" alt="image" src="https://github.com/user-attachments/assets/0767be79-b8d7-4285-b4fc-8c02c236c2bc" />

### Explotación de Vulnerabilidad Shellshock y Obtención de Reverse Shell

Probamos a explotar el shellshock, para ello tendremos que enviar una petición GET cambiando el user-agent a una cadena concreta seguida del comando que queremos ejecutar, y de primeras no parece funcionar debido a que normalmente hay que añadir un echo antes del comando que queremos ejecutar para que funcione, lo probamos y vemos que se ejecuta el comando whoami devolviéndonos al usuario cerberus:

<img width="759" height="257" alt="image" src="https://github.com/user-attachments/assets/4851d61d-dabd-4bbd-a181-34cce83f8128" />

Como hemos podido ejecutar comandos gracias a la vulnerabilidad shellshock, ahora podemos intentar enviarnos una reverse shell para hacer más cómoda la ejecución de comandos, para ello haremos lo siguiente. En una terminal primero dejamos en escucha por el puerto 7777 mediante netcat:

<img width="756" height="93" alt="image" src="https://github.com/user-attachments/assets/07a8f5bc-eb58-44de-a1d3-3e4d8b76dfb8" />

Desde otro terminal lanzamos una petición modificada para explotar el shellshock y que nos envíe una reverse-shell (podemos usar https://www.revshells.com/ para generarla), aunque tendremos que cambiar sh por /bin/bash para pueda reconocer el comando correctamente:

<img width="756" height="46" alt="image" src="https://github.com/user-attachments/assets/7bf6e042-5bef-4058-9b9e-9e7184bc955f" />

Si volvemos a la terminal con netcat en escucha habremos recibido una reverse-shell de la máquina symfonos3 donde podremos ejecutar comandos como whoami:

<img width="757" height="143" alt="image" src="https://github.com/user-attachments/assets/b77774fe-4dc6-4dcc-939a-6e8ba706357f" />

Como tenemos acceso a una shell del equipo atacado podemos recopilar información relevante como posibles redes internas, en este caso si ejecutamos el comando hostname -I podemos comprobar que tiene una interfaz con red distinta a la que hemos atacado por lo que podemos intuir que hay una red interna oculta en el segmento 10.10.0.0:

<img width="757" height="95" alt="image" src="https://github.com/user-attachments/assets/e65bc373-a447-4493-b74a-f77659c494c9" />

### Mejora de Shell

Antes de seguir, vamos a mejorar la terminal que se nos proporciona para tener más capacidades como poder usar Ctrl+L, clear, evitar salirse de la terminal con Ctrl+C,...

Para conseguirlo tendremos que usar los siguientes comandos:

<img width="759" height="296" alt="image" src="https://github.com/user-attachments/assets/801b336d-b130-4bb1-aea0-ee0149a97540" />

Y habremos mejorado la shell, es decir hemos conseguido una shell interactiva, aunque cabe recalcar que es un paso opcional solo para tener mayor comodidad:

<img width="756" height="78" alt="image" src="https://github.com/user-attachments/assets/6424ffd4-bf76-465b-b928-02b1a72912b1" />

## Reconocimiento Interno de symfonos3

Revisamos la versión del equipo, que además coincide con la versión que descubrimos anteriormente, la versión Debian stretch:

<img width="760" height="145" alt="image" src="https://github.com/user-attachments/assets/fab67fed-21ee-4dfa-8ce4-af05f2c8ae54" />

Si usamos el comando ip address / hostname -I podemos ver las dos interfaces del equipo:

<img width="607" height="52" alt="image" src="https://github.com/user-attachments/assets/697b1713-20a6-45e3-8446-a577f4d15a62" />

Comprobamos si el usuario cerberus puede ejecutar comandos como sudo, pero en este caso no se puede:

<img width="608" height="50" alt="image" src="https://github.com/user-attachments/assets/ca76b7ae-35e7-455a-8d4c-b97c793638e9" />

Buscamos posibles binarios root mediante el comando find:

<img width="606" height="222" alt="image" src="https://github.com/user-attachments/assets/1d686364-78c3-4d51-ae21-ad5515ac8214" />

Si revisamos los grupos a los que pertenece el usuario cerberus vemos que pertenece al grupo pcap que está relacionado con el análisis de tráfico en tcpdump o wireshark y que es raro que un usuario no root pertenezca a tal grupo:

<img width="606" height="39" alt="image" src="https://github.com/user-attachments/assets/f119179b-532a-4173-b01a-3a248c1af1c2" />

Por lo que podemos buscar si viene instalado tcpdump o wireshark mediante el comando which, en este caso viene instalado tcpdump por lo que podríamos investigar por ese lado si intentamos analizar el tráfico que se genere en la red de la máquina:

<img width="606" height="67" alt="image" src="https://github.com/user-attachments/assets/54367fa9-ba34-4d1d-9e4f-ea992ed437e6" />

### Reconocimiento de Procesos y Tareas Programadas mediante PSPY

Respecto a procesos, tareas programadas,.. que estén en ejecución podemos usar la herramienta pspy disponible en un repositorio de github:

<img width="603" height="200" alt="image" src="https://github.com/user-attachments/assets/ef87db36-d1c8-493f-8829-6197b0e72464" />

Descargamos la versión x64 de pspy desde github y lo descargamos en /Downloads:

<img width="609" height="127" alt="image" src="https://github.com/user-attachments/assets/b9b77bb9-89bb-42cd-9342-66db3182b518" />

Para moverlo al equipo atacado podemos usar un servidor http mediante python, en este caso podemos porque ambas máquinas se encuentran en la misma red, por lo que primero lanzamos el servidor python desde kali linux en el directorio donde se encuentre el pspy:

<img width="606" height="70" alt="image" src="https://github.com/user-attachments/assets/1e30a1e0-ef3d-498e-b13c-77cbd5f7af68" />

Y en la reverse shell lo descargamos mediante curl o wget, y le asignamos permisos de ejecución mediante el comando chmod:

<img width="759" height="146" alt="image" src="https://github.com/user-attachments/assets/2bcf3468-79c0-4a6d-aa24-c4089181e71c" />

<img width="754" height="36" alt="image" src="https://github.com/user-attachments/assets/c00d1558-71a8-406d-9f05-c958ba108325" />

Luego podremos ejecutarlo y empezará a escanear procesos y tareas activas del sistema: 

<img width="760" height="280" alt="image" src="https://github.com/user-attachments/assets/95b0f0b3-a4f6-40d5-a08e-cd31e13aad22" />

Tras un rato buscando, podemos ver que hay varias tareas cron relacionadas con ftp que se ejecutan continuamente que podrían ser interesantes, por ejemplo varias tareas son ejecutados por el usuario root redirigiendo tareas al directorio /opt/ftpclient:

<img width="759" height="244" alt="image" src="https://github.com/user-attachments/assets/57ea36ce-7d19-4d87-9fef-39cea9ab447d" />

Comprobamos el directorio /opt/ftpclient pero no podemos acceder por permisos, al revisar los permisos vemos que solo podemos acceder siendo root o pertenecer al grupo hades:

<img width="757" height="116" alt="image" src="https://github.com/user-attachments/assets/f40aa108-3e1a-4ba4-a510-ed3ea937fd40" />

### Análisis de Tráfico mediante TCPDUMP

Como parece que suceden varias tareas relacionadas con ftp, y aprovechando que podemos usar tcpdump al pertenecer al grupo pcap, y que FTP es un protocolo que transmite credenciales USER, PASS,.. en texto plano, podemos probar a capturar tráfico esperando poder capturar información o credenciales que nos puedan ser útiles.

Lanzamos el comando tcpdump, podemos usar -h para comprobar los posibles parámetros:

<img width="756" height="263" alt="image" src="https://github.com/user-attachments/assets/03b72170-c93a-4cc0-aab6-048c49f7bf91" />

Después de dejar un rato el tcpdump lo cancelamos y revisamos que se ha creado el archivo correctamente:

<img width="756" height="137" alt="image" src="https://github.com/user-attachments/assets/cca1e8e6-9659-4ba8-a88a-ae8f10a3fc28" />

Tras revisar el archivo se han podido encontrar un usuario y contraseña de un usuario llamado hades:

<img width="908" height="220" alt="image" src="https://github.com/user-attachments/assets/708914e5-0b2d-4cc7-812a-89e199eb528a" />

Como sabemos que hay un servicio ssh al haber realizado un escaneo mediante nmap al principio podemos probar a acceder mediante el usuario hades y vemos que si nos deja:

<img width="906" height="455" alt="image" src="https://github.com/user-attachments/assets/df05ad32-89d8-4064-8254-66bc8f9e1957" />

Revisamos si podemos sacar algo de información, y vemos que pertenece a los grupos hades y gods:

<img width="912" height="74" alt="image" src="https://github.com/user-attachments/assets/278c3994-5fe0-42fc-b7d7-a09730454ec0" />

## Escalada de Privilegios en SYMFONOS 3 mediante BINARIOS SUID

Buscamos archivos pertenecientes al grupo gods, para ello usamos el comando find y mandamos todo los resultados no exitosos al /dev/null para una salida más limpia. 

<img width="912" height="47" alt="image" src="https://github.com/user-attachments/assets/6ccc8df8-5f22-41d4-a3c8-0db006c854f6" />

Veremos que salen sobre todo librerías de python las cuales seguramente están relacionadas con las tareas que vimos anteriormente mediante pspy que se estaban ejecutando:

<img width="910" height="374" alt="image" src="https://github.com/user-attachments/assets/98eeba8f-8e88-4d78-a13b-7ab7740b9e73" />

Como vimos mediante pspy varias tareas relacionadas con FTP, filtraremos por tal servicio. Donde encontraremos dos archivos los cuales si revisamos sus permisos vemos que disponen de escritura por lo que podríamos eventualmente editarlos:

<img width="908" height="164" alt="image" src="https://github.com/user-attachments/assets/e094f5c6-b860-4976-a41b-77cd8d2ff9e6" />

Como anteriormente vimos mediante pspy que las tareas programadas con ftp se ejecutaban mediante el usuario root, podemos intentar editar los scripts de ftp para que ejecuten comandos que le especifiquemos y que una vez ejecutados por cron se ejecute con permisos de superusuario. Por ejemplo, podemos pasarle un comando que agregue el bit SUID a la ruta /bin/bash.

Revisamos los permisos de /bin/bash, dispone de 755 como permisos:

<img width="907" height="78" alt="image" src="https://github.com/user-attachments/assets/c030eb3a-0c28-4cf0-add9-498ea908656e" />

Editamos el script de ftp encontrado anteriormente:

<img width="912" height="82" alt="image" src="https://github.com/user-attachments/assets/1a51fcbb-a692-42fe-a9e8-67c1d8f363b4" />

Agregamos la ejecución de comandos, por ejemplo mediante la librería os, especificando un cambio de permisos a 4755 siendo 4 el bit SUID, luego guardamos el archivo y nos salimos:

<img width="912" height="222" alt="image" src="https://github.com/user-attachments/assets/616c5157-7787-4da5-8a65-9bc47cc30101" />

Después de unos segundos vemos que se ejecuta la tarea cron agregando el bit SUID:

<img width="909" height="55" alt="image" src="https://github.com/user-attachments/assets/84993bea-16d8-4058-8016-a559612830fe" />

<img width="908" height="55" alt="image" src="https://github.com/user-attachments/assets/680ed202-bc7e-4136-9971-216479a2fd66" />

Si revisamos GTFOBins podemos buscar alguna opción para explotar el SUID de bash, en este caso nos valdría con el comando bash -p permitiéndonos ser el usuario propietario de en este caso /bin/bash que es root:

<img width="906" height="199" alt="image" src="https://github.com/user-attachments/assets/3d166842-a926-4cf0-8d66-a6a61a3141b8" />

Obtenemos una shell con acceso root:

<img width="911" height="177" alt="image" src="https://github.com/user-attachments/assets/7b878149-cedb-44f8-8f7c-959ae3a69cb7" />

PWNED ! :)

