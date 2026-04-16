const API_KEY = CONFIG.WEATHER_API_KEY 

async function atualizarMeteorologiaEventos(eventos) {
    
    for (const ev of eventos) {
        const span = document.getElementById(`weather-${ev.id}`);

        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(ev.local)}&appid=${API_KEY}&units=metric&lang=pt`;
            const res = await fetch(url);
            const dados = await res.json();

            if (dados.cod === 200) {
                const iconCode = dados.weather[0].icon
                const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`
                span.innerHTML = `<img src="${iconUrl}" alt="${dados.weather[0].description}">`
            }
        } catch (erro) {
            console.error("Erro ao carregar clima:", erro)
        }
    }
}