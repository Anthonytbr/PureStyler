<script
        // OPCIÓN 1: Alerta simple al cargar la página
        window.onload = function() {
            alert("¡Bienvenido! Gracias por visitar nuestra página web.");
        };
        
        // OPCIÓN 2: También puedes usar addEventListener (más moderno)
        /*
        window.addEventListener('load', function() {
            alert("¡Hola! Esta página acaba de cargar completamente.");
        });
        */
        
        // OPCIÓN 3: Alerta más personalizada con información
        /*
        window.onload = function() {
            let horaActual = new Date().toLocaleTimeString();
            alert(`¡Bienvenido!\nHora de visita: ${horaActual}\n\n¡Gracias por visitarnos!`);
        };
        */
        
        // OPCIÓN 4: Alerta con confirmación
        /*
        window.onload = function() {
            let bienvenida = confirm("¡Bienvenido a nuestra página!\n\n¿Te gustaría recibir notificaciones?");
            if (bienvenida) {
                alert("¡Excelente! Gracias por suscribirte.");
            } else {
                alert("No hay problema. ¡Disfruta navegando!");
            }
        };
        */
// Script para manejar la navegación suave
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});
</script>
 // Obtener el elemento de audio
 const bgMusic = document.getElementById('bgMusic');
        
 // Función para reproducir la música
 function playMusic() {
     bgMusic.play();
 }
 
 // Función para pausar la música
 function pauseMusic() {
     bgMusic.pause();
 }
 
 // Función para cambiar el volumen
 function changeVolume() {
     const volumeSlider = document.getElementById('volume');
     bgMusic.volume = volumeSlider.value;
 }
 
 // Configurar el volumen inicial
 window.onload = function() {
     bgMusic.volume = document.getElementById('volume').value;
 }
  <script>
        let cart = [];
        let cartCount = 0;

        function addToCart(name, price) {
            cart.push({ name, price });
            cartCount++;
            document.getElementById('cartCount').textContent = cartCount;
            
            // Efecto visual de confirmación
            const cartIcon = document.querySelector('.cart-icon');
            cartIcon.style.transform = 'scale(1.2)';
            setTimeout(() => {
                cartIcon.style.transform = 'scale(1)';
            }, 200);
            
            // Mostrar notificación
            showNotification(`${name} agregado al carrito`);
        }

        function showNotification(message) {
            const notification = document.createElement('div');
            notification.textContent = message;
            notification.style.cssText = `
                position: fixed;
                top: 100px;
                right: 30px;
                background: linear-gradient(45deg, #667eea, #764ba2);
                color: white;
                padding: 15px 20px;
                border-radius: 10px;
                box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
                z-index: 1001;
                opacity: 0;
                transform: translateX(100px);
                transition: all 0.3s ease;
            `;
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.style.opacity = '1';
                notification.style.transform = 'translateX(0)';
            }, 100);
            
            setTimeout(() => {
                notification.style.opacity = '0';
                notification.style.transform = 'translateX(100px)';
                setTimeout(() => {
                    document.body.removeChild(notification);
                }, 300);
            }, 3000);
        }

        function toggleCart() {
            if (cart.length === 0) {
                alert('Tu carrito está vacío');
                return;
            }
            
            let cartContent = 'Tu carrito contiene:\n\n';
            let total = 0;
            
            cart.forEach((item, index) => {
                cartContent += `${index + 1}. ${item.name} - $${item.price}\n`;
                total += item.price;
            });
            
            cartContent += `\nTotal: $${total}`;
            alert(cartContent);
        }

        // Smooth scrolling para los enlaces de navegación
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                if (targetId.startsWith('#')) {
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        targetElement.scrollIntoView({
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });

        // Animación de entrada para las tarjetas de productos
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        document.querySelectorAll('.product-card').forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(50px)';
            card.style.transition = `all 0.6s ease ${index * 0.1}s`;
            observer.observe(card);
        });
                const products = {
            'conjunto-primavera': {
                name: 'Conjunto de Primavera',
                price: '$1,000',
                image: 'https://i.pinimg.com/736x/15/35/53/153553bd085c6cd0537765c13a4c083b.jpg',
                description: 'Conjunto perfecto para la temporada primaveral.'
            },
            'chaqueta-denim': {
                name: 'Chaqueta Denim Premium',
                price: '$2,000',
                image: 'https://i.pinimg.com/736x/83/c4/e9/83c4e990fd6490cd5affd17516037ecb.jpg',
                description: 'Chaqueta de mezclilla de alta calidad.'
            },
            'pantalones-cargo': {
                name: 'Pantalones Cargo',
                price: '$600',
                image: 'https://i.pinimg.com/736x/33/2d/aa/332daa4a75b98bde74ab0a7b02143fda.jpg',
                description: 'Pantalones cargo versátiles y cómodos.'
            },
            'conjunto-samurai': {
                name: 'Conjunto de Entrenamiento Estilo Samurái',
                price: '$5,000',
                image: 'https://i.pinimg.com/736x/e5/7f/bb/e57fbb8062395096a7c5fcc93a9c7e6c.jpg',
                description: 'Conjunto único inspirado en la estética samurái.'
            },
            'anillo-plata': {
                name: 'Anillo de Plata',
                price: '$1,000',
                image: 'https://i.pinimg.com/736x/0f/e1/a1/0fe1a111fe3c05b379fedcab04abb602.jpg',
                description: 'Elegante anillo de plata sterling.'
            },
            'gafas-vintage': {
                name: 'Gafas de Sol Vintage',
                price: '$700',
                image: 'https://i.pinimg.com/736x/0e/fc/26/0efc26283ee88a1ffa17698df8072585.jpg',
                description: 'Gafas de sol con estilo vintage clásico.'
            },
            'pulsera-plata': {
                name: 'Pulsera de Plata Artesanal',
                price: '$2,000',
                image: 'https://img.fantaskycdn.com/ac865c49419882652d2ae28670f9fd9e_750x.jpeg',
                description: 'Pulsera artesanal de plata con trabajo detallado.'
            },
            'cadena-plata': {
                name: 'Cadena de Plata',
                price: '$2,000',
                image: 'https://img.fantaskycdn.com/11e1ce8a54917074179f3b5b189fc0bb_750x.jpeg',
                description: 'Cadena de plata elegante y versátil.'
            },
            'traje-clasico': {
                name: 'Traje Clásico Negro',
                price: '$3,500',
                image: 'https://i.pinimg.com/736x/4d/e1/0f/4de10fbabf0f4888ae4493c7c48a908f.jpg',
                description: 'Traje clásico negro de corte impecable.'
            },
            'sapatos': {
                name: 'Sapatos',
                price: '$1,000',
                image: 'https://img.fantaskycdn.com/efbcb6f2d73fe1463d415e4eedd21c3c_540x.jpeg',
                description: 'Zapatos elegantes de cuero genuino.'
            },
            'corbata': {
                name: 'Corbata',
                price: '$200',
                image: 'https://i.pinimg.com/736x/93/74/21/9374219d6bd05337dae3fb83f34539f3.jpg',
                description: 'Corbata de seda de alta calidad.'
            },
            'monos': {
                name: 'Moños',
                price: '$100',
                image: 'https://i.pinimg.com/736x/46/31/cc/4631cc36e740168de768a713dec6f4d9.jpg',
                description: 'Moños elegantes para ocasiones especiales.'
            }
        };
           function openModal(productId) {
            const product = products[productId];
            
            document.getElementById('modal-title').textContent = product.name;
            document.getElementById('modal-price').textContent = product.price;
            document.getElementById('modal-image').src = product.image;
            document.getElementById('modal-description').textContent = product.description;
            
            document.getElementById('productModal').style.display = 'block';
        }

        function closeModal() {
            document.getElementById('productModal').style.display = 'none';
        }

        function buyProduct() {
            alert('Producto agregado al carrito');
            closeModal();
        }

        window.onclick = function(event) {
            const modal = document.getElementById('productModal');
            if (event.target == modal) {
                closeModal();
            }
        }
    </script>
    </script>