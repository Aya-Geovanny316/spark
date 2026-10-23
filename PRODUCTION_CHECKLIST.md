# SPARK · Checklist de producción

## Verificado localmente

- [x] App Router y rutas dinámicas identificados.
- [x] Configuración Netlify sin exportación estática para producción.
- [x] Node 22.12.0 fijado en Netlify.
- [x] Variables documentadas en `.env.example`.
- [x] `.env` excluido de Git.
- [x] Escritura de fotografías dirigida a Supabase Storage.
- [x] API administrativa protegida con sesión de servidor.
- [x] Validación Zod en altas y cambios de productos/categorías.
- [x] QR y PDF implementados sin binarios externos.
- [x] Metadatos SEO básicos preparados.
- [x] `npm run typecheck` correcto tras los cambios de preparación.
- [x] `npm run build` había finalizado correctamente antes de esta auditoría; debe repetirse antes de publicar.

## Pendiente de credenciales o servicio externo

- [x] Crear y vincular proyecto PostgreSQL en Neon.
- [x] Aplicar migración inicial de Prisma en Neon.
- [ ] Configurar `DATABASE_URL` y `DATABASE_URL_UNPOOLED` de Neon en Netlify.
- [ ] Crear usuario administrador en Supabase Auth.
- [ ] Configurar las claves Supabase en Netlify.
- [ ] Confirmar bucket público `product-images`.
- [ ] Probar subida y persistencia de fotografías.
- [ ] Configurar la URL pública definitiva.

## Pendiente de prueba en producción

- [ ] Login y logout desde el dominio Netlify.
- [ ] CRUD de productos y categorías.
- [ ] Persistencia después de un nuevo deploy.
- [ ] QR escaneado desde Android y iPhone.
- [ ] PDF abierto e impreso desde producción.
- [ ] Temáticas y fecha Guatemala en producción.
- [ ] Quema del Diablo estática, limitada al 7 de diciembre de Guatemala.
- [ ] Easter Egg de Coco Latte en dispositivos táctiles.
- [ ] Logs sin errores críticos.
