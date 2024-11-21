function validateLogin() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    if (!email || !validateEmail(email)) {
        alert('Por favor, insira um e-mail válido.');
        return false;
    }

    if (!password) {
        alert('Por favor, insira sua senha.');
        return false;
    }

    // Se todos os campos estiverem válidos, envie o formulário
    alert('Login bem-sucedido!');
    return true;
}

function validateRegister() {
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const phone = document.getElementById('register-phone').value;
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;

    if (!name) {
        alert('Por favor, insira seu nome completo.');
        return false;
    }

    if (!email || !validateEmail(email)) {
        alert('Por favor, insira um e-mail válido.');
        return false;
    }

    if (!phone || !validatePhone(phone)) {
        alert('Por favor, insira um telefone válido.');
        return false;
    }

    if (!username) {
        alert('Por favor, insira um nome de usuário.');
        return false;
    }

    if (!password) {
        alert('Por favor, insira sua senha.');
        return false;
    }

    if (password !== confirmPassword) {
        alert('As senhas não coincidem.');
        return false;
    }

    // Se todos os campos estiverem válidos, envie os dados para o backend
    const userData = {
        nome: name,
        email: email,
        telefone: phone,
        username: username,
        password: password
    };

    fetch('http://127.0.0.1:5000/cadastro', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data.error) {
            alert(data.error);
        } else {
            alert('Cadastro bem-sucedido!');
            window.location.href = 'login.html';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Erro ao cadastrar. Tente novamente mais tarde.');
    });
}

function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function validatePhone(phone) {
    const re = /^\(\d{2}\) \d{4,5}-\d{4}$/;
    return re.test(phone);
}

document.getElementById('register-phone').addEventListener('input', function (e) {
    e.target.value = phoneMask(e.target.value);
});

function phoneMask(value) {
    if (!value) return '';
    value = value.replace(/\D/g, '');
    value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
    value = value.replace(/(\d)(\d{4})$/, '$1-$2');
    return value;
}