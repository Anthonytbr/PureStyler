-- 1. ESTRUCTURA DE LA BASE DE DATOS
-- Crear base de datos
CREATE DATABASE tienda_online;
USE tienda_online;

-- Tabla de productos
CREATE TABLE productos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL,
    imagen VARCHAR(500),
    categoria VARCHAR(100),
    stock INT DEFAULT 0,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de usuarios (opcional para carritos persistentes)
CREATE TABLE usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    telefono VARCHAR(20),
    direccion TEXT,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de carritos
CREATE TABLE carritos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NULL, -- NULL para carritos de invitados
    session_id VARCHAR(255), -- Para identificar carritos sin login
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Tabla de items del carrito
CREATE TABLE carrito_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    carrito_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT NOT NULL DEFAULT 1,
    precio_unitario DECIMAL(10,2) NOT NULL,
    fecha_agregado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (carrito_id) REFERENCES carritos(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE,
    UNIQUE KEY unique_cart_product (carrito_id, producto_id)
);

-- Tabla de pedidos
CREATE TABLE pedidos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT,
    carrito_id INT,
    total DECIMAL(10,2) NOT NULL,
    estado ENUM('pendiente', 'procesando', 'enviado', 'entregado', 'cancelado') DEFAULT 'pendiente',
    direccion_envio TEXT,
    fecha_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (carrito_id) REFERENCES carritos(id)
);

-- Insertar productos de ejemplo
INSERT INTO productos (nombre, descripcion, precio, imagen, categoria, stock) VALUES
('Funda iPhone 14 Pro', 'Funda premium con protección contra caídas', 29.99, 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=300', 'accesorios', 50),
('Cargador Inalámbrico', 'Carga rápida 15W compatible con todos los dispositivos', 39.99, 'https://images.unsplash.com/photo-1609688669309-fc15db557633?w=300', 'accesorios', 30),
('Cable USB-C Premium', 'Cable de carga rápida 2 metros, ultra resistente', 19.99, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300', 'accesorios', 100),
('Soporte para Laptop', 'Soporte ergonómico ajustable de aluminio', 79.99, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300', 'accesorios', 25),
('Mouse Pad Gaming', 'Superficie premium para gaming con bordes LED', 24.99, 'https://images.unsplash.com/photo-1563297007-0686b7003af7?w=300', 'accesorios', 40),
('Hub USB-C 7 en 1', 'Adaptador multifuncional con HDMI, USB y SD', 59.99, 'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=300', 'accesorios', 20);

-- Índices para mejor rendimiento
CREATE INDEX idx_productos_categoria ON productos(categoria);
CREATE INDEX idx_productos_activo ON productos(activo);
CREATE INDEX idx_carritos_session ON carritos(session_id);
CREATE INDEX idx_carrito_items_carrito ON carrito_items(carrito_id);
CREATE INDEX idx_pedidos_usuario ON pedidos(usuario_id);
CREATE INDEX idx_pedidos_fecha ON pedidos(fecha_pedido);