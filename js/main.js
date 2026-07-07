// ============================================
// MOBILE NAV TOGGLE
// ============================================
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('open');
    });
}

// Close nav when a link is clicked (mobile)
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('open');
    });
});

// ============================================
// SCROLL REVEAL ANIMATIONS (Intersection Observer)
// ============================================
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
        }
    });
}, observerOptions);

// Observe all sections and cards
document.addEventListener('DOMContentLoaded', () => {
    const elementsToReveal = document.querySelectorAll(
        '.hero-content, .featured-card, .behind-the-code, .project-card, .testimonial-card, .about-grid, .skills, .education, .testimonials-section, .skill-group, .side-quests, .terminal-window'
    );
    
    elementsToReveal.forEach(el => {
        el.classList.add('reveal');
        observer.observe(el);
    });
});

// ============================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ============================================
// CONTACT FORM (Formspree)
// ============================================
const contactForm = document.getElementById('contactForm');
const successModal = document.getElementById('successModal');
const closeModal = document.getElementById('closeModal');

if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();
        
        if (!name || !email || !message) {
            // Custom error alert (optional)
            showAlert('Please fill in all fields.', 'error');
            return;
        }
        
        if (!email.includes('@') || !email.includes('.')) {
            showAlert('Please enter a valid email address.', 'error');
            return;
        }
        
        // Show sending state
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        try {
            const formData = new FormData(this);
            
            const response = await fetch(this.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                window.Achievements.checkMessenger();
                // Show success modal
                successModal.classList.add('active');
                contactForm.reset();
                
                // Add confetti
                createConfetti();
            } else {
                const data = await response.json();
                showAlert('Something went wrong: ' + (data.error || 'Please try again.'), 'error');
            }
        } catch (error) {
            showAlert('Network error. Please check your connection and try again.', 'error');
            console.error('Formspree error:', error);
        }
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    });
}

// Close modal
if (closeModal) {
    closeModal.addEventListener('click', function() {
        successModal.classList.remove('active');
    });
}

// Close modal on overlay click
if (successModal) {
    successModal.addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.remove('active');
        }
    });
}

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && successModal && successModal.classList.contains('active')) {
        successModal.classList.remove('active');
    }
});

// ============================================
// CUSTOM ALERT (for errors)
// ============================================
function showAlert(message, type) {
    // Remove existing alert
    const existingAlert = document.querySelector('.custom-alert');
    if (existingAlert) existingAlert.remove();
    
    const alert = document.createElement('div');
    alert.className = `custom-alert custom-alert-${type}`;
    alert.textContent = message;
    document.body.appendChild(alert);
    
    // Auto dismiss after 4 seconds
    setTimeout(() => {
        alert.classList.add('fade-out');
        setTimeout(() => alert.remove(), 300);
    }, 4000);
}

// ============================================
// CONFETTI PARTICLES
// ============================================
function createConfetti() {
    const colors = ['#00fbff', '#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#ff6bff', '#ffffff'];
    const container = document.getElementById('successModal');
    
    for (let i = 0; i < 30; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'modal-confetti';
        confetti.style.left = (Math.random() * 100) + '%';
        confetti.style.top = (Math.random() * 50) + '%';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.width = (Math.random() * 6 + 4) + 'px';
        confetti.style.height = (Math.random() * 6 + 4) + 'px';
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
        confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
        confetti.style.animationDelay = (Math.random() * 1.5) + 's';
        container.appendChild(confetti);
        
        // Remove after animation
        setTimeout(() => confetti.remove(), 4000);
    }
}

// ============================================
// PARALLAX / MOUSE TRACKING (Subtle effect on hero)
// ============================================
const hero = document.querySelector('.hero');
if (hero) {
    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 8;
        const y = (e.clientY / window.innerHeight - 0.5) * 8;
        hero.style.setProperty('--mouse-x', x + 'px');
        hero.style.setProperty('--mouse-y', y + 'px');
    });
}

// ============================================
// ADD REVEAL ANIMATIONS TO CSS
// ============================================
// Inject the animation styles dynamically
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    .reveal {
        opacity: 0;
        transform: translateY(40px);
        transition: opacity 0.8s ease, transform 0.8s ease;
    }
    
    .reveal.revealed {
        opacity: 1;
        transform: translateY(0);
    }
    
    .featured-card.reveal.revealed,
    .project-card.reveal.revealed,
    .testimonial-card.reveal.revealed {
        transition-delay: 0.1s;
    }
`;
document.head.appendChild(styleSheet);

console.log('Portfolio loaded successfully!');
console.log('Built with love and lots of AI prompting.');


// ============================================
// FLIPABLE PHOTO - Best of Both Worlds
// ============================================
const flipContainer = document.getElementById('flipContainer');

if (flipContainer) {
    let isFlipped = false;
    let achievementTriggered = false;
    
    // Check if device has touch support
    const isTouchDevice = ('ontouchstart' in window) || 
                          (navigator.maxTouchPoints > 0);
    
    if (isTouchDevice) {
        // MOBILE: Tap to toggle flip + achievement
        flipContainer.addEventListener('click', function(e) {
            isFlipped = !isFlipped;
            if (isFlipped) {
                this.classList.add('tapped');
                // ACHIEVEMENT UNLOCKED!
                if (window.Achievements && !achievementTriggered) {
                    achievementTriggered = true;
                    window.Achievements.checkFlipMaster();
                }
            } else {
                this.classList.remove('tapped');
            }
        });
    } else {
        // DESKTOP: Hover to flip + achievement (first time only)
        flipContainer.addEventListener('mouseenter', function(e) {
            // Only trigger if not already achieved
            if (!achievementTriggered && window.Achievements) {
                achievementTriggered = true;
                window.Achievements.checkFlipMaster();
                console.log('🔄 Flip Master achievement unlocked on hover!');
            }
        });
        
        // Also allow click as fallback (in case someone clicks)
        flipContainer.addEventListener('click', function(e) {
            this.classList.toggle('tapped');
            if (window.Achievements && !achievementTriggered) {
                achievementTriggered = true;
                window.Achievements.checkFlipMaster();
                console.log('🔄 Flip Master achievement unlocked on click!');
            }
        });
    }
}


// ============================================
// STACKING CARDS (Scroll Effect)
// ============================================
(function() {
    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window && 'IntersectionObserverEntry' in window)) return;
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;
    
    const stackCards = document.querySelectorAll('.js-stack-cards');
    if (stackCards.length === 0) return;
    
    // Initialize each stack
    stackCards.forEach(function(element) {
        new StackCards(element);
    });
    
    // StackCards class
    function StackCards(element) {
        this.element = element;
        this.items = this.element.querySelectorAll('.js-stack-cards__item');
        this.scrollingFn = false;
        this.scrolling = false;
        
        this.init();
        this.initResize();
    }
    
    StackCards.prototype.init = function() {
        this.setCards();
        
        var self = this;
        var observer = new IntersectionObserver(function(entries) {
            if (entries[0].isIntersecting) {
                if (self.scrollingFn) return;
                self.initScroll();
            } else {
                if (!self.scrollingFn) return;
                window.removeEventListener('scroll', self.scrollingFn);
                self.scrollingFn = false;
            }
        }, { threshold: [0, 1] });
        
        observer.observe(this.element);
    };
    
    StackCards.prototype.initResize = function() {
        var self = this;
        var resizeTimer;
        
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                self.setCards();
            }, 200);
        });
    };
    
    StackCards.prototype.initScroll = function() {
        var self = this;
        this.scrollingFn = function() {
            self.scrollHandler();
        };
        window.addEventListener('scroll', this.scrollingFn);
    };
    
    StackCards.prototype.scrollHandler = function() {
        if (this.scrolling) return;
        this.scrolling = true;
        window.requestAnimationFrame(this.animate.bind(this));
    };
    
    StackCards.prototype.setCards = function() {
        // Get gap value
        var gapStyle = getComputedStyle(this.element).getPropertyValue('--stack-cards-gap');
        var gap = this.getPixelValue(gapStyle);
        
        // Store properties
        this.marginY = gap;
        this.elementHeight = this.element.offsetHeight;
        
        if (this.items.length > 0) {
            var cardStyle = getComputedStyle(this.items[0]);
            this.cardTop = Math.floor(parseFloat(cardStyle.getPropertyValue('top')));
            this.cardHeight = Math.floor(parseFloat(cardStyle.getPropertyValue('height')));
        }
        
        this.windowHeight = window.innerHeight;
        
        // Reset padding and transforms
        if (isNaN(this.marginY)) {
            this.element.style.paddingBottom = '0px';
        } else {
            this.element.style.paddingBottom = (this.marginY * (this.items.length - 1)) + 'px';
        }
        
        for (var i = 0; i < this.items.length; i++) {
            if (isNaN(this.marginY)) {
                this.items[i].style.transform = 'none';
            } else {
                this.items[i].style.transform = 'translateY(' + (this.marginY * i) + 'px)';
            }
        }
    };
    
    StackCards.prototype.getPixelValue = function(value) {
        var temp = document.createElement('div');
        temp.style.cssText = 'position:absolute;visibility:hidden;height:' + value;
        this.element.appendChild(temp);
        var result = parseInt(getComputedStyle(temp).getPropertyValue('height'));
        this.element.removeChild(temp);
        return result;
    };
    
    StackCards.prototype.animate = function() {
        if (isNaN(this.marginY)) {
            this.scrolling = false;
            return;
        }
        
        var rect = this.element.getBoundingClientRect();
        var top = rect.top;
        
        // Check if still in view
        if (this.cardTop - top + this.windowHeight - this.elementHeight - this.cardHeight + this.marginY + this.marginY * this.items.length > 0) {
            this.scrolling = false;
            return;
        }
        
        for (var i = 0; i < this.items.length; i++) {
            var scrollOffset = this.cardTop - top - i * (this.cardHeight + this.marginY);
            
            if (scrollOffset > 0) {
                var scale = i === this.items.length - 1 ? 1 : (this.cardHeight - scrollOffset * 0.05) / this.cardHeight;
                this.items[i].style.transform = 'translateY(' + (this.marginY * i) + 'px) scale(' + Math.max(scale, 0.7) + ')';
                this.items[i].style.opacity = Math.min(1, 1 - (scrollOffset / (this.cardHeight * 1.5)));
            } else {
                this.items[i].style.transform = 'translateY(' + (this.marginY * i) + 'px)';
                this.items[i].style.opacity = '1';
            }
        }
        
        this.scrolling = false;
    };
})();



// ============================================
// EXPLORER ACHIEVEMENT (Footer Scroll)
// ============================================
const footer = document.querySelector('.footer');
if (footer) {
    const footerObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            window.Achievements.checkExplorer();
            footerObserver.disconnect(); // Only trigger once
        }
    }, { threshold: 0.1 });
    footerObserver.observe(footer);
}


// ============================================
// HIDDEN ACHIEVEMENT: Click Logo 10 Times
// ============================================
let logoClickCount = 0;
const logo = document.querySelector('.nav-logo');

if (logo) {
    logo.addEventListener('click', function(e) {
        // Check if the hidden achievement is already unlocked
        const isHiddenUnlocked = window.Achievements && window.Achievements.isUnlocked('hidden');
        
        if (isHiddenUnlocked) {
            // If already unlocked, allow navigation normally
            return;
        }
        
        // Otherwise, prevent navigation and count clicks
        e.preventDefault();
        logoClickCount++;
        console.log(`🖱️ Logo clicked ${logoClickCount} times`);
        
        if (logoClickCount >= 10) {
            if (window.Achievements) {
                window.Achievements.trigger('hidden');
                console.log('🔮 Hidden achievement unlocked!');
                logoClickCount = 0;
            }
        }
    });
}