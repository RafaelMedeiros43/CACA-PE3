document.addEventListener('DOMContentLoaded', async () => {
    
    const areaNoticias = document.getElementById('noticias-dinamicas')
    if (!areaNoticias) return

    try {
        const linkRSS = 'https://news.google.com/rss/search?q=saude+portugal&hl=pt-PT&gl=PT&ceid=PT:pt-150'
        const linkAPI = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(linkRSS)}`

        const resposta = await fetch(linkAPI)
        const dados = await resposta.json();

        if (dados.status === 'ok') {
            
            let asMinhasImagens = [
                'noticia1.jpg', 'noticia2.jpg', 'noticia3.jpg', 
                'noticia4.jpg', 'noticia5.jpg', 'noticia6.jpg'
            ];

            asMinhasImagens.sort(() => Math.random() - 0.5)


            let htmlParaMostrar = ''
            const ultimasTresNoticias = dados.items.slice(0, 3)

            ultimasTresNoticias.forEach((noticia, indice) => {
                
                const imagemEscolhida = `media/${asMinhasImagens[indice]}`
                
                const tituloLimpo = noticia.title.split(' - ')[0]

                htmlParaMostrar += `
                    <article class="news-card">
                        <img src="${imagemEscolhida}" alt="Notícia">
                        <h4>${tituloLimpo}</h4>
                        <a href="${noticia.link}" target="_blank" class="link-blue">Ler artigo completo</a>
                    </article>
                `
            })

            areaNoticias.innerHTML = htmlParaMostrar
        }

    } catch (erro) {
        areaNoticias.innerHTML = '<p>Erro ao carregar notícias.</p>'
    }
})