Se nos inicia el laboratorio, vemos que es una web dedicada a la venta de items:

<img width="991" height="476" alt="image" src="https://github.com/user-attachments/assets/dc26403c-203f-4227-9cf7-508076af4322" />

Realizamos un reconocimiento de directorios mediante ffuf:

<img width="995" height="371" alt="image" src="https://github.com/user-attachments/assets/b504807e-f505-42c6-9519-9e2dd5e0b4aa" />

Accedemos al robots.txt y vemos que existe un directorio llamado administrator-panel, el cual también detectamos mediante ffuf:

<img width="996" height="153" alt="image" src="https://github.com/user-attachments/assets/e43b6e9f-f556-4cf9-abd6-c2461050677e" />

Accedemos a tal directorio y vemos que no nos pide ninguna forma de autenticación o bloqueo, y vemos que dispone de la funcionalidad de eliminar usuarios:

<img width="997" height="321" alt="image" src="https://github.com/user-attachments/assets/9640ab24-e4d1-4c0f-988a-67f5bad1f45c" />

Eliminamos al usuario carlos para cumplir con el laboratorio y vemos que se nos marca el laboratorio como completado/solved:

<img width="993" height="359" alt="image" src="https://github.com/user-attachments/assets/98952936-0a5b-402c-9d02-59428dfda11d" />

<img width="993" height="93" alt="image" src="https://github.com/user-attachments/assets/da02e6ee-a188-4820-815f-9fd6d9d029a9" />



