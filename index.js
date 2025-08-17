document.addEventListener('DOMContentLoaded', () => {
    // Lógica para el saludo
    const greetingElement = document.getElementById('greeting');
    const dateElement = document.getElementById('date');
    const user = "Prof.Gerardo Oscar Urbina";

    const now = new Date();
    const hours = now.getHours();

    if (hours >= 0 && hours < 6) {
        greetingElement.textContent = `Buenas noches ${user}`;
    } else if (hours >= 6 && hours < 12) {
        greetingElement.textContent = `Buenos días ${user}`;
    } else if (hours >= 12 && hours < 19) {
        greetingElement.textContent = `Buenas tardes ${user}`;
    } else {
        greetingElement.textContent = `Buenas noches ${user}`;
    }

    dateElement.textContent = now.toLocaleDateString();

    // Lógica para el botón "Ingresar Sistema Contable"
    document.getElementById('ingresar-btn').addEventListener('click', () => {
        window.location.href = 'sic.html';
    });
    
    // Lógica para el botón "Cerrar Sistema Contable"
    document.getElementById('cerrar-btn').addEventListener('click', () => {
        if (confirm("¿Desea CERRAR el Sistema Contable?")) {
            // Esta función está restringida por seguridad en la mayoría de los navegadores modernos.
            window.close();
        }
    });
});