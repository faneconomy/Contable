document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'https://script.google.com/macros/s/AKfycbz-FKxFVCy7jtCr5YfdCCkeHSgydBPf_oRs8MvwxHEJgKNUhIBLlnySj8xmjLAzHUy3/exec';
    const rubroSelect = document.getElementById('rubro-select');
    const areaDisplay = document.getElementById('area-display');
    const significadoDisplay = document.getElementById('significado-display');
    const eliminarBtn = document.getElementById('eliminar-btn');
    const volverBtn = document.getElementById('volver-btn');
    const salirBtn = document.getElementById('salir-btn');
    let allData = [];

    // Verificación de elementos del DOM
    if (!rubroSelect || !areaDisplay || !significadoDisplay || !eliminarBtn || !volverBtn || !salirBtn) {
        console.error('Uno o más elementos del DOM no se encontraron:', {
            rubroSelect, areaDisplay, significadoDisplay, eliminarBtn, volverBtn, salirBtn
        });
        alert('Error: Algunos elementos de la página no se cargaron correctamente. Revisa la consola para más detalles.');
        return;
    }

    async function fetchRubros() {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                body: JSON.stringify({ action: 'fetchAll' }),
                headers: { 'Content-Type': 'text/plain;charset=utf-8' }
            });
            const result = await response.json();
            if (result.status === 'success') {
                return result.data;
            } else {
                alert('Error al obtener los datos: ' + result.message);
                return [];
            }
        } catch (error) {
            alert('Ocurrió un error al consultar la API: ' + error.message);
            return [];
        }
    }

    function populateSelect() {
        rubroSelect.innerHTML = ''; // Limpiar opciones existentes
        const uniqueRubros = [...new Set(allData.map(item => item.nombre))].sort();
        if (uniqueRubros.length > 0) {
            uniqueRubros.forEach(rubro => {
                const option = document.createElement('option');
                option.value = rubro;
                option.textContent = rubro;
                rubroSelect.appendChild(option);
            });
        } else {
            const option = document.createElement('option');
            option.value = '';
            option.textContent = 'No hay rubros disponibles';
            rubroSelect.appendChild(option);
        }
    }

    async function checkUsage(nombre) {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                body: JSON.stringify({ action: 'checkUsage', nombre }),
                headers: { 'Content-Type': 'text/plain;charset=utf-8' }
            });
            const result = await response.json();
            return result.canDelete || false; // Default a false si no hay respuesta
        } catch (error) {
            alert('Error al verificar uso: ' + error.message);
            return false;
        }
    }

    rubroSelect.addEventListener('change', () => {
        const selectedRubro = rubroSelect.value;
        const rubroData = allData.find(item => item.nombre === selectedRubro);
        if (rubroData) {
            areaDisplay.value = rubroData.area || '';
            significadoDisplay.value = rubroData.significado || '';
        } else {
            areaDisplay.value = '';
            significadoDisplay.value = '';
        }
    });

    eliminarBtn.addEventListener('click', async () => {
        const selectedRubro = rubroSelect.value;
        if (!selectedRubro) {
            alert('Seleccione un Rubro Contable para eliminar');
            return;
        }

        const canDelete = await checkUsage(selectedRubro);
        if (!canDelete) {
            alert('No se puede eliminar el rubro porque está en uso en otros registros');
            return;
        }

        const confirmacion = confirm(`¿Desea eliminar el rubro contable "${selectedRubro}"?`);
        if (confirmacion) {
            try {
                const response = await fetch(API_URL, {
                    method: 'POST',
                    body: JSON.stringify({ action: 'delete', nombre: selectedRubro }),
                    headers: { 'Content-Type': 'text/plain;charset=utf-8' }
                });
                const result = await response.json();
                if (result.status === 'success') {
                    alert(result.message);
                    allData = await fetchRubros();
                    populateSelect();
                    areaDisplay.value = '';
                    significadoDisplay.value = '';
                } else {
                    alert(result.message || 'Error desconocido al eliminar');
                }
            } catch (error) {
                alert('Error al eliminar: ' + error.message);
            }
        }
    });

    volverBtn.addEventListener('click', () => {
        const pregunta = confirm("¿Desea VOLVER al Sistema Ingresar Rubro Contable?");
        if (pregunta) {
            window.location.href = 'rubroscontables.html';
        }
    });

    salirBtn.addEventListener('click', () => {
        const pregunta = confirm("¿Desea SALIR del Sistema eliminar Rubro Contable?");
        if (pregunta) {
            window.location.href = 'sic.html';
        }
    });

    async function initialize() {
        allData = await fetchRubros();
        populateSelect();
    }

    initialize();
});