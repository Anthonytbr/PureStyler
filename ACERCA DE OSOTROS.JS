<script>
        function openModal(modalId) {
            document.getElementById(modalId).style.display = 'block';
            document.body.style.overflow = 'hidden';
        }

        function closeModal(modalId) {
            document.getElementById(modalId).style.display = 'none';
            document.body.style.overflow = 'auto';
        }

        // Cerrar modal al hacer click fuera de él
        window.onclick = function(event) {
            const modals = document.querySelectorAll('.modal');
            modals.forEach(modal => {
                if (event.target === modal) {
                    modal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                }
            });
        }

        // Animación de entrada para las tarjetas
        document.addEventListener('DOMContentLoaded', function() {
            const cards = document.querySelectorAll('.section-card, .resource-card');
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            });

            cards.forEach(card => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                observer.observe(card);
            });
        });

        // Función para redirigir
function irAOtraPagina() {
    window.location.href = 'otra-pagina.html';
    // O para abrir en nueva pestaña:
    // window.open('otra-pagina.html', '_blank');
}

// Asignar al botón
document.getElementById('miBoton').onclick = irAOtraPagina;
function MiComponente() {
    const irAOtraPagina = () => {
        window.location.href = '/otra-pagina';
    };

    return (
        <button onClick={irAOtraPagina}>
            Ir a otra página
        </button>
    );
}
        // Función para redirigir
function irAOtraPagina() {
    window.location.href = 'otra-pagina.html';
    // O para abrir en nueva pestaña:
    // window.open('otra-pagina.html', '_blank');
}

// Asignar al botón
document.getElementById('miBoton').onclick = irAOtraPagina;
function MiComponente() {
    const irAOtraPagina = () => {
        window.location.href = '/otra-pagina';
    };

    return (
        <button onClick={irAOtraPagina}>
            Ir a otra página
        </button>
    );
}
        // Función para redirigir
function irAOtraPagina() {
    window.location.href = 'otra-pagina.html';
    // O para abrir en nueva pestaña:
    // window.open('otra-pagina.html', '_blank');
}

// Asignar al botón
document.getElementById('miBoton').onclick = irAOtraPagina;
function MiComponente() {
    const irAOtraPagina = () => {
        window.location.href = '/otra-pagina';
    };

    return (
        <button onClick={irAOtraPagina}>
            Ir a otra página
        </button>
    );
}

    </script>