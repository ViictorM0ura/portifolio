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
// Função para lidar com o clique no link de e-mail/WhatsApp
function setupContactOptions() {
    const contactEmailLink = document.getElementById('contactEmailLink');
    if (!contactEmailLink) {
        console.warn('Link de contato não encontrado no rodapé.');
        return;
    }

    contactEmailLink.addEventListener('click', (event) => {
        event.preventDefault(); 

        const email = 'contatovitormoura1998@gmail.com';
        const phoneNumber = '5571987300325';

        // Cria a caixa de diálogo/opções
        const dialog = document.createElement('div');
        dialog.classList.add('contact-dialog');
        dialog.innerHTML = `
            <p>Como você prefere entrar em contato?</p>
            <button class="dialog-button email-option">Enviar E-MAIL</button>
            <button class="dialog-button whatsapp-option">WhatsApp</button>
            <button class="dialog-button close-dialog">Cancelar</button>
        `;

        // Adiciona os estilos da caixa de diálogo (injetado dinamicamente)
        const dialogStyle = document.createElement('style');
        dialogStyle.textContent = `
            .contact-dialog {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: #1a1a1a; /* Fundo escuro */
                border: 2px solid #00ff88; /* Borda verde */
                border-radius: 10px;
                padding: 25px;
                z-index: 10001; /* Acima de tudo */
                text-align: center;
                box-shadow: 0 10px 30px rgba(0, 255, 136, 0.4);
                display: flex;
                flex-direction: column;
                gap: 15px;
                opacity: 0;
                transform: translate(-50%, -50%) scale(0.8);
                transition: opacity 0.3s ease, transform 0.3s ease;
                max-width: 90%; /* Limita a largura em telas menores */
            }
            .contact-dialog.show {
                opacity: 1;
                transform: translate(-50%, -50%) scale(1);
            }
            .contact-dialog p {
                font-size: 1.1rem;
                color: #ffffff;
                margin-bottom: 15px;
            }
            .dialog-button {
                background: linear-gradient(45deg, #00ff88, #00cc6a);
                color: #121212;
                border: none;
                padding: 12px 20px;
                border-radius: 25px;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: 1rem;
                width: 100%; /* Botões com largura total */
            }
            .dialog-button:hover {
                background: linear-gradient(45deg, #00cc6a, #00ff88);
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(0, 255, 136, 0.2);
            }
            .dialog-button.close-dialog {
                background: rgba(255, 255, 255, 0.1);
                color: #ffffff;
            }
            .dialog-button.close-dialog:hover {
                background: rgba(255, 255, 255, 0.2);
                color: #ffffff;
                box-shadow: none;
                transform: none;
            }
            /* Overlay para escurecer o fundo */
            .overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                z-index: 10000;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            .overlay.show {
                opacity: 1;
            }
        `;
        document.head.appendChild(dialogStyle);

        const overlay = document.createElement('div');
        overlay.classList.add('overlay');
        document.body.appendChild(overlay);
        document.body.appendChild(dialog);

        // Adiciona classe 'show' para animação de entrada
        setTimeout(() => {
            overlay.classList.add('show');
            dialog.classList.add('show');
        }, 10);

        // Lógica dos botões
        dialog.querySelector('.email-option').addEventListener('click', () => {
            window.location.href = `mailto:${email}`;
            closeDialog();
        });

        dialog.querySelector('.whatsapp-option').addEventListener('click', () => {
            // Link para WhatsApp (Web ou App)
            window.open(`https://wa.me/${phoneNumber}?text=Olá%2C%20visitei%20seu%20portfólio%20e%20gostaria%20de%20saber%20mais%20sobre.`, '_blank');
            closeDialog();
        });

        dialog.querySelector('.close-dialog').addEventListener('click', closeDialog);
        overlay.addEventListener('click', closeDialog); // Clicar fora fecha o diálogo

        function closeDialog() {
            dialog.classList.remove('show');
            overlay.classList.remove('show');
            setTimeout(() => {
                dialog.remove();
                overlay.remove();
                dialogStyle.remove(); // Remove os estilos também
            }, 300); // Tempo da transição de saída
        }
    });
}

// Chame a nova função na inicialização principal
document.addEventListener('DOMContentLoaded', () => {
    showLoadingAnimation();
    
    setTimeout(() => {
        // ... (suas outras chamadas de função) ...
        addRippleCSS();
        addButtonEffects();
        setupIntersectionObserver();
        addParallaxEffect();
        typeWriter();
        setupInteractionNotifications();
        
        setupContactOptions(); // <--- ADICIONADO AQUI
        
        console.log('🎮 VITOR MOURA - Site otimizado carregado com sucesso!');
        console.log('✨ Efeitos essenciais ativados: Loader, Cards, Botões, Parallax, Notificações, Digitação, Opções de Contato!');
    }, 2500);
});

// Listener para ajustar parallax e outras coisas em resize
window.addEventListener('resize', () => {
    // Re-avalia o parallax em resize para desktop
    addParallaxEffect();
    // Se tiver outras otimizações responsivas baseadas em JS, adicione-as aqui.
});

