/* ========================================
   SAMPATH UPPALA PORTFOLIO
   JavaScript - Animations & Interactions
   ======================================== */

   document.addEventListener('DOMContentLoaded', () => {
    // Initialize all features
    initCursorGlow();
    initTiltEffect();
    initScrollAnimations();
    initMobileMenu();
    initSmoothScroll();
    initPageTransitions();
});

/* ========================================
   CURSOR GLOW EFFECT (Smooth)
   ======================================== */
function initCursorGlow() {
    const cursorGlow = document.querySelector('.cursor-glow');
    if (!cursorGlow) return;
    
    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;
    
    // Track mouse position
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Show glow on first mouse move
        if (cursorGlow.style.opacity === '0' || cursorGlow.style.opacity === '') {
            currentX = mouseX;
            currentY = mouseY;
            cursorGlow.style.opacity = '1';
        }
    });
    
    function animate() {
        // Smooth interpolation
        currentX += (mouseX - currentX) * 0.1;
        currentY += (mouseY - currentY) * 0.1;
        
        // Use transform for GPU acceleration - offset by half width/height to center
        cursorGlow.style.transform = `translate(${currentX - 250}px, ${currentY - 250}px)`;
        
        requestAnimationFrame(animate);
    }
    
    // Start animation
    animate();
    
    // Handle mouse leaving/entering window
    document.addEventListener('mouseleave', () => {
        cursorGlow.style.opacity = '0';
    });
    
    document.addEventListener('mouseenter', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        currentX = mouseX;
        currentY = mouseY;
        cursorGlow.style.opacity = '1';
    });
}

/* ========================================
   3D TILT EFFECT (Smooth & Subtle)
   ======================================== */
function initTiltEffect() {
    const tiltElements = document.querySelectorAll('[data-tilt]');
    
    tiltElements.forEach(element => {
        let currentX = 0, currentY = 0;
        let targetX = 0, targetY = 0;
        let animationId = null;
        
        element.addEventListener('mouseenter', function() {
            this.style.transition = 'box-shadow 0.5s cubic-bezier(0.23, 1, 0.32, 1), border-color 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
        });
        
        element.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Subtle rotation values (max ~3 degrees)
            targetX = (y - centerY) / 40;
            targetY = (centerX - x) / 40;
            
            if (!animationId) {
                animationId = requestAnimationFrame(() => animateTilt(this));
            }
        });
        
        element.addEventListener('mouseleave', function() {
            targetX = 0;
            targetY = 0;
            this.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.6s cubic-bezier(0.23, 1, 0.32, 1), border-color 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
            this.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
            cancelAnimationFrame(animationId);
            animationId = null;
            currentX = 0;
            currentY = 0;
        });
        
        function animateTilt(el) {
            // Smooth interpolation (easing)
            currentX += (targetX - currentX) * 0.08;
            currentY += (targetY - currentY) * 0.08;
            
            el.style.transform = `perspective(1000px) rotateX(${currentX}deg) rotateY(${currentY}deg)`;
            
            // Continue animation if values haven't settled
            if (Math.abs(targetX - currentX) > 0.01 || Math.abs(targetY - currentY) > 0.01) {
                animationId = requestAnimationFrame(() => animateTilt(el));
            } else {
                animationId = null;
            }
        }
    });
}

/* ========================================
   SCROLL ANIMATIONS
   ======================================== */
function initScrollAnimations() {
    // Create intersection observer for scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Stagger children animations
                const children = entry.target.querySelectorAll('.stagger-child');
                children.forEach((child, index) => {
                    child.style.animationDelay = `${index * 0.1}s`;
                    child.classList.add('visible');
                });
            }
        });
    }, observerOptions);
    
    // Observe all animatable elements
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
    
    // Parallax effect on scroll
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                handleParallax();
                ticking = false;
            });
            ticking = true;
        }
    });
}

function handleParallax() {
    const scrolled = window.pageYOffset;
    
    // Parallax for hero elements
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
        heroContent.style.opacity = 1 - (scrolled * 0.002);
    }
    
    // Parallax for 3D cube
    const cube = document.querySelector('.cube');
    if (cube) {
        cube.style.transform = `rotateX(${scrolled * 0.5}deg) rotateY(${scrolled * 0.5}deg)`;
    }
}

/* ========================================
   MOBILE MENU
   ======================================== */
function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav');
    
    if (!menuBtn || !nav) return;
    
    menuBtn.addEventListener('click', () => {
        menuBtn.classList.toggle('active');
        nav.classList.toggle('mobile-open');
        document.body.classList.toggle('menu-open');
    });
    
    // Close menu on link click
    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            menuBtn.classList.remove('active');
            nav.classList.remove('mobile-open');
            document.body.classList.remove('menu-open');
        });
    });
}

/* ========================================
   SMOOTH SCROLL
   ======================================== */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ========================================
   PAGE TRANSITIONS
   ======================================== */
function initPageTransitions() {
    // Add loading class on page load
    document.body.classList.add('loaded');
    
    // Handle internal link clicks for page transitions
    document.querySelectorAll('a').forEach(link => {
        const href = link.getAttribute('href');
        
        // Only apply to internal HTML links
        if (href && href.endsWith('.html') && !href.startsWith('http')) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Add exit animation class
                document.body.classList.add('page-exit');
                
                // Navigate after animation
                setTimeout(() => {
                    window.location.href = href;
                }, 300);
            });
        }
    });
}

/* ========================================
   TYPING EFFECT (Optional enhancement)
   ======================================== */
function initTypingEffect() {
    const typingElements = document.querySelectorAll('.typewriter');
    
    typingElements.forEach(element => {
        const text = element.textContent;
        element.textContent = '';
        element.style.borderRight = '2px solid var(--accent)';
        
        let i = 0;
        const typeInterval = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(typeInterval);
                // Blinking cursor effect
                setInterval(() => {
                    element.style.borderRightColor = element.style.borderRightColor === 'transparent' 
                        ? 'var(--accent)' 
                        : 'transparent';
                }, 500);
            }
        }, 100);
    });
}

/* ========================================
   ACTIVE NAV LINK HIGHLIGHT
   ======================================== */
function updateActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    document.querySelectorAll('nav a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
}

// Run on load
updateActiveNav();

/* ========================================
   MAGNETIC BUTTON EFFECT (Smooth)
   ======================================== */
document.querySelectorAll('.btn-primary, .btn-secondary').forEach(button => {
    let currentX = 0, currentY = 0;
    let targetX = 0, targetY = 0;
    let animationId = null;
    
    button.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        targetX = x * 0.15;
        targetY = y * 0.15;
        
        if (!animationId) {
            animationId = requestAnimationFrame(() => animateButton(this));
        }
    });
    
    button.addEventListener('mouseleave', function() {
        targetX = 0;
        targetY = 0;
        this.style.transition = 'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1)';
        this.style.transform = 'translate(0, 0)';
        cancelAnimationFrame(animationId);
        animationId = null;
    });
    
    function animateButton(el) {
        currentX += (targetX - currentX) * 0.1;
        currentY += (targetY - currentY) * 0.1;
        
        el.style.transition = 'none';
        el.style.transform = `translate(${currentX}px, ${currentY}px)`;
        
        if (Math.abs(targetX - currentX) > 0.1 || Math.abs(targetY - currentY) > 0.1) {
            animationId = requestAnimationFrame(() => animateButton(el));
        } else {
            animationId = null;
        }
    }
});

/* ========================================
   PRELOADER (Optional)
   ======================================== */
window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        preloader.classList.add('hidden');
        setTimeout(() => {
            preloader.remove();
        }, 500);
    }
});

/* ========================================
   SCROLL PROGRESS INDICATOR
   ======================================== */
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 2px;
        background: var(--accent);
        z-index: 9999;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
}

initScrollProgress();

/* ========================================
   CARD HOVER SOUND (Optional - disabled by default)
   ======================================== */
// Uncomment to enable subtle hover sounds
/*
const hoverSound = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10...');
document.querySelectorAll('[data-tilt]').forEach(el => {
    el.addEventListener('mouseenter', () => {
        hoverSound.volume = 0.1;
        hoverSound.currentTime = 0;
        hoverSound.play().catch(() => {});
    });
});
*/