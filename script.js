// 1. BASE DE DATOS DE JUGADORES (Actualizada con tus rutas de imágenes)
const catalogoJugadores = [
    { id: 1, nombre: "Luis Díaz", equipo: "Colombia", rareza: "oro", foto: "🇨🇴", esImagen: false },
    { id: 2, nombre: "Lionel Messi", equipo: "Argentina", rareza: "oro", foto: "🇦🇷", esImagen: false },
    { id: 3, nombre: "Richard Ríos", equipo: "Colombia", rareza: "comun", foto: "🇨🇴", esImagen: false },
    { id: 4, nombre: "Fede Valverde", equipo: "Uruguay", rareza: "comun", foto: "imagenes/fede.png", esImagen: true }, // Tu foto local
    { id: 5, nombre: "Neymar Jr", equipo: "Brasil", rareza: "comun", foto: "imagenes/ney.png", esImagen: true },     // Tu foto local
    { id: 6, nombre: "Vinícius Jr", equipo: "Brasil", rareza: "oro", foto: "🇧🇷", esImagen: false },
    { id: 7, nombre: "James Rodríguez", equipo: "Colombia", rareza: "oro", foto: "🇨🇴", esImagen: false },
    { id: 8, nombre: "Darwin Núñez", equipo: "Uruguay", rareza: "comun", foto: "🇺🇾", esImagen: false },
    { id: 9, nombre: "Emiliano Martínez", equipo: "Argentina", rareza: "comun", foto: "🇦🇷", esImagen: false },
    { id: 10, nombre: "Moises Caicedo", equipo: "Ecuador", rareza: "comun", foto: "🇪🇨", esImagen: false },
    { id: 11, nombre: "Cristiano Ronaldo", equipo: "Portugal", rareza: "oro", foto: "🇵🇹", esImagen: false },
    { id: 12, nombre: "Kylian Mbappé", equipo: "Francia", rareza: "oro", foto: "🇫🇷", esImagen: false },
    { id: 13, nombre: "Erling Haaland", equipo: "Noruega", rareza: "oro", foto: "🇳🇴", esImagen: false },
    { id: 14, nombre: "Jude Bellingham", equipo: "Inglaterra", rareza: "oro", foto: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", esImagen: false },
    { id: 15, nombre: "Kevin De Bruyne", equipo: "Bélgica", rareza: "oro", foto: "🇧🇪", esImagen: false },
    { id: 16, nombre: "Lautaro Martínez", equipo: "Argentina", rareza: "comun", foto: "🇦🇷", esImagen: false },
    { id: 17, nombre: "Rodrygo Goes", equipo: "Brasil", rareza: "comun", foto: "🇧🇷", esImagen: false },
    { id: 18, nombre: "Piero Hincapié", equipo: "Ecuador", rareza: "comun", foto: "🇪🇨", esImagen: false },
    { id: 19, nombre: "Santiago Giménez", equipo: "México", rareza: "comun", foto: "🇲🇽", esImagen: false },
    { id: 20, nombre: "Endrick", equipo: "Brasil", rareza: "comun", foto: "🇧🇷", esImagen: false }
];

// 2. ESTADO DEL JUEGO (Cargar de LocalStorage o iniciar vacío)
let estadoAlbum = JSON.parse(localStorage.getItem('album_progreso')) || {
    sobresDisponibles: 3,
    cartasPegadas: [], // Guardará los IDs de las que ya están en el álbum
    repetidas: []      // Lista de IDs de las cartas repetidas
};

// Guardar progreso automáticamente
function guardarProgreso() {
    localStorage.setItem('album_progreso', JSON.stringify(estadoAlbum));
}

// 3. FUNCIÓN AUXILIAR PARA RENDERIZAR LA FOTO O EL EMOJI
// Esta función decide si dibuja una etiqueta <img> o si deja el texto/bandera plano
function generarContenidoFoto(jugador) {
    if (jugador.esImagen) {
        // Retorna la etiqueta de imagen con estilos para que no se desborde del cromo
        return `<img src="${jugador.foto}" alt="${jugador.nombre}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 5px; margin: 5px 0;">`;
    } else {
        return `<div style="font-size: 2.5rem; margin: 5px 0;">${jugador.foto}</div>`;
    }
}

// 4. INICIALIZAR EL ÁLBUM VISUAL (Pestaña "MI ÁLBUM")
function inicializarAlbum() {
    const contenedor = document.getElementById('contenedor-album');
    if (!contenedor) return;
    contenedor.innerHTML = '';

    catalogoJugadores.forEach(jugador => {
        const estaPegada = estadoAlbum.cartasPegadas.includes(jugador.id);
        const casilla = document.createElement('div');
        casilla.className = `casilla-album ${estaPegada ? 'pegada' : ''}`;

        if (estaPegada) {
            casilla.innerHTML = `
                <div style="font-size: 0.7rem; color: #888;">${jugador.equipo}</div>
                ${generarContenidoFoto(jugador)}
                <div class="nombre-album">${jugador.nombre}</div>
                <span class="rareza ${jugador.rareza}">${jugador.rareza}</span>
            `;
        } else {
            casilla.innerHTML = `
                <div style="font-size: 2rem; color: #333; opacity: 0.3;">👤</div>
                <div style="font-size: 0.8rem; color: #555; font-weight: bold;">${jugador.nombre}</div>
                <div style="font-size: 0.6rem; color: #444;">${jugador.id}</div>
            `;
        }
        contenedor.appendChild(casilla);
    });
}

// 5. ABRIR UN SOBRE NUEVO (5 Cartas aleatorias)
document.getElementById('btn-abrir-sobre')?.addEventListener('click', () => {
    if (estadoAlbum.sobresDisponibles <= 0) {
        alert("¡No te quedan más sobres por hoy! Espera a mañana o recarga los sobres.");
        return;
    }

    estadoAlbum.sobresDisponibles--;
    actualizarInterfazComun();

    const contenedorSobres = document.getElementById('contenedor-sobres');
    contenedorSobres.innerHTML = '';

    // Sacar 5 cartas al azar
    for (let i = 0; i < 5; i++) {
        const indiceAzar = Math.floor(Math.random() * catalogoJugadores.length);
        const jugadorSacadó = catalogoJugadores[indiceAzar];

        // Crear la estructura visual del cromo (Efecto de voltear clickeable)
        const cartaContenedor = document.createElement('div');
        cartaContenedor.className = 'carta-contenedor';
        
        let esRepetida = estadoAlbum.cartasPegadas.includes(jugadorSacadó.id);

        // Si ya la tiene, va a la pila de repetidas. Si no, se pega directo en el álbum
        if (esRepetida) {
            estadoAlbum.repetidas.push(jugadorSacadó.id);
        } else {
            estadoAlbum.cartasPegadas.push(jugadorSacadó.id);
        }

        cartaContenedor.innerHTML = `
            <div class="carta-interior">
                <div class="cara-trasera">PANINI</div>
                <div class="cara-delantera">
                    <div style="font-size: 0.7rem; color: #666; font-weight: bold;">${jugadorSacadó.equipo}</div>
                    ${generarContenidoFoto(jugadorSacadó)}
                    <div class="nombre-jugador">${jugadorSacadó.nombre}</div>
                    <span class="rareza ${jugadorSacadó.rareza}">${jugadorSacadó.rareza}</span>
                    ${esRepetida ? '<div style="color: red; font-size: 0.65rem; font-weight: bold; margin-top: 3px;">🔄 REPETIDA!</div>' : '<div style="color: green; font-size: 0.65rem; font-weight: bold; margin-top: 3px;">✨ ¡NUEVA!</div>'}
                </div>
            </div>
        `;

        // Animación al hacer clic para revelar la carta
        cartaContenedor.addEventListener('click', function() {
            this.classList.toggle('volteada');
        });

        contenedorSobres.appendChild(cartaContenedor);
    }

    guardarProgreso();
    inicializarAlbum();
    actualizarPestañaRepetidas();
});

// 6. ACTUALIZAR PESTAÑA DE REPETIDAS Y MERCADO DE INTERCAMBIO
function actualizarPestañaRepetidas() {
    const contadorText = document.getElementById('contador-repetidas');
    const contenedorRepetidas = document.getElementById('contenedor-repetidas');
    const btnIntercambiar = document.getElementById('btn-intercambiar');

    if (!contadorText || !contenedorRepetidas || !btnIntercambiar) return;

    contenedorRepetidas.innerHTML = '';
    contadorText.innerText = `Tienes ${estadoAlbum.repetidas.length} cartas repetidas`;

    // Activar o desactivar el botón de canje (Se necesitan 3 para 1 sobre)
    if (estadoAlbum.repetidas.length >= 3) {
        btnIntercambiar.disabled = false;
        btnIntercambiar.style.backgroundColor = '#e94560';
        btnIntercambiar.style.cursor = 'pointer';
    } else {
        btnIntercambiar.disabled = true;
        btnIntercambiar.style.backgroundColor = '#0f3460';
        btnIntercambiar.style.cursor = 'not-allowed';
    }

    // Dibujar las cartas que tienes repetidas actualmente en la pila
    estadoAlbum.repetidas.forEach((idRepetido) => {
        const jugador = catalogoJugadores.find(j => j.id === idRepetido);
        if (jugador) {
            const minicarta = document.createElement('div');
            minicarta.className = 'casilla-album pegada';
            minicarta.style.width = '110px';
            minicarta.style.height = '150px';
            minicarta.innerHTML = `
                <div style="font-size: 0.6rem; color: #555;">${jugador.equipo}</div>
                ${generarContenidoFoto(jugador)}
                <div class="nombre-album" style="font-size: 0.75rem;">${jugador.nombre}</div>
            `;
            contenedorRepetidas.appendChild(minicarta);
        }
    });
}

// Lógica del botón para canjear 3 repetidas por un sobre nuevo
document.getElementById('btn-intercambiar')?.addEventListener('click', () => {
    if (estadoAlbum.repetidas.length >= 3) {
        // Quitamos las 3 primeras repetidas de la lista
        estadoAlbum.repetidas.splice(0, 3);
        estadoAlbum.sobresDisponibles++;
        
        alert("¡Intercambio completado con éxito! Has recibido 1 sobre extra.");
        
        guardarProgreso();
        actualizarInterfazComun();
        actualizarPestañaRepetidas();
    }
});

// 7. INTERFAZ COMÚN (Contadores globales)
function actualizarInterfazComun() {
    const textoSobres = document.getElementById('sobres-disponibles');
    if (textoSobres) {
        textoSobres.innerText = `Sobres disponibles hoy: ${estadoAlbum.sobresDisponibles}`;
    }
}

// Simulador de recarga diaria (Para desarrollo)
document.getElementById('btn-reiniciar-dia')?.addEventListener('click', () => {
    estadoAlbum.sobresDisponibles = 3;
    guardarProgreso();
    actualizarInterfazComun();
    alert("¡Sobres recargados! Revisa la pestaña 'ABRIR SOBRES'.");
});

// 8. CARGA INICIAL CUANDO SE ABRE LA WEB
window.onload = function() {
    actualizarInterfazComun();
    inicializarAlbum();
    actualizarPestañaRepetidas();
};