 // Datos de productos
        const products = {
            classic1: {
                title: "Camisa Blanca",
                price: "$299",
                description: "Camisa clásica de algodón premium, perfecta para cualquier ocasión formal. Fabricada con algodón 100% egipcio para mayor durabilidad y comodidad.",
                image: "https://i.pinimg.com/736x/9b/7c/20/9b7c20a0a601903d943362bd57548668.jpg",
                specs: "• Material: Algodón 100%<br>• Tallas: S, M, L, XL<br>• Color: Blanco<br>• Cuidado: Lavable en máquina"
            },
            classic2: {
                title: "Pantalón Negro",
                price: "$189",
                description: "Pantalón de vestir en color negro, corte clásico y elegante. Perfecto para combinar con camisas formales y blazers.",
                image: "https://i.pinimg.com/736x/56/72/99/567299d68b9a55622117e68fffbeb7b5.jpg",
                specs: "• Material: Lana 70%, Poliéster 30%<br>• Tallas: 28-42<br>• Color: Negro<br>• Corte: Clásico"
            },
            classic3: {
                title: "Blazer de Lana",
                price: "$429",
                description: "Blazer elegante de lana merino, ideal para eventos formales. Diseño atemporal que nunca pasa de moda.",
                image: "https://i.pinimg.com/736x/3f/bc/b1/3fbcb14dbce684f21e50be6cb83bcde1.jpg",
                specs: "• Material: Lana Merino 100%<br>• Tallas: S, M, L, XL<br>• Color: Gris Oxford<br>• Forro interior completo"
            },
            sport1: {
                title: "Camiseta Deportiva",
                price: "$79",
                description: "Camiseta técnica con tecnología de absorción de humedad. Ideal para entrenamientos intensos y actividades deportivas.",
                image: "https://i.pinimg.com/736x/a7/38/1e/a7381ebd512410563c72a817c2764e0b.jpg",
                specs: "• Material: Poliéster técnico<br>• Tecnología: Dri-FIT<br>• Tallas: XS-XXL<br>• Colores disponibles: 5"
            },
            sport2: {
                title: "Zapatillas Running",
                price: "$189",
                description: "Zapatillas deportivas de última generación para corredores. Con amortiguación avanzada y suela antideslizante.",
                image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=250&fit=crop",
                specs: "• Suela: Goma antideslizante<br>• Amortiguación: Gel<br>• Tallas: 36-46<br>• Peso: 280g"
            },
            sport3: {
                title: "Shorts Deportivos",
                price: "$89",
                description: "Shorts cómodos y transpirables para entrenamientos intensos. Con cintura elástica y bolsillos laterales.",
                image: "https://i5.walmartimages.com.mx/mg/gm/1p/images/product-images/img_large/00750132599893l.jpg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
                specs: "• Material: Poliéster 85%, Spandex 15%<br>• Cintura: Elástica<br>• Longitud: 7 pulgadas<br>• Bolsillos: 2 laterales"
            },
            casual1: {
                title: "Camiseta Casual",
                price: "$45",
                description: "Camiseta de algodón 100% para uso diario, suave y cómoda. Perfecta para looks casuales y relajados.",
                image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=250&fit=crop",
                specs: "• Material: Algodón 100%<br>• Corte: Regular<br>• Cuello: Redondo<br>• Colores: 8 disponibles"
            },
            casual2: {
                title: "Jeans Clásicos",
                price: "$129",
                description: "Jeans de mezclilla resistente con corte moderno y cómodo. Versátiles para cualquier ocasión casual.",
                image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=250&fit=crop",
                specs: "• Material: Denim 98%, Elastano 2%<br>• Corte: Slim fit<br>• Lavado: Stone wash<br>• 5 bolsillos"
            },
            casual3: {
                title: "Sudadera Casual",
                price: "$89",
                description: "Sudadera con capucha, perfecta para días frescos y relajados. Interior afelpado para mayor calidez.",
                image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=250&fit=crop",
                specs: "• Material: Algodón 80%, Poliéster 20%<br>• Capucha ajustable<br>• Bolsillo canguro<br>• Interior afelpado"
            },
            formal1: {
                title: "Traje Ejecutivo",
                price: "$599",
                description: "Traje completo de corte italiano, ideal para ejecutivos. Incluye saco y pantalón con acabados de lujo.",
                image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=250&fit=crop",
                specs: "• Material: Lana Super 120s<br>• Corte: Italiano<br>• Incluye: Saco y pantalón<br>• Forro: Seda"
            },
            formal2: {
                title: "Corbata de Seda",
                price: "$89",
                description: "Corbata elegante de seda italiana con diseño sofisticado. Perfecta para completar tu look formal.",
                image: "https://corbatasygemelos.es/1768-medium_default/corbatas-seda-azul-marino-rayas.jpg",
                specs: "• Material: Seda 100%<br>• Origen: Italia<br>• Ancho: 8cm<br>• Largo: 150cm"
            },
            formal3: {
                title: "Zapatos Oxford",
                price: "$289",
                description: "Zapatos Oxford de cuero genuino, perfectos para ocasiones formales. Suela de cuero y acabado premium.",
                image: "https://www.corbataslester.com/magazine/wp-content/uploads/2018/01/oxford.jpg",
                specs: "• Material: Cuero genuino<br>• Suela: Cuero<br>• Color: Negro<br>• Tallas: 38-45"
            }
        };

        function openModal(productId) {
            const product = products[productId];
            if (product) {
                document.getElementById('modalTitle').textContent = product.title;
                document.getElementById('modalPrice').textContent = product.price;
                document.getElementById('modalDescription').textContent = product.description;
                document.getElementById('modalImage').style.backgroundImage = `url('${product.image}')`;
                document.getElementById('modalSpecs').innerHTML = product.specs;
                document.getElementById('productModal').style.display = 'block';
            }
        }

        function closeModal() {
            document.getElementById('productModal').style.display = 'none';
        }

        // Cerrar modal al hacer clic fuera de él
        window.onclick = function(event) {
            const modal = document.getElementById('productModal');
            if (event.target === modal) {
                closeModal();
            }
        }

        // Cerrar modal con Escape
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                closeModal();
            }
        });