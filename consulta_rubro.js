// consulta_rubro.js
document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'https://script.google.com/macros/s/AKfycbz-FKxFVCy7jtCr5YfdCCkeHSgydBPf_oRs8MvwxHEJgKNUhIBLlnySj8xmjLAzHUy3/exec';
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
        const searchArea = busquedaArea.value;
        const searchRubro = busquedaRubro.value;
        const filtered = allData.filter(item =>
            (searchArea === '' || item.area === searchArea) &&
            (searchRubro === '' || item.nombre === searchRubro)
        );
        displayData(filtered);
    }

    async function initialize() {
        allData = await fetchRubros();
        populateSelects();
        displayData(allData);
    }

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