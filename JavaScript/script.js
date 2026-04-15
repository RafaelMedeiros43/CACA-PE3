document.addEventListener('DOMContentLoaded', () => {
    /*
    DOM ELEMENTS & CONSTANTS
    */

    //Newsletter Constants
    const form = document.getElementById("form-newsletter")
    const nomeF = document.getElementById("nome")
    const telemovelF = document.getElementById("telemovel")
    const emailF = document.getElementById("email")
    const mensagemFeedback = document.getElementById("mensagem-feedback")

    //Dropdown Indicativo
    const dropdownContainerIndicativo = document.getElementById('dropdown-indicativo')
    const dropdownSelectedIndicativo = dropdownContainerIndicativo.querySelector('.dropdown-selected')
    const dropdownOptionsIndicativo = dropdownContainerIndicativo.querySelector('.dropdown-options')
    const inputIndicativoHidden = document.getElementById('indicativo')

    //Dropdown Mensagem
    const mensagemEscrita = document.getElementById("mensagem")
    const dropdownAssuntoContainer = document.getElementById('dropdown-assunto')
    const dropdownAssuntoSelected = document.getElementById('assunto-selected')
    const dropdownAssuntoOptions = document.getElementById('assunto-options')
    const inputAssuntoHidden = document.getElementById('assunto')
    const mensagemPreDefinida = {
        ajuda: 'Boa tarde, gostava de pedir ajuda com...',
        evento: 'Boas, tenho interesse em saber mais informações sobre o evento...',
        marcacao: 'Ola, quero marcar uma consulta no dia...',
        ensino: 'Ola, gostaria de saber mais sobre o vosso programa de ensino'
    }

    //Admin Button
    const btnAdmin = document.getElementById("btn-admin")


    //Back to Top Button
    const toTopbtn = document.getElementById("to-top")
    
    //Carousel Constants
    const track = document.getElementById("carousel-track")
    const btnNext = document.getElementById("forward")
    const btnPrev = document.getElementById("prev")
    const imagens = ["media/hero.png", "media/evento1.png", "media/sobre_nos.png"]

    //Hamburger Menu Constants
    const headerBtn = document.getElementById('header-menu')
    const menuLinks = document.getElementById('nav-links')
    const navItems = document.querySelectorAll('#nav-links a')

    //Logo Constants
    const textElement = document.querySelector('.text p')
    const textContent = textElement.innerText
    const angle = 360 / textContent.length

    textElement.innerHTML = textContent.split("").map(
        (char, i) => {
            return `<span style="transform: translate(-50%, -50%) rotate(${i * angle}deg) translateY(-52px)">${char}</span>`
        }
    ).join("")

    //Dark Mode Constants
    const themeToggleBtn = document.getElementById('theme-toggle')
    const htmlEl = document.documentElement
    const sunIcon = themeToggleBtn.getAttribute('icon-sun')
    const moonIcon = themeToggleBtn.getAttribute('icon-moon')

    //Events Carousel Constants
    const eventTrack = document.querySelector('.events-track')
    const eventCards = document.querySelectorAll('.event-card')
    const eventPrevBtn = document.getElementById('event-prev')
    const eventNextBtn = document.getElementById('event-next')

    /*
    STATE VARIABLES
    */
    let indiceAtual = 1
    let isTransitioning = false

    /* 
      FUNCTIONS
     */

    //Função switch do menu para telemovel
    function toggleMenu() {
    menuLinks.classList.toggle('active')
}


    
    //--- Dropdown do indicativo ---
    dropdownSelectedIndicativo.addEventListener('click', function(event) {
    dropdownOptionsIndicativo.classList.toggle('open')
    event.stopPropagation() 
    })
    const todasOpcoes = dropdownOptionsIndicativo.querySelectorAll('li')
    todasOpcoes.forEach(function(opcao) {
        opcao.addEventListener('click', function() {
            dropdownSelectedIndicativo.textContent = this.getAttribute('short-data')
            inputIndicativoHidden.value = this.getAttribute('data-value')
            dropdownOptionsIndicativo.classList.remove('open')
        })
    })
    document.addEventListener('click', function(event) {
        if (!dropdownContainerIndicativo.contains(event.target)) {
            dropdownOptionsIndicativo.classList.remove('open')
        }
    })

    //--- Dropdown do assunto ---
    dropdownAssuntoSelected.addEventListener('click', function(event) {
        dropdownAssuntoOptions.classList.toggle('open')
        event.stopPropagation()
    })

    const opcoesAssunto = dropdownAssuntoOptions.querySelectorAll('li')
    opcoesAssunto.forEach(function(opcao) {
        opcao.addEventListener('click', function() {
            const assunto = this.getAttribute('data-value')
            dropdownAssuntoSelected.textContent = this.textContent
            inputAssuntoHidden.value = assunto
            mensagemEscrita.value = mensagemPreDefinida[assunto] || ''
            dropdownAssuntoOptions.classList.remove('open')
        })
    })

    document.addEventListener('click', function(event) {
        if (!dropdownAssuntoContainer.contains(event.target)) {
            dropdownAssuntoOptions.classList.remove('open')
        }
    })

    // --- Carrosel ---
    // Initializes the main carousel by cloning the first and last slides for infinite looping.
    function initCarousel() {
        // Clone Last Image (Prepended)
        const cloneLast = document.createElement("div")
        cloneLast.classList.add("carousel-slide")
        cloneLast.style.backgroundImage = `url('${imagens[imagens.length - 1]}')`
        cloneLast.id = 'last-clone'
        track.appendChild(cloneLast)

        // Real Images
        imagens.forEach((img) => {
            const slide = document.createElement("div")
            slide.classList.add("carousel-slide")
            slide.style.backgroundImage = `url('${img}')`
            track.appendChild(slide)
        })

        // Clone First Image (Appended)
        const cloneFirst = document.createElement("div")
        cloneFirst.classList.add("carousel-slide")
        cloneFirst.style.backgroundImage = `url('${imagens[0]}')`
        cloneFirst.id = 'first-clone'
        track.appendChild(cloneFirst)

        // Initial Position
        track.style.transform = `translateX(-${indiceAtual * 100}%)`
    }

    // Handles the slide navigation (next/prev), updates the index, and applies the CSS transform.
    function mudarImagem(direcao) {
        if (isTransitioning) return
        track.style.transition = 'transform 0.5s ease-in-out'
        isTransitioning = true

        if (direcao === 'next') {
            indiceAtual++
        } else {
            indiceAtual--
        }
        track.style.transform = `translateX(-${indiceAtual * 100}%)`
    } 

    // Resets the position without transition when reaching cloned slides to maintain the infinite loop illusion.
    function handleCarouselTransition() {
        isTransitioning = false
        const slides = document.querySelectorAll('.carousel-slide')
        
        if (slides[indiceAtual].id === 'last-clone') {
            track.style.transition = 'none'
            indiceAtual = slides.length - 2
            track.style.transform = `translateX(-${indiceAtual * 100}%)`
        }
        if (slides[indiceAtual].id === 'first-clone') {
            track.style.transition = 'none'
            indiceAtual = 1
            track.style.transform = `translateX(-${indiceAtual * 100}%)`
        }
    }
    
 //Changes scroll to top button, as user scrolls down
    function scrollPos(){
       const alturaTotal = document.documentElement.scrollHeight - window.innerHeight
       const percentagemScroll = (window.scrollY / alturaTotal) * 100
         if (percentagemScroll > 10 ) { //Makes the button show up when user scrolls past header
            toTopbtn.style.display = "block"
            toTopbtn.style.color = 'white'

            if (percentagemScroll > 90){ //Changes the color of the button as soon as user goes near the footer that is a darker color
             toTopbtn.style.backgroundColor = 'white'
             toTopbtn.style.color = 'black'
            }
            else{
             toTopbtn.style.backgroundColor = "var(--accent-color)"
            }
          }
          else {
             toTopbtn.style.display = "none"
          }
    }

     //Makes user go to top of the page
    function voltarAoTopo() {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        })
    }

    // --- Theme ---
    // Sets the visual theme, updates the toggle button icon, and saves the preference to localStorage.
    function setTheme(theme) {
        htmlEl.setAttribute('data-theme', theme)
        themeToggleBtn.textContent = theme === 'dark' ? sunIcon : moonIcon
        localStorage.setItem('theme', theme)
    }

    // Toggles between 'light' and 'dark' modes based on the current state.
    function toggleTheme() {
        const newTheme = htmlEl.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'
        setTheme(newTheme)
    }

    // Initializes the theme on page load, checking localStorage or system preference.
    function initTheme() {
        const savedTheme = localStorage.getItem('theme')
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        const currentTheme = savedTheme || (prefersDark ? 'dark' : 'light')
        setTheme(currentTheme)
    }

    // --- Eventos Carousel ---
    function initEventCarousel() {
    const eventTrack = document.querySelector('.events-track')
    const eventWrapper = document.querySelector('.events-mask')
    const eventPrevBtn = document.getElementById('event-prev')
    const eventNextBtn = document.getElementById('event-next')
    
    let eventIndex = 0;

    function updateEventCarousel() {
        const cartao = eventTrack.querySelector('.event-card')
        if (!cartao) return

        const espaco = parseFloat(window.getComputedStyle(eventTrack).gap) || 0
        const tamanhoSalto = cartao.offsetWidth + espaco

        const limiteMaximo = Math.max(0, eventTrack.scrollWidth - eventWrapper.offsetWidth)
        
        let movimento = eventIndex * tamanhoSalto
        
        if (movimento >= limiteMaximo) {
            movimento = limiteMaximo
            eventIndex = Math.floor(limiteMaximo / tamanhoSalto);
        }

        eventTrack.style.transform = `translateX(-${movimento}px)`
    }

    eventNextBtn.addEventListener('click', () => {
        eventIndex++
        updateEventCarousel()
    });

    eventPrevBtn.addEventListener('click', () => {
        if (eventIndex > 0) {
            eventIndex--
            updateEventCarousel()
        }
    });

    window.addEventListener('resize', updateEventCarousel)
}


    // --- Modo Admin ---
    let isAdmin = localStorage.getItem('caca_admin') === 'true'
    function initAdminClass() {
        if (isAdmin) {
            document.body.classList.add('admin-mode')
        } else {
            document.body.classList.remove('admin-mode')
        }
    }

    function toggleAdmin(event) {
        isAdmin = !isAdmin
        localStorage.setItem('admin_state', isAdmin)
        initAdminClass()   
    }


    /* 
    INITIALIZATION & EVENT LISTENERS
    */
    
    // Initialize Logic
    initAdminClass()
    initCarousel()
    initTheme()
    initEventCarousel()

    // Add Listeners
    track.addEventListener('transitionend', handleCarouselTransition)
    btnNext.addEventListener("click", () => mudarImagem('next'))
    btnPrev.addEventListener("click", () => mudarImagem('prev'))
    window.addEventListener("scroll", scrollPos)
    toTopbtn.addEventListener("click", voltarAoTopo)
    themeToggleBtn.addEventListener('click', toggleTheme)
    headerBtn.addEventListener('click', toggleMenu);
    btnAdmin.addEventListener('click', toggleAdmin)
    
    navItems.forEach(link => {
        link.addEventListener('click', () => {
            menuLinks.classList.remove('active');
        });
    });

    
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem('theme')) { 
            setTheme(e.matches ? 'dark' : 'light')
        }
    })
    if (isAdmin) {
    console.log('21')
}
}
)
    
