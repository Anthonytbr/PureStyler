# Sistema de Login con SQL Server

Sistema de autenticación completo con base de datos SQL Server, JWT y interfaz web moderna para Windows.

## 🚀 Características

- ✅ Registro y login de usuarios
- ✅ Encriptación de contraseñas con bcrypt
- ✅ Autenticación JWT
- ✅ Base de datos SQL Server
- ✅ Interfaz web responsive
- ✅ Validaciones de seguridad
- ✅ Sesiones persistentes
- ✅ Optimizado para Windows

## 📋 Prerequisitos

- **Node.js** (v14 o superior)
- **SQL Server** (Express, Developer, o Standard)
- **SQL Server Management Studio (SSMS)** (recomendado)
- **npm** o **yarn**

## 🔧 Configuración de SQL Server

### 1. Instalar SQL Server
```bash
# Descargar SQL Server Express (gratuito)
# https://www.microsoft.com/en-us/sql-server/sql-server-downloads

# O usar SQL Server Developer Edition
# https://www.microsoft.com/en-us/sql-server/sql-server-downloads
```

### 2. Configurar SQL Server
```sql
-- Habilitar autenticación mixta (SQL Server + Windows)
-- En SSMS: Server Properties > Security > SQL Server and Windows Authentication mode

-- Habilitar protocolo TCP/IP
-- SQL Server Configuration Manager > SQL Server Network Configuration > Protocols
```

### 3. Crear usuario SA o usuario personalizado
```sql
-- Opción 1: Usar SA (administrador)
ALTER LOGIN sa ENABLE;
ALTER LOGIN sa WITH PASSWORD = 'TuPasswordSeguro123!';

-- Opción 2: Crear usuario personalizado
CREATE LOGIN mi_usuario WITH PASSWORD = 'MiPassword123!';
CREATE USER mi_usuario FOR LOGIN mi_usuario;
ALTER ROLE db_owner ADD MEMBER mi_usuario;
```

## 🛠️ Instalación del Proyecto

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/login-system-sqlserver.git
   cd login-system-sqlserver
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   copy .env.example .env
   ```
   Edita el archivo `.env` con tus credenciales:
   ```bash
   DB_SERVER=localhost
   DB_USER=sa
   DB_PASSWORD=TuPasswordSeguro123!
   DB_NAME=login_system
   DB_INSTANCE=SQLEXPRESS
   JWT_SECRET=tu_clave_secreta_super_segura
   ```

4. **Crear la base de datos**
   - Abrir SSMS y conectar a tu servidor
   - Ejecutar el script `database.sql`:
   ```sql
   -- Copiar y pegar el contenido de database.sql en SSMS
   -- O usar sqlcmd desde la línea de comandos:
   sqlcmd -S localhost\SQLEXPRESS -U sa -P TuPassword -i database.sql
   ```

5. **Verificar la conexión**
   ```bash
   npm run dev
   ```
   Visita: `http://localhost:3000/api/health`

6. **Ejecutar el proyecto**
   ```bash
   # Desarrollo (con auto-reinicio)
   npm run dev
   
   # Producción
   npm start
   ```

7. **Abrir en el navegador**
   ```
   http://localhost:3000
   ```

## 📁 Estructura del Proyecto

```
login-system-sqlserver/
├── server.js              # Servidor Express con SQL Server
├── package.json           # Dependencias (mssql incluido)
├── .env                   # Variables de entorno (NO SUBIR)
├── .env.example          # Plantilla de variables
├── database.sql          # Script de SQL Server
├── public/               # Archivos frontend
│   ├── Acceder.html     # Página principal
│   ├── Acceder.css      # Estilos
│   └── Acceder.js       # Lógica frontend
└── README.md
```

## 🗄️ Configuraciones Comunes de SQL Server

### Para SQL Server Express:
```bash
DB_SERVER=localhost
DB_INSTANCE=SQLEXPRESS
DB_PORT=1433
```

### Para instancia por defecto:
```bash
DB_SERVER=localhost
# DB_INSTANCE= (dejar vacío)
DB_PORT=1433
```

### Para servidor remoto:
```bash
DB_SERVER=192.168.1.100
DB_PORT=1433
DB_ENCRYPT=true
```

## 🔐 Seguridad

- Contraseñas hasheadas con bcrypt (salt rounds: 10)
- Tokens JWT con expiración de 24 horas
- Variables sensibles en archivo `.env` (excluido de Git)
- Validaciones tanto en frontend como backend
- Conexiones SQL parameterizadas (previene SQL injection)

## 🌐 API Endpoints

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| POST | `/api/register` | Registrar nuevo usuario | No |
| POST | `/api/login` | Iniciar sesión | No |
| GET | `/api/profile` | Obtener perfil del usuario | Sí |
| GET | `/api/users` | Listar usuarios | Sí |
| POST | `/api/logout` | Cerrar sesión | Sí |
| GET | `/api/health` | Estado de la API/DB | No |

## 👤 Usuario Demo

- **Email:** demo@ejemplo.com
- **Password:** 123456

## 🚨 Troubleshooting

### Error: "Login failed for user 'sa'"
```bash
# Verificar que la autenticación mixta esté habilitada
# SSMS > Server Properties > Security > SQL Server and Windows Authentication mode
```

### Error: "A network-related or instance-specific error"
```bash
# Verificar que SQL Server esté ejecutándose
services.msc -> SQL Server (SQLEXPRESS)

# Verificar que TCP/IP esté habilitado
# SQL Server Configuration Manager > Protocols for SQLEXPRESS > TCP/IP
```

### Error: "Cannot find module 'mssql'"
```bash
# Reinstalar dependencias
npm install mssql
```

### Error de puerto en uso
```bash
# Cambiar puerto en .env
PORT=3001
```

### Error de conexión timeout
```bash
# Aumentar timeout en .env o verificar firewall
# Windows Firewall > Allow SQL Server port 1433
```

## 🔧 Comandos Útiles

```bash
# Verificar servicios de SQL Server
services.msc

# Verificar puertos abiertos
netstat -an | findstr :1433

# Conectar por línea de comandos
sqlcmd -S localhost\SQLEXPRESS -U sa -P TuPassword

# Verificar versión de SQL Server
sqlcmd -S localhost\SQLEXPRESS -U sa -P TuPassword -Q "SELECT @@VERSION"
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

⭐ ¡Optimizado para Windows y SQL Server! Si te gusta este proyecto, ¡dale una estrella en GitHub!