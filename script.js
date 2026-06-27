/* ======================================
   LENIS SMOOTH SCROLL
   ====================================== */
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

/* ======================================
   PARTICLE BACKGROUND (ENHANCED)
   ====================================== */
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let mouse = { x: null, y: null, radius: 180 };
let width = 0;
let height = 0;
let animationId = null;

function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', () => {
    resizeCanvas();
    initParticles();
});

window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
});

class Particle {
    constructor() {
        this.reset();
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.baseX = this.x;
        this.baseY = this.y;
    }

    reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2.5 + 0.5;
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = Math.random() * 40 + 10;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
        this.opacity = Math.random() * 0.6 + 0.15;
        this.color = Math.random() > 0.5 
            ? `rgba(139, 92, 246, ${this.opacity})`
            : `rgba(196, 181, 253, ${this.opacity})`;
        this.pulsePhase = Math.random() * Math.PI * 2;
        this.pulseSpeed = 0.002 + Math.random() * 0.003;
    }

    draw() {
        const pulseOpacity = this.opacity * (0.7 + 0.3 * Math.sin(this.pulsePhase));
        ctx.fillStyle = this.color.replace(this.opacity.toString(), pulseOpacity.toString());
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }

    update() {
        this.pulsePhase += this.pulseSpeed;

        if (mouse.x !== null && mouse.y !== null) {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < mouse.radius) {
                const forceDirectionX = dx / distance;
                const forceDirectionY = dy / distance;
                const maxDistance = mouse.radius;
                const force = (maxDistance - distance) / maxDistance;
                const directionX = forceDirectionX * force * this.density * 0.5;
                const directionY = forceDirectionY * force * this.density * 0.5;
                this.x -= directionX;
                this.y -= directionY;
            } else {
                if (Math.abs(this.x - this.baseX) > 0.5) {
                    this.x += (this.baseX - this.x) * 0.02;
                }
                if (Math.abs(this.y - this.baseY) > 0.5) {
                    this.y += (this.baseY - this.y) * 0.02;
                }
            }
        }

        this.baseX += this.speedX;
        this.baseY += this.speedY;

        if (this.baseX < -50) this.baseX = width + 50;
        if (this.baseX > width + 50) this.baseX = -50;
        if (this.baseY < -50) this.baseY = height + 50;
        if (this.baseY > height + 50) this.baseY = -50;
    }
}

function initParticles() {
    particles = [];
    const count = Math.min(Math.floor((width * height) / 10000), 150);
    for (let i = 0; i < count; i++) {
        particles.push(new Particle());
    }
}

function connectParticles() {
    const maxDist = 130;
    for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
            const dx = particles[a].x - particles[b].x;
            const dy = particles[a].y - particles[b].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < maxDist) {
                const opacity = (1 - distance / maxDist) * 0.12;
                ctx.strokeStyle = `rgba(139, 92, 246, ${opacity})`;
                ctx.lineWidth = distance < 60 ? 0.8 : 0.4;
                ctx.beginPath();
                ctx.moveTo(particles[a].x, particles[a].y);
                ctx.lineTo(particles[b].x, particles[b].y);
                ctx.stroke();
            }
        }
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, width, height);
    
    for (const particle of particles) {
        particle.draw();
        particle.update();
    }
    connectParticles();
    animationId = requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();

/* ======================================
   NAVIGATION
   ====================================== */
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('nav-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-link');

// Scroll effect
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile toggle
navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    lenis.stop();
});

mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
        lenis.start();
    });
});

// Active nav link tracking
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

/* ======================================
   MAGNETIC EFFECTS
   ====================================== */
function initMagneticEffect(selector, strength = 0.15) {
    document.querySelectorAll(selector).forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
        });

        el.addEventListener('mouseleave', () => {
            el.style.transform = '';
        });
    });
}

// Initialize magnetic effects
initMagneticEffect('.btn', 0.12);
initMagneticEffect('.social-link', 0.15);
initMagneticEffect('.nav-link', 0.08);
initMagneticEffect('.project-link', 0.1);
initMagneticEffect('.service-cta', 0.08);
initMagneticEffect('.value-prop', 0.06);

/* ======================================
   SKILL CARD MOUSE GLOW
   ====================================== */
document.querySelectorAll('.skill-card, .service-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const glow = card.querySelector('.skill-card-glow, .service-glow');
        if (glow) {
            glow.style.top = `${y - 80}px`;
            glow.style.left = `${x - 80}px`;
        }
    });

    card.addEventListener('mouseleave', () => {
        const glow = card.querySelector('.skill-card-glow, .service-glow');
        if (glow) {
            glow.style.top = '';
            glow.style.left = '';
        }
    });
});

/* ======================================
   TYPED TEXT EFFECT
   ====================================== */
const rotatingText = document.getElementById('rotating-text');
const titles = [
    'Interactive Frontend Developer',
    'Digital Experience Designer',
    'Creative Coder',
    'UI Animation Specialist',
    'Performance Engineer'
];
let titleIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeSpeed = 80;

function typeEffect() {
    const currentTitle = titles[titleIndex];

    if (isDeleting) {
        rotatingText.textContent = currentTitle.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 40;
    } else {
        rotatingText.textContent = currentTitle.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 80;
    }

    if (!isDeleting && charIndex === currentTitle.length) {
        typeSpeed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        titleIndex = (titleIndex + 1) % titles.length;
        typeSpeed = 500;
    }

    setTimeout(typeEffect, typeSpeed);
}

typeEffect();

/* ======================================
   COUNTER ANIMATION
   ====================================== */
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        function updateCounter() {
            current += increment;
            if (current < target) {
                counter.textContent = Math.ceil(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        }
        updateCounter();
    });
}

// Trigger counters when hero is visible
const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            heroObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) heroObserver.observe(heroStats);

/* ======================================
   GSAP SCROLL ANIMATIONS
   ====================================== */
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Reveal animations for sections
    gsap.utils.toArray('.reveal').forEach((element, i) => {
        const delay = parseInt(element.getAttribute('data-delay') || 0);
        gsap.fromTo(element, 
            { opacity: 0, y: 40 },
            {
                opacity: 1,
                y: 0,
                duration: 1,
                delay: delay / 1000,
                ease: 'expo.out',
                scrollTrigger: {
                    trigger: element,
                    start: 'top 85%',
                    end: 'bottom 20%',
                    toggleActions: 'play none none reverse',
                    once: true
                }
            }
        );
    });

    // Hero name line animations
    gsap.from('.name-line', {
        opacity: 0,
        y: 30,
        duration: 1,
        stagger: 0.15,
        ease: 'expo.out',
        delay: 0.3
    });

    // Hero stats stagger
    gsap.from('.stat', {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.1,
        ease: 'expo.out',
        delay: 1,
        scrollTrigger: {
            trigger: '.hero-stats',
            start: 'top 90%'
        }
    });

    // Hero value props
    gsap.from('.value-prop', {
        opacity: 0,
        y: 20,
        duration: 0.6,
        stagger: 0.08,
        ease: 'expo.out',
        delay: 1.2,
        scrollTrigger: {
            trigger: '.hero-value-props',
            start: 'top 90%'
        }
    });

    // Project cards
    gsap.utils.toArray('.project-card').forEach((card, i) => {
        gsap.fromTo(card,
            { opacity: 0, y: 50 },
            {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: 'expo.out',
                delay: i * 0.15,
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                }
            }
        );

        // Project image zoom
        gsap.fromTo(card.querySelector('.project-thumbnail'),
            { scale: 1.1 },
            {
                scale: 1,
                duration: 1.5,
                ease: 'expo.out',
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%'
                }
            }
        );

        // Project details
        gsap.fromTo(card.querySelectorAll('.project-detail'),
            { opacity: 0, y: 20 },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: 'expo.out',
                scrollTrigger: {
                    trigger: card.querySelector('.project-details'),
                    start: 'top 90%'
                }
            }
        );
    });

    // Service cards
    gsap.utils.toArray('.service-card').forEach((card, i) => {
        gsap.fromTo(card,
            { opacity: 0, y: 50 },
            {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: 'expo.out',
                delay: i * 0.15,
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                }
            }
        );
    });

    // Skill cards
    gsap.utils.toArray('.skill-card').forEach((card, i) => {
        gsap.fromTo(card,
            { opacity: 0, y: 40 },
            {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: 'expo.out',
                delay: i * 0.1,
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                }
            }
        );
    });

    // Tech icons
    gsap.from('.tech-item', {
        opacity: 0,
        y: 30,
        scale: 0.9,
        duration: 0.8,
        stagger: 0.05,
        ease: 'expo.out',
        scrollTrigger: {
            trigger: '.tech-icons',
            start: 'top 85%'
        }
    });

    // About highlights
    gsap.from('.highlight-item', {
        opacity: 0,
        x: -30,
        duration: 0.8,
        stagger: 0.1,
        ease: 'expo.out',
        scrollTrigger: {
            trigger: '.about-highlights',
            start: 'top 85%'
        }
    });

    // Contact section
    gsap.from('.contact-text', {
        opacity: 0,
        y: 30,
        duration: 1,
        ease: 'expo.out',
        scrollTrigger: {
            trigger: '.contact-content',
            start: 'top 85%'
        }
    });

    gsap.from('.social-link', {
        opacity: 0,
        y: 30,
        scale: 0.9,
        duration: 0.8,
        stagger: 0.1,
        ease: 'expo.out',
        delay: 0.3,
        scrollTrigger: {
            trigger: '.social-links',
            start: 'top 90%'
        }
    });

    // Parallax effect for hero visual
    gsap.to('.hero-visual', {
        yPercent: 30,
        ease: 'none',
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1
        }
    });

    // Floating animation for avatar
    gsap.to('.avatar-container', {
        y: -20,
        duration: 3,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1
    });

    // Rotate ring animation
    gsap.to('.avatar-ring', {
        rotation: 360,
        duration: 20,
        ease: 'none',
        repeat: -1
    });
}

/* ======================================
   SMOOTH SCROLL FOR ANCHOR LINKS
   ====================================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            lenis.scrollTo(target, {
                offset: -80,
                duration: 1.5
            });
        }
    });
});

/* ======================================
   PAGE LOAD
   ====================================== */
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Initial hero animations
    if (typeof gsap !== 'undefined') {
        gsap.from('.hero-greeting', {
            opacity: 0,
            y: 20,
            duration: 0.8,
            ease: 'expo.out',
            delay: 0.2
        });

        gsap.from('.hero-tagline', {
            opacity: 0,
            y: 20,
            duration: 0.8,
            ease: 'expo.out',
            delay: 0.6
        });

        gsap.from('.hero-description', {
            opacity: 0,
            y: 20,
            duration: 0.8,
            ease: 'expo.out',
            delay: 0.9
        });

        gsap.from('.hero-cta .btn', {
            opacity: 0,
            y: 20,
            duration: 0.8,
            stagger: 0.1,
            ease: 'expo.out',
            delay: 1.2
        });

        gsap.from('.scroll-indicator', {
            opacity: 0,
            y: 20,
            duration: 0.8,
            ease: 'expo.out',
            delay: 1.6
        });
    }
});

/* ======================================
   CURSOR TRAIL EFFECT (Optional premium touch)
   ====================================== */
const cursorTrail = [];
const trailLength = 10;

document.addEventListener('mousemove', (e) => {
    cursorTrail.push({ x: e.clientX, y: e.clientY, time: Date.now() });
    if (cursorTrail.length > trailLength) cursorTrail.shift();
});

/* ======================================
   INTERSECTION OBSERVER FALLBACK
   ====================================== */
if (typeof gsap === 'undefined') {
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-delay') || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, parseInt(delay));
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.reveal').forEach(el => {
        revealObserver.observe(el);
    });
}
