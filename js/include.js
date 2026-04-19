async function loadComponents() {
    try {
        document.getElementById('navigation').innerHTML = await (await fetch('navigation.html')).text();
        document.getElementById('footer').innerHTML = await (await fetch('footer.html')).text();
        setTimeout(setActiveNavLink, 50);
    } catch (e) {
        console.error('Error:', e);
    }
}

function setActiveNavLink() {
    const current = location.pathname.split('/').pop() || 'home.html';
    document.querySelectorAll('.nav-links a').forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === current);
    });
}

document.addEventListener('DOMContentLoaded', loadComponents);
