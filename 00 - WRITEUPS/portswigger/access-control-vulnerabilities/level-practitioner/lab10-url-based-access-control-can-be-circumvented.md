Se nos inicia el laboratorio, vemos que es una web dedicada a la venta de items:

<img width="996" height="434" alt="image" src="https://github.com/user-attachments/assets/44a61cea-92d2-473e-9e11-f8791d6e6ff0" />

Realizamos un reconocimiento de directorios mediante ffuf, encontramos un directorio que podría ser interesante llamado admin:

<img width="1000" height="392" alt="image" src="https://github.com/user-attachments/assets/80f38494-d6ac-4bdd-9aa4-fcaeb15799c5" />

Pero al acceder vemos que está protegido a nivel de usuario/rol:

<img width="1000" height="252" alt="image" src="https://github.com/user-attachments/assets/47ad521f-2ab9-4f37-88dc-3a21ef47e34b" />

Capturamos la petición al directorio /admin, y vemos que nos salta el access denied:

<img width="996" height="272" alt="image" src="https://github.com/user-attachments/assets/8e633b7a-dc79-4831-9385-907f4cb325f3" />

Probamos si se acepta el uso de la cabecera X-Original-Url, la cual se encarga de sobrescribir la dirección URL original y usada en gran parte para evasión de WAF´s.

En este caso vemos que no está restringida la cabecera por lo que podemos usarla, porque como vemos que responde con un “Not Found 404” indica que si está funcionando la redirección pero en este caso como el directorio TEST no existe por eso salta el error 404:

<img width="997" height="273" alt="image" src="https://github.com/user-attachments/assets/1d1c3f4a-b848-4cbd-b043-4c0f1440e9ef" />

Si probamos con la URL del panel de admin mediante la cabecera X-Original-Url vemos que nos deja acceder sin restricciones de usuario/rol:

<img width="993" height="410" alt="image" src="https://github.com/user-attachments/assets/1b103420-a0fa-434d-8058-b16e30496b6a" />

Usamos el click derecho en la petición y la abrimos en el navegador:

<img width="997" height="272" alt="image" src="https://github.com/user-attachments/assets/649e8ab0-a45a-4bfb-bb8f-d6cdfcd05cc8" />

Vemos que nos aparece el panel de admin de manera más visual, y que nos aparece la función de eliminar usuarios:

<img width="996" height="288" alt="image" src="https://github.com/user-attachments/assets/dacdb293-84d7-435a-b652-b8ee302f385a" />

Pero nos encontramos que también está protegido a nivel de usuario/rol por lo que no podemos eliminarlo de momento:

<img width="999" height="222" alt="image" src="https://github.com/user-attachments/assets/4dc2650f-9078-48ec-9e9c-843bcdda0e26" />

Como antes accedimos al panel de admin, podemos ver el código que usa, y por tanto saber cómo se tramitan las peticiones, donde vemos la ruta que se usaría para eliminar un usuario: 

<img width="997" height="235" alt="image" src="https://github.com/user-attachments/assets/b16222e7-6305-4d75-afb2-ae21f1aa48a7" />

Esta vez cambiamos la ruta de la cabecera por /admin/delete y cambiamos la ruta GET por /?username, y veremos que nos devuelve un error 302 Found, lo que indica que se ha realizado una acción:

<img width="996" height="295" alt="image" src="https://github.com/user-attachments/assets/fc27e286-1df6-496d-ba3f-25192550bbeb" />

Si volvemos a probar a acceder al panel de admin, y vemos el código de la respuesta vemos que aparece el mensaje de usuario eliminado correctamente:

<img width="993" height="302" alt="image" src="https://github.com/user-attachments/assets/2a6568d2-f9ae-447f-9cb8-6eb0c3e61dd2" />

Si volvemos al dashboard de la web vemos que se ha completado correctamente el lab:

<img width="996" height="220" alt="image" src="https://github.com/user-attachments/assets/f8c78ad0-8b5c-4a22-b0b2-250d0a1540d4" />

<img width="997" height="85" alt="image" src="https://github.com/user-attachments/assets/539eac57-ff9e-49a1-911e-d46f62b36465" />

