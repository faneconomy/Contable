document.addEventListener('DOMContentLoaded', () => {
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
        console.error('Uno o más elementos del DOM no se encontraron a las 07:01 PM -03 del 31/08/2025:', {
            rubroSelect, areaDisplay, significadoDisplay, eliminarBtn, volverBtn, salirBtn
        });
        alert('Error: Algunos elementos de la página no se cargaron correctamente. Revisa la consola.');
        return;
    }

    async function fetchRubros() {
        console.log('Iniciando fetchRubros a las 07:01 PM -03 del 31/08/2025...');
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos de tiempo de espera

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                body: JSON.stringify({ action: 'fetchAll' }),
                headers: { 'Content-Type': 'application/json' },
                mode: 'cors',
                credentials: 'omit',
                signal: controller.signal
            });
            console.log('Respuesta recibida:', response);
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error HTTP: ${response.status} - ${errorText}`);
            }
            const result = await response.json();
            console.log('Datos recibidos:', result);
            if (result.status === 'success') {
                return result.data;
            } else {
                alert('Error al obtener los datos: ' + result.message);
                return [];
            }
        } catch (error) {
            console.error('Detalles del error en fetchRubros:', error);
            if (error.name === 'AbortError') {
                alert('La solicitud a la API tardó demasiado y fue cancelada.');
            } else {
                alert('Ocurrió un error al consultar la API: ' + error.message);
            }
            return [];
        } finally {
            clearTimeout(timeoutId); // Limpiar el temporizador
        }
    }

    function populateSelect() {
        console.log('Poblando select con datos:', allData);
        rubroSelect.innerHTML = '';
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
        console.log('Iniciando checkUsage para:', nombre);
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                body: JSON.stringify({ action: 'checkUsage', nombre }),
                headers: { 'Content-Type': 'application/json' },
                mode: 'cors',
                credentials: 'omit',
                signal: controller.signal
            });
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status} - ${await response.text()}`);
            }
            const result = await response.json();
            console.log('Resultado de checkUsage:', result);
            return result.canDelete || false;
        } catch (error) {
            console.error('Detalles del error en checkUsage:', error);
            if (error.name === 'AbortError') {
                alert('La verificación de uso tardó demasiado y fue cancelada.');
            } else {
                alert('Error al verificar uso: ' + error.message);
            }
            return false;
        } finally {
            clearTimeout(timeoutId);
        }
    }

    rubroSelect.addEventListener('change', () => {
        console.log('Cambio en rubroSelect:', rubroSelect.value);
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
        console.log('Click en eliminarBtn:', rubroSelect.value);
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
                    headers: { 'Content-Type': 'application/json' },
                    mode: 'cors',
                    credentials: 'omit'
                });
                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status} - ${await response.text()}`);
                }
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
                console.error('Detalles del error en eliminarBtn:', error);
                alert('Error al eliminar: ' + error.message);
            }
        }
    });

    volverBtn.addEventListener('click', () => {
        console.log('Click en volverBtn a las 07:01 PM -03 del 31/08/2025');
        const pregunta = confirm("¿Desea VOLVER al Sistema Ingresar Rubro Contable?");
        if (pregunta) {
            window.location.href = 'rubroscontables.html';
        }
    });

    salirBtn.addEventListener('click', () => {
        console.log('Click en salirBtn a las 07:01 PM -03 del 31/08/2025');
        const pregunta = confirm("¿Desea SALIR del Sistema eliminar Rubro Contable?");
        if (pregunta) {
            window.location.href = 'sic.html';
        }
    });

    async function initialize() {
        console.log('Iniciando inicialización a las 07:01 PM -03 del 31/08/2025...');
        allData = await fetchRubros();
        populateSelect();
    }

    initialize();
});

