Se nos inicia el laboratorio, vemos que es una web dedicada a la venta de items:

<img width="998" height="428" alt="image" src="https://github.com/user-attachments/assets/ee531bbb-9c7e-4ff9-a090-62c9a34f601f" />

Realizamos un reconocimiento de directorios mediante ffuf, encontramos un directorio que podría ser interesante llamado chat:

<img width="1001" height="356" alt="image" src="https://github.com/user-attachments/assets/ed1f4c44-d14c-401e-a3b8-e9dca98a40b6" />

Accedemos al directorio /chat y vemos que es una funcionalidad de la web que consiste en un chat con otra persona en directo:

<img width="998" height="521" alt="image" src="https://github.com/user-attachments/assets/de799faf-77f7-4748-834e-b8743b6aff5a" />

Si capturamos la petición de la funcionalidad de transcripción, vemos que devuelve un resultado distinto según el número que tenga, por lo que podemos probar a re-enviar las solicitudes con distintos números para ver si podemos capturar alguna información sensible, en este caso si usamos el número 1 vemos que se muestra un mensaje con una contraseña en texto plano:

<img width="998" height="196" alt="image" src="https://github.com/user-attachments/assets/cd5d471c-11bd-4225-8af0-210d05700ff7" />

Iniciamos sesión con el usuario que ya sabíamos y con la contraseña encontrada:

<img width="1000" height="439" alt="image" src="https://github.com/user-attachments/assets/57155353-0209-4951-81f8-ca18936dc35c" />

Luego veremos que se nos marca el laboratorio como completado/solved:

<img width="998" height="452" alt="image" src="https://github.com/user-attachments/assets/909477b0-d9f5-45d9-8b29-7572d16d550d" />

<img width="1000" height="98" alt="image" src="https://github.com/user-attachments/assets/7255456e-dcd0-431b-9af1-cd90dcff3ead" />

