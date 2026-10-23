# SPARK · Despliegue en Netlify

## Estado de la arquitectura

| Área | Estado | Detalle |
| --- | --- | --- |
| Next.js / App Router | Compatible | Next 15 con rutas dinámicas y funciones Node. |
| Build de Netlify | Preparado | `npm run db:generate && npm run build`, plugin oficial de Next. |
| Base de datos | Requiere servicio externo | PostgreSQL administrado, recomendado Supabase. |
| Prisma | Compatible con configuración | `DATABASE_URL` pooled para runtime y `DIRECT_URL` para migraciones. |
| Autenticación | Preparada | NextAuth con JWT; Supabase Auth en producción. |
| Fotografías | Preparadas | Supabase Storage mediante `SUPABASE_SERVICE_ROLE_KEY` privada. |
| PDF / QR | Compatible | `pdf-lib`, `qrcode` y Canvas, sin binarios externos. |
| Temáticas | Compatible | Se calculan con `America/Guatemala` en la aplicación. |
| Quema del Diablo | Compatible | Tema estático del 7 de diciembre; no carga video ni transición. |
| Escritura en filesystem | No utilizada para datos | Las subidas usan Storage; `.next` es artefacto de build. |

## 1. Crear el sitio

1. En Netlify, selecciona **Add new site → Import an existing project**.
2. Conecta GitHub y selecciona `Aya-Geovanny316/spark`.
3. Usa la rama que contenga la versión revisada.
4. Netlify detectará `netlify.toml`; no configures un publish directory estático alternativo.
5. El build usa Node `22.12.0` y ejecuta `npm run db:generate && npm run build`.

No se debe activar `output: export` para Netlify. Esa opción solo se usa cuando `GITHUB_PAGES=true`.

## 2. Supabase

Crear un proyecto Supabase y ejecutar `supabase/schema.sql` en el SQL Editor. Después:

1. Crear el usuario administrador en Supabase Authentication → Users.
2. En User Metadata asignar, como mínimo, `{ "role": "ADMIN", "name": "SPARK Admin" }`.
3. Confirmar que el bucket público `product-images` exista.
4. Mantener la service role exclusivamente como variable privada de Netlify.
5. Ejecutar las migraciones de Prisma desde un entorno controlado usando `DIRECT_URL`; no hacerlo automáticamente durante cada deploy.

## 3. Variables de entorno en Netlify

Configurar Production, y también Deploy Previews si se desean probar:

```text
DATABASE_URL=postgresql://...pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
DIRECT_URL=postgresql://...db.<proyecto>.supabase.co:5432/postgres
NEXTAUTH_SECRET=<secreto aleatorio largo>
NEXTAUTH_URL=https://<sitio>.netlify.app
NEXT_PUBLIC_SITE_URL=https://<sitio>.netlify.app
NEXT_PUBLIC_MENU_URL=https://<sitio>.netlify.app
NEXT_PUBLIC_SUPABASE_URL=https://<proyecto>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key>
SUPABASE_SERVICE_ROLE_KEY=<service role key privada>
SUPABASE_STORAGE_BUCKET=product-images
STORAGE_PROVIDER=supabase
```

No agregar `SEED_ADMIN_EMAIL` ni `SEED_ADMIN_PASSWORD` en producción. No copiar valores del `.env` local y no poner secretos con prefijo `NEXT_PUBLIC_`.

## 4. Primera publicación

1. Guardar las variables.
2. Ejecutar el primer deploy.
3. Abrir `https://<sitio>.netlify.app/` y comprobar el menú público.
4. Abrir `/admin/login` y probar el usuario de Supabase Auth.
5. Crear una categoría o producto de prueba y comprobar que persiste tras recargar.
6. Subir una fotografía y comprobar que la URL pertenece al bucket de Supabase.
7. Configurar `publicMenuUrl` desde el panel con la URL pública definitiva.
8. Regenerar el QR y comprobar la URL final.
9. Generar un PDF y comprobar que conserva una o dos páginas A4.

## 5. Verificaciones de producción

- Revisar Functions logs después del primer acceso público y del login.
- Revisar errores de conexión Prisma si el menú no carga.
- Confirmar HTTPS y el dominio canónico antes de imprimir el QR.
- Probar el menú en un teléfono mediante una red móvil, no solo desde localhost.
- Probar una edición administrativa y confirmar persistencia en Supabase.

## 6. Revertir

Usar **Deploys → seleccionar deploy anterior → Publish deploy**. No borrar la base de datos ni el bucket para revertir una versión del frontend.

## Limitaciones pendientes

- No se puede verificar aquí la conexión real a Supabase ni la persistencia de producción sin credenciales.
- No se ejecutó un escaneo físico del QR en Android/iPhone.
- No se realizó ningún deploy ni se modificó GitHub o Netlify.
