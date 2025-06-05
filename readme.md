# Sistema de Login con MySQL

Sistema de autenticación completo con base de datos MySQL, JWT y interfaz web moderna.

## 🚀 Características

- ✅ Registro y login de usuarios
- ✅ Encriptación de contraseñas con bcrypt
- ✅ Autenticación JWT
- ✅ Base de datos MySQL
- ✅ Interfaz web responsive
- ✅ Validaciones de seguridad
- ✅ Sesiones persistentes

## 📋 Prerequisitos

- Node.js (v14 o superior)
- MySQL (v8.0 o superior)
- npm o yarn

## 🛠️ Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/login-system-mysql.git
   cd login-system-mysql
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   ```
   Edita el archivo `.env` con tus credenciales:
   ```bash
   DB_HOST=localhost
   DB_USER=tu_usuario
   DB_PASSWORD=tu_password
   DB_NAME=login_system
   JWT_SECRET=tu_clave_secreta_super_segura
   ```

4. **Crear la base de datos**
   - Ejecuta el script `database.sql` en MySQL:
   ```bash
   mysql -u root -p < database.sql
   ```

5. **Ejecutar el proyecto**
   ```bash
   # Desarrollo
   npm run dev
   
   # Producción
   npm start
   ```

6. **Abrir en el navegador**
   ```
   http://localhost:3000
   ```

## 📁 Estructura del Proyecto

```
login-system-mysql/
├── server.js              # Servidor Express
├── package.json           # Dependencias
├── .env                   # Variables de entorno (NO SUBIR)
├── .env.example          # Plantilla de variables
├── database.sql          # Script de base de datos
├── public/               # Archivos frontend
│   ├── Acceder.html     # Página principal
│   ├── Acceder.css      # Estilos
│   └── Acceder.js       # Lógica frontend
└── README.md
```

## 🔐 Seguridad

- Las contraseñas se almacenan hasheadas con bcrypt
- Se utilizan tokens JWT para autenticación
- Variables sensibles en archivo `.env` (excluido de Git)
- Validaciones tanto en frontend como backend

## 🌐 API Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/register` | Registrar nuevo usuario |
| POST | `/api/login` | Iniciar sesión |
| GET | `/api/profile` | Obtener perfil del usuario |
| GET | `/api/users` | Listar usuarios (requiere auth) |
| POST | `/api/logout` | Cerrar sesión |

## 👤 Usuario Demo

- **Email:** demo@ejemplo.com
- **Password:** 123456

## 🚨 Importante

**NUNCA subas el archivo `.env` a GitHub**. Contiene información sensible como contraseñas y claves secretas.

## 🐛 Troubleshooting

### Error de conexión a MySQL
```bash
# Verificar que MySQL esté ejecutándose
sudo service mysql status

# Verificar credenciales en .env
```

### Error "Cannot find module"
```bash
# Reinstalar dependencias
rm -rf node_modules
npm install
```

### Error de puerto en uso
```bash
# Cambiar puerto en .env o terminar proceso
lsof -ti:3000 | xargs kill -9
```

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

⭐ Si te gusta este proyecto, ¡dale una estrella en GitHub!