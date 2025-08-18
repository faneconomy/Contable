document.addEventListener('DOMContentLoaded', () => {

    // Lógica para la función Cmd_Salir_Click()
    // Replicando la acción de preguntar si el usuario desea cerrar. [cite: 3]
    document.getElementById('salir-btn').addEventListener('click', () => {
        const pregunta = confirm("Desea CERRAR el Sistema de Información Contable");
        if (pregunta) {
            // En Visual Basic se guardaba el libro de Excel y se cerraba la aplicación. [cite: 3]
            // En el entorno web, no se puede cerrar la ventana de manera forzada.
            // Se simula el cierre o se cierra la pestaña actual del navegador.
            window.close();
        }
    });

    // Lógica para las funciones de navegación de los botones.
    // En Visual Basic, se escondía el formulario actual y se mostraba uno nuevo. [cite: 4]
    // En el entorno web, se redirige a una nueva página HTML para cada opción.
    document.getElementById('rubros-btn').addEventListener('click', () => {
        window.location.href = 'rubroscontables.html';
    });

    document.getElementById('plan-btn').addEventListener('click', () => {
        window.location.href = 'opcionplancuentas.html';
    });
    
    // Lógica para el botón del Libro Diario, que incluye una base de datos en Excel. [cite: 5, 6]
    document.getElementById('diario-btn').addEventListener('click', () => {
        // En Visual Basic, esta función contaba filas y poblaba un ComboBox. [cite: 5, 6]
        // En el entorno web, esto requiere una llamada a la API de Google Sheets.
        // Aquí iría el código para:
        // 1. Autenticar con Google Sheets.
        // 2. Leer los datos de una hoja de cálculo (por ejemplo, 'Hoja1').
        // 3. Procesar los datos para llenar una lista desplegable en la página 'librodiario.html'.
        
        // window.location.href = 'librodiario.html';
    });
    
    // Se replica la lógica para los demás botones
    document.getElementById('mayor-btn').addEventListener('click', () => {
        window.location.href = 'libromayor.html';
    });

    document.getElementById('subdiario-btn').addEventListener('click', () => {
        window.location.href = 'subdiario.html';
    });

    document.getElementById('sumas-saldos-btn').addEventListener('click', () => {
        window.location.href = 'sumassaldos.html';
    });

    document.getElementById('balance-general-btn').addEventListener('click', () => {
        window.location.href = 'balancegeneral.html';
    });

    document.getElementById('ecuacion-btn').addEventListener('click', () => {
        window.location.href = 'ecuacionpatrimonial.html';
    });
    
    // Lógica para la función de cierre del formulario (UserForm_QueryClose). [cite: 7]
   // window.addEventListener('beforeunload', (event) => {
      //  const confirmExit = confirm("Desea CERRAR el Sistema EXCEL presione CERRAR");
       // if (!confirmExit) {
            // Si el usuario presiona Cancelar, se evita que la página se cierre.
    //        event.preventDefault();
   //         event.returnValue = ''; // Esto es necesario para algunos navegadores.
        }
    });

});


