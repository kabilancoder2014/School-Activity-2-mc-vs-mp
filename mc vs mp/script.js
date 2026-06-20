document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. REGISTER GSAP PLUGINS & INIT LENIS
    // ==========================================
    gsap.registerPlugin(ScrollTrigger);

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

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // ==========================================
    // 2. STICKY THEME TOGGLE
    // ==========================================
    const themeToggleBtn = document.getElementById('theme-toggle');
    const sunIcon = themeToggleBtn.querySelector('.sun-icon');
    const moonIcon = themeToggleBtn.querySelector('.moon-icon');
    const htmlElement = document.documentElement;

    const savedTheme = localStorage.getItem('theme') || 'dark';
    htmlElement.setAttribute('data-theme', savedTheme);
    updateThemeIcons(savedTheme);

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        gsap.to(themeToggleBtn, {
            rotation: "+=360",
            duration: 0.4,
            ease: 'power2.out',
            onComplete: () => {
                htmlElement.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
                updateThemeIcons(newTheme);
            }
        });
    });

    function updateThemeIcons(theme) {
        if (theme === 'dark') {
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
        } else {
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
        }
    }

    // ==========================================
    // 3. SCROLL PROGRESS TRACKER DOT (LEFT EDGE)
    // ==========================================
    gsap.to('.scroll-dot', {
        y: () => {
            const track = document.querySelector('.scroll-track');
            return track && track.offsetHeight > 0 ? track.offsetHeight - 8 : 0;
        },
        ease: 'none',
        scrollTrigger: {
            start: 0,
            end: 'max',
            scrub: true,
            invalidateOnRefresh: true
        }
    });

    // ==========================================
    // 4. VERTICAL SCROLLSPY (TRACKER HIGHLIGHT)
    // ==========================================
    const navItems = document.querySelectorAll('.tracker-label');
    const logoLink = document.getElementById('logo-link');
    const sections = gsap.utils.toArray('.content-section');

    sections.forEach((section, idx) => {
        ScrollTrigger.create({
            trigger: section,
            start: "top 150px",
            end: "bottom 150px",
            onToggle: (self) => {
                if (self.isActive) {
                    navItems.forEach((nav, navIdx) => {
                        if (navIdx === idx) {
                            nav.classList.add('active');
                        } else {
                            nav.classList.remove('active');
                        }
                    });
                }
            }
        });
    });

    // ==========================================
    // 5. STUNNING & RESPONSIVE ENTRANCE TIMELINES
    // ==========================================
    const mm = gsap.matchMedia();

    // Desktop view animations (full offsets and bouncing eases)
    mm.add("(min-width: 969px)", () => {
        sections.forEach(section => {
            const headings = section.querySelectorAll('.hero, .container > h2, .container > .section-subtitle');
            const cards = section.querySelectorAll('.card');
            const table = section.querySelectorAll('.table-wrapper');
            const footer = section.querySelectorAll('footer');

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: section,
                    start: 'top 95%',
                    end: 'top 40%',
                    scrub: 1,
                    invalidateOnRefresh: true
                }
            });

            // Headings slide in from left + fade in
            if (headings.length > 0) {
                tl.fromTo(headings, 
                    { x: -55, opacity: 0 },
                    { x: 0, opacity: 1, duration: 0.8, stagger: 0.12, ease: 'power2.out' }
                );
            }

            // Cards scale up + slide from bottom + back overshoot bounce
            if (cards.length > 0) {
                tl.fromTo(cards, 
                    { y: 90, scale: 0.91, opacity: 0 },
                    { y: 0, scale: 1, opacity: 1, duration: 0.85, stagger: 0.16, ease: 'back.out(1.25)' },
                    '-=0.45'
                );
            }

            // Tables slide in from right + fade in
            if (table.length > 0) {
                tl.fromTo(table, 
                    { x: 55, opacity: 0 },
                    { x: 0, opacity: 1, duration: 0.85, ease: 'power2.out' },
                    '-=0.45'
                );
            }

            // Footer fades in
            if (footer.length > 0) {
                tl.fromTo(footer,
                    { opacity: 0 },
                    { opacity: 0.5, duration: 0.6, ease: 'power2.out' },
                    '-=0.2'
                );
            }
        });
    });

    // Mobile view animations (lighter offsets and speeds for compact screens)
    mm.add("(max-width: 968px)", () => {
        sections.forEach(section => {
            const headings = section.querySelectorAll('.hero, .container > h2, .container > .section-subtitle');
            const cards = section.querySelectorAll('.card');
            const table = section.querySelectorAll('.table-wrapper');
            const footer = section.querySelectorAll('footer');

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: section,
                    start: 'top 95%',
                    end: 'top 50%',
                    scrub: 1,
                    invalidateOnRefresh: true
                }
            });

            if (headings.length > 0) {
                tl.fromTo(headings, 
                    { x: -25, opacity: 0 },
                    { x: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: 'power2.out' }
                );
            }

            if (cards.length > 0) {
                tl.fromTo(cards, 
                    { y: 40, scale: 0.95, opacity: 0 },
                    { y: 0, scale: 1, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out' },
                    '-=0.3'
                );
            }

            if (table.length > 0) {
                tl.fromTo(table, 
                    { x: 25, opacity: 0 },
                    { x: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
                    '-=0.3'
                );
            }

            if (footer.length > 0) {
                tl.fromTo(footer,
                    { opacity: 0 },
                    { opacity: 0.5, duration: 0.4, ease: 'power2.out' },
                    '-=0.2'
                );
            }
        });
    });

    // ==========================================
    // 6. UNIFIED NAVIGATION CLICK SCROLLS
    // ==========================================
    
    // Tracker Label click handling
    navItems.forEach((item) => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = item.getAttribute('href');
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                lenis.scrollTo(targetEl, { offset: -70 });
            }
        });
    });

    // Logo click handling
    logoLink.addEventListener('click', (e) => {
        e.preventDefault();
        lenis.scrollTo('#intro');
    });

    // Learn More buttons click handling
    const learnMoreLinks = document.querySelectorAll('.learn-more-btn');
    learnMoreLinks.forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = btn.getAttribute('href');
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                lenis.scrollTo(targetEl, { offset: -70 });
            }
        });
    });

    // Force ScrollTrigger refresh on window resize
    window.addEventListener('resize', () => {
        ScrollTrigger.refresh();
    });
});
