let mapaPrincipal;
let pinoPrincipal;
let mapaPrincipalInstancia = null;
let pinoPrincipalInstancia = null;

// Cria o pino do mapa vermelho
const pinoVermelho = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

document.addEventListener('DOMContentLoaded', () => {
    // INICIALIZA O MAPA PRINCIPAL
    const contentorMapa = document.getElementById('mapa-principal');
    
    if (contentorMapa) {
        mapaPrincipal = L.map('mapa-principal').setView([37.7412, -25.6756], 13);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(mapaPrincipal);

        pinoPrincipal = L.marker([37.7465, -25.6628], {icon: pinoVermelho}).addTo(mapaPrincipal)
            .bindPopup('<b>CACA</b><br>Universidade dos Açores')
            .openPopup();

        setTimeout(() => {
            mapaPrincipal.invalidateSize();
        }, 200)
    }
});


async function abrirMapaEventos(localizacao) {
    const mapaEventos = document.getElementById('mapa-eventos');
    const titulo = document.getElementById('titulo-mapa-eventos');
    const containerMapa = document.getElementById('mapa-eventos-container');

    if (!mapaEventos || !titulo || !containerMapa) {
        console.error('Elementos do modal de mapa não encontrados.');
        return;
    }

    // Abre o mapa e muda o título para a morada
    mapaEventos.classList.add('show');
    titulo.textContent = localizacao;

    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(localizacao)}&limit=1`);
        const dados = await response.json();

        if (dados.length > 0) {
            const lat = dados[0].lat;
            const lon = dados[0].lon;
            
            if(!mapaPrincipalInstancia) {
                // Se for a primeira vez que abre o pop-up, cria o mapa
                mapaPrincipalInstancia = L.map('mapa-eventos-container').setView([lat, lon], 15);
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; OpenStreetMap'
                }).addTo(mapaPrincipalInstancia);

                pinoPrincipalInstancia = L.marker([lat, lon], {icon: pinoVermelho}).addTo(mapaPrincipalInstancia)
                    .bindPopup (`<b>${localizacao}</b>`).openPopup();
            } else{
                // Se o mapa já existir, apenas muda as coordenadas e o pino
                mapaPrincipalInstancia.setView([lat, lon], 15);
                pinoPrincipalInstancia.setLatLng([lat, lon]).setPopupContent(`<b>${localizacao}</b>`).openPopup();
            }

            setTimeout(() => mapaPrincipalInstancia.invalidateSize(), 350);
        } else { // Se o utilizador clicar num local que não existe no GPS:
            if (mapaPrincipalInstancia) {
                mapaPrincipalInstancia.remove();
                mapaPrincipalInstancia = null;
                pinoPrincipalInstancia = null;
            }

            containerMapa.innerHTML = '<p class="map-msg-erro">Localização não encontrada no GPS.</p>';
        }
    } catch (erro) {
        console.error("Erro ao carregar mapa do popup: ", erro);
    }
}