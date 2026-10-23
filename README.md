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

El panel incluye NextAuth con credenciales, middleware de proteccion, CRUD de productos y categorias, configuracion editable y validaciones Zod. Para produccion todavia debes conectar el almacenamiento persistente de imagenes y configurar HTTPS/infraestructura.
