// =======================================================
// Funções de Utilitários
// =======================================================

// Função para detectar dispositivos móveis
function isMobile() {
    return window.innerWidth <= 768; // Ajuste conforme necessário
}


// =======================================================
// Funções de Animação e Interatividade
// =======================================================

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
    
    // CSS para o loader (injetado dinamicamente para carregamento rápido)
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
            transition: opacity 0.5s ease-out;
            pointer-events: all; /* Garante que o loader bloqueie interações */
        }
        
        .loader-logo {
            font-family: 'Poppins', sans-serif; /* Certifique-se que esta fonte está carregada no seu CSS principal */
            font-size: 3rem;
            font-weight: 700;
            background: linear-gradient(45deg, #00ff88, #00cc6a);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 2rem;
            animation: pulse 1.5s ease-in-out infinite; /* Efeito de pulso para o texto do loader */
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
            animation: loading 2s ease-in-out forwards;
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
        
        @media (max-width: 768px) {
            .loader-logo { font-size: 2rem; }
            .loader-bar { width: 80%; }
        }
    `;
    document.head.appendChild(loaderStyle);
    document.body.appendChild(loader);
    
    // Remove o loader após a animação
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
            if (loader.parentNode) {
                loader.remove();
            }
        }, 500); // Duração do fade-out
    }, 2500); // Tempo total: 2s (progress bar) + 0.5s (fade-out) = 2.5s para o loader sumir
}

// Animação de entrada dos cartões
function animateCards() {
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';
        
        // Desativa animações de entrada no mobile para leveza
        const animationDuration = isMobile() ? '0s' : '0.6s'; 
        const delay = isMobile() ? 0 : index * 100; // Remove delay no mobile
        
        setTimeout(() => {
            card.style.transition = `all ${animationDuration} cubic-bezier(0.175, 0.885, 0.32, 1.275)`;
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, delay);
    });
}

// Efeito de clique nos botões (ripple effect)
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
            }, 600); // Duração da animação ripple
            
            // Redirecionar para as redes sociais - Chame handleNetworkClick aqui
            const networkType = this.closest('.card').dataset.network;
            handleNetworkClick(networkType);
        });
    });
}

// Adicionar CSS para o efeito ripple (injetado dinamicamente)
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

// Função para lidar com cliques nas redes sociais
function handleNetworkClick(network) {
    const networks = {
        linkedin: 'https://www.linkedin.com/in/vitor-moura-312976325/',
        instagram: 'https://www.instagram.com/viictor_158/',
        discord: 'https://discord.gg/FvwXhJzDn2',
        github: 'https://github.com/ViictorM0ura',
    };
    
    if (networks[network]) {
        const card = document.querySelector(`[data-network="${network}"]`);
        if (card) {
            card.style.transform = 'scale(0.95)'; // Pequena animação de clique no card
            setTimeout(() => {
                window.open(networks[network], '_blank');
                card.style.transform = ''; // Volta ao normal
            }, 150);
        }
    }
}

// Efeito de parallax suave no scroll (apenas desktop)
function addParallaxEffect() {
    if (isMobile()) {
        return; // Desativa o parallax em dispositivos móveis
    }

    let ticking = false;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const parallax = document.querySelector('.logo-container'); 
        if (parallax) {
            const speed = scrolled * 0.5; // Ajuste a velocidade se desejar
            parallax.style.transform = `translateY(${speed}px)`;
        }
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }, { passive: true }); 
}


function typeWriter() {
    const logo = document.querySelector('.logo');
    if (!logo) return;
    
    const text = 'VITOR MOURA'; // O texto que será digitado
    logo.innerHTML = ''; // Limpa o conteúdo inicial
    
    let i = 0;
    const timer = setInterval(() => {
        if (i < text.length) {
            logo.innerHTML += text.charAt(i);
            i++;
        } else {
            clearInterval(timer);
        }
    }, 150); // Velocidade da digitação
}

// Observador de interseção para animações de cards (ativa animação quando aparece na tela)
function setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Aplica os estilos para tornar o card visível e animá-lo
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target); // Para animar apenas uma vez
            }
        });
    }, { threshold: 0.1 }); // Ajuste o threshold se precisar que o card esteja mais ou menos visível
    
    document.querySelectorAll('.card').forEach(card => {
        card.style.opacity = '0'; // Garante que cards comecem invisíveis
        card.style.transform = 'translateY(50px)';
        observer.observe(card);
    });
}

// Notificações de interação (para feedback visual ao clicar nos cards)
function setupInteractionNotifications() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        const button = card.querySelector('.card-button');
        button?.addEventListener('click', (e) => {
            e.preventDefault(); // Previne o link de abrir imediatamente
            
            const network = card.getAttribute('data-network');
            showNotification(network); // Mostra a notificação
            
            // Re-chama o redirecionamento com delay para dar tempo da notificação aparecer
            setTimeout(() => {
                handleNetworkClick(network);
            }, 150); // Pequeno delay para a notificação aparecer primeiro
        });
    });
}

// Mostra notificação personalizada
function showNotification(network) {
    const messages = {
        'linkedin': '🔗 Abrindo LinkedIn...',
        'instagram': '📷 Visitando Instagram...',
        'discord': '💬 Entrando no Discord...',
        'github': '💻 Abrindo GitHub...',
    };
    
    const notification = document.createElement('div');
    notification.className = 'custom-notification';
    notification.textContent = messages[network] || '🔗 Redirecionando...';
    
    // CSS para a notificação (injetado dinamicamente para garantir que esteja lá)
    const notificationStyle = document.createElement('style');
    notificationStyle.textContent = `
        .custom-notification {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.8);
            color: #00ff88;
            padding: 10px 20px;
            border-radius: 8px;
            font-family: 'Poppins', sans-serif; /* Certifique-se que esta fonte está carregada */
            font-size: 1rem;
            z-index: 9999;
            opacity: 0;
            transition: opacity 0.3s ease-in-out;
            pointer-events: none; /* Não bloqueia cliques */
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
            white-space: nowrap; /* Evita que o texto quebre em várias linhas */
        }
        .custom-notification.show {
            opacity: 1;
        }
        /* Ajustes para mobile */
        @media (max-width: 768px) {
            .custom-notification {
                font-size: 0.85rem;
                padding: 8px 15px;
            }
        }
    `;
    document.head.appendChild(notificationStyle);
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 100);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000); // Notificação visível por 3 segundos
}


// =======================================================
// Inicialização Principal
// =======================================================

// Inicialização de todas as funcionalidades quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    // 1. Mostrar a animação de carregamento IMEDIATAMENTE.
    showLoadingAnimation(); 
    
    // 2. Após o loader desaparecer, inicializar as outras funcionalidades.
    // O setTimeout aqui sincroniza com o fim da animação do loader.
    setTimeout(() => {
        addRippleCSS(); // Adiciona o CSS para o efeito ripple dos botões
        addButtonEffects(); // Ativa os efeitos de clique nos botões
        setupIntersectionObserver(); // Configura a animação de entrada dos cards
        addParallaxEffect(); // Ativa o efeito parallax (apenas desktop)
        typeWriter(); // Inicia o efeito de digitação do título
        setupInteractionNotifications(); // Configura as notificações ao interagir com cards
        
        console.log('🎮 VITOR MOURA - Site otimizado carregado com sucesso!');
        console.log('✨ Efeitos essenciais ativados: Loader, Cards, Botões, Parallax, Notificações, Digitação!');
    }, 2500); // Este tempo deve ser igual ou ligeiramente maior que o tempo total do loader (2s animação + 0.5s fade-out)
});

// Listener para ajustar parallax e outras coisas em resize
window.addEventListener('resize', () => {
    // Re-avalia o parallax em resize para desktop
    addParallaxEffect();
    // Se tiver outras otimizações responsivas baseadas em JS, adicione-as aqui.
});