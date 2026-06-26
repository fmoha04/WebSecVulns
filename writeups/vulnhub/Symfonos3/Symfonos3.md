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

## Fuzzing de Directorios mediante FFUF

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

### Mejora de Shell Obtenida

Antes de seguir, vamos a mejorar la terminal que se nos proporciona para tener más capacidades como poder usar Ctrl+L, clear, evitar salirse de la terminal con Ctrl+C,...

Para conseguirlo tendremos que usar los siguientes comandos:

<img width="759" height="296" alt="image" src="https://github.com/user-attachments/assets/801b336d-b130-4bb1-aea0-ee0149a97540" />

Y habremos mejorado la shell, es decir hemos conseguido una shell interactiva, aunque cabe recalcar que es un paso opcional solo para tener mayor comodidad:

<img width="756" height="78" alt="image" src="https://github.com/user-attachments/assets/6424ffd4-bf76-465b-b928-02b1a72912b1" />

## Reconocimiento Interno de la primera máquina comprometida (symfonos3)

Revisamos la versión del equipo, que además coincide con la versión que descubrimos anteriormente, la versión Debian stretch:

<img width="760" height="145" alt="image" src="https://github.com/user-attachments/assets/fab67fed-21ee-4dfa-8ce4-af05f2c8ae54" />





















































































































