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
- Por ultimo pulsamos TEST y si nos sale todo en verde tenemos establecida nuestra conexión

![This is an alt text.](https://res.cloudinary.com/dtbfspso5/image/upload/v1730170374/Captura_de_pantalla_2024-10-28_235242_l5tk3c.png "This is a sample image.")

## Prisma + NextJs

Prisma se usa para facilitar la interacción con bases de datos SQL y no-SQL y se integra perfectamente en aplicaciones Next.js, permitiéndote definir y manipular modelos de datos de forma eficiente.

> [IMPORTANTE]
>
> Nos permite modelar o tener objects _evitando tener que hacer queries_ como seleccionar tabla, insertar en tabla etc.

[Prisma Documentación](https://www.prisma.io/docs/orm/overview/introduction/what-is-prisma)

[Vercel Documentación: Para crear el prisma client (para trabajar con nuestro object, modelos que vamos a crear)](https://vercel.com/guides/nextjs-prisma-postgres)

## Conectar Prisma con Next

- En la terminal vamos a ejecutar el siguiente comando:

```
 npx prisma init
```

- Este comando nos crear el archivo .env con el database_url. En la cual tenemos que editar con nuestros datos.

- Ejecutado el comando en la terminal nos da una serie de pasos:

1. En el archivo .env tenemos que establecer el DATABASE_URL o la variable de entorno de nuestra base.
2. Establecer el _provider_ de _datasource_ para establecer un _scheman.prisma_ esto nos habilita trabajar con: postgresql, mysql, SQLite, mongodb o cockroach db.
3. Ejecutar el comando : npx prisma db pull para convertir una base de datos en prisma.
4. Ejecutar el comando: npx prisma generate para generar el PRISMA CLIENT.

- Por otra parte, creamos un archivo copia del .env con el nombre .env.template. Este archivo servirá de guía para la gente que se sume al proyecto o que quiera hacer las configuraciones base en caso de clonar nuestro repo.

- Ahora vamos a trabajar en la carpeta _PRISMA_ en el archivo _schema.prisma_: En este archivo vamos a definir los modelos con los cuales vamos a trabajar.
  NOTA: un MODELO representa una tabla dentro de la base de datos.

```js
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Todo {
  id          String   @id @default(uuid())
  description String
  complete    Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

```

Nota: @default() es para establecer el valor por defecto por ejemplo en la propiedad complete lo establecemos como false.

- Como hicimos una modificación en la base de datos o en nuestra estructura de datos tenemos que ejecutar una migración. Esto se debe que al agregar el model Todo es nuestra primera modificación a la base de datos.
  Para ellos vamos a utilizar el siguiente comando:

```
npx prisma migrate dev
```

Nota: _dev_ seria el nombre de nuestra migración.

> [IMPORTANTE]
>
> Este comando crea el proceso de migración, verifica la variables de entorno. Realiza los cambios y procesos necesarios para que nuestra base de datos y nuestro modelo estén en sintonía o en sincronía. Esto para asegurarle a prisma que los cambios que hagamos afectan la base de datos.
>
> NO OLVIDAR: CADA VEZ QUE HAGAMOS CAMBIOS TENEMOS QUE HACER LAS MIGRACIONES CORRESPONDIENTE.

- Una vez terminado el proceso del comando, nos vamos a tablePlus y apretamos ctrl + R, Si todo lo hicimos correctamente vamos a poder ver lo siguiente:
  ![TablePlus.](https://res.cloudinary.com/dtbfspso5/image/upload/v1730173074/Captura_de_pantalla_2024-10-29_003724_sek4c1.png)

- Por ultimo vamos a ejecutar el comando para generar el CLIENTE DE PRISMA (PRISMA CLIENT) para poder hacer las manipulaciones de la base de datos.

```
npx prisma generate
```

Importante seguir las recomendaciones que nos da el link de vercel:
[Vercel Documentación: Para crear el prisma client (para trabajar con nuestro object, modelos que vamos a crear)](https://vercel.com/guides/nextjs-prisma-postgres)

Tenemos que crear una nueva carpeta dentro de SRC / LIB/ prisma.ts

```js
import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export default prisma;
```

Hacemos modificaciones en TS para global

```js
import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!(global as any).prisma) {
    (global as any).prisma = new PrismaClient();
  }
  prisma = (global as any).prisma;
}

export default prisma;

```

## Generar semilla de base de datos

La semilla sirve como una copia de la base de datos para poder hacer las pruebas pertinentes, probar la app, insertar datos ficticios sin destruir o sobrecargar la base de datos real.
En nuestro caso la información semilla de la base de datos seria crear un par de To do.

1.  Vamos a crear un endpoint y una vez creado lo vamos a probar en postman: http://localhost:3000/api/seed
    Para crearlo vamos a ir a nuestra carpeta API, vamos a crear la carpeta SEED y dentro el archivo route.ts.
    Nota: RAG es el snippet que configuramos para la creación rápida del archivo route.ts

```js
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: Request) {
  return NextResponse.json({
    message: "Seed Executed",
  });
}
```

2. Ahora tenemos que hacer una inserción a la base de datos. Primero haremos una inserción básica y luego una masiva.
   Para la básica:

- Preparamos la inserción de la base de datos.
- Utilizamos prisma que hemos creado en la carpeta lib/prisma.
- Seleccionamos el model para nosotros seria 'todo'.
- Al hacer punto, nos salen todas los métodos que podemos utilizar sobre 'todo' en este caso buscar crear por ende utilizaremos _create_
- Especificamos la data que es la información que quiero insertar en un todo.
  Nota: todas son opcionales excepto la description porque asi lo definimos en nuestro model.
- agregamos un await para esperar la creación y lo guardamos en una constante.

```js
import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: Request) {
  const todo = await prisma.todo.create({
    data: {
      description: "Piedra del alma",
    },
  });
  console.log("🚀 ~ GET ~ todo:", todo);

  return NextResponse.json({
    message: "Seed Executed",
  });
}
```

Para ver el todo creado, tenemos que ejecutar en postman => http://localhost:3000/api/seed
Y en la terminal del visual no sale estos datos:
![Terminal en visual](https://res.cloudinary.com/dtbfspso5/image/upload/v1730218243/Captura_de_pantalla_2024-10-29_131004_cmdpyx.png)

También podemos ver el elemento creado en TablePlus:
![TablePlus](https://res.cloudinary.com/dtbfspso5/image/upload/v1730218354/Captura_de_pantalla_2024-10-29_131157_hopdh6.png)

- La IDEA usualmente del SEED es que purge la base de datos y la deje de manera tal que pueda trabajar tranquilo en ella sin que me vaya duplicando la data. Para ello vamos agregar la siguiente linea de código en nuestro route.ts

```js
await prisma.todo.deleteMany(); // delete * from todo
```

Tambien podemos especificar que elementos queremos borrar:

```js
await prisma.todo.deleteMany({
  where: {
    complete: false,
  },
}); // delete from todo where complete = false
```

Para la masiva:

- Primero borramos la anterior tabla que teniamos:

```js
await prisma.todo.deleteMany(); // delete * from todo
```

- Preparamos la inserción de la base de datos.
- Utilizamos _prisma_ que hemos creado en la carpeta lib/prisma.
- Seleccionamos el model para nosotros seria 'todo'.
- Al hacer punto, nos salen todas los métodos que podemos utilizar sobre 'todo' en este caso buscar crear de manera masiva por ende utilizaremos _createMany_
- Especificamos la data a diferencia de la forma básica que la información que quiero insertar era un todo, aquí tenemos que insertar un arreglo con todos:

```js
// insert masivo
await prisma.todo.createMany({
  data: [
    { description: "Piedra del alma", complete: true },
    { description: "Piedra del poder" },
    { description: "Piedra del tiempo" },
    { description: "Piedra del espacio" },
    { description: "Piedra del realidad" },
  ],
});
```

Nota: todas son opcionales excepto la description porque asi lo definimos en nuestro model.

- agregamos un await para esperar la creación.
- Ejecutamos en postman el endpoint y volvemos al tablePlus: En este caso nos creo todo el arreglo con los distintos todo individuales

  ![TablePlus](https://res.cloudinary.com/dtbfspso5/image/upload/v1730219085/Captura_de_pantalla_2024-10-29_132422_swlknh.png)

NOTA: cada vez que ejecutemos el seed en postman vamos a perder los id porque nos genera nuevos uuid().

## Lista todas las entradas

En este caso queremos crear un nuevo endpoint: http://localhost:3000/api/todos para poder listar todos los todo creados.

1. Creamos dentro de la carpeta API, la carpeta todo y dentro de ella el archivo route.ts.
2. utilizamos el snippet rag para hacer la creación del archivo.
3. En este caso para traer todos los elementos utiliza el método _findMany()_

```js
import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: Request) {
  const todos = await prisma.todo.findMany({});
}
```

4. Ahora retornamos los todos

```js
import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: Request) {
  const todos = await prisma.todo.findMany();
  return NextResponse.json(todos);
}
```
5. Probamos en postman el endpoint y si todo sale correctamente podemos visualizar los 5 todo que tenemos: 

  ![Postman](https://res.cloudinary.com/dtbfspso5/image/upload/v1730219946/Captura_de_pantalla_2024-10-29_133845_yy4wq7.png)






# Recomendaciones

Cuando alguien probar nuestra app, el va a necesitar tener la db arriba, por ende tenemos que tener preparado cierto pasos antes de llegar a ese punto:

1. en el gitignore: agregamos la carpeta _postgres_. Esto se debe ya que la carpeta postgres es solo para desarrollo.

2. Otro punto muy importante que no queremos perder es nuestra lógica de como levantamos nuestro imagen

# Development

Pasos para levantar la app en desarrollo

1. Levantar la base de datos

```
docker compose up -d
```

2. Renombrar el .env.template a .env
3. Reemplazar las variables de entorno
4. Ejecutar el SEED para [crear la base de datos local](http://localhost:3000/api/seed)

# Prisma commands

```
npx prisma init
npx prisma migrate dev
npx prisma generate
```

# Prod

# Stage
