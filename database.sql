-- Crear la base de datos en SQL Server
CREATE DATABASE login_system;
GO

USE login_system;
GO

-- Crear tabla de usuarios
CREATE TABLE users (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(100) NOT NULL,
    email NVARCHAR(100) UNIQUE NOT NULL,
    password NVARCHAR(255) NOT NULL,
    created_at DATETIME2 DEFAULT GETDATE(),
    last_login DATETIME2 NULL,
    is_active BIT DEFAULT 1
);
GO

-- Insertar usuario demo (password: 123456 hasheada)
INSERT INTO users (name, email, password, last_login) 
VALUES ('Usuario Demo', 'demo@ejemplo.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', GETDATE());
GO

-- Crear tabla de sesiones (opcional)
CREATE TABLE user_sessions (
    id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,
    session_token NVARCHAR(255) NOT NULL,
    expires_at DATETIME2 NOT NULL,
    created_at DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
GO

-- Crear índices para mejorar rendimiento
CREATE INDEX IX_users_email ON users(email);
CREATE INDEX IX_user_sessions_token ON user_sessions(session_token);
CREATE INDEX IX_user_sessions_user_id ON user_sessions(user_id);
GO