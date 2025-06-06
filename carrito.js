// Carrito de compras - Funcionalidad principal
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// Función para agregar productos al carrito
function agregarAlCarrito(id, nombre, precio, imagen) {
    // Verificar si el producto ya está en el carrito
    const productoExistente = carrito.find(item => item.id === id);
    
    if (productoExistente) {
        productoExistente.cantidad += 1;
    } else {
        carrito.push({
            id,
            nombre,
            precio: parseFloat(precio),
            imagen,
            cantidad: 1
        });
    }
    
    // Actualizar localStorage
    localStorage.setItem('carrito', JSON.stringify(carrito));
    
    // Mostrar notificación
    mostrarNotificacion(`${nombre} agregado al carrito`);
    
    // Actualizar contador del carrito
    actualizarContadorCarrito();
}

// Función para mostrar notificación
function mostrarNotificacion(mensaje) {
    const notificacion = document.createElement('div');
    notificacion.className = 'notificacion-carrito';
    notificacion.textContent = mensaje;
    document.body.appendChild(notificacion);
    
    setTimeout(() => {
        notificacion.classList.add('mostrar');
    }, 100);
    
    setTimeout(() => {
        notificacion.classList.remove('mostrar');
        setTimeout(() => {
            document.body.removeChild(notificacion);
        }, 300);
    }, 3000);
}

// Función para actualizar el contador del carrito
function actualizarContadorCarrito() {
    const contador = document.getElementById('contador-carrito');
    if (contador) {
        const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);
        contador.textContent = totalItems;
        contador.style.display = totalItems > 0 ? 'block' : 'none';
    }
}

// Inicializar contador al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    actualizarContadorCarrito();
    
    // Configurar botones "Agregar al carrito"
    document.querySelectorAll('.agregar-carrito').forEach(boton => {
        boton.addEventListener('click', function() {
            const producto = this.closest('.producto');
            const id = producto.dataset.id;
            const nombre = producto.querySelector('.producto-nombre').textContent;
            const precio = producto.querySelector('.producto-precio').textContent.replace('$', '');
            const imagen = producto.querySelector('.producto-imagen').src;
            
            agregarAlCarrito(id, nombre, precio, imagen);
        });
    });
});