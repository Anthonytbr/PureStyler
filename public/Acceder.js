// Acceder.js - Versión actualizada para conectar con API
class AuthService {
    constructor() {
        this.baseURL = 'http://localhost:3000/api';
        this.token = localStorage.getItem('authToken');
        this.currentUser = null;
    }

    // Configurar headers para las peticiones
    getHeaders() {
        const headers = {
            'Content-Type': 'application/json',
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        return headers;
    }

    // Registro de usuario
    async register(userData) {
        try {
            const response = await fetch(`${this.baseURL}/register`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(userData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error en el registro');
            }

            // Guardar token y datos del usuario
            this.token = data.token;
            localStorage.setItem('authToken', this.token);
            this.currentUser = data.user;

            return { success: true, user: data.user, message: data.message };

        } catch (error) {
            console.error('Error en registro:', error);
            return { success: false, error: error.message };
        }
    }

    // Login de usuario
    async login(credentials) {
        try {
            const response = await fetch(`${this.baseURL}/login`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(credentials)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error en el login');
            }

            // Guardar token y datos del usuario
            this.token = data.token;
            localStorage.setItem('authToken', this.token);
            this.currentUser = data.user;

            return { success: true, user: data.user, message: data.message };

        } catch (error) {
            console.error('Error en login:', error);
            return { success: false, error: error.message };
        }
    }

    // Obtener perfil del usuario
    async getProfile() {
        try {
            const response = await fetch(`${this.baseURL}/profile`, {
                method: 'GET',
                headers: this.getHeaders()
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error obteniendo perfil');
            }

            this.currentUser = data.user;
            return { success: true, user: data.user };

        } catch (error) {
            console.error('Error obteniendo perfil:', error);
            return { success: false, error: error.message };
        }
    }

    // Obtener lista de usuarios
    async getUsers() {
        try {
            const response = await fetch(`${this.baseURL}/users`, {
                method: 'GET',
                headers: this.getHeaders()
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error obteniendo usuarios');
            }

            return { success: true, users: data.users };

        } catch (error) {
            console.error('Error obteniendo usuarios:', error);
            return { success: false, error: error.message };
        }
    }

    // Logout
    async logout() {
        try {
            if (this.token) {
                await fetch(`${this.baseURL}/logout`, {
                    method: 'POST',
                    headers: this.getHeaders()
                });
            }

            // Limpiar datos locales
            this.token = null;
            this.currentUser = null;
            localStorage.removeItem('authToken');

            return { success: true, message: 'Sesión cerrada correctamente' };

        } catch (error) {
            console.error('Error en logout:', error);
            // Aún así limpiar datos locales
            this.token = null;
            this.currentUser = null;
            localStorage.removeItem('authToken');

            return { success: true, message: 'Sesión cerrada correctamente' };
        }
    }

    // Verificar si el usuario está autenticado
    isAuthenticated() {
        return !!this.token;
    }
}

// Instancia del servicio de autenticación
const authService = new AuthService();

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
async function showDashboard(user) {
    document.getElementById('userName').textContent = user.name;
    document.getElementById('userEmail').textContent = user.email;
    document.getElementById('lastLogin').textContent = user.last_login ?
        new Date(user.last_login).toLocaleString() : 'Primer acceso';

    // Cargar y mostrar lista de usuarios
    const result = await authService.getUsers();
    if (result.success) {
        const usersList = document.getElementById('usersList');
        usersList.innerHTML = result.users.map(u => `
            <div class="user-item">
                <strong>${u.name}</strong> - ${u.email}<br>
                <small>Último acceso: ${u.last_login ? new Date(u.last_login).toLocaleString() : 'Nunca'}</small>
            </div>
        `).join('');
    }

    authForm.style.display = 'none';
    dashboard.style.display = 'block';
}

// Función para mostrar el formulario de auth
function showAuthForm() {
    authForm.style.display = 'block';
    dashboard.style.display = 'none';
}

// Función para deshabilitar/habilitar el formulario
function toggleFormDisabled(disabled) {
    const inputs = loginForm.querySelectorAll('input');
    inputs.forEach(input => input.disabled = disabled);
    submitBtn.disabled = disabled;
    submitBtn.textContent = disabled ? 'Procesando...' : (isLoginMode ? 'Iniciar Sesión' : 'Registrarse');
}

// Event listeners
toggleLink.addEventListener('click', (e) => {
    e.preventDefault();
    toggleMode();
});

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const name = document.getElementById('name').value.trim();

    if (!email || !password) {
        showMessage('Por favor, completa todos los campos obligatorios.');
        return;
    }

    // Deshabilitar formulario durante la petición
    toggleFormDisabled(true);

    try {
        let result;

        if (isLoginMode) {
            // Proceso de login
            result = await authService.login({ email, password });
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

            result = await authService.register({ name, email, password });
        }

        if (result.success) {
            showMessage(result.message, 'success');
            setTimeout(() => {
                showDashboard(result.user);
            }, 1000);
        } else {
            showMessage(result.error);
        }

    } catch (error) {
        console.error('Error:', error);
        showMessage('Error de conexión. Verifica que el servidor esté ejecutándose.');
    } finally {
        toggleFormDisabled(false);
    }
});

logoutBtn.addEventListener('click', async () => {
    const result = await authService.logout();
    showMessage(result.message, 'success');
    setTimeout(() => {
        showAuthForm();
        loginForm.reset();
        messageDiv.innerHTML = '';
    }, 1000);
});

// Verificar si el usuario ya está autenticado al cargar la página
document.addEventListener('DOMContentLoaded', async () => {
    if (authService.isAuthenticated()) {
        const result = await authService.getProfile();
        if (result.success) {
            showDashboard(result.user);
        } else {
            // Token inválido, limpiar datos
            authService.logout();
        }
    }
});

// Inicialización
console.log('Sistema de login con base de datos inicializado');
console.log('Servidor backend requerido en http://localhost:3000');