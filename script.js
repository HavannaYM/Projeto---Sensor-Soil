// Global function for password toggle
function togglePassword(inputId, eyeId) {
    const passwordInput = document.getElementById(inputId);
    const eyeIcon = document.getElementById(eyeId);
    
    if (!passwordInput || !eyeIcon) return;

    const isPassword = passwordInput.type === 'password';
    passwordInput.type = isPassword ? 'text' : 'password';

    // Update eye icon SVG
    if (isPassword) {
        eyeIcon.innerHTML = `
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
            <line x1="1" y1="1" x2="23" y2="23"></line>
        `;
        eyeIcon.style.stroke = "#2E7D32";
    } else {
        eyeIcon.innerHTML = `
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
        `;
        eyeIcon.style.stroke = "#1f3d2b";
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Cadastro Form Logic
    const cadastroForm = document.getElementById('cadastroForm');
    if (cadastroForm) {
        cadastroForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nome = document.getElementById('nome').value.trim();
            const email = document.getElementById('email').value.trim();
            const fazenda = document.getElementById('fazenda').value.trim();
            const senha = document.getElementById('senha').value;
            const confirmarSenha = document.getElementById('confirmarSenha').value;
            const termos = document.getElementById('termos').checked;

            // Basic Validation
            if (!nome || !email || !fazenda || !senha || !confirmarSenha) {
                alert('Por favor, preencha todos os campos.');
                return;
            }

            if (senha.length < 6) {
                alert('A senha deve ter pelo menos 6 caracteres.');
                return;
            }

            if (senha !== confirmarSenha) {
                alert('As senhas não coincidem.');
                return;
            }

            if (!termos) {
                alert('Você deve aceitar os termos de uso.');
                return;
            }

            // Save to localStorage
            const user = { nome, email, fazenda, senha };
            localStorage.setItem('sensor_soil_user', JSON.stringify(user));

            const btn = cadastroForm.querySelector('.btn-submit');
            btn.textContent = 'FINALIZANDO...';
            btn.disabled = true;

            setTimeout(() => {
                alert('Cadastro realizado com sucesso! Redirecionando para login...');
                window.location.href = 'login.html';
            }, 1500);
        });
    }

    // Login Form Logic
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const emailInput = document.getElementById('loginEmail').value.trim();
            const senhaInput = document.getElementById('loginSenha').value;

            const storedUser = JSON.parse(localStorage.getItem('sensor_soil_user'));

            if (!storedUser || storedUser.email !== emailInput || storedUser.senha !== senhaInput) {
                alert('E-mail ou senha inválidos.');
                return;
            }

            const btn = loginForm.querySelector('.btn-submit');
            btn.textContent = 'ACESSANDO...';
            btn.disabled = true;

            setTimeout(() => {
                alert(`Bem-vindo, ${storedUser.nome}! Login realizado com sucesso.`);
                window.location.href = 'dashboard.html';
            }, 1500);
        });
    }
});
