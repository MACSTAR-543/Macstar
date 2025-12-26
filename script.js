// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('MACSTAR Wallet Portfolio Initializing...');
    
    // Initialize all components
    initializeNavigation();
    initializeStats();
    initializeRepositories();
    initializeTerminal();
    initializeAnimations();
    initializeForm();
    initializeWalletEffects();
});

// Navigation System
function initializeNavigation() {
    const navCards = document.querySelectorAll('.nav-card');
    const tabContents = document.querySelectorAll('.tab-content');
    
    navCards.forEach(card => {
        card.addEventListener('click', () => {
            const tabId = card.getAttribute('data-tab');
            
            // Update active nav card
            navCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            
            // Show corresponding tab
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === `${tabId}-tab`) {
                    content.classList.add('active');
                    
                    // Trigger content-specific initialization
                    if (tabId === 'repos') {
                        loadRepositories();
                    }
                }
            });
            
            // Add click effect
            card.style.transform = 'scale(0.95)';
            setTimeout(() => {
                card.style.transform = '';
            }, 150);
        });
    });
}

// Animated Stats Counter
function initializeStats() {
    const statValues = document.querySelectorAll('.stat-value[data-count]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const target = parseInt(element.getAttribute('data-count'));
                animateCounter(element, target);
                observer.unobserve(element);
            }
        });
    }, { threshold: 0.5 });
    
    statValues.forEach(stat => observer.observe(stat));
}

function animateCounter(element, target) {
    const duration = 2000;
    const frameDuration = 1000 / 60;
    const totalFrames = Math.round(duration / frameDuration);
    let frame = 0;
    
    const counter = setInterval(() => {
        frame++;
        const progress = frame / totalFrames;
        const currentValue = Math.round(target * progress);
        
        element.textContent = currentValue;
        
        if (frame === totalFrames) {
            clearInterval(counter);
        }
    }, frameDuration);
}

// GitHub Repositories
async function initializeRepositories() {
    // Load initial repositories
    loadRepositories();
    
    // Setup load more button
    const loadMoreBtn = document.querySelector('.btn-load-more');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', loadMoreRepositories);
    }
}

async function loadRepositories() {
    const reposGrid = document.querySelector('.repos-grid');
    if (!reposGrid) return;
    
    // Show loading state
    reposGrid.innerHTML = `
        <div class="repo-card loading">
            <div class="repo-skeleton"></div>
        </div>
        <div class="repo-card loading">
            <div class="repo-skeleton"></div>
        </div>
        <div class="repo-card loading">
            <div class="repo-skeleton"></div>
        </div>
    `;
    
    try {
        // In production, replace with actual GitHub API call
        // const response = await fetch('https://api.github.com/users/MACSTAR/repos');
        // const repos = await response.json();
        
        // Simulated repositories data
        const mockRepos = [
            {
                name: 'cyberwallet-api',
                description: 'Secure blockchain wallet management system with multi-signature support',
                language: 'JavaScript',
                stars: 24,
                forks: 8,
                updated: '2023-10-15',
                topics: ['blockchain', 'security', 'nodejs', 'express']
            },
            {
                name: 'secure-auth',
                description: 'Authentication middleware with advanced security features',
                language: 'TypeScript',
                stars: 18,
                forks: 5,
                updated: '2023-10-10',
                topics: ['authentication', 'security', 'middleware', 'oauth2']
            },
            {
                name: 'devops-dashboard',
                description: 'Real-time monitoring dashboard for Docker containers',
                language: 'JavaScript',
                stars: 31,
                forks: 12,
                updated: '2023-10-05',
                topics: ['react', 'docker', 'monitoring', 'devops']
            },
            {
                name: 'code-analyzer',
                description: 'Static code analysis tool for security vulnerabilities',
                language: 'Python',
                stars: 15,
                forks: 3,
                updated: '2023-09-28',
                topics: ['security', 'python', 'analysis', 'automation']
            },
            {
                name: 'api-gateway',
                description: 'Microservices API gateway with rate limiting and caching',
                language: 'Go',
                stars: 22,
                forks: 6,
                updated: '2023-09-20',
                topics: ['microservices', 'api', 'golang', 'gateway']
            },
            {
                name: 'crypto-tracker',
                description: 'Real-time cryptocurrency price tracking dashboard',
                language: 'JavaScript',
                stars: 29,
                forks: 9,
                updated: '2023-09-15',
                topics: ['crypto', 'react', 'websocket', 'dashboard']
            }
        ];
        
        displayRepositories(mockRepos);
    } catch (error) {
        console.error('Error loading repositories:', error);
        reposGrid.innerHTML = `
            <div class="repo-card error">
                <h3>Error Loading Repositories</h3>
                <p>Failed to fetch GitHub data. Please try again later.</p>
            </div>
        `;
    }
}

function displayRepositories(repos) {
    const reposGrid = document.querySelector('.repos-grid');
    if (!reposGrid) return;
    
    reposGrid.innerHTML = '';
    
    repos.forEach(repo => {
        const repoCard = document.createElement('div');
        repoCard.className = 'repo-card';
        
        const timeAgo = getTimeAgo(repo.updated);
        
        repoCard.innerHTML = `
            <div class="repo-header">
                <h3>${repo.name}</h3>
                <div class="repo-stats">
                    <span><i class="fas fa-star"></i> ${repo.stars}</span>
                    <span><i class="fas fa-code-branch"></i> ${repo.forks}</span>
                </div>
            </div>
            <p class="repo-desc">${repo.description}</p>
            <div class="repo-tech">
                <span>${repo.language}</span>
                ${repo.topics.map(topic => `<span>${topic}</span>`).join('')}
            </div>
            <div class="repo-footer">
                <span class="repo-updated">Updated ${timeAgo}</span>
                <a href="#" class="repo-link">
                    View Code
                    <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        `;
        
        reposGrid.appendChild(repoCard);
    });
}

function getTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return 'today';
    if (days === 1) return 'yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    if (days < 365) return `${Math.floor(days / 30)} months ago`;
    return `${Math.floor(days / 365)} years ago`;
}

function loadMoreRepositories() {
    const btn = document.querySelector('.btn-load-more');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
    btn.disabled = true;
    
    setTimeout(() => {
        // Simulate loading more repos
        const additionalRepos = [
            {
                name: 'portfolio-v3',
                description: 'This portfolio website - version 3.0',
                language: 'JavaScript',
                stars: 12,
                forks: 3,
                updated: '2023-10-01',
                topics: ['portfolio', 'react', 'cyberpunk', 'design']
            },
            {
                name: 'cli-toolkit',
                description: 'Command line tools for developer productivity',
                language: 'Python',
                stars: 8,
                forks: 2,
                updated: '2023-09-25',
                topics: ['cli', 'python', 'tools', 'automation']
            }
        ];
        
        // Append to existing repos
        const reposGrid = document.querySelector('.repos-grid');
        additionalRepos.forEach(repo => {
            const repoCard = document.createElement('div');
            repoCard.className = 'repo-card';
            repoCard.innerHTML = `
                <div class="repo-header">
                    <h3>${repo.name}</h3>
                    <div class="repo-stats">
                        <span><i class="fas fa-star"></i> ${repo.stars}</span>
                        <span><i class="fas fa-code-branch"></i> ${repo.forks}</span>
                    </div>
                </div>
                <p class="repo-desc">${repo.description}</p>
                <div class="repo-tech">
                    <span>${repo.language}</span>
                    ${repo.topics.map(topic => `<span>${topic}</span>`).join('')}
                </div>
                <div class="repo-footer">
                    <span class="repo-updated">Updated ${getTimeAgo(repo.updated)}</span>
                    <a href="#" class="repo-link">
                        View Code
                        <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            `;
            reposGrid.appendChild(repoCard);
        });
        
        btn.innerHTML = '<i class="fas fa-sync"></i> Load More Repositories';
        btn.disabled = false;
        
        // Show notification
        showNotification('2 more repositories loaded successfully!', 'success');
    }, 1500);
}

// Terminal System
function initializeTerminal() {
    const terminal = document.querySelector('.terminal-modal');
    const terminalInput = document.querySelector('.terminal-input input');
    const closeBtn = document.querySelector('.term-btn.close');
    const minimizeBtn = document.querySelector('.term-btn.minimize');
    const maximizeBtn = document.querySelector('.term-btn.maximize');
    
    // Show terminal after 3 seconds
    setTimeout(() => {
        terminal.style.display = 'block';
        setTimeout(() => {
            terminal.style.transform = 'translateY(0)';
            terminal.style.opacity = '1';
        }, 10);
    }, 3000);
    
    // Terminal commands
    if (terminalInput) {
        terminalInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const command = terminalInput.value.trim().toLowerCase();
                processCommand(command);
                terminalInput.value = '';
            }
        });
    }
    
    // Terminal controls
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            terminal.style.transform = 'translateY(100px)';
            terminal.style.opacity = '0';
            setTimeout(() => {
                terminal.style.display = 'none';
            }, 300);
        });
    }
    
    if (minimizeBtn) {
        minimizeBtn.addEventListener('click', () => {
            terminal.style.transform = 'translateY(calc(100% - 40px))';
        });
    }
    
    if (maximizeBtn) {
        maximizeBtn.addEventListener('click', () => {
            if (terminal.style.transform.includes('translateY(0)')) {
                terminal.style.width = '90%';
                terminal.style.height = '80vh';
            } else {
                terminal.style.width = '';
                terminal.style.height = '';
                terminal.style.transform = 'translateY(0)';
            }
        });
    }
}

function processCommand(command) {
    const output = document.querySelector('.terminal-output');
    
    // Add command to output
    output.innerHTML += `<p><span class="term-prompt">user@macstar:~$</span> ${command}</p>`;
    
    // Process command
    switch(command) {
        case 'help':
            output.innerHTML += `
                <p>Available commands:</p>
                <p>• help - Show this help message</p>
                <p>• about - About MACSTAR</p>
                <p>• skills - Show technical skills</p>
                <p>• projects - List projects</p>
                <p>• contact - Contact information</p>
                <p>• clear - Clear terminal</p>
                <p>• github - Open GitHub profile</p>
            `;
            break;
            
        case 'about':
            output.innerHTML += `
                <p>MACSTAR - Cyber Developer</p>
                <p>Full-stack developer specializing in security and blockchain</p>
                <p>Passionate about creating secure, scalable applications</p>
                <p>Open source contributor and tech enthusiast</p>
            `;
            break;
            
        case 'skills':
            output.innerHTML += `
                <p>Technical Skills:</p>
                <p>• JavaScript/TypeScript - ⭐⭐⭐⭐⭐</p>
                <p>• Python - ⭐⭐⭐⭐</p>
                <p>• React/Node.js - ⭐⭐⭐⭐⭐</p>
                <p>• Docker/Kubernetes - ⭐⭐⭐</p>
                <p>• AWS/GCP - ⭐⭐⭐⭐</p>
                <p>• Blockchain/Security - ⭐⭐⭐⭐⭐</p>
            `;
            break;
            
        case 'projects':
            output.innerHTML += `
                <p>Featured Projects:</p>
                <p>• CyberWallet API - Secure blockchain wallet system</p>
                <p>• SecureAuth Middleware - Advanced authentication</p>
                <p>• DevOps Dashboard - Container monitoring</p>
                <p>• Code Analyzer - Security vulnerability scanner</p>
                <p>• Crypto Tracker - Real-time price dashboard</p>
            `;
            break;
            
        case 'contact':
            output.innerHTML += `
                <p>Contact Information:</p>
                <p>• GitHub: github.com/MACSTAR</p>
                <p>• Email: macstar@dev.com</p>
                <p>• LinkedIn: linkedin.com/in/macstar</p>
                <p>• Twitter: @MACSTAR_dev</p>
            `;
            break;
            
        case 'clear':
            output.innerHTML = '';
            break;
            
        case 'github':
            output.innerHTML += `<p>Opening GitHub profile...</p>`;
            setTimeout(() => {
                window.open('https://github.com/MACSTAR', '_blank');
            }, 500);
            break;
            
        default:
            output.innerHTML += `<p>Command not found: ${command}. Type 'help' for available commands.</p>`;
    }
    
    // Scroll to bottom
    output.scrollTop = output.scrollHeight;
}

// Animations
function initializeAnimations() {
    // Add hover effects to all cards
    const cards = document.querySelectorAll('.card, .repo-card, .skill-card, .project-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
    
    // Animate skill bars on scroll
    const skillBars = document.querySelectorAll('.level-bar');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const width = bar.style.width;
                bar.style.width = '0';
                
                setTimeout(() => {
                    bar.style.transition = 'width 1.5s ease';
                    bar.style.width = width;
                }, 300);
                
                observer.unobserve(bar);
            }
        });
    }, { threshold: 0.3 });
    
    skillBars.forEach(bar => observer.observe(bar));
}

// Form Handling
function initializeForm() {
    const form = document.getElementById('messageForm');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Show loading state
        const submitBtn = form.querySelector('.btn-send');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-lock"></i> Encrypting...';
        submitBtn.disabled = true;
        
        // Simulate encryption and sending
        setTimeout(() => {
            console.log('Message sent:', data);
            
            // Show success message
            showNotification('Message encrypted and sent successfully!', 'success');
            
            // Reset form
            form.reset();
            
            // Restore button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 2000);
    });
}

// Wallet Effects
function initializeWalletEffects() {
    // Add scanning effect to chip
    const chipGlow = document.querySelector('.chip-glow');
    if (chipGlow) {
        setInterval(() => {
            chipGlow.style.opacity = Math.random() > 0.5 ? '0.7' : '0.3';
        }, 2000);
    }
    
    // Update balance with random fluctuation (simulation)
    const balanceAmount = document.querySelector('.balance-amount .amount');
    if (balanceAmount) {
        setInterval(() => {
            const current = parseInt(balanceAmount.textContent.replace(',', ''));
            const change = Math.random() > 0.5 ? 1 : -1;
            const newBalance = Math.max(1000, current + change);
            balanceAmount.textContent = newBalance.toLocaleString();
        }, 5000);
    }
    
    // Connection status animation
    const signal = document.querySelector('.signal');
    if (signal) {
        setInterval(() => {
            signal.style.opacity = Math.random() > 0.1 ? '1' : '0.5';
        }, 3000);
    }
}

// Notification System
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add styles if not already added
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, var(--primary-violet), var(--secondary-violet));
                padding: 20px 25px;
                border-radius: 12px;
                box-shadow: 0 10px 30px rgba(124, 58, 237, 0.3);
                display: flex;
                align-items: center;
                gap: 15px;
                z-index: 9999;
                animation: slideIn 0.3s ease;
                border: 1px solid rgba(255, 255, 255, 0.1);
   
