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
    initializeSkillFilters();
    initializeProjectFilters();
});

// Navigation System - FIXED
function initializeNavigation() {
    console.log('Initializing navigation...');
    
    const navCards = document.querySelectorAll('.nav-card');
    const tabContents = document.querySelectorAll('.tab-content');
    
    console.log('Found nav cards:', navCards.length);
    console.log('Found tab contents:', tabContents.length);
    
    // Hide all tabs except profile
    tabContents.forEach(tab => {
        if (tab.id !== 'profile-tab') {
            tab.classList.remove('active');
        }
    });
    
    // Set initial active tab (Profile)
    const profileTab = document.getElementById('profile-tab');
    if (profileTab) {
        profileTab.classList.add('active');
    }
    
    navCards.forEach(card => {
        card.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Nav card clicked:', this.getAttribute('data-tab'));
            
            const tabId = this.getAttribute('data-tab');
            const targetTab = document.getElementById(`${tabId}-tab`);
            
            if (!targetTab) {
                console.error('Target tab not found:', `${tabId}-tab`);
                return;
            }
            
            // Update active nav card
            navCards.forEach(c => {
                c.classList.remove('active');
                c.style.transform = '';
            });
            this.classList.add('active');
            
            // Hide all tab contents
            tabContents.forEach(content => {
                content.classList.remove('active');
            });
            
            // Show selected tab
            targetTab.classList.add('active');
            
            // Add click effect
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // Trigger content-specific initialization
            switch(tabId) {
                case 'repos':
                    console.log('Loading repositories...');
                    loadRepositories();
                    break;
                case 'skills':
                    console.log('Initializing skills...');
                    initializeSkillAnimations();
                    break;
                case 'projects':
                    console.log('Initializing projects...');
                    break;
                case 'contact':
                    console.log('Initializing contact...');
                    // Nothing specific needed
                    break;
            }
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
    const duration = 1500;
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
            element.textContent = target; // Ensure final value is exact
        }
    }, frameDuration);
}

// GitHub Repositories
async function initializeRepositories() {
    console.log('Initializing repositories...');
    
    // Setup load more button
    const loadMoreBtn = document.querySelector('.btn-load-more');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', loadMoreRepositories);
    }
}

async function loadRepositories() {
    console.log('Loading repositories data...');
    
    const reposGrid = document.querySelector('.repos-grid');
    if (!reposGrid) {
        console.error('Repos grid not found!');
        return;
    }
    
    // Show loading state
    reposGrid.innerHTML = `
        <div class="repo-card loading" style="grid-column: 1 / -1; padding: 40px; text-align: center;">
            <div class="repo-skeleton" style="height: 150px; border-radius: 16px;"></div>
            <p style="margin-top: 20px; color: var(--text-secondary);">Loading repositories...</p>
        </div>
    `;
    
    try {
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
            <div class="repo-card error" style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                <h3 style="color: var(--danger);">Error Loading Repositories</h3>
                <p style="color: var(--text-secondary);">Failed to fetch GitHub data. Please try again later.</p>
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
                <a href="#" class="repo-link" onclick="event.preventDefault(); showNotification('Opening repository: ${repo.name}', 'info');">
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
    if (!btn) return;
    
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
        if (reposGrid) {
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
                        <a href="#" class="repo-link" onclick="event.preventDefault(); showNotification('Opening repository: ${repo.name}', 'info');">
                            View Code
                            <i class="fas fa-arrow-right"></i>
                        </a>
                    </div>
                `;
                reposGrid.appendChild(repoCard);
            });
        }
        
        btn.innerHTML = '<i class="fas fa-sync"></i> Load More Repositories';
        btn.disabled = false;
        
        // Show notification
        showNotification('2 more repositories loaded successfully!', 'success');
    }, 1500);
}

// Initialize Skill Animations
function initializeSkillAnimations() {
    console.log('Initializing skill animations...');
    
    const skillBars = document.querySelectorAll('.level-bar');
    skillBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0';
        
        setTimeout(() => {
            bar.style.transition = 'width 1.5s ease-in-out';
            bar.style.width = width;
        }, 100);
    });
}

// Initialize Skill Filters
function initializeSkillFilters() {
    const filterButtons = document.querySelectorAll('.skills-filter .filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const filter = this.textContent.toLowerCase();
            const skillCards = document.querySelectorAll('.skill-card');
            
            skillCards.forEach(card => {
                const skillName = card.querySelector('h3').textContent.toLowerCase();
                let showCard = false;
                
                switch(filter) {
                    case 'all':
                        showCard = true;
                        break;
                    case 'frontend':
                        showCard = ['javascript', 'react', 'html', 'css', 'vue', 'angular'].some(skill => 
                            skillName.includes(skill)
                        );
                        break;
                    case 'backend':
                        showCard = ['python', 'node.js', 'mongodb', 'express', 'docker'].some(skill => 
                            skillName.includes(skill)
                        );
                        break;
                    case 'tools':
                        showCard = ['docker', 'git', 'aws'].some(skill => 
                            skillName.includes(skill)
                        );
                        break;
                }
                
                if (showCard) {
                    card.style.display = 'flex';
                    card.style.animation = 'fadeIn 0.5s ease';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// Initialize Project Filters
function initializeProjectFilters() {
    const filterButtons = document.querySelectorAll('.projects-filter .proj-filter');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const filter = this.textContent.toLowerCase();
            const projectCards = document.querySelectorAll('.project-card');
            
            projectCards.forEach(card => {
                const projectTitle = card.querySelector('h3').textContent.toLowerCase();
                const projectTech = card.querySelector('.project-tech').textContent.toLowerCase();
                let showCard = false;
                
                switch(filter) {
                    case 'all':
                        showCard = true;
                        break;
                    case 'web apps':
                        showCard = projectTech.includes('react') || projectTech.includes('javascript');
                        break;
                    case 'apis':
                        showCard = projectTech.includes('node.js') || projectTech.includes('express');
                        break;
                    case 'security':
                        showCard = projectTitle.includes('secure') || projectTitle.includes('auth');
                        break;
                }
                
                if (showCard) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeIn 0.5s ease';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// Terminal System
function initializeTerminal() {
    const terminal = document.querySelector('.terminal-modal');
    const terminalInput = document.querySelector('.terminal-input input');
    const closeBtn = document.querySelector('.term-btn.close');
    const minimizeBtn = document.querySelector('.term-btn.minimize');
    const maximizeBtn = document.querySelector('.term-btn.maximize');
    
    if (!terminal) return;
    
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
            if (terminal.style.width === '90%') {
                terminal.style.width = '500px';
                terminal.style.height = '';
            } else {
                terminal.style.width = '90%';
                terminal.style.height = '80vh';
            }
        });
    }
}

function processCommand(command) {
    const output = document.querySelector('.terminal-output');
    if (!output) return;
    
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
    const cards = document.querySelectorAll('.card, .repo-card, .skill-card, .project-card, .mini-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
    
    // Add fadeIn animation to CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .repo-skeleton {
            background: linear-gradient(90deg, 
                rgba(124, 58, 237, 0.1), 
                rgba(124, 58, 237, 0.2), 
                rgba(124, 58, 237, 0.1));
            background-size: 200% 100%;
            border-radius: 10px;
            animation: pulse 1.5s ease-in-out infinite;
        }
        
        @keyframes pulse {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
        }
    `;
    document.head.appendChild(style);
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
            const current = parseInt(balanceAmount.textContent.replace(',', '')) || 1024;
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

// Notification System - Make it global
window.showNotification = function(message, type) {
    // Remove any existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
        if (notification.parentNode) {
            document.body.removeChild(notification);
        }
    });
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
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
            }
            
            .notification i {
                font-size: 20px;
            }
            
            .notification span {
                font-size: 14px;
                font-weight: 500;
            }
            
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Remove notification after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 5000);
};

// Keyboard Shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl + T to toggle terminal
    if (e.ctrlKey && e.key === 't') {
        e.preventDefault();
        const terminal = document.querySelector('.terminal-modal');
        if (terminal.style.display === 'none') {
            terminal.style.display = 'block';
            setTimeout(() => {
                terminal.style.transform = 'translateY(0)';
                terminal.style.opacity = '1';
            }, 10);
        } else {
            terminal.style.transform = 'translateY(100px)';
            terminal.style.opacity = '0';
            setTimeout(() => {
                terminal.style.display = 'none';
            }, 300);
        }
    }
    
    // Escape to close terminal
    if (e.key === 'Escape') {
        const terminal = document.querySelector('.terminal-modal');
        if (terminal && terminal.style.display !== 'none') {
            terminal.style.transform = 'translateY(100px)';
            terminal.style.opacity = '0';
            setTimeout(() => {
                terminal.style.display = 'none';
            }, 300);
        }
    }
});

console.log('MACSTAR Wallet Portfolio Ready! 🚀');
