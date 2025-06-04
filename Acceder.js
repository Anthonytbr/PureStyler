 // Simulación de base de datos en memoria
        class Database {
            constructor() {
                this.users = [
                    {
                        id: 1,
                        name: "Usuario Demo",
                        email: "demo@ejemplo.com",
                        password: "123456",
                        lastLogin: new Date().toISOString()
                    }
                ];
                this.currentUser = null;
            }
            
            findUserByEmail(email) {
                return this.users.find(user => user.email === email);
            }
            
            addUser(userData) {
                const newUser = {
                    id: this.users.length + 1,
                    ...userData,
                    lastLogin: new Date().toISOString()
                };
                this.users.push(newUser);
                return newUser;
            }
            
            authenticateUser(email, password) {
                const user = this.findUserByEmail(email);
                if (user && user.password === password) {
                    user.lastLogin = new Date().toISOString();
                    this.currentUser = user;
                    return user;
                }
                return null;
            }
            
            logout() {
                this.currentUser = null;
            }
            
            getAllUsers() {
                return this.users.map(user => ({
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    lastLogin: user.lastLogin
                }));
            }
        }
        
        // Instancia de la base de datos
        const db = new Database();
        
        // Elementos del DOM
        const authForm = document.getElementById('authForm');
        const dashboard = document.getElementById('dashboard');
        const loginForm = document.getElementById('loginForm');
        const formTitle = document.getElementById('formTitle');
        const submitBtn = document.getElementById('submitBtn');
        const toggleLink = document.getElementById('toggleLink');
        const toggleText = document.getElementById('toggleText');
        const nameGroup = document.getElementById('nameGroup');
        const messageDiv = document.getElementById('message');
        const logoutBtn = document.getElementById('logoutBtn');
        
        // Variables de estado
        let isLoginMode = true;
        
        // Función para mostrar mensajes
        function showMessage(text, type = 'error') {
            messageDiv.innerHTML = `<div class="message ${type}">${text}</div>`;
            setTimeout(() => {
                messageDiv.innerHTML = '';
            }, 5000);
        }
        
        // Función para alternar entre login y registro
        function toggleMode() {
            isLoginMode = !isLoginMode;
            
            if (isLoginMode) {
                formTitle.textContent = 'Iniciar Sesión';
                submitBtn.textContent = 'Iniciar Sesión';
                toggleText.textContent = '¿No tienes cuenta?';
                toggleLink.textContent = 'Regístrate aquí';
                nameGroup.style.display = 'none';
                document.getElementById('name').required = false;
            } else {
                formTitle.textContent = 'Crear Cuenta';
                submitBtn.textContent = 'Registrarse';
                toggleText.textContent = '¿Ya tienes cuenta?';
                toggleLink.textContent = 'Inicia sesión aquí';
                nameGroup.style.display = 'block';
                document.getElementById('name').required = true;
            }
            
            messageDiv.innerHTML = '';
        }
        
        // Función para mostrar el dashboard
        function showDashboard(user) {
            document.getElementById('userName').textContent = user.name;
            document.getElementById('userEmail').textContent = user.email;
            document.getElementById('lastLogin').textContent = new Date(user.lastLogin).toLocaleString();
            
            // Mostrar lista de usuarios
            const usersList = document.getElementById('usersList');
            const allUsers = db.getAllUsers();
            usersList.innerHTML = allUsers.map(u => `
                <div class="user-item">
                    <strong>${u.name}</strong> - ${u.email}<br>
                    <small>Último acceso: ${new Date(u.lastLogin).toLocaleString()}</small>
                </div>
            `).join('');
            
            authForm.style.display = 'none';
            dashboard.style.display = 'block';
        }
        
        // Función para mostrar el formulario de auth
        function showAuthForm() {
            authForm.style.display = 'block';
            dashboard.style.display = 'none';
        }
        
        // Event listeners
        toggleLink.addEventListener('click', (e) => {
            e.preventDefault();
            toggleMode();
        });
        
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const name = document.getElementById('name').value.trim();
            
            if (!email || !password) {
                showMessage('Por favor, completa todos los campos obligatorios.');
                return;
            }
            
            if (isLoginMode) {
                // Proceso de login
                const user = db.authenticateUser(email, password);
                if (user) {
                    showMessage('¡Inicio de sesión exitoso!', 'success');
                    setTimeout(() => {
                        showDashboard(user);
                    }, 1000);
                } else {
                    showMessage('Email o contraseña incorrectos.');
                }
            } else {
                // Proceso de registro
                if (!name) {
                    showMessage('Por favor, ingresa tu nombre completo.');
                    return;
                }
                
                if (password.length < 6) {
                    showMessage('La contraseña debe tener al menos 6 caracteres.');
                    return;
                }
                
                if (db.findUserByEmail(email)) {
                    showMessage('Ya existe una cuenta con este email.');
                    return;
                }
                
                const newUser = db.addUser({ name, email, password });
                showMessage('¡Cuenta creada exitosamente!', 'success');
                
                setTimeout(() => {
                    db.currentUser = newUser;
                    showDashboard(newUser);
                }, 1000);
            }
        });
        
        logoutBtn.addEventListener('click', () => {
            db.logout();
            showMessage('Sesión cerrada correctamente.', 'success');
            setTimeout(() => {
                showAuthForm();
                loginForm.reset();
                messageDiv.innerHTML = '';
            }, 1000);
        });
        
        // Inicialización
        console.log('Sistema de login inicializado');
        console.log('Usuario demo: demo@ejemplo.com / 123456');