document.addEventListener('DOMContentLoaded', () => {
    // REEMPLAZA ESTA URL CON LA QUE TE DIO TU ÚLTIMO DESPLIEGUE
    const API_URL = 'https://script.google.com/macros/s/AKfycbyEuqHKSFwIYczCLEIsleWYIEmPUabOECGSMQiQCnl2TAZT7ROqCepbXtxq2KRXiaLp/exec';

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
                headers: { 'Content-Type': 'application/json' }
            });
            const result = await response.json();
            if (result.status === 'success') {
                return result.data;
            } else {
                console.error('Error al obtener rubros:', result.message);
                alert('Error al cargar la lista de rubros: ' + result.message);
                return [];
            }
        } catch (error) {
            console.error('Detalles del error en fetchRubros:', error);
            alert('Error de red o CORS. Asegúrate de que la URL de la API es correcta y que la implementación de Google Apps Script tiene los permisos de acceso configurados para "Cualquier persona".');
            return [];
        }
    }

    rubroSelect.addEventListener('change', () => {
        const selectedRubro = rubroSelect.value;
        const selectedData = allData.find(item => item.nombre === selectedRubro);
        if (selectedData) {
            areaDisplay.value = selectedData.area;
            significadoDisplay.value = selectedData.significado;
        } else {
            areaDisplay.value = '';
            significadoDisplay.value = '';
        }
    });

    eliminarBtn.addEventListener('click', async () => {
        const selectedRubro = rubroSelect.value;
        if (!selectedRubro) {
            alert('Por favor, selecciona un rubro contable para eliminar.');
            return;
        }

        try {
            const usageCheckResponse = await fetch(API_URL, {
                method: 'POST',
                body: JSON.stringify({ action: 'checkUsage', nombre: selectedRubro }),
                headers: { 'Content-Type': 'application/json' }
            });
            const usageCheckResult = await usageCheckResponse.json();

            if (usageCheckResult.canDelete) {
                const confirmacion = confirm(`¿Estás seguro de que quieres eliminar el rubro: ${selectedRubro}?`);
                if (confirmacion) {
                    const response = await fetch(API_URL, {
                        method: 'POST',
                        body: JSON.stringify({ action: 'delete', nombre: selectedRubro }),
                        headers: { 'Content-Type': 'application/json' }
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
                }
            } else {
                alert('No se puede eliminar este rubro porque está en uso en los registros de la empresa.');
            }
        } catch (error) {
            console.error('Detalles del error en eliminarBtn:', error);
            alert('Error al eliminar: ' + error.message);
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

    function populateSelect() {
        rubroSelect.innerHTML = '';
        if (allData.length === 0) {
            const option = document.createElement('option');
            option.textContent = 'No hay rubros contables disponibles';
            rubroSelect.appendChild(option);
            eliminarBtn.disabled = true;
        } else {
            allData.forEach(item => {
                const option = document.createElement('option');
                option.value = item.nombre;
                option.textContent = item.nombre;
                rubroSelect.appendChild(option);
            });
            eliminarBtn.disabled = false;
        }
        rubroSelect.dispatchEvent(new Event('change'));
    }

    async function initialize() {
        allData = await fetchRubros();
        populateSelect();
    }

    initialize();
});
