// Sistema de áudio aprimorado
function initAudioSystem() {
    const audio = document.getElementById('backgroundAudio');
    const audioIndicator = document.getElementById('audioIndicator');
    let audioStarted = false;
    let userInteracted = false;
    
    if (!audio) {
        console.warn('Elemento de áudio não encontrado');
        return;
    }
    
    // Configurar áudio para reprodução contínua
    audio.volume = 0.3;
    audio.loop = true;
    audio.preload = 'auto';
    
    // Função para iniciar áudio
    function startAudio() {
        if (!audioStarted && userInteracted) {
            const playPromise = audio.play();
            
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    audioStarted = true;
                    if (audioIndicator) {
                        audioIndicator.classList.add('playing');
                    }
                    console.log('🎵 Música iniciada!');
                }).catch(error => {
                    console.log('Erro ao reproduzir áudio:', error);
                    // Tenta novamente após 1 segundo
                    setTimeout(() => {
                        if (userInteracted) startAudio();
                    }, 1000);
                });
            }
        }
    }
    
    // Função para garantir que a música continue
    function ensureAudioPlaying() {
        if (userInteracted && audioStarted && audio.paused) {
            audio.play().catch(console.log);
        }
    }
    
    // Função para toggle do áudio (controla volume, não pausa)
    function toggleAudio() {
        if (!userInteracted) {
            userInteracted = true;
            startAudio();
            return;
        }
        
        if (audio.volume > 0) {
            audio.volume = 0;
            if (audioIndicator) {
                audioIndicator.classList.remove('playing');
                audioIndicator.title = 'Música silenciada - Clique para ativar';
            }
        } else {
            audio.volume = 0.3;
            if (audioIndicator) {
                audioIndicator.classList.add('playing');
                audioIndicator.title = 'Música tocando - Clique para silenciar';
            }
            // Garante que está tocando
            ensureAudioPlaying();
        }
    }
    
    // Detectar QUALQUER interação do usuário
    const interactionEvents = ['click', 'touchstart', 'keydown', 'scroll', 'wheel', 'mousemove'];
    
    function handleFirstInteraction() {
        if (!userInteracted) {
            userInteracted = true;
            startAudio();
            console.log('🎮 Primeira interação detectada - iniciando música');
        }
    }
    
    // Adicionar listeners para todas as interações
    interactionEvents.forEach(eventType => {
        document.addEventListener(eventType, handleFirstInteraction, { once: true, passive: true });
    });
    
    // Eventos específicos para garantir reprodução
    document.body.addEventListener('click', () => {
        if (!userInteracted) {
            userInteracted = true;
        }
        ensureAudioPlaying();
    });
    
    // Scroll sempre inicia/continua a música
    window.addEventListener('scroll', () => {
        if (!userInteracted) {
            userInteracted = true;
        }
        ensureAudioPlaying();
    });
    
    // Hover nos cards inicia música
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            if (!userInteracted) {
                userInteracted = true;
            }
            ensureAudioPlaying();
        });
    });
    
    // Controlar áudio clicando no indicador
    if (audioIndicator) {
        audioIndicator.addEventListener('click', toggleAudio);
    }
    
    // REMOVIDO: Controle de volume no scroll (mantém volume constante)
    
    // Modificado: Manter música tocando mesmo quando sair da aba
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // Página oculta - MANTÉM música tocando
            if (audioStarted && userInteracted) {
                // Força continuar tocando
                setTimeout(() => {
                    ensureAudioPlaying();
                }, 100);
            }
        } else {
            // Página visível - garante que música continue
            if (userInteracted) {
                ensureAudioPlaying();
            }
        }
    });
    
    // Eventos de foco da janela
    window.addEventListener('focus', () => {
        if (userInteracted) {
            ensureAudioPlaying();
        }
    });
    
    window.addEventListener('blur', () => {
        // NÃO pausa - mantém tocando
        if (audioStarted && userInteracted) {
            ensureAudioPlaying();
        }
    });
    
    // Salvar estado ao sair da página
    window.addEventListener('beforeunload', () => {
        if (audioStarted && audio.volume > 0) {
            localStorage.setItem('musicWasPlaying', 'true');
            localStorage.setItem('musicCurrentTime', audio.currentTime.toString());
        }
    });
    
    // Restaurar música ao carregar
    window.addEventListener('load', () => {
        const wasPlaying = localStorage.getItem('musicWasPlaying');
        const currentTime = localStorage.getItem('musicCurrentTime');
        
        if (wasPlaying === 'true') {
            if (currentTime) {
                audio.currentTime = parseFloat(currentTime);
            }
            
            // Aguarda primeira interação para restaurar
            const restoreAudio = () => {
                userInteracted = true;
                startAudio();
            };
            
            document.addEventListener('click', restoreAudio, { once: true });
            document.addEventListener('scroll', restoreAudio, { once: true });
        }
        
        // Limpa storage
        localStorage.removeItem('musicWasPlaying');
        localStorage.removeItem('musicCurrentTime');
    });
    
    // Prevenir erros de áudio
    audio.addEventListener('error', (e) => {
        console.log('Erro no áudio:', e);
        if (userInteracted) {
            setTimeout(() => {
                audio.load();
                startAudio();
            }, 2000);
        }
    });
    
    // Garantir loop
    audio.addEventListener('ended', () => {
        if (userInteracted && audioStarted) {
            audio.currentTime = 0;
            audio.play().catch(console.log);
        }
    });
    
    // Monitorar constantemente se a música está tocando
    setInterval(() => {
        if (userInteracted && audioStarted && audio.paused && audio.volume > 0) {
            console.log('🔄 Reativando música...');
            ensureAudioPlaying();
        }
    }, 2000);
}

// Efeito de neve animada
function createSnowflake() {
    const snowContainer = document.querySelector('.snow-container');
    if (!snowContainer) return;

    if (isMobile()) {
        return; // Não cria partículas em dispositivos móveis
    }

    const snowflake = document.createElement('div');
    snowflake.classList.add('snowflake');
    snowflake.innerHTML = '❄';

    // Posição aleatória
    snowflake.style.left = Math.random() * 100 + '%';
    snowflake.style.fontSize = Math.random() * 10 + 10 + 'px';
    snowflake.style.opacity = Math.random() * 0.6 + 0.2;

    // Duração da animação aleatória
    const duration = Math.random() * 3 + 2;
    snowflake.style.animationDuration = duration + 's';

    // Adicionar ao container
    snowContainer.appendChild(snowflake);

    // Remover após a animação
    setTimeout(() => {
        if (snowflake.parentNode) {
            snowflake.remove();
        }
    }, duration * 1000);
}


// Animação de entrada dos cartões
function animateCards() {
    const cards = document.querySelectorAll('.card');
    
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';
        
        const animationDuration = isMobile() ? '1s' : '0.6s'; // Maior duração no mobile
        const delay = isMobile() ? 300 : index * 100; // Maior delay no mobile
        
        setTimeout(() => {
            card.style.transition = `all ${animationDuration} cubic-bezier(0.175, 0.885, 0.32, 1.275)`;
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, delay);
    });
}


// Efeito de clique nos botões
function addButtonEffects() {
    const buttons = document.querySelectorAll('.card-button');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Criar efeito de ripple
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
            
            // Redirecionar para as redes sociais
            const networkType = this.closest('.card').dataset.network;
            handleNetworkClick(networkType);
        });
    });
}

// Função para lidar com cliques nas redes sociais
function handleNetworkClick(network) {
    const networks = {
        linkedin: 'https://www.linkedin.com/in/vitor-moura-312976325/',
        instagram: 'https://www.instagram.com/viictor_158/',
        discord: 'https://discord.gg/FvwXhJzDn2',
        github: 'https://github.com/ViictorM0ura',
        // loja: 'https://www.arenahosting.com.br/',
        // mods: 'https://www.arenamods.com.br/',
        // cidade: 'https://discord.gg/K3jUhZCksT',
        // kick: 'https://kick.com/arenamta',
        // tiktok: 'https://tiktok.com/@arenamta',
        // twitter: 'https://twitter.com/arenamta',
        // facebook: 'https://facebook.com/arenamta',
        // twitch: 'https://twitch.tv/arenamta',
        // telegram: 'https://t.me/arenamta',
        // whatsapp: 'https://wa.me/5511999999999',
        // spotify: 'https://open.spotify.com/user/arenamta',
        // soundcloud: 'https://soundcloud.com/arenamta',
        // linkedin: 'https://linkedin.com/company/arenamta',
        // steam: 'https://steamcommunity.com/groups/arenamta',
        // website: 'https://www.arenamta.com.br/',
        // forum: 'https://forum.arenamta.com.br/',
        // suporte: 'https://suporte.arenamta.com.br/',
        // tickets: 'https://tickets.arenamta.com.br/'
    };
    
    if (networks[network]) {
        // Animação antes de redirecionar
        const card = document.querySelector(`[data-network="${network}"]`);
        if (card) {
            card.style.transform = 'scale(0.95)';
            
            setTimeout(() => {
                window.open(networks[network], '_blank');
                card.style.transform = '';
            }, 150);
        }
    }
}

// Efeito de parallax suave no scroll
function addParallaxEffect() {
    if (isMobile()) {
        return; // Não adicionar parallax em dispositivos móveis
    }

    let ticking = false;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const parallax = document.querySelector('.logo-container');
        if (parallax) {
            const speed = scrolled * 0.5;
            parallax.style.transform = `translateY(${speed}px)`;
        }
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    });
}


// Adicionar CSS para o efeito ripple
function addRippleCSS() {
    const style = document.createElement('style');
    style.textContent = `
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
            pointer-events: none;
        }
        
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        .card-button {
            position: relative;
            overflow: hidden;
        }
    `;
    document.head.appendChild(style);
}

// Efeito de digitação para o título
function typeWriter() {
    const logo = document.querySelector('.logo');
    if (!logo) return;
    
    const text = 'VITOR MOURA';
    logo.innerHTML = '';
    
    let i = 0;
    const timer = setInterval(() => {
        if (i < text.length) {
            logo.innerHTML += text.charAt(i);
            i++;
        } else {
            clearInterval(timer);
        }
    }, 150);
}

// Observador de interseção para animações
function setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    });
    
    document.querySelectorAll('.card').forEach(card => {
        observer.observe(card);
    });
}

// Efeito de cursor personalizado
function addCustomCursor() {
    if (window.innerWidth <= 768) return;
    
    const cursor = document.createElement('div');
    cursor.classList.add('custom-cursor');
    document.body.appendChild(cursor);
    
    const cursorStyle = document.createElement('style');
    cursorStyle.textContent = `
        .custom-cursor {
            position: fixed;
            width: 20px;
            height: 20px;
            background: rgba(0, 255, 136, 0.5);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transition: transform 0.1s ease;
            mix-blend-mode: difference;
        }
        
        .custom-cursor.hover {
            transform: scale(2);
            background: rgba(0, 255, 136, 0.8);
        }
    `;
    document.head.appendChild(cursorStyle);
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX - 10 + 'px';
        cursor.style.top = e.clientY - 10 + 'px';
    });
    
    // Efeito hover nos elementos interativos
    const interactiveElements = document.querySelectorAll('.card, .card-button');
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
        });
        
        element.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
        });
    });
}

// Continuação do createFloatingParticles
function createFloatingParticles() {
    const particleContainer = document.createElement('div');
    particleContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
    `;
    document.body.appendChild(particleContainer);
    
    function createParticle() {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: rgba(0, 255, 136, 0.3);
            border-radius: 50%;
            animation: float ${Math.random() * 6 + 4}s linear infinite;
        `;
        
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = '100%';
        
        particleContainer.appendChild(particle);
        
        setTimeout(() => {
            if (particle.parentNode) {
                particle.remove();
            }
        }, 10000);
    }
    
    // Adicionar CSS da animação
    const particleStyle = document.createElement('style');
    particleStyle.textContent = `
        @keyframes float {
            0% {
                transform: translateY(0) translateX(0) rotate(0deg);
                opacity: 0;
            }
            10% {
                opacity: 1;
            }
            90% {
                opacity: 1;
            }
            100% {
                transform: translateY(-100vh) translateX(${Math.random() * 200 - 100}px) rotate(360deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(particleStyle);
    
    setInterval(createParticle, 1000);
}

// Efeito de loading inicial
function showLoadingAnimation() {
    const loader = document.createElement('div');
    loader.innerHTML = `
        <div class="loader-container">
            <div class="loader-logo">VITOR MOURA</div>
            <div class="loader-bar">
                <div class="loader-progress"></div>
            </div>
        </div>
    `;
    
    const loaderStyle = document.createElement('style');
    loaderStyle.textContent = `
        .loader-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #121212;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            transition: opacity 0.5s ease;
        }
        
        .loader-logo {
            font-family: 'Poppins', sans-serif;
            font-size: 3rem;
            font-weight: 700;
            background: linear-gradient(45deg, #00ff88, #00cc6a);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 2rem;
            animation: pulse 1.5s ease-in-out infinite;
        }
        
        .loader-bar {
            width: 300px;
            height: 4px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 2px;
            overflow: hidden;
        }
        
        .loader-progress {
            height: 100%;
            background: linear-gradient(45deg, #00ff88, #00cc6a);
            border-radius: 2px;
            animation: loading 2s ease-in-out;
            transform: translateX(-100%);
        }
        
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
        }
        
        @keyframes loading {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(0); }
        }
    `;
    document.head.appendChild(loaderStyle);
    document.body.appendChild(loader);
    
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
            if (loader.parentNode) {
                loader.remove();
            }
        }, 500);
    }, 2500);
}

// Função para detectar dispositivo móvel
function isMobile() {
    return window.innerWidth <= 768;
}

// Ajustar animações para mobile
function adjustForMobile() {
    if (isMobile()) {
        // Reduzir partículas em dispositivos móveis
        const style = document.createElement('style');
        style.textContent = `
            @media (max-width: 768px) {
                .custom-cursor {
                    display: none;
                }
                
                .card::before {
                    display: none;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Otimização de performance
function optimizePerformance() {
    // Throttle para eventos de scroll
    let ticking = false;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const parallax = document.querySelector('.logo-container');
        if (parallax) {
            const speed = scrolled * 0.5;
            parallax.style.transform = `translateY(${speed}px)`;
        }
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    });
}

// Easter egg - Konami Code
let konamiCode = [];
const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.keyCode);
    
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        // Easter egg ativado!
        document.body.style.animation = 'rainbow 2s linear infinite';
        
        const rainbowStyle = document.createElement('style');
        rainbowStyle.textContent = `
            @keyframes rainbow {
                0% { filter: hue-rotate(0deg); }
                100% { filter: hue-rotate(360deg); }
            }
        `;
        document.head.appendChild(rainbowStyle);
        
        setTimeout(() => {
            document.body.style.animation = '';
        }, 5000);
    }
});

// Adicionar CSS para o indicador de áudio
function addAudioIndicatorCSS() {
    const style = document.createElement('style');
    style.textContent = `
        .audio-indicator {
            position: fixed;
            top: 20px;
            right: 20px;
            display: flex;
            align-items: center;
            gap: 5px;
            background: rgba(0, 0, 0, 0.7);
            padding: 10px 15px;
            border-radius: 25px;
            cursor: pointer;
            z-index: 1000;
            transition: all 0.3s ease;
            border: 2px solid rgba(0, 255, 136, 0.3);
        }
        
        .audio-indicator:hover {
            background: rgba(0, 255, 136, 0.1);
            border-color: rgba(0, 255, 136, 0.6);
            transform: scale(1.05);
        }
        
        .audio-indicator span {
            color: #00ff88;
            font-size: 16px;
            margin-left: 5px;
        }
        
        .audio-wave {
            width: 3px;
            height: 15px;
            background: #00ff88;
            border-radius: 2px;
            animation: wave 1s ease-in-out infinite;
            opacity: 0.3;
        }
        
        .audio-wave:nth-child(1) { animation-delay: 0s; }
        .audio-wave:nth-child(2) { animation-delay: 0.2s; }
        .audio-wave:nth-child(3) { animation-delay: 0.4s; }
        
        .audio-indicator.playing .audio-wave {
            opacity: 1;
        }
        
        @keyframes wave {
            0%, 100% { height: 15px; }
            50% { height: 25px; }
        }
        
        @media (max-width: 768px) {
            .audio-indicator {
                top: 10px;
                right: 10px;
                padding: 8px 12px;
            }
            
            .audio-indicator span {
                font-size: 14px;
            }
            
            .audio-wave {
                width: 2px;
                height: 12px;
            }
            
            @keyframes wave {
                0%, 100% { height: 12px; }
                50% { height: 20px; }
            }
        }
    `;
    document.head.appendChild(style);
}

// Sistema de monitoramento de áudio avançado
function setupAudioMonitoring() {
    const audio = document.getElementById('backgroundAudio');
    if (!audio) return;
    
    // Monitora constantemente o estado do áudio
    setInterval(() => {
        const audioIndicator = document.getElementById('audioIndicator');
        
        // Verifica se o áudio deveria estar tocando
        if (audio.volume > 0 && !audio.paused) {
            if (audioIndicator && !audioIndicator.classList.contains('playing')) {
                audioIndicator.classList.add('playing');
            }
        } else if (audio.volume === 0) {
            if (audioIndicator && audioIndicator.classList.contains('playing')) {
                audioIndicator.classList.remove('playing');
            }
        }
        
        // Log de debug
        if (audio.paused && audio.volume > 0) {
            console.log('🔄 Áudio pausado detectado - tentando reativar...');
            audio.play().catch(console.log);
        }
    }, 1000);
    
    // Força reprodução em intervalos regulares
    setInterval(() => {
        if (audio.volume > 0 && audio.paused) {
            audio.play().catch(console.log);
        }
    }, 3000);
}

// Prevenção de pausas automáticas
function preventAutoPause() {
    const audio = document.getElementById('backgroundAudio');
    if (!audio) return;
    
    // Intercepta tentativas de pausar
    const originalPause = audio.pause;
    audio.pause = function() {
        console.log('⚠️ Tentativa de pausar interceptada');
        // Só permite pausar se o volume for 0 (silenciado pelo usuário)
        if (this.volume === 0) {
            originalPause.call(this);
        }
    };
    
    // Força play quando necessário
    audio.addEventListener('pause', () => {
        if (audio.volume > 0) {
            setTimeout(() => {
                audio.play().catch(console.log);
            }, 100);
        }
    });
}

// Inicialização principal
document.addEventListener('DOMContentLoaded', () => {
    // Mostrar loading
    showLoadingAnimation();
    
    // Inicializar sistemas principais
    setTimeout(() => {
        // Adicionar estilos CSS
        addRippleCSS();
        addAudioIndicatorCSS();
        
        // Inicializar funcionalidades
        initAudioSystem();
        setupAudioMonitoring();
        preventAutoPause();
        addButtonEffects();
        animateCards();
        addParallaxEffect();
        setupIntersectionObserver();
        addCustomCursor();
        createFloatingParticles();
        adjustForMobile();
        optimizePerformance();
        
        // Efeitos visuais
        setTimeout(typeWriter, 1000);
        
        console.log('🎮 VITOR MOURA - Site carregado com sucesso!');
        console.log('🎵 Sistema de áudio aprimorado inicializado!');
        console.log('✨ Todos os efeitos ativados!');
        console.log('🔒 Proteção contra pausas automáticas ativada!');
    }, 2500);
});

// Criar neve continuamente
setInterval(() => {
    if (document.querySelector('.snow-container')) {
        createSnowflake();
    }
}, 200);

// Função para redimensionamento da janela
window.addEventListener('resize', () => {
    adjustForMobile();
});

// Prevenção de erro em caso de elementos não encontrados
window.addEventListener('error', (e) => {
    console.warn('Erro capturado:', e.message);
});

// Função de debug aprimorada
function debugInfo() {
    const audio = document.getElementById('backgroundAudio');
    const audioIndicator = document.getElementById('audioIndicator');
    
    console.log('🔧 Debug Info Avançado:');
    console.log('- Audio element:', audio);
    console.log('- Audio paused:', audio ? audio.paused : 'N/A');
    console.log('- Audio volume:', audio ? audio.volume : 'N/A');
    console.log('- Audio current time:', audio ? audio.currentTime : 'N/A');
    console.log('- Audio indicator:', audioIndicator);
    console.log('- Cards found:', document.querySelectorAll('.card').length);
    console.log('- Snow container:', document.querySelector('.snow-container'));
    console.log('- User interacted:', window.userInteracted || 'Not set');
}

// Atalho para debug (Ctrl + Shift + D)
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        debugInfo();
    }
});

// Garantia final - força reprodução a cada 5 segundos
setInterval(() => {
    const audio = document.getElementById('backgroundAudio');
    if (audio && audio.volume > 0 && audio.paused) {
        console.log('🎵 Forçando reprodução de áudio...');
        audio.play().catch(console.log);
    }
}, 5000);

// Proteção contra mudanças de página
window.addEventListener('beforeunload', (e) => {
    const audio = document.getElementById('backgroundAudio');
    if (audio && !audio.paused && audio.volume > 0) {
        // Salva estado para restaurar
        localStorage.setItem('arenaAudioState', JSON.stringify({
            playing: true,
            volume: audio.volume,
            currentTime: audio.currentTime,
            timestamp: Date.now()
        }));
    }
});

// Continuação da restauração ao carregar nova página
window.addEventListener('load', () => {
    const savedState = localStorage.getItem('arenaAudioState');
    if (savedState) {
        try {
            const state = JSON.parse(savedState);
            const timeDiff = Date.now() - state.timestamp;
            
            // Se passou menos de 30 segundos, restaura o áudio
            if (timeDiff < 30000 && state.playing) {
                const audio = document.getElementById('backgroundAudio');
                if (audio) {
                    audio.volume = state.volume;
                    audio.currentTime = state.currentTime;
                    
                    // Aguarda primeira interação para restaurar
                    const restoreAudio = () => {
                        audio.play().then(() => {
                            console.log('🎵 Áudio restaurado após navegação!');
                            const indicator = document.getElementById('audioIndicator');
                            if (indicator && audio.volume > 0) {
                                indicator.classList.add('playing');
                            }
                        }).catch(console.log);
                    };
                    
                    // Múltiplos eventos para garantir restauração
                    document.addEventListener('click', restoreAudio, { once: true });
                    document.addEventListener('scroll', restoreAudio, { once: true });
                    document.addEventListener('mousemove', restoreAudio, { once: true });
                    document.addEventListener('keydown', restoreAudio, { once: true });
                }
            }
        } catch (e) {
            console.log('Erro ao restaurar estado do áudio:', e);
        }
        
        // Limpa o estado salvo
        localStorage.removeItem('arenaAudioState');
    }
});

// Sistema de heartbeat para manter áudio vivo
function setupAudioHeartbeat() {
    const audio = document.getElementById('backgroundAudio');
    if (!audio) return;
    
    let heartbeatInterval;
    
    function startHeartbeat() {
        if (heartbeatInterval) return;
        
        heartbeatInterval = setInterval(() => {
            if (audio.volume > 0) {
                // Verifica se o áudio está realmente tocando
                if (audio.paused) {
                    console.log('💓 Heartbeat: Reativando áudio pausado');
                    audio.play().catch(console.log);
                }
                
                // Verifica se o tempo está avançando (detecta travamento)
                const currentTime = audio.currentTime;
                setTimeout(() => {
                    if (audio.currentTime === currentTime && !audio.paused && audio.volume > 0) {
                        console.log('💓 Heartbeat: Áudio travado detectado, reiniciando');
                        audio.load();
                        audio.play().catch(console.log);
                    }
                }, 2000);
            }
        }, 3000);
    }
    
    function stopHeartbeat() {
        if (heartbeatInterval) {
            clearInterval(heartbeatInterval);
            heartbeatInterval = null;
        }
    }
    
    // Inicia heartbeat quando áudio começar
    audio.addEventListener('play', startHeartbeat);
    audio.addEventListener('pause', () => {
        if (audio.volume === 0) {
            stopHeartbeat();
        }
    });
}

// Detecção avançada de interação do usuário
function setupAdvancedInteractionDetection() {
    let interactionDetected = false;
    const audio = document.getElementById('backgroundAudio');
    
    if (!audio) return;
    
    const allInteractionEvents = [
        'click', 'dblclick', 'mousedown', 'mouseup', 'mousemove',
        'touchstart', 'touchend', 'touchmove',
        'keydown', 'keyup', 'keypress',
        'scroll', 'wheel',
        'focus', 'blur',
        'resize', 'orientationchange'
    ];
    
    function handleInteraction(event) {
        if (!interactionDetected) {
            interactionDetected = true;
            console.log(`🎮 Primeira interação detectada: ${event.type}`);
            
            // Inicia áudio imediatamente
            if (audio.paused && audio.volume > 0) {
                audio.play().then(() => {
                    console.log('🎵 Áudio iniciado por interação!');
                }).catch(console.log);
            }
        }
        
        // Para eventos de scroll, sempre tenta manter o áudio
        if (event.type === 'scroll' || event.type === 'wheel') {
            if (audio.paused && audio.volume > 0) {
                audio.play().catch(console.log);
            }
        }
    }
    
    // Adiciona listeners para todos os eventos
    allInteractionEvents.forEach(eventType => {
        document.addEventListener(eventType, handleInteraction, { 
            passive: true, 
            capture: true 
        });
    });
    
    // Listener especial para window
    allInteractionEvents.forEach(eventType => {
        window.addEventListener(eventType, handleInteraction, { 
            passive: true, 
            capture: true 
        });
    });
}

// Sistema de recuperação de áudio
function setupAudioRecovery() {
    const audio = document.getElementById('backgroundAudio');
    if (!audio) return;
    
    let recoveryAttempts = 0;
    const maxRecoveryAttempts = 5;
    
    function attemptRecovery() {
        if (recoveryAttempts >= maxRecoveryAttempts) {
            console.log('❌ Máximo de tentativas de recuperação atingido');
            return;
        }
        
        recoveryAttempts++;
        console.log(`🔄 Tentativa de recuperação ${recoveryAttempts}/${maxRecoveryAttempts}`);
        
        // Recarrega o áudio
        audio.load();
        
        // Aguarda um pouco e tenta tocar
        setTimeout(() => {
            if (audio.volume > 0) {
                audio.play().then(() => {
                    console.log('✅ Recuperação bem-sucedida!');
                    recoveryAttempts = 0; // Reset contador
                }).catch(error => {
                    console.log('❌ Falha na recuperação:', error);
                    // Tenta novamente após delay
                    setTimeout(attemptRecovery, 2000);
                });
            }
        }, 1000);
    }
    
    // Eventos que podem precisar de recuperação
    audio.addEventListener('error', attemptRecovery);
    audio.addEventListener('stalled', attemptRecovery);
    audio.addEventListener('suspend', () => {
        if (audio.volume > 0) {
            attemptRecovery();
        }
    });
}

// Proteção contra políticas de autoplay
function setupAutoplayWorkaround() {
    const audio = document.getElementById('backgroundAudio');
    if (!audio) return;
    
    // Cria contexto de áudio para contornar restrições
    let audioContext;
    
    function initAudioContext() {
        if (!audioContext) {
            try {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
                console.log('🎵 Contexto de áudio criado');
            } catch (e) {
                console.log('❌ Erro ao criar contexto de áudio:', e);
            }
        }
        
        if (audioContext && audioContext.state === 'suspended') {
            audioContext.resume().then(() => {
                console.log('🎵 Contexto de áudio resumido');
            });
        }
    }
    
    // Inicializa contexto na primeira interação
    document.addEventListener('click', initAudioContext, { once: true });
    document.addEventListener('touchstart', initAudioContext, { once: true });
    
    // Conecta áudio ao contexto
    if (audioContext) {
        try {
            const source = audioContext.createMediaElementSource(audio);
            source.connect(audioContext.destination);
        } catch (e) {
            console.log('Erro ao conectar áudio ao contexto:', e);
        }
    }
}

// Sistema de notificação de estado do áudio
function setupAudioStatusNotification() {
    const audio = document.getElementById('backgroundAudio');
    if (!audio) return;
    
    let lastStatus = 'unknown';
    
    function updateStatus(status, details = '') {
        if (status !== lastStatus) {
            console.log(`🎵 Status do áudio: ${status} ${details}`);
            lastStatus = status;
            
            // Atualiza indicador visual se existir
            const indicator = document.getElementById('audioIndicator');
            if (indicator) {
                indicator.setAttribute('data-status', status);
                
                // Atualiza tooltip
                const tooltips = {
                    'playing': 'Música tocando - Clique para silenciar',
                    'paused': 'Música pausada - Clique para tocar',
                    'muted': 'Música silenciada - Clique para ativar',
                    'loading': 'Carregando música...',
                    'error': 'Erro no áudio - Clique para tentar novamente'
                };
                
                indicator.title = tooltips[status] || 'Controle de áudio';
            }
        }
    }
    
    // Monitora eventos de áudio
    audio.addEventListener('play', () => updateStatus('playing'));
    audio.addEventListener('pause', () => {
        updateStatus(audio.volume === 0 ? 'muted' : 'paused');
    });
    audio.addEventListener('loadstart', () => updateStatus('loading'));
    audio.addEventListener('error', () => updateStatus('error'));
    audio.addEventListener('volumechange', () => {
        if (audio.volume === 0) {
            updateStatus('muted');
        } else if (!audio.paused) {
            updateStatus('playing');
        }
    });
}

// Função para forçar reprodução em situações específicas
function forceAudioPlayback() {
    const audio = document.getElementById('backgroundAudio');
    if (!audio) return;
    
    // Força reprodução quando:
    
    // 1. Usuário volta para a aba
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden && audio.volume > 0 && audio.paused) {
            setTimeout(() => {
                audio.play().catch(console.log);
            }, 500);
        }
    });
    
    // 2. Janela ganha foco
    window.addEventListener('focus', () => {
        if (audio.volume > 0 && audio.paused) {
            audio.play().catch(console.log);
        }
    });
    
    // 3. Após qualquer clique na página
    document.addEventListener('click', () => {
        if (audio.volume > 0 && audio.paused) {
            audio.play().catch(console.log);
        }
    });
    
    // 4. Durante scroll
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            if (audio.volume > 0 && audio.paused) {
                audio.play().catch(console.log);
            }
        }, 100);
    });
}

// Inicialização de todos os sistemas de áudio
function initAllAudioSystems() {
    console.log('🎵 Inicializando sistemas avançados de áudio...');
    
    setupAudioHeartbeat();
    setupAdvancedInteractionDetection();
    setupAudioRecovery();
    setupAutoplayWorkaround();
    setupAudioStatusNotification();
    forceAudioPlayback();
    
    console.log('✅ Todos os sistemas de áudio inicializados!');
}

// Adiciona inicialização dos sistemas avançados
document.addEventListener('DOMContentLoaded', () => {
    // Aguarda um pouco para garantir que o DOM está pronto
    setTimeout(() => {
        initAllAudioSystems();
    }, 1000);
});

// Comando de console para debug completo
window.arenaDebug = {
    audio: () => {
        const audio = document.getElementById('backgroundAudio');
        return {
            element: audio,
            paused: audio?.paused,
            volume: audio?.volume,
            currentTime: audio?.currentTime,
            duration: audio?.duration,
            readyState: audio?.readyState,
            networkState: audio?.networkState
        };
    },
    forcePlay: () => {
        const audio = document.getElementById('backgroundAudio');
        if (audio) {
            audio.play().then(() => {
                console.log('✅ Áudio forçado com sucesso!');
            }).catch(error => {
                console.log('❌ Erro ao forçar áudio:', error);
            });
        }
    },
    toggleVolume: () => {
        const audio = document.getElementById('backgroundAudio');
        if (audio) {
            audio.volume = audio.volume > 0 ? 0 : 0.3;
            console.log(`🔊 Volume alterado para: ${audio.volume}`);
        }
    }
};

console.log('🎮 VITOR MOURA Debug disponível em window.arenaDebug');





// Adicione estas funções ao seu script.js existente

// Contador animado para estatísticas
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                const duration = 2000; // 2 segundos
                const step = target / (duration / 16); // 60fps
                let current = 0;
                
                const updateCounter = () => {
                    current += step;
                    if (current < target) {
                        counter.textContent = Math.floor(current).toLocaleString();
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target.toLocaleString();
                    }
                };
                
                updateCounter();
                observer.unobserve(counter);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => observer.observe(counter));
}

// Status da live (simulado)
function updateLiveStatus() {
    const liveCard = document.querySelector('[data-network="kick"]');
    const liveIndicator = liveCard?.querySelector('.live-indicator');
    const viewersSpan = liveCard?.querySelector('.viewers');
    
    if (liveIndicator && viewersSpan) {
        // Simula viewers online (entre 50-500)
        const viewers = Math.floor(Math.random() * 450) + 50;
        viewersSpan.textContent = `🔴 ${viewers} assistindo`;
        
        // Atualiza a cada 30 segundos
        setTimeout(updateLiveStatus, 30000);
    }
}

// Efeito de hover especial para cards
function setupSpecialCardEffects() {
    const specialCards = document.querySelectorAll('.special-card, .trendy-card, .twitter-card, .city-card');
    
    specialCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            // Adiciona partículas ou efeitos especiais
            createParticleEffect(card);
        });
        
        card.addEventListener('mouseleave', () => {
            // Remove efeitos
            removeParticleEffect(card);
        });
    });
}

// Cria efeito de partículas
function createParticleEffect(element) {
    const particles = document.createElement('div');
    particles.className = 'particle-effect';
    particles.innerHTML = '✨'.repeat(5);
    element.appendChild(particles);
    
    // Remove após animação
    setTimeout(() => {
        if (particles.parentNode) {
            particles.parentNode.removeChild(particles);
        }
    }, 1000);
}

function removeParticleEffect(element) {
    const particles = element.querySelector('.particle-effect');
    if (particles) {
        particles.remove();
    }
}

// Notificações de interação
function setupInteractionNotifications() {
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        const button = card.querySelector('.card-button');
        
        button?.addEventListener('click', (e) => {
            e.preventDefault();
            
            const network = card.getAttribute('data-network');
            showNotification(network);
            
            // Efeito de ripple no botão
            createRippleEffect(e.target, e);
        });
    });
}

// Mostra notificação personalizada
function showNotification(network) {
    const messages = {
        'kick': '🔴 Redirecionando para a live na Kick...',
        'tiktok': '🎵 Abrindo TikTok do VITOR MOURA...',
        'twitter': '🐦 Seguindo no Twitter...',
        'cidade': '🏙️ Conectando à Cidade do MTA...',
        'youtube': '📺 Abrindo canal do YouTube...',
        'instagram': '📷 Visitando Instagram...',
        'discord': '💬 Entrando no Discord...',
        'community': '👥 Acessando comunidade...',
        'loja': '🛒 Visitando loja Arena Host...',
        'mods': '⭐ Abrindo site de mods...'
    };
    
    const notification = document.createElement('div');
    notification.className = 'custom-notification';
    notification.textContent = messages[network] || '🔗 Redirecionando...';
    
    document.body.appendChild(notification);
    
    // Anima entrada
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Remove após 3 segundos
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Cria efeito ripple nos botões
function createRippleEffect(button, event) {
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');
    
    button.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
}

// Sistema de tema dinâmico
function setupDynamicTheme() {
    const hour = new Date().getHours();
    const body = document.body;
    
    // Tema baseado no horário
    if (hour >= 6 && hour < 12) {
        body.classList.add('morning-theme');
    } else if (hour >= 12 && hour < 18) {
        body.classList.add('afternoon-theme');
    } else if (hour >= 18 && hour < 22) {
        body.classList.add('evening-theme');
    } else {
        body.classList.add('night-theme');
    }
}

// Parallax suave para elementos
function setupParallaxEffect() {
    const parallaxElements = document.querySelectorAll('.card, .stat-card');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        parallaxElements.forEach((element, index) => {
            const speed = (index % 3 + 1) * 0.1;
            element.style.transform = `translateY(${rate * speed}px)`;
        });
    });
}

// Detector de dispositivo para otimizações
function detectDevice() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isTablet = /iPad|Android/i.test(navigator.userAgent) && window.innerWidth > 768;
    
    if (isMobile) {
        document.body.classList.add('mobile-device');
        // Desabilita alguns efeitos pesados em mobile
        disableHeavyAnimations();
    } else if (isTablet) {
        document.body.classList.add('tablet-device');
    } else {
        document.body.classList.add('desktop-device');
        // Habilita efeitos avançados no desktop
        enableAdvancedEffects();
    }
}

function disableHeavyAnimations() {
    const style = document.createElement('style');
    style.textContent = `
        .snow-container { display: none !important; }
        .card::before { display: none !important; }
        * { animation-duration: 0.1s !important; }
    `;
    document.head.appendChild(style);
}

function enableAdvancedEffects() {
    // Efeito de mouse trail
    setupMouseTrail();
    // Partículas de fundo
    setupBackgroundParticles();
}

// Efeito de rastro do mouse
function setupMouseTrail() {
    const trail = [];
    const trailLength = 10;
    
    document.addEventListener('mousemove', (e) => {
        trail.push({ x: e.clientX, y: e.clientY, time: Date.now() });
        
        if (trail.length > trailLength) {
            trail.shift();
        }
        
        updateTrail();
    });
    
    function updateTrail() {
        const existingTrails = document.querySelectorAll('.mouse-trail');
        existingTrails.forEach(t => t.remove());
        
        trail.forEach((point, index) => {
            const trailElement = document.createElement('div');
            trailElement.className = 'mouse-trail';
            trailElement.style.left = point.x + 'px';
            trailElement.style.top = point.y + 'px';
            trailElement.style.opacity = index / trailLength;
            trailElement.style.transform = `scale(${index / trailLength})`;
            
            document.body.appendChild(trailElement);
            
            setTimeout(() => trailElement.remove(), 500);
        });
    }
}

// Sistema de conquistas/badges
function setupAchievementSystem() {
    const achievements = {
        'first_visit': { name: 'Primeira Visita', icon: '🎉', unlocked: false },
        'explorer': { name: 'Explorador', icon: '🗺️', unlocked: false },
        'social_butterfly': { name: 'Borboleta Social', icon: '🦋', unlocked: false },
        'night_owl': { name: 'Coruja Noturna', icon: '🦉', unlocked: false }
    };
    
    // Verifica conquistas
    checkAchievements(achievements);
    
    // Salva no localStorage
    localStorage.setItem('arena_achievements', JSON.stringify(achievements));
}

function checkAchievements(achievements) {
    // Primeira visita
    if (!localStorage.getItem('arena_first_visit')) {
        unlockAchievement('first_visit', achievements);
        localStorage.setItem('arena_first_visit', 'true');
    }
    
    // Explorador (clicou em 3+ cards)
    const clickCount = parseInt(localStorage.getItem('arena_click_count') || '0');
    if (clickCount >= 3 && !achievements.explorer.unlocked) {
        unlockAchievement('explorer', achievements);
    }
    
    // Coruja noturna (visitou após 22h)
    const hour = new Date().getHours();
    if (hour >= 22 || hour < 6) {
        unlockAchievement('night_owl', achievements);
    }
}

function unlockAchievement(id, achievements) {
    achievements[id].unlocked = true;
    showAchievementNotification(achievements[id]);
}

function showAchievementNotification(achievement) {
    const notification = document.createElement('div');
    notification.className = 'achievement-notification';
    notification.innerHTML = `
        <div class="achievement-icon">${achievement.icon}</div>
        <div class="achievement-text">
            <div class="achievement-title">Conquista Desbloqueada!</div>
            <div class="achievement-name">${achievement.name}</div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 100);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 500);
    }, 4000);
}

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    // Funções existentes
    if (typeof createSnowflakes === 'function') createSnowflakes();
    if (typeof setupAudioControls === 'function') setupAudioControls();
    
    // Novas funções
    animateCounters();
    updateLiveStatus();
    setupSpecialCardEffects();
    setupInteractionNotifications();
    setupDynamicTheme();
    detectDevice();
    setupAchievementSystem();
    
    // Só habilita parallax em desktop
    if (!document.body.classList.contains('mobile-device')) {
        setupParallaxEffect();
    }
    
    // Contador de cliques para conquistas
    document.addEventListener('click', () => {
        const currentCount = parseInt(localStorage.getItem('arena_click_count') || '0');
        localStorage.setItem('arena_click_count', (currentCount + 1).toString());
    });
    
    // Smooth scroll para links internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Loading screen fade out
    const loadingScreen = document.querySelector('.loading-screen');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.classList.add('fade-out');
            setTimeout(() => loadingScreen.remove(), 500);
        }, 1000);
    }
});

// Performance monitoring
function monitorPerformance() {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            console.log(`VITOR MOURA carregou em ${loadTime}ms`);
            
            // Se demorou muito, sugere otimizações
            if (loadTime > 3000) {
                console.warn('Carregamento lento detectado. Considere otimizações.');
            }
        });
    }
}

// Função para detectar dispositivos móveis
function isMobile() {
    return window.innerWidth <= 768; // Ou outro critério de breakpoint
}

// Ajustar animações para mobile
function adjustForMobile() {
    if (isMobile()) {
        // Desabilitar animações pesadas
        document.body.classList.add('mobile');
        // Pode desabilitar ou ajustar os efeitos pesados, como partículas ou animações intensas
        const style = document.createElement('style');
        style.textContent = `
            .snowflake {
                animation-duration: 5s !important; /* Lenta no mobile */
            }
            .card {
                transition: none !important; /* Desabilitar transições nos cards no mobile */
            }
            .card-button {
                transition: none !important; /* Desabilitar transições nos botões */
            }
        `;
        document.head.appendChild(style);
    } else {
        document.body.classList.remove('mobile');
    }
}

// Chama a função no carregamento e no redimensionamento da tela
adjustForMobile();
window.addEventListener('resize', adjustForMobile);


monitorPerformance();
