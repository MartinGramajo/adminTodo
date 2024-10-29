## Next API Routes - RESTful API - Handlers

Esta sección tiene por objetivo principal, crear un RESTful Api básico en Next, nos dará la base para seguir trabajando mediante una "application programming interface", en futuras secciones. El objetivo final es que podamos tener un endpoint lo suficientemente robusto para poder trabajar con él.

Puntualmente veremos:

- READ
- Paginaciones
- Update
- Post
- SEED
- Docker
- Postgres
- Prisma
- Prisma + Next
- Yup - Validador

## Inicio del proyecto - adminTodo

Creación de un RESTful API: En la carpeta _APP_, vamos a crear una nueva carpeta _api_ en donde a su vez, vamos crear el archivo _route.ts_

snippet para la creación rápida: rag

```js
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: Request) {
  return NextResponse.json({
    hola: "mundo",
  });
}
```

Por ultimo probamos el endpoint en Postman: http://localhost:3000/api/hello

#### Agregar otra petición

Para agregar otra petición simplemente tenemos que copiar el export de arriba y cambiarle el método en este caso vamos a poner de ejemplo con el método POST :

```js
// rag snippets para creación

import { NextResponse, NextRequest } from "next/server";

export async function GET(request: Request) {
  return NextResponse.json({
    hola: "mundo",
  });
}

export async function POST(request: Request) {
  return NextResponse.json({
    hola: "mundo",
    method: "POST",
  });
}
```

## Configurar Postgres localmente

> [!IMPORTANTE]
>
> Todo esto hacer con el docker desktop abierto y corriendo.

Creamos en la raíz del proyecto el archivo _docker-compose.yml_ este archivo básicamente serán las instrucciones de como quiero subir mis imágenes.

1. version: se arranca el archivo con el numero de version.

2. services: vamos a crear el servicio todosDB.


> [!NOTA]
>
> los archivos .yml la tabulation es muy importante.
>
> NO USAR ESPACIOS.


3. todosDB: configuramos la _image_ que descargamos con el comando => docker pull postgres:15.3

4. container_name: nombre del contenedor o el DNS hacia el servidor donde esta nuestra base de datos:

5. restart : es por si reiniciamos la imagen o pc. Al configurar como 'always' esto nos asegura de estar levantando nuestra imagen siempre.

6. ports: tenemos que hacer chocar el puerto local con el puerto del contenedor. La base de datos de postgres tiene por defecto el 5432, por ende lo que nosotros queremos es comunicar el puerto 5432 de nuestro equipo/pc con el 5432 del contenedor.

7. environment: esto es para configurar nuestras variables de entorno. Creamos 2 Variables user y password.

8. volumen: nos permite conectar una carpeta de nuestra computadora con una carpeta del servidor.

el resultado es el siguiente:

```js
version: '3'

services:
  todosDB:
    image:  postgres:15.3
    container_name: todos-db
    restart: always
    ports:
      - 5432:5432
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
    volumes:
      - ./postgres:/var/lib/postgresql/data

```

9. Una vez terminada la configuración del archivo _docker-compose.yml_, en la terminal ya sea en el visual o abriendo con la power shell o cmd vamos a pararnos en la carpeta del proyecto.

> [COMANDOS]
>
> pwd: nos ubica en la carpeta del proyecto
>
> ls: para verificar que estamos en la raíz del proyecto. (si nos tira lo package.json estamos bien ubicados).
>
> docker compose up -d : Este comando es para levantar la imagen, el -d significa detach que lo haga de manera desenlazada de la terminal.

10. Por ultimo nos queda verificar que todo se ha creado perfectamente, para ello nos vamos a docker desktop, en la opción container 

![This is an alt text.](https://res.cloudinary.com/dtbfspso5/image/upload/v1730170064/Captura_de_pantalla_2024-10-28_234717_tkc6zv.png "This is a sample image.")

11. Nos vamos a tablePlus para probar la base de datos: 
 - Tocamos el + 
 - seleccionamos PostgreSQL 
 - definimos la conexión: configuramos la conexión 
 > [IMPORTANTE]
>
> Aquí vamos a utilizar las variables de entorno tanto para el usuario como para el password que definimos en el punto 7.
>
- Por ultimo pulsamos TEST y si nos sale todo en verde tenemos establecida nuestra conexión

![This is an alt text.](https://res.cloudinary.com/dtbfspso5/image/upload/v1730170374/Captura_de_pantalla_2024-10-28_235242_l5tk3c.png "This is a sample image.")


## Recomendaciones 

Cuando alguien probar nuestra app, el va a necesitar tener la db arriba, por ende tenemos que tener preparado cierto pasos antes de llegar a ese punto: 

1. en el gitignore: agregamos la carpeta *postgres*. Esto se debe ya que la carpeta postgres es solo para desarrollo.

2. Otro punto muy importante que no queremos perder es nuestra lógica de como levantamos nuestro imagen 

# Development 

Pasos para levantar la app en desarrollo 

1. Levantar la base de datos 

```
docker compose up -d
```

2. Ejecutar algún procedimiento para llenar de datos ficticios nuestra base de datos.


# Prod


# Stage