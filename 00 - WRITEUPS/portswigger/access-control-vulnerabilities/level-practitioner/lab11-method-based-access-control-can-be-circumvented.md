Se nos inicia el laboratorio, vemos que es una web dedicada a la venta de items:

<img width="1003" height="404" alt="image" src="https://github.com/user-attachments/assets/aed1b58c-70bc-4517-97b3-f3ce23abaf09" />

Realizamos un reconocimiento de directorios mediante ffuf, encontramos un directorio que podría ser interesante llamado admin:

<img width="1001" height="392" alt="image" src="https://github.com/user-attachments/assets/46ec5798-d89c-4377-ac9b-665355747d02" />

Aunque no podemos acceder, porque esta protegido a nivel de usuario, restringido solo para el usuario administrador:

<img width="1003" height="284" alt="image" src="https://github.com/user-attachments/assets/5e6eebf0-cb05-4c49-9236-1d2efc96d772" />

Probamos a realizar un ataque de fuerza bruta ya que sabemos el usuario, podemos usar la utilidad del intruder de burpsuite para realizar un sniper attack:

Primero seleccionamos dentro de la petición el campo a realizar fuerza bruta:

<img width="1004" height="652" alt="image" src="https://github.com/user-attachments/assets/a623453a-6fbe-4e56-9304-9240ea407841" />

Luego seleccionamos que se use un diccionario de SecLists de contraseñas por defecto:

<img width="1000" height="561" alt="image" src="https://github.com/user-attachments/assets/e81a1f36-9b6f-4ade-8760-e7939d24e094" />

Lanzamos el ataque:

<img width="1002" height="279" alt="image" src="https://github.com/user-attachments/assets/a842e941-4de9-4544-988c-17a06b5464ba" />

Y si nos fijamos, todas las pruebas reciben un código de estado 200 y un lenght exacto de 3446, salvo una petición, con el password admin, que da un código de estado 302 Found y una longitud muy baja en comparación con las demás opciones:

<img width="990" height="254" alt="image" src="https://github.com/user-attachments/assets/183bd2cf-3fa8-4d8b-a269-f6203bfc953a" />

Probamos la combinación: administrator + admin, y nos responde con 302 Found:

<img width="1000" height="272" alt="image" src="https://github.com/user-attachments/assets/1ed8c1dd-fc15-49fd-975b-72632f05796a" />

Probamos a iniciar sesión de manera visual en el panel de login:

<img width="1002" height="478" alt="image" src="https://github.com/user-attachments/assets/9eb08980-859c-4c73-963a-5f6bcf6c68a2" />

Nos deja acceder:

<img width="997" height="437" alt="image" src="https://github.com/user-attachments/assets/126cc175-6929-40f9-b62a-01f2a6c6043a" />

Ahora tenemos acceso a un panel de aumento/decremento de roles para los usuarios:

<img width="998" height="388" alt="image" src="https://github.com/user-attachments/assets/c3cef0e5-0211-4c0a-b912-b25bccf393ed" />

Capturamos la petición de intentar aumentar los privilegios del usuario wiener a admin:

<img width="996" height="384" alt="image" src="https://github.com/user-attachments/assets/74aca1fd-8fa0-49f2-9af0-be02b7075cef" />

Modificamos la petición de POST a GET e indicamos que queremos upgradear los privilegios del usuario wiener como ruta y usamos la cookie de sesión del admin: 

<img width="1002" height="468" alt="image" src="https://github.com/user-attachments/assets/544b6f67-cd36-4cdc-be8f-91514633dd9d" />

Y se completa el laboratorio al aumentar los privilegios del usuario wiener correctamente:

<img width="1001" height="207" alt="image" src="https://github.com/user-attachments/assets/82ac75e4-d9f7-418e-8add-9f23b8dfccaf" />

<img width="999" height="76" alt="image" src="https://github.com/user-attachments/assets/ec16f0f6-da53-459c-a6f4-33ea0faba909" />

