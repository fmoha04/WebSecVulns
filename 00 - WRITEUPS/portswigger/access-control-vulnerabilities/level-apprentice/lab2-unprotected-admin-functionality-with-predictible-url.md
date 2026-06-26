Se nos inicia el laboratorio, vemos que es una web dedicada a la venta de items:

<img width="994" height="549" alt="image" src="https://github.com/user-attachments/assets/b916c80c-2e03-46da-8ac8-b93de5520c12" />

Realizamos un reconocimiento de directorios mediante ffuf, aunque en esta ocasión no encontramos nada interesante como un robots.txt o un panel de administrador:

<img width="997" height="342" alt="image" src="https://github.com/user-attachments/assets/03fbb512-eaea-4f28-98a2-c4d014209973" />

Capturamos la petición del home mediante burpsuite y vemos que hay información sensible en el código javascript que se nos devuelve, en este caso el panel de administración:

<img width="996" height="290" alt="image" src="https://github.com/user-attachments/assets/8af5d5fc-8b73-4cbf-a685-8564bf6a7b70" />

Probamos a acceder y nos deja sin ningún tipo de restricción, además observamos que se dispone de la función de eliminar usuarios:

<img width="996" height="299" alt="image" src="https://github.com/user-attachments/assets/1724a029-9103-406f-81cd-3c7af9f7af0b" />

Después eliminamos al usuario carlos para cumplir con el laboratorio y vemos que se nos marca el laboratorio como completado/solved:

<img width="993" height="376" alt="image" src="https://github.com/user-attachments/assets/7f90c28e-6eef-4631-9ff1-3dac7d801df5" />

<img width="995" height="93" alt="image" src="https://github.com/user-attachments/assets/ef91a3ae-1a90-4bdb-a2ad-1b6a7e38eb42" />

