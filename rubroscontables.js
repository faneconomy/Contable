document.addEventListener('DOMContentLoaded', () => {
    // Referencias a los elementos del DOM
    const areaContableSelect = document.getElementById('area-contable');
    const nombreRubroInput = document.getElementById('nombre-rubro');
    const significadoRubroInput = document.getElementById('significado-rubro');
    const guardarBtn = document.getElementById('guardar-btn');
    const limpiarBtn = document.getElementById('limpiar-btn');
    const salirBtn = document.getElementById('salir-btn');
    
    // **¡Importante! Reemplaza este valor con la URL de tu API de Apps Script**
    const API_URL = 'https://script.google.com/macros/s/AKfycbz-FKxFVCy7jtCr5YfdCCkeHSgydBPf_oRs8MvwxHEJgKNUhIBLlnySj8xmjLAzHUy3/exec'; 

    // Inicializar el formulario con la lista desplegable del área contable
    function initializeForm() {
        const areas = ["Activo", "Pasivo", "PN Resultado R+", "PN Resultado R-", "PN Capital", "Activo R.A."];
        areas.forEach(area => {
            const option = document.createElement('option');
            option.value = area;
            option.textContent = area;
            areaContableSelect.appendChild(option);
        });
        areaContableSelect.focus();
    }

    // Lógica del botón "Limpiar Información"
    limpiarBtn.addEventListener('click', () => {
        if (nombreRubroInput.value.trim() === "" && areaContableSelect.value.trim() === "" && significadoRubroInput.value.trim() === "") {
            alert("Debes ingresar datos para poder limpiarlos."); 
        } else {
            const confirmacion = confirm("¿Quieres borrar los datos?");
            if (confirmacion) {
                nombreRubroInput.value = "";
                areaContableSelect.value = "";
                significadoRubroInput.value = "";
                areaContableSelect.focus();
            }
        }
    });

    // Lógica del botón "Guardar Rubro Contable" actualizada para usar la API
    guardarBtn.addEventListener('click', async () => {
        const nombre = nombreRubroInput.value.trim();
        const area = areaContableSelect.value;
        const significado = significadoRubroInput.value.trim();

        if (nombre === "" || significado === "") {
            alert("Debes ingresar los datos solicitados.");
            areaContableSelect.focus();
            return;
        }

        const datosRubro = {
            area: area,
            nombre: nombre,
            significado: significado
        };

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                body: JSON.stringify(datosRubro),
                headers: {
                    'Content-Type': 'text/plain;charset=utf-8'  // Cambiado para evitar preflight 'application/json'
                }
            });
            const result = await response.json();

            if (result.status === 'success') {
                alert(result.message);
                nombreRubroInput.value = "";
                areaContableSelect.value = "";
                significadoRubroInput.value = "";
                areaContableSelect.focus();
            } else {
                alert(result.message);
                areaContableSelect.focus();
            }
        } catch (error) {
            alert("Ocurrió un error al guardar el rubro: " + error.message);
        }
    });
      // Lógica del botón "Consultar Rubro Contable"
    const consultarBtn = document.getElementById('consultar-btn');
consultarBtn.addEventListener('click', () => {
    window.location.href = 'consulta_rubro.html';
});
    // Lógica del botón "Salir"
    salirBtn.addEventListener('click', () => {
        const nombre = nombreRubroInput.value.trim();
        const area = areaContableSelect.value;
        const significado = significadoRubroInput.value.trim();
        if (nombre === "" && area === "" && significado === "") {
            const pregunta = confirm("¿Quieres salir del Sistema Rubro Contable?");
            if (pregunta) {
                window.location.href = 'sic.html';
            } else {
                areaContableSelect.focus();
            }
        } else {
            const respuesta = confirm("Se eliminarán los datos ingresados. ¿QUIERES SALIR DE TODAS FORMAS?");
            if (respuesta) {
                nombreRubroInput.value = "";
                areaContableSelect.value = "";
                significadoRubroInput.value = "";
                window.location.href = 'sic.html';
            } else {
                areaContableSelect.focus();
            }
        }
    });

    initializeForm();
});





