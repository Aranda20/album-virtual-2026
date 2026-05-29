const catalogoJugadores = [
    { id: 1, nombre: "Luis Díaz", equipo: "Colombia", rareza: "oro", foto: "🇨🇴" },
    { id: 2, nombre: "Lionel Messi", equipo: "Argentina", rareza: "oro", foto: "🇦🇷" },
    { id: 3, nombre: "Richard Ríos", equipo: "Colombia", rareza: "comun", foto: "🇨🇴" },
    { id: 4, nombre: "Federico Valverde", equipo: "Uruguay", rareza: "comun", foto: "🇺🇾" },
    { id: 5, nombre: "Neymar Jr", equipo: "Brasil", rareza: "oro", foto: "🇧🇷" },
    { id: 6, nombre: "Vinícius Jr", equipo: "Brasil", rareza: "oro", foto: "🇧🇷" },
    { id: 7, nombre: "James Rodríguez", equipo: "Colombia", rareza: "oro", foto: "🇨🇴" },
    { id: 8, nombre: "Darwin Núñez", equipo: "Uruguay", rareza: "comun", foto: "🇺🇾" },
    { id: 9, nombre: "Emiliano Martínez", equipo: "Argentina", rareza: "comun", foto: "🇦🇷" },
    { id: 10, nombre: "Moises Caicedo", equipo: "Ecuador", rareza: "comun", foto: "🇪🇨" }
];

// --- MODIFICADO: Intentar cargar datos previos guardados en el navegador ---
let sobresRestantes = parseInt(localStorage.getItem("sobresRestantes")) ?? 3;
if (isNaN(sobresRestantes)) sobresRestantes = 3; // Validación por seguridad

let cromosObtenidos = JSON.parse(localStorage.getItem("cromosObtenidos")) || [];

const contenedorSobres = document.getElementById("contenedor-sobres");
const contenedorAlbum = document.getElementById("contenedor-album");
const botonAbrir = document.getElementById("btn-abrir-sobre");
const botonReiniciar = document.getElementById("btn-reiniciar-dia");
const textoContador = document.getElementById("sobres-disponibles");

// Función para actualizar el texto del contador en pantalla y deshabilitar botón si es 0
function actualizarInterfazContador() {
    textoContador.innerText = `Sobres disponibles hoy: ${sobresRestantes}`;
    if (sobresRestantes <= 0) {
        botonAbrir.style.backgroundColor = "#555";
        botonAbrir.style.cursor = "not-allowed";
    } else {
        botonAbrir.style.backgroundColor = "#e94560";
        botonAbrir.style.cursor = "pointer";
    }
}

// Inicializa la estructura del álbum fijándose si el jugador ya estaba obtenido antes
function inicializarAlbum() {
    contenedorAlbum.innerHTML = "";
    catalogoJugadores.forEach(jugador => {
        const casilla = document.createElement("div");
        casilla.classList.add("casilla-album");
        casilla.id = `album-jugador-${jugador.id}`;
        
        // MODIFICADO: Si el cromo ya estaba guardado en LocalStorage, se dibuja ya pegado
        if (cromosObtenidos.includes(jugador.id)) {
            casilla.classList.add("pegada");
            casilla.innerHTML = `
                <div class="foto-album">${jugador.foto}</div>
                <div class="nombre-album">${jugador.nombre}</div>
                <div style="font-size: 0.6rem; color: #777;">${jugador.equipo}</div>
            `;
        } else {
            // Si no lo tiene, se dibuja la silueta vacía
            casilla.innerHTML = `
                <div class="foto-album" style="opacity: 0.2; font-size: 2rem;">👤</div>
                <div class="nombre-album">${jugador.nombre}</div>
                <div style="font-size: 0.6rem; color: #555;">${jugador.id}</div>
            `;
        }
        contenedorAlbum.appendChild(casilla);
    });
}

function procesarCromo(jugador, tarjetaVisual) {
    if (cromosObtenidos.includes(jugador.id)) {
        const indicadorRepetido = document.createElement("div");
        indicadorRepetido.style.cssText = "color: #e94560; font-weight: bold; font-size: 0.8rem; margin-top: 5px;";
        indicadorRepetido.innerText = "🔄 ¡REPETIDA! (A la pila)";
        tarjetaVisual.querySelector(".cara-delantera").appendChild(indicadorRepetido);
    } else {
        cromosObtenidos.push(jugador.id);
        
        // NUEVO: Guardar la lista actualizada de cromos en la memoria del navegador
        localStorage.setItem("cromosObtenidos", JSON.stringify(cromosObtenidos));

        const casillaEspecifica = document.getElementById(`album-jugador-${jugador.id}`);
        if (casillaEspecifica) {
            casillaEspecifica.classList.add("pegada");
            casillaEspecifica.innerHTML = `
                <div class="foto-album">${jugador.foto}</div>
                <div class="nombre-album">${jugador.nombre}</div>
                <div style="font-size: 0.6rem; color: #777;">${jugador.equipo}</div>
            `;
        }
    }
}

function crearCartaHTML(jugador) {
    const cartaContenedor = document.createElement("div");
    cartaContenedor.classList.add("carta-contenedor");

    cartaContenedor.innerHTML = `
        <div class="carta-interior">
            <div class="cara-trasera">
                <div>PANINI</div>
                <div style="font-size: 0.8rem; margin-top:10px;">¡REVELAR!</div>
            </div>
            <div class="cara-delantera">
                <div style="font-size: 3rem;">${jugador.foto}</div>
                <div class="nombre-jugador">${jugador.nombre}</div>
                <div style="font-size:0.8rem; color:#777;">${jugador.equipo}</div>
                <span class="rareza ${jugador.rareza}">${jugador.rareza}</span>
            </div>
        </div>
    `;

    cartaContenedor.addEventListener("click", () => {
        if (!cartaContenedor.classList.contains("volteada")) {
            cartaContenedor.classList.add("volteada");
            procesarCromo(jugador, cartaContenedor);
        }
    });

    contenedorSobres.appendChild(cartaContenedor);
}

function abrirSobre() {
    if (sobresRestantes <= 0) {
        alert("¡No te quedan más sobres por hoy! Espera a mañana o recarga los sobres.");
        return;
    }

    sobresRestantes--;
    
    // NUEVO: Guardar los sobres restantes en la memoria del navegador
    localStorage.setItem("sobresRestantes", sobresRestantes);
    actualizarInterfazContador();

    contenedorSobres.innerHTML = "";
    for (let i = 0; i < 5; i++) {
        const indiceAleatorio = Math.floor(Math.random() * catalogoJugadores.length);
        const jugadorSeleccionado = catalogoJugadores[indiceAleatorio];
        crearCartaHTML(jugadorSeleccionado);
    }
}

// Reiniciar el día limpiando o reseteando los valores
botonReiniciar.addEventListener("click", () => {
    sobresRestantes = 3;
    localStorage.setItem("sobresRestantes", sobresRestantes);
    actualizarInterfazContador();
});

// Ejecución inicial
actualizarInterfazContador();
inicializarAlbum();