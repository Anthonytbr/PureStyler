// server.js - Configurado para SQL Server
const express = require('express');
const sql = require('mssql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'tu_clave_secreta_aqui';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de SQL Server
const dbConfig = {
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER || 'localhost',
  database: process.env.DB_NAME || 'login_system',
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true', // Para Azure SQL
    trustServerCertificate: true, // Para desarrollo local
    enableArithAbort: true,
    instanceName: process.env.DB_INSTANCE || undefined, // Ej: 'SQLEXPRESS'
  },
  port: parseInt(process.env.DB_PORT) || 1433,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  connectionTimeout: 60000,
  requestTimeout: 60000
};

// Pool de conexiones
let poolPromise;

// Función para inicializar la conexión
async function initializeDatabase() {
  try {
    poolPromise = new sql.ConnectionPool(dbConfig);
    await poolPromise.connect();
    console.log('✅ Conexión a SQL Server establecida correctamente');
    console.log(`📊 Base de datos: ${dbConfig.database}`);
    console.log(`🖥️  Servidor: ${dbConfig.server}${dbConfig.options.instanceName ? '\\' + dbConfig.options.instanceName : ''}`);
    return poolPromise;
  } catch (error) {
    console.error('❌ Error conectando a SQL Server:', error.message);
    console.error('💡 Verifica que SQL Server esté ejecutándose y las credenciales sean correctas');
    process.exit(1);
  }
}

// Función para obtener el pool de conexiones
async function getPool() {
  if (!poolPromise) {
    poolPromise = initializeDatabase();
  }
  return poolPromise;
}

// Middleware para verificar JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token de acceso requerido' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido' });
    }
    req.user = user;
    next();
  });
};

// RUTAS DE LA API

// Ruta de registro
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validaciones
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
    }

    const pool = await getPool();

    // Verificar si el usuario ya existe
    const existingUser = await pool.request()
      .input('email', sql.NVarChar, email)
      .query('SELECT id FROM users WHERE email = @email');

    if (existingUser.recordset.length > 0) {
      return res.status(400).json({ error: 'Ya existe una cuenta con este email' });
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar nuevo usuario
    const result = await pool.request()
      .input('name', sql.NVarChar, name)
      .input('email', sql.NVarChar, email)
      .input('password', sql.NVarChar, hashedPassword)
      .query(`
                INSERT INTO users (name, email, password, last_login) 
                OUTPUT INSERTED.id, INSERTED.name, INSERTED.email, INSERTED.created_at, INSERTED.last_login
                VALUES (@name, @email, @password, GETDATE())
            `);

    const newUser = result.recordset[0];

    // Generar JWT
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: '¡Cuenta creada exitosamente!',
      token: token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        created_at: newUser.created_at,
        last_login: newUser.last_login
      }
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Ruta de login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }

    const pool = await getPool();

    // Buscar usuario
    const result = await pool.request()
      .input('email', sql.NVarChar, email)
      .query('SELECT * FROM users WHERE email = @email AND is_active = 1');

    if (result.recordset.length === 0) {
      return res.status(401).json({ error: 'Email o contraseña incorrectos' });
    }

    const user = result.recordset[0];

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Email o contraseña incorrectos' });
    }

    // Actualizar último login
    await pool.request()
      .input('userId', sql.Int, user.id)
      .query('UPDATE users SET last_login = GETDATE() WHERE id = @userId');

    // Generar JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Respuesta sin contraseña
    const { password: _, ...userResponse } = user;
    userResponse.last_login = new Date(); // Actualizar con la nueva fecha

    res.json({
      message: '¡Inicio de sesión exitoso!',
      token: token,
      user: userResponse
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Ruta para obtener perfil del usuario
app.get('/api/profile', authenticateToken, async (req, res) => {
  try {
    const pool = await getPool();

    const result = await pool.request()
      .input('userId', sql.Int, req.user.id)
      .query('SELECT id, name, email, created_at, last_login FROM users WHERE id = @userId');

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ user: result.recordset[0] });

  } catch (error) {
    console.error('Error obteniendo perfil:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Ruta para obtener todos los usuarios (protegida)
app.get('/api/users', authenticateToken, async (req, res) => {
  try {
    const pool = await getPool();

    const result = await pool.request()
      .query(`
                SELECT id, name, email, created_at, last_login 
                FROM users 
                WHERE is_active = 1 
                ORDER BY created_at DESC
            `);

    res.json({ users: result.recordset });

  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Ruta para logout (opcional - invalida token del lado cliente)
app.post('/api/logout', authenticateToken, async (req, res) => {
  // En una implementación más compleja, podrías agregar el token a una lista negra
  res.json({ message: 'Sesión cerrada correctamente' });
});

// Ruta para verificar la salud de la API
app.get('/api/health', async (req, res) => {
  try {
    const pool = await getPool();
    await pool.request().query('SELECT 1 as test');
    res.json({
      status: 'OK',
      database: 'Connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'Error',
      database: 'Disconnected',
      error: error.message
    });
  }
});

// Servir archivos estáticos
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'Acceder.html'));
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error('Error no manejado:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Manejo del cierre graceful
process.on('SIGTERM', async () => {
  console.log('🔄 Cerrando conexiones...');
  if (poolPromise) {
    await (await poolPromise).close();
  }
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('🔄 Cerrando conexiones...');
  if (poolPromise) {
    await (await poolPromise).close();
  }
  process.exit(0);
});

// Iniciar servidor
async function startServer() {
  await initializeDatabase();

  app.listen(PORT, () => {
    console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
    console.log('📁 Archivos estáticos servidos desde ./public');
    console.log('🔗 Endpoint de salud: http://localhost:' + PORT + '/api/health');
  });
}

startServer().catch(console.error);