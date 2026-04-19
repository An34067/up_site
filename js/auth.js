function getUser() {
    return JSON.parse(localStorage.getItem('user'));
}
function saveUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
}
function isLoggedIn() {
    return getUser() !== null;
}
function logout() {
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}
function initNav() {
    const userMenu = document.querySelector('.user-menu');
    if (!userMenu) return;

    const avatar = userMenu.querySelector('.avatar');
    if (!avatar) return;

    if (isLoggedIn()) {
        const user = getUser();
        avatar.innerHTML = user.avatar;
        avatar.href = 'profile.html';
        avatar.title = user.firstname + ' ' + user.lastname;
    } else {
        avatar.innerHTML = '<i class="fas fa-user"></i>';
        avatar.href = 'login.html';
        avatar.title = 'Sign In';
    }
}
function initLogin() {
    const btn = document.querySelector('.btn-signin');
    if (!btn) return;

    btn.onclick = function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        const user = getUser();
        
        if (user && user.email === email && user.password === password) {
            window.location.href = 'profile.html';
        } else {
            alert('Аккаунт не найден. Нужно зарегистрироваться.');
        }
    };
}
function initSignin() {
    const btn = document.querySelector('.btn-signup');
    if (!btn) return;

    btn.onclick = function(e) {
        e.preventDefault();
        
        const firstname = document.getElementById('firstname').value;
        const lastname = document.getElementById('lastname').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirm = document.getElementById('confirm-password').value;
        
        if (!firstname || !lastname || !email || !password) {
            alert('Заполните все поля');
            return;
        }
        
        if (password !== confirm) {
            alert('Пароли не совпадают');
            return;
        }
        
        const user = {
            firstname: firstname,
            lastname: lastname,
            email: email,
            password: password,
            avatar: (firstname[0] + lastname[0]).toUpperCase()
        };
        
        saveUser(user);
        alert('Регистрация успешна!');
        window.location.href = 'profile.html';
    };
}
function initProfile() {
    if (!isLoggedIn()) {
        window.location.href = 'login.html';
        return;
    }

    const user = getUser();

    const nameEl = document.querySelector('.user h2');
    if (nameEl) nameEl.textContent = user.firstname + ' ' + user.lastname;

    const emailEl = document.querySelector('.user span');
    if (emailEl) emailEl.textContent = user.email;

    const avatarEl = document.querySelector('.user-avatar');
    if (avatarEl) avatarEl.textContent = user.avatar;

    const logoutBtn = document.querySelector('.logout');
    if (logoutBtn) {
        logoutBtn.onclick = logout;
        logoutBtn.style.cursor = 'pointer';
    }
}
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runAuth);
} else {
    runAuth();
}
function runAuth() {
    const page = window.location.pathname;
    
    if (page.includes('login')) {
        initLogin();
    } else if (page.includes('signin')) {
        initSignin();
    } else if (page.includes('profile')) {
        initProfile();
    }
    setTimeout(initNav, 200);
}