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
