document.addEventListener('DOMContentLoaded', () => {
    const carrito = [];
    const itemsCarrito = document.getElementById('items-carrito');
    const totalElement = document.getElementById('total');
    const botonPagar = document.getElementById('pagar');

    // Agregar productos al carrito
    document.querySelectorAll('.agregar').forEach(boton => {
        boton.addEventListener('click', (e) => {
            const producto = e.target.closest('.producto');
            const id = producto.getAttribute('data-id');
            const nombre = producto.querySelector('h3').textContent;
            const precio = parseFloat(producto.querySelector('p').textContent.replace('$', ''));

            // Verificar si ya está en el carrito
            const itemExistente = carrito.find(item => item.id === id);

            if (itemExistente) {
                itemExistente.cantidad++;
            } else {
                carrito.push({ id, nombre, precio, cantidad: 1 });
            }

            actualizarCarrito();
        });
    });

    // Actualizar el carrito en el DOM
    function actualizarCarrito() {
        itemsCarrito.innerHTML = '';
        let total = 0;

        carrito.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'item-carrito';
            itemElement.innerHTML = `
                <span>${item.nombre} x${item.cantidad}</span>
                <span>$${(item.precio * item.cantidad).toFixed(2)}</span>
                <button class="eliminar" data-id="${item.id}">Eliminar</button>
            `;
            itemsCarrito.appendChild(itemElement);

            total += item.precio * item.cantidad;
        });

        totalElement.textContent = `$${total.toFixed(2)}`;

        // Agregar evento a botones de eliminar
        document.querySelectorAll('.eliminar').forEach(boton => {
            boton.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                const index = carrito.findIndex(item => item.id === id);
                
                if (index !== -1) {
                    if (carrito[index].cantidad > 1) {
                        carrito[index].cantidad--;
                    } else {
                        carrito.splice(index, 1);
                    }
                    actualizarCarrito();
                }
            });
        });
    }

    // Botón de pagar
    botonPagar.addEventListener('click', () => {
        if (carrito.length === 0) {
            alert('¡Tu carrito está vacío!');
        } else {
            alert(`¡Gracias por tu compra! Total: $${totalElement.textContent}`);
            carrito.length = 0;
            actualizarCarrito();
        }
    });
});