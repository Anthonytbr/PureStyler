<?php
// config/database.php - Configuración de base de datos
class Database {
    private $host = 'localhost';
    private $db_name = 'tienda_online';
    private $username = 'root'; // Cambia por tu usuario
    private $password = '';     // Cambia por tu contraseña
    private $port = 3306;       // Puerto MySQL
    public $conn;

    public function getConnection() {
        $this->conn = null;
        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";port=" . $this->port . ";dbname=" . $this->db_name,
                $this->username,
                $this->password
            );
            $this->conn->exec("set names utf8");
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch(PDOException $exception) {
            echo "Error de conexión: " . $exception->getMessage();
        }
        return $this->conn;
    }
}

// classes/Producto.php - Clase para manejar productos
class Producto {
    private $conn;
    private $table_name = "productos";

    public $id;
    public $nombre;
    public $descripcion;
    public $precio;
    public $imagen;
    public $categoria;
    public $stock;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Obtener todos los productos activos
    public function obtenerTodos() {
        $query = "SELECT id, nombre, descripcion, precio, imagen, categoria, stock 
                  FROM " . $this->table_name . " 
                  WHERE activo = true 
                  ORDER BY nombre";
        
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    // Obtener productos por categoría
    public function obtenerPorCategoria($categoria) {
        $query = "SELECT id, nombre, descripcion, precio, imagen, categoria, stock 
                  FROM " . $this->table_name . " 
                  WHERE categoria = ? AND activo = true 
                  ORDER BY nombre";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $categoria);
        $stmt->execute();
        return $stmt;
    }

    // Obtener producto por ID
    public function obtenerPorId($id) {
        $query = "SELECT id, nombre, descripcion, precio, imagen, categoria, stock 
                  FROM " . $this->table_name . " 
                  WHERE id = ? AND activo = true";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $id);
        $stmt->execute();
        
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if($row) {
            $this->id = $row['id'];
            $this->nombre = $row['nombre'];
            $this->descripcion = $row['descripcion'];
            $this->precio = $row['precio'];
            $this->imagen = $row['imagen'];
            $this->categoria = $row['categoria'];
            $this->stock = $row['stock'];
            return true;
        }
        return false;
    }
}

// classes/Carrito.php - Clase para manejar el carrito
class Carrito {
    private $conn;
    private $table_carritos = "carritos";
    private $table_items = "carrito_items";

    public $id;
    public $usuario_id;
    public $session_id;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Obtener o crear carrito por session_id
    public function obtenerPorSession($session_id) {
        $query = "SELECT id, usuario_id, session_id 
                  FROM " . $this->table_carritos . " 
                  WHERE session_id = ?";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $session_id);
        $stmt->execute();
        
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if($row) {
            $this->id = $row['id'];
            $this->usuario_id = $row['usuario_id'];
            $this->session_id = $row['session_id'];
            return true;
        } else {
            // Crear nuevo carrito
            return $this->crear($session_id);
        }
    }

    // Crear nuevo carrito
    private function crear($session_id) {
        $query = "INSERT INTO " . $this->table_carritos . " (session_id) VALUES (?)";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $session_id);
        
        if($stmt->execute()) {
            $this->id = $this->conn->lastInsertId();
            $this->session_id = $session_id;
            return true;
        }
        return false;
    }

    // Agregar producto al carrito
    public function agregarProducto($producto_id, $cantidad = 1) {
        // Verificar si el producto ya existe en el carrito
        $query_check = "SELECT id, cantidad FROM " . $this->table_items . " 
                        WHERE carrito_id = ? AND producto_id = ?";
        $stmt_check = $this->conn->prepare($query_check);
        $stmt_check->bindParam(1, $this->id);
        $stmt_check->bindParam(2, $producto_id);
        $stmt_check->execute();
        
        if($stmt_check->rowCount() > 0) {
            // Actualizar cantidad
            $row = $stmt_check->fetch(PDO::FETCH_ASSOC);
            $nueva_cantidad = $row['cantidad'] + $cantidad;
            return $this->actualizarCantidad($producto_id, $nueva_cantidad);
        } else {
            // Obtener precio del producto
            $producto = new Producto($this->conn);
            if($producto->obtenerPorId($producto_id)) {
                $query = "INSERT INTO " . $this->table_items . " 
                          (carrito_id, producto_id, cantidad, precio_unitario) 
                          VALUES (?, ?, ?, ?)";
                $stmt = $this->conn->prepare($query);
                $stmt->bindParam(1, $this->id);
                $stmt->bindParam(2, $producto_id);
                $stmt->bindParam(3, $cantidad);
                $stmt->bindParam(4, $producto->precio);
                
                return $stmt->execute();
            }
        }
        return false;
    }

    // Actualizar cantidad de producto
    public function actualizarCantidad($producto_id, $cantidad) {
        if($cantidad <= 0) {
            return $this->eliminarProducto($producto_id);
        }

        $query = "UPDATE " . $this->table_items . " 
                  SET cantidad = ? 
                  WHERE carrito_id = ? AND producto_id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $cantidad);
        $stmt->bindParam(2, $this->id);
        $stmt->bindParam(3, $producto_id);
        
        return $stmt->execute();
    }

    // Eliminar producto del carrito
    public function eliminarProducto($producto_id) {
        $query = "DELETE FROM " . $this->table_items . " 
                  WHERE carrito_id = ? AND producto_id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);
        $stmt->bindParam(2, $producto_id);
        
        return $stmt->execute();
    }

    // Vaciar carrito
    public function vaciar() {
        $query = "DELETE FROM " . $this->table_items . " WHERE carrito_id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);
        
        return $stmt->execute();
    }

    // Obtener items del carrito
    public function obtenerItems() {
        $query = "SELECT ci.id, ci.producto_id, ci.cantidad, ci.precio_unitario,
                         p.nombre, p.descripcion, p.imagen, p.stock,
                         (ci.cantidad * ci.precio_unitario) as subtotal
                  FROM " . $this->table_items . " ci
                  JOIN productos p ON ci.producto_id = p.id
                  WHERE ci.carrito_id = ?
                  ORDER BY ci.fecha_agregado DESC";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);
        $stmt->execute();
        
        return $stmt;
    }

    // Obtener total del carrito
    public function obtenerTotal() {
        $query = "SELECT SUM(cantidad * precio_unitario) as total 
                  FROM " . $this->table_items . " 
                  WHERE carrito_id = ?";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);
        $stmt->execute();
        
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row['total'] ? floatval($row['total']) : 0;
    }

    // Contar items del carrito
    public function contarItems() {
        $query = "SELECT SUM(cantidad) as total_items 
                  FROM " . $this->table_items . " 
                  WHERE carrito_id = ?";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);
        $stmt->execute();
        
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row['total_items'] ? intval($row['total_items']) : 0;
    }
}

// api/productos.php - API para obtener productos
session_start();

// Headers para API
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../config/database.php';
include_once '../classes/Producto.php';

$database = new Database();
$db = $database->getConnection();
$producto = new Producto($db);

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        if(isset($_GET['categoria'])) {
            $stmt = $producto->obtenerPorCategoria($_GET['categoria']);
        } else {
            $stmt = $producto->obtenerTodos();
        }
        
        $productos = array();
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $productos[] = array(
                "id" => $row['id'],
                "nombre" => $row['nombre'],
                "descripcion" => $row['descripcion'],
                "precio" => floatval($row['precio']),
                "imagen" => $row['imagen'],
                "categoria" => $row['categoria'],
                "stock" => intval($row['stock'])
            );
        }
        
        echo json_encode($productos);
        break;
}

// api/carrito.php - API para manejar el carrito
session_start();

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../config/database.php';
include_once '../classes/Carrito.php';

$database = new Database();
$db = $database->getConnection();
$carrito = new Carrito($db);

// Obtener o generar session_id
if(!isset($_SESSION['session_id'])) {
    $_SESSION['session_id'] = uniqid();
}

$session_id = $_SESSION['session_id'];
$carrito->obtenerPorSession($session_id);

$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents("php://input"));

switch($method) {
    case 'GET':
        // Obtener items del carrito
        $stmt = $carrito->obtenerItems();
        $items = array();
        
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $items[] = array(
                "id" => $row['id'],
                "producto_id" => $row['producto_id'],
                "nombre" => $row['nombre'],
                "descripcion" => $row['descripcion'],
                "imagen" => $row['imagen'],
                "precio" => floatval($row['precio_unitario']),
                "cantidad" => intval($row['cantidad']),
                "subtotal" => floatval($row['subtotal']),
                "stock" => intval($row['stock'])
            );
        }
        
        $response = array(
            "items" => $items,
            "total" => $carrito->obtenerTotal(),
            "total_items" => $carrito->contarItems()
        );
        
        echo json_encode($response);
        break;
        
    case 'POST':
        // Agregar producto al carrito
        if(isset($data->producto_id) && isset($data->cantidad)) {
            if($carrito->agregarProducto($data->producto_id, $data->cantidad)) {
                echo json_encode(array("message" => "Producto agregado al carrito"));
            } else {
                echo json_encode(array("message" => "Error al agregar producto"));
            }
        }
        break;
        
    case 'PUT':
        // Actualizar cantidad
        if(isset($data->producto_id) && isset($data->cantidad)) {
            if($carrito->actualizarCantidad($data->producto_id, $data->cantidad)) {
                echo json_encode(array("message" => "Cantidad actualizada"));
            } else {
                echo json_encode(array("message" => "Error al actualizar cantidad"));
            }
        }
        break;
        
    case 'DELETE':
        if(isset($_GET['producto_id'])) {
            // Eliminar producto específico
            if($carrito->eliminarProducto($_GET['producto_id'])) {
                echo json_encode(array("message" => "Producto eliminado"));
            } else {
                echo json_encode(array("message" => "Error al eliminar producto"));
            }
        } else {
            // Vaciar carrito
            if($carrito->vaciar()) {
                echo json_encode(array("message" => "Carrito vaciado"));
            } else {
                echo json_encode(array("message" => "Error al vaciar carrito"));
            }
        }
        break;
}
?>