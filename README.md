# SPARK - menu digital

Menu digital premium para cafeteria, construido con Next.js App Router, TypeScript, Tailwind, Framer Motion, Prisma y PostgreSQL.

## Desarrollo local

1. Copia .env.example a .env y configura DATABASE_URL.
2. Instala dependencias: npm install.
3. Genera el cliente y ejecuta la migracion: npm run db:generate y npm run db:migrate.
4. Carga datos demo: npm run db:seed.
5. Inicia el proyecto: npm run dev.

El seed crea un administrador con SEED_ADMIN_EMAIL y SEED_ADMIN_PASSWORD. Cambia ambos valores antes de ejecutar el seed en cualquier entorno compartido.

El menu publico esta en /. El panel protegido esta en /admin; las rutas publicas son /api/products y /api/categories.

## Produccion

Configura PostgreSQL, NEXTAUTH_SECRET, NEXTAUTH_URL y una estrategia persistente de almacenamiento S3/R2 antes de desplegar. Ejecuta npm run build y npm start detras de Nginx o Apache con HTTPS.

El panel incluye NextAuth con credenciales, middleware de protección, CRUD de productos y categorías, configuración editable y validaciones Zod. En Netlify, las credenciales se validan contra Supabase Auth, Prisma usa la base PostgreSQL de Supabase y las imágenes se almacenan en Supabase Storage.

## Netlify + Supabase

1. Crea un proyecto en Supabase y copia las variables de `.env.example` en Netlify → Site configuration → Environment variables.
2. En Supabase SQL Editor ejecuta `supabase/schema.sql`.
3. Crea el bucket público `product-images` (el SQL lo crea) y conserva `SUPABASE_SERVICE_ROLE_KEY` únicamente como variable privada de Netlify.
4. Crea el usuario administrador en Supabase Authentication → Users. En User Metadata agrega `{ "role": "ADMIN", "name": "SPARK Admin" }`.
5. Configura `DATABASE_URL` con la conexión pooled de Supabase y `DIRECT_URL` con la conexión directa. No pongas ninguna de las dos en el navegador.
6. Conecta el repositorio GitHub `Aya-Geovanny316/spark` en Netlify. El archivo `netlify.toml` ejecuta `npx prisma generate && npm run build` y activa `@netlify/plugin-nextjs`.
7. Define `NEXTAUTH_URL` con la URL real de Netlify y `NEXTAUTH_SECRET` con un secreto aleatorio largo. Después de guardar variables, ejecuta un nuevo deploy.

La sesión del panel conserva NextAuth para no cambiar la interfaz existente; cuando Supabase está configurado, el proveedor de credenciales usa Supabase Auth. Los endpoints admin vuelven a comprobar la sesión en el servidor, y la service role de Storage nunca se envía al navegador.

Para desarrollo local sin Supabase, se mantiene el fallback Prisma definido por `SEED_ADMIN_EMAIL` y `SEED_ADMIN_PASSWORD`. Para producción no uses ese fallback: crea el usuario en Supabase Auth y elimina esas variables de Netlify.
