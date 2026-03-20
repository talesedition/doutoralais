// ============================================
// DRA. LAIS DE MELO - CIRURGIÃ DENTISTA
// Professional JavaScript Functionality
// Advanced Animations & Interactions
// ============================================

document.addEventListener('DOMContentLoaded', function() {

    // ============================================
    // SCROLL PROGRESS BAR
    // ============================================
    const scrollProgress = document.querySelector('.scroll-progress');

    function updateScrollProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        scrollProgress.style.width = progress + '%';
    }

    window.addEventListener('scroll', updateScrollProgress, { passive: true });

    // ============================================
    // HEADER SCROLL EFFECT
    // ============================================
    const header = document.querySelector('.header');
    let lastScroll = 0;
    let ticking = false;

    function updateHeader() {
        const currentScroll = window.scrollY;

        // Add/remove scrolled class
        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Hide/show header on scroll direction
        if (currentScroll > lastScroll && currentScroll > 200) {
            header.classList.add('hidden');
        } else {
            header.classList.remove('hidden');
        }

        lastScroll = currentScroll;
        ticking = false;
    }

    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateHeader);
            ticking = true;
        }
    }, { passive: true });

    // ============================================
    // MOBILE MENU
    // ============================================
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const navLinkItems = document.querySelectorAll('.nav-link');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        });
    }

    // Close mobile menu when clicking a link
    navLinkItems.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenuBtn) mobileMenuBtn.classList.remove('active');
            if (navLinks) navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (navLinks && navLinks.classList.contains('active')) {
            if (!navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                mobileMenuBtn.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    });

    // ============================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 100;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============================================
    // SCROLL REVEAL ANIMATION
    // ============================================
    function initScrollReveal() {
        const revealElements = document.querySelectorAll('[data-reveal]');

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = entry.target.dataset.delay || 0;
                    setTimeout(() => {
                        entry.target.classList.add('revealed');
                    }, delay);
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));
    }

    // Initialize scroll reveal immediately
    initScrollReveal();

    // ============================================
    // COUNTER ANIMATION
    // ============================================
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number[data-target]');

        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.dataset.target);
                    const suffix = counter.dataset.suffix || '+';
                    const duration = 2000;
                    const startTime = performance.now();

                    function updateCounter(currentTime) {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);

                        // Easing function (easeOutQuart)
                        const easeOut = 1 - Math.pow(1 - progress, 4);
                        const current = Math.floor(easeOut * target);

                        counter.textContent = current + suffix;

                        if (progress < 1) {
                            requestAnimationFrame(updateCounter);
                        }
                    }

                    requestAnimationFrame(updateCounter);
                    counterObserver.unobserve(counter);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => counterObserver.observe(counter));
    }

    // Initialize counters immediately
    animateCounters();

    // ============================================
    // RESULTS FILTER (Antes e Depois)
    // ============================================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const resultCards = document.querySelectorAll('.result-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');

            const filter = this.dataset.filter;

            resultCards.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.classList.remove('hidden');
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        card.classList.add('hidden');
                    }, 300);
                }
            });
        });
    });

    // ============================================
    // BEFORE/AFTER COMPARISON SLIDER
    // ============================================
    const comparisonSliders = document.querySelectorAll('.comparison-slider');

    comparisonSliders.forEach(slider => {
        const before = slider.querySelector('.comparison-before');
        const after = slider.querySelector('.comparison-after');
        const handle = slider.querySelector('.comparison-handle');
        
        let isDragging = false;

        function updateSlider(x) {
            const rect = slider.getBoundingClientRect();
            let position = ((x - rect.left) / rect.width) * 100;
            
            // Clamp position between 0 and 100
            position = Math.max(0, Math.min(100, position));
            
            after.style.width = position + '%';
            handle.style.left = position + '%';
        }

        // Mouse events
        slider.addEventListener('mousedown', (e) => {
            isDragging = true;
            updateSlider(e.clientX);
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            updateSlider(e.clientX);
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });

        // Touch events
        slider.addEventListener('touchstart', (e) => {
            isDragging = true;
            updateSlider(e.touches[0].clientX);
        }, { passive: true });

        slider.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            updateSlider(e.touches[0].clientX);
        }, { passive: true });

        slider.addEventListener('touchend', () => {
            isDragging = false;
        });

        // Initialize at 50%
        after.style.width = '50%';
        handle.style.left = '50%';
    });

    // ============================================
    // CAROUSEL FUNCTIONALITY
    // ============================================
    const track = document.getElementById('carouselTrack');
    const slides = document.querySelectorAll('.carousel-slide');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dots = document.querySelectorAll('.dot');

    if (track && slides.length > 0) {
        let currentIndex = 0;
        const totalSlides = slides.length;
        let autoPlayInterval;
        let touchStartX = 0;
        let touchEndX = 0;

        function updateCarousel() {
            track.style.transform = `translateX(-${currentIndex * 100}%)`;

            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });

            if (prevBtn) {
                prevBtn.disabled = currentIndex === 0;
                prevBtn.style.opacity = currentIndex === 0 ? '0.3' : '1';
            }
            
            if (nextBtn) {
                nextBtn.disabled = currentIndex === totalSlides - 1;
                nextBtn.style.opacity = currentIndex === totalSlides - 1 ? '0.3' : '1';
            }
        }

        function goToSlide(index) {
            if (index < 0) index = 0;
            if (index >= totalSlides) index = totalSlides - 1;
            currentIndex = index;
            updateCarousel();
            resetAutoPlay();
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));
        }

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => goToSlide(index));
        });

        // Touch events for swipe
        const carouselWrapper = document.querySelector('.carousel-wrapper');

        if (carouselWrapper) {
            carouselWrapper.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });

            carouselWrapper.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
            }, { passive: true });
        }

        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    goToSlide(currentIndex + 1);
                } else {
                    goToSlide(currentIndex - 1);
                }
            }
        }

        // Auto-play
        function startAutoPlay() {
            autoPlayInterval = setInterval(() => {
                if (currentIndex < totalSlides - 1) {
                    goToSlide(currentIndex + 1);
                } else {
                    goToSlide(0);
                }
            }, 5000);
        }

        function resetAutoPlay() {
            clearInterval(autoPlayInterval);
            startAutoPlay();
        }

        // Pause auto-play on hover
        const carouselContainer = document.querySelector('.carousel-container');
        
        if (carouselContainer) {
            carouselContainer.addEventListener('mouseenter', () => {
                clearInterval(autoPlayInterval);
            });

            carouselContainer.addEventListener('mouseleave', startAutoPlay);
        }

        // Initialize
        updateCarousel();
        startAutoPlay();
    }

    // ============================================
    // PARALLAX EFFECT (Desktop only)
    // ============================================
    const parallaxElements = document.querySelectorAll('.shape, .hero-pattern');

    function handleParallax() {
        // Only apply parallax on non-touch devices
        if (window.matchMedia('(pointer: coarse)').matches) return;
        
        const scrolled = window.pageYOffset;

        parallaxElements.forEach((el, index) => {
            const speed = 0.5 + (index * 0.1);
            el.style.transform = `translateY(${scrolled * speed}px)`;
        });
    }

    let parallaxTicking = false;
    window.addEventListener('scroll', function() {
        if (!parallaxTicking) {
            requestAnimationFrame(function() {
                handleParallax();
                parallaxTicking = false;
            });
            parallaxTicking = true;
        }
    }, { passive: true });

    // ============================================
    // MAGNETIC BUTTON EFFECT (Desktop only)
    // ============================================
    const magneticButtons = document.querySelectorAll('.btn-primary, .btn-quote, .btn-cta-primary');

    if (!window.matchMedia('(pointer: coarse)').matches) {
        magneticButtons.forEach(button => {
            button.addEventListener('mousemove', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                this.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
            });

            button.addEventListener('mouseleave', function() {
                this.style.transform = '';
            });
        });
    }

    // ============================================
    // SPECIALTY CARDS HOVER EFFECT
    // ============================================
    const specialtyCards = document.querySelectorAll('.specialty-card');

    specialtyCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });

    // ============================================
    // TESTIMONIAL CARDS STAGGER
    // ============================================
    const testimonialCards = document.querySelectorAll('.testimonial-card');

    testimonialCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
    });

    // ============================================
    // LAZY LOADING FOR IMAGES
    // ============================================
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.classList.add('loaded');
                    img.style.opacity = '1';
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px'
        });

        document.querySelectorAll('img').forEach(img => {
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.5s ease';
            imageObserver.observe(img);
        });
    }

    // ============================================
    // RIPPLE EFFECT FOR BUTTONS
    // ============================================
    const rippleButtons = document.querySelectorAll('a, button');

    rippleButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Don't create ripple for disabled buttons
            if (this.disabled) return;
            
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
                left: ${x}px;
                top: ${y}px;
                width: 100px;
                height: 100px;
                margin-left: -50px;
                margin-top: -50px;
            `;

            const originalPosition = getComputedStyle(this).position;
            if (originalPosition === 'static') {
                this.style.position = 'relative';
            }
            this.style.overflow = 'hidden';
            this.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
                if (originalPosition === 'static') {
                    this.style.position = '';
                }
            }, 600);
        });
    });

    // Add ripple animation keyframes
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);

    // ============================================
    // GALLERY IMAGE ERROR HANDLING
    // ============================================
    const galleryImages = document.querySelectorAll('.gallery-image img');
    galleryImages.forEach(img => {
        img.addEventListener('error', function() {
            this.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect fill="%23f0ebe5" width="400" height="300"/%3E%3Ctext fill="%23a89f97" font-family="Montserrat" font-size="16" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EImagem%3C/text%3E%3C/svg%3E';
            this.style.opacity = '1';
        });
    });

    // ============================================
    // CONSOLE MESSAGE
    // ============================================
    console.log('%c🦷 Dra. Lais de Melo', 'font-size: 24px; font-weight: bold; color: #D4A574;');
    console.log('%cWebsite carregado com sucesso!', 'font-size: 14px; color: #7a726a;');
    console.log('%c✨ Animações e interatividades inicializadas', 'font-size: 12px; color: #a89f97;');
});

// ============================================
// DEBOUNCE UTILITY
// ============================================
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ============================================
// THROTTLE UTILITY
// ============================================
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ============================================
// RESIZE HANDLER
// ============================================
window.addEventListener('resize', debounce(() => {
    // Close mobile menu on resize to desktop
    if (window.innerWidth > 768) {
        const navLinks = document.querySelector('.nav-links');
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        
        if (navLinks && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            if (mobileMenuBtn) mobileMenuBtn.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
}, 250));