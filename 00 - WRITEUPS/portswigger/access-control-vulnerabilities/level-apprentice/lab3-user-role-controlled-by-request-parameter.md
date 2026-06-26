Se nos inicia el laboratorio, vemos que es una web dedicada a la venta de items:

<img width="996" height="440" alt="image" src="https://github.com/user-attachments/assets/0fb254d0-d150-4704-8a56-c60d747f03a9" />

Realizamos un reconocimiento de directorios mediante ffuf, encontramos un directorio que podría ser interesante llamado admin:

<img width="996" height="374" alt="image" src="https://github.com/user-attachments/assets/30c58b36-6ca4-49c6-ab95-06066c8578eb" />

Probamos a acceder al directorio admin, pero nos indica que no podemos acceder sin ser el usuario administrator, pero al menos ahora sabemos que existe un usuario con tal nombre:

<img width="998" height="258" alt="image" src="https://github.com/user-attachments/assets/37794b9b-fae7-454d-9de8-28e1e217d424" />

Probamos esta vez a capturar la petición mediante burpsuite, y se encuentra un parámetro denominado Admin=false:

<img width="995" height="372" alt="image" src="https://github.com/user-attachments/assets/c172d67c-9ad2-43b4-a9e4-99208416b00b" />

Por lo que podremos aprovecharnos de la mala configuración cambiando el parámetro a true, donde veremos que nos indica que hemos accedido como usuario administrator y disponemos de más características como un panel de eliminación de usuarios:

<img width="999" height="471" alt="image" src="https://github.com/user-attachments/assets/3a85d086-641e-45b3-8473-0f37872bc6e3" />

Para poder cambiar el parámetro y poder interactuar de manera física con el panel de admin, tendremos que cambiar desde el almacenamiento de las herramientas de desarrollo y editar la variable Admin a true:

<img width="994" height="123" alt="image" src="https://github.com/user-attachments/assets/384d7744-a8af-4821-9e14-681e9b92f134" />

<img width="999" height="133" alt="image" src="https://github.com/user-attachments/assets/393709dc-e769-47b9-9658-f9b44eaca6e3" />

Y si recargamos la página en /admin, veremos que se nos concede acceso al panel:

<img width="998" height="318" alt="image" src="https://github.com/user-attachments/assets/ae49ed5a-ef2e-480c-9434-a41e215c7f9d" />

Después eliminamos al usuario carlos para cumplir con el laboratorio y vemos que se nos marca el laboratorio como completado/solved:

<img width="999" height="381" alt="image" src="https://github.com/user-attachments/assets/06c6bf18-c6cc-4c36-85b7-480bf6f432ba" />

<img width="996" height="92" alt="image" src="https://github.com/user-attachments/assets/c97eb282-9e9e-49f4-8eab-10b07dcffb80" />

