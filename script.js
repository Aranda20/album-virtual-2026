// OPCIÓN 2: Catálogo expandido a 20 jugadores
const catalogoJugadores = [
    { id: 1, nombre: "Luis Díaz", equipo: "Colombia", rareza: "oro", foto: "🇨🇴" },
    { id: 2, nombre: "Lionel Messi", equipo: "Argentina", rareza: "oro", foto: "🇦🇷" },
    { id: 3, nombre: "Richard Ríos", equipo: "Colombia", rareza: "comun", foto: "🇨🇴" },
    { id: 4, font: "Federico Valverde", nombre: "Fede Valverde", equipo: "Uruguay", rareza: "comun", foto: "🇺🇾" },
    { id: 5, nombre: "Neymar Jr", equipo: "Brasil", rareza: "oro", foto: "🇧🇷" },
    { id: 6, nombre: "Vinícius Jr", equipo: "Brasil", rareza: "oro", foto: "🇧🇷" },
    { id: 7, nombre: "James Rodríguez", equipo: "Colombia", rareza: "oro", foto: "🇨🇴" },
    { id: 8, nombre: "Darwin Núñez", equipo: "Uruguay", rareza: "comun", foto: "🇺🇾" },
    { id: 9, nombre: "Emiliano Martínez", equipo: "Argentina", rareza: "comun", foto: "🇦🇷" },
    { id: 10, nombre: "Moises Caicedo", equipo: "Ecuador", rareza: "comun", foto: "🇪🇨" },
    { id: 11, nombre: "Cristiano Ronaldo", equipo: "Portugal", rareza: "oro", foto: "🇵🇹" },
    { id: 12, nombre: "Kylian Mbappé", equipo: "Francia", rareza: "oro", foto: "🇫🇷" },
    { id: 13, nombre: "Erling Haaland", equipo: "Noruega", rareza: "oro", foto: "🇳🇴" },
    { id: 14, nombre: "Jude Bellingham", equipo: "Inglaterra", rareza: "oro", foto: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
    { id: 15, nombre: "Kevin De Bruyne", equipo: "Bélgica", rareza: "oro", foto: "🇧🇪" },
    { id: 16, nombre: "Lautaro Martínez", equipo: "Argentina", rareza: "comun", foto: "🇦🇷" },
    { id: 17, nombre: "Rodrygo Goes", equipo: "Brasil", rareza: "comun", foto: "🇧🇷" },
    { id: 18, nombre: "Piero Hincapié", equipo: "Ecuador", rareza: "comun", foto: "🇪🇨" },
    { id: 19, nombre: "Santiago Giménez", equipo: "México", rareza: "comun", foto: "🇲🇽" },
    { id: 20, nombre: "Endrick", equipo: "Brasil", rareza: "comun", foto: "🇧🇷" }
];

// Cargar datos de LocalStorage
let guardadoSobres = localStorage.getItem("sobresRestantes");
let sobresRestantes = (guardadoSobres !== null) ? parseInt(guardadoSobres) : 3;
if (isNaN(sobresRestantes)) sobresRestantes = 3;

let cromosObtenidos = JSON.parse(localStorage.getItem("cromosObtenidos")) || [];
let listaRepetidas = JSON.parse(localStorage.getItem("listaRepetidas")) || []; // Nueva lista de repetidas

// Elementos del DOM
const contenedorSobres = document.getElementById("contenedor-sobres");
const contenedorRepetidas = document.getElementById("contenedor-repetidas");
const contenedorAlbum = document.getElementById("contenedor-album");
const botonAbrir = document.getElementById("btn-abrir-sobre");
const botonReiniciar = document.getElementById("btn-reiniciar-dia");
const botonIntercambiar = document.getElementById("btn-intercambiar");
const textoContador = document.getElementById("sobres-disponibles");
const textoRepetidas = document.getElementById("contador-repetidas");

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

// OPCIÓN 1: Actualizar la zona visual de las cartas repetidas
function actualizarInterfazRepetidas() {
    contenedorRepetidas.innerHTML = "";
    textoRepetidas.innerText = `Tienes ${listaRepetidas.length} cartas repetidas`;

    if (listaRepetidas.length >= 3) {
        botonIntercambiar.disabled = false;
        botonIntercambiar.style.backgroundColor = "#e94560";
        botonIntercambiar.style.cursor = "pointer";
    } else {
        botonIntercambiar.disabled = true;
        botonIntercambiar.style.backgroundColor = "#0f3460";
        botonIntercambiar.style.cursor = "not-allowed";
    }

    listaRepetidas.forEach((idReg) => {
        const jugador = catalogoJugadores.find(j => j.id === idReg);
        if (jugador) {
            const minicarta = document.createElement("div");
            minicarta.style.cssText = "background: #222; border: 1px solid #e94560; padding: 5px; border-radius: 5px; text-align: center; width: 70px; font-size: 0.7rem;";
            minicarta.innerHTML = `<div>${jugador.foto}</div><div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${jugador.nombre}</div>`;
            contenedorRepetidas.appendChild(minicarta);
        }
    });
}

function inicializarAlbum() {
    contenedorAlbum.innerHTML = "";
    catalogoJugadores.forEach(jugador => {
        const casilla = document.createElement("div");
        casilla.classList.add("casilla-album");
        casilla.id = `album-jugador-${jugador.id}`;
        
        if (cromosObtenidos.includes(jugador.id)) {
            casilla.classList.add("pegada");
            casilla.innerHTML = `
                <div class="foto-album">${jugador.foto}</div>
                <div class="nombre-album">${jugador.nombre}</div>
                <div style="font-size: 0.6rem; color: #777;">${jugador.equipo}</div>
            `;
        } else {
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
        // OPCIÓN 1: Si ya la tiene, se va directamente al almacén de repetidas
        listaRepetidas.push(jugador.id);
        localStorage.setItem("listaRepetidas", JSON.stringify(listaRepetidas));
        actualizarInterfazRepetidas();

        const indicadorRepetido = document.createElement("div");
        indicadorRepetido.style.cssText = "color: #e94560; font-weight: bold; font-size: 0.8rem; margin-top: 5px;";
        indicadorRepetido.innerText = "🔄 ¡REPETIDA! (A la pila)";
        tarjetaVisual.querySelector(".cara-delantera").appendChild(indicadorRepetido);
    } else {
        cromosObtenidos.push(jugador.id);
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

function crearCartaHTML(jugador, contenedorDestino) {
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

    contenedorDestino.appendChild(cartaContenedor);
}

// OPCIÓN 3: Función que genera las cartas ocultas detrás del sobre animado
function generarContenidoSobre() {
    const zonaCartas = document.createElement("div");
    zonaCartas.style.cssText = "display: flex; flex-wrap: wrap; justify-content: center; gap: 15px; width: 100%; animation: fadeIn 0.5s;";
    
    for (let i = 0; i < 5; i++) {
        const indiceAleatorio = Math.floor(Math.random() * catalogoJugadores.length);
        const jugadorSeleccionado = catalogoJugadores[indiceAleatorio];
        crearCartaHTML(jugadorSeleccionado, zonaCartas);
    }
    contenedorSobres.appendChild(zonaCartas);
}

function abrirSobre() {
    if (sobresRestantes <= 0) {
        alert("¡No te quedan más sobres por hoy! Espera a mañana o usa tus repetidas.");
        return;
    }

    sobresRestantes--;
    localStorage.setItem("sobresRestantes", sobresRestantes);
    actualizarInterfazContador();

    contenedorSobres.innerHTML = "";

    // OPCIÓN 3: Creación visual del sobre cerrado (Pack Opening)
    const sobreCerrado = document.createElement("div");
    sobreCerrado.style.cssText = "width: 200px; height: 280px; background: linear-gradient(135deg, #e94560, #0f3460); border: 4px solid #fff; border-radius: 15px; display: flex; flex-direction: column; justify-content: center; align-items: center; cursor: pointer; margin: 20px auto; box-shadow: 0 10px 20px rgba(0,0,0,0.5); transition: transform 0.3s;";
    sobreCerrado.innerHTML = `<h2 style="color: gold; font-family: sans-serif; letter-spacing: 2px; margin: 0;">PANINI</h2><p style="color: white; font-weight: bold; margin-top: 20px; animation: pulse 1.5s infinite;">💥 TOCAR PARA ROMPER 💥</p>`;
    
    // Efecto Hover al pasar el mouse por el sobre
    sobreCerrado.onmouseenter = () => sobreCerrado.style.transform = "scale(1.05) rotate(2deg)";
    sobreCerrado.onmouseleave = () => sobreCerrado.style.transform = "scale(1) rotate(0deg)";

    // Al hacer clic, se rompe el sobre y salen las cartas
    sobreCerrado.onclick = () => {
        sobreCerrado.style.transform = "scale(0.1)";
        sobreCerrado.style.opacity = "0";
        setTimeout(() => {
            contenedorSobres.innerHTML = "";
            generarContenidoSobre();
        }, 300);
    };

    contenedorSobres.appendChild(sobreCerrado);
}

// OPCIÓN 1: Lógica del botón para canjear las repetidas
botonIntercambiar.onclick = () => {
    if (listaRepetidas.length >= 3) {
        // Eliminar 3 cartas de la lista
        listaRepetidas.splice(0, 3);
        localStorage.setItem("listaRepetidas", JSON.stringify(listaRepetidas));
        
        // Regalar un sobre
        sobresRestantes++;
        localStorage.setItem("sobresRestantes", sobresRestantes);
        
        // Actualizar todo
        actualizarInterfazContador();
        actualizarInterfazRepetidas();
        alert("♻️ ¡Intercambio exitoso! Entregaste 3 repetidas a la FIFA y ganaste +1 Sobre de recompensa.");
    }
};

botonReiniciar.addEventListener("click", () => {
    sobresRestantes = 3;
    localStorage.setItem("sobresRestantes", sobresRestantes);
    actualizarInterfazContador();
});

botonAbrir.onclick = abrirSobre;

// Ejecución inicial
actualizarInterfazContador();
actualizarInterfazRepetidas();
inicializarAlbum();