// consulta_rubro.js
document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'https://script.google.com/macros/s/AKfycbyEuqHKSFwIYczCLEIsleWYIEmPUabOECGSMQiQCnl2TAZT7ROqCepbXtxq2KRXiaLp/exec';
    const areasFijas = ["Activo", "Pasivo", "PN Capital", "PN Resultado R+", "PN Resultado R-"];
    let allData = [];

    const busquedaArea = document.getElementById('busqueda-area');
    const busquedaRubro = document.getElementById('busqueda-rubro');
    const consultarBtn = document.getElementById('consultar-btn');
    const limpiarBtn = document.getElementById('limpiar-btn');
    const volverBtn = document.getElementById('volver-btn');
    const salirBtn = document.getElementById('salir-btn');
    const tbody = document.querySelector('#tabla-rubros tbody');

    async function fetchRubros() {
        try {
            const response = await fetch(API_URL);  // Usa GET sin cuerpo
            const result = await response.json();
            // Maneja si es un arreglo directo o un objeto con estado
            if (Array.isArray(result)) {
                return result;
            } else if (result.status === 'success') {
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

    function populateSelects() {
        // Áreas fijas
        areasFijas.forEach(area => {
            const option = document.createElement('option');
            option.value = area;
            option.textContent = area;
            busquedaArea.appendChild(option);
        });

        // Rubros únicos de los datos
        const uniqueRubros = [...new Set(allData.map(item => item.nombre))].sort();
        uniqueRubros.forEach(rubro => {
            const option = document.createElement('option');
            option.value = rubro;
            option.textContent = rubro;
            busquedaRubro.appendChild(option);
        });
    }

    function displayData(data) {
        tbody.innerHTML = '';
        data.sort((a, b) => a.area.localeCompare(b.area));
        data.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${item.area}</td>
                <td>${item.nombre}</td>
                <td>${item.significado}</td>
            `;
            tbody.appendChild(tr);
        });
    }

    function filterData() {
        const searchArea = busquedaArea.value.toLowerCase();
        const searchRubro = busquedaRubro.value.toLowerCase();
        const filtered = allData.filter(item =>
            (searchArea === '' || item.area.toLowerCase().includes(searchArea)) &&
            (searchRubro === '' || item.nombre.toLowerCase().includes(searchRubro))
        );
        displayData(filtered);
    }

    async function initialize() {
        allData = await fetchRubros();
        console.log('Datos obtenidos:', allData);  // Depuración
        populateSelects();
        displayData(allData);
    }

    // Eventos de cambio para búsquedas dinámicas
    busquedaArea.addEventListener('change', filterData);
    busquedaRubro.addEventListener('change', filterData);

    consultarBtn.addEventListener('click', () => {
        if (busquedaRubro.value === '' && busquedaArea.value === '') {
            alert('Seleccione un Rubro Contable o Área Contable que quiera consultar');
        } else {
            filterData();
        }
    });

    limpiarBtn.addEventListener('click', () => {
        busquedaArea.value = '';
        busquedaRubro.value = '';
        displayData(allData);
    });

    volverBtn.addEventListener('click', () => {
        const pregunta = confirm("Desea VOLVER al Sistema Ingresar Rubro Contable");
        if (pregunta) {
            window.location.href = 'rubroscontables.html';
        } else {
            busquedaRubro.focus();
        }
    });

    salirBtn.addEventListener('click', () => {
        const pregunta = confirm("Desea SALIR del Sistema consulta Rubro Contable");
        if (pregunta) {
            window.location.href = 'sic.html'; // Ajusta según la página principal
        } else {
            busquedaRubro.focus();
        }
    });

    initialize();
});


