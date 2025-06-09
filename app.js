// Enhanced Infrastructure Portfolio JavaScript
// Focus on accessibility, performance, and user experience

document.addEventListener('DOMContentLoaded', function() {
    // Cache DOM elements for better performance
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    
    // State management
    let isMenuOpen = false;
    let isScrolling = false;
    let currentSection = 'home';
    
    // Utility functions
    const debounce = (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };
    
    const throttle = (func, limit) => {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    };

    // Mobile menu functionality with accessibility
    function toggleMobileMenu() {
        isMenuOpen = !isMenuOpen;
        navMenu.classList.toggle('active', isMenuOpen);
        hamburger.classList.toggle('active', isMenuOpen);
        hamburger.setAttribute('aria-expanded', isMenuOpen);
        
        // Animate hamburger lines
        const spans = hamburger.querySelectorAll('span');
        if (isMenuOpen) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            
            // Lock body scroll when menu is open
            document.body.style.overflow = 'hidden';
            
            // Focus management
            navMenu.setAttribute('aria-hidden', 'false');
            navLinks[0]?.focus();
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
            
            // Unlock body scroll
            document.body.style.overflow = '';
            
            // Reset focus
            navMenu.setAttribute('aria-hidden', 'true');
            hamburger.focus();
        }
    }

    function closeMobileMenu() {
        if (isMenuOpen) {
            toggleMobileMenu();
        }
    }

    // Enhanced smooth scrolling with easing
    function smoothScrollTo(targetElement, offset = 0) {
        if (!targetElement) return;
        
        const targetPosition = targetElement.offsetTop - offset;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const duration = Math.min(Math.abs(distance) / 2, 1000); // Max 1 second
        let start = null;

        function animation(currentTime) {
            if (start === null) start = currentTime;
            const timeElapsed = currentTime - start;
            const progress = Math.min(timeElapsed / duration, 1);
            
            // Easing function (ease-out cubic)
            const ease = 1 - Math.pow(1 - progress, 3);
            
            window.scrollTo(0, startPosition + distance * ease);
            
            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        }
        
        requestAnimationFrame(animation);
    }

    // Navigation link handling
    function handleNavLinkClick(e) {
        e.preventDefault();
        
        const targetId = e.currentTarget.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
            const navbarHeight = navbar.offsetHeight;
            smoothScrollTo(targetSection, navbarHeight + 20);
            
            // Update active state
            updateActiveNavLink(targetId);
            
            // Close mobile menu if open
            closeMobileMenu();
            
            // Update browser history
            if (history.pushState) {
                history.pushState(null, null, `#${targetId}`);
            }
        }
    }

    // Active navigation link highlighting
    function updateActiveNavLink(sectionId = null) {
        if (!sectionId) {
            // Determine current section based on scroll position
            const navbarHeight = navbar.offsetHeight;
            const scrollPosition = window.scrollY + navbarHeight + 100;

            let currentSectionId = 'home';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionBottom = sectionTop + sectionHeight;

                if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                    currentSectionId = section.getAttribute('id');
                }
            });
            
            sectionId = currentSectionId;
        }
        
        if (currentSection !== sectionId) {
            currentSection = sectionId;
            
            // Update nav links
            navLinks.forEach(link => {
                const linkTarget = link.getAttribute('href').substring(1);
                link.classList.toggle('active', linkTarget === sectionId);
                link.setAttribute('aria-current', linkTarget === sectionId ? 'page' : 'false');
            });
        }
    }

    // Enhanced navbar scroll effects with improved visibility
    function updateNavbarOnScroll() {
        const scrolled = window.scrollY > 50;
        
        // Detect if we're in dark mode
        const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches ||
                          document.documentElement.hasAttribute('data-color-scheme') &&
                          document.documentElement.getAttribute('data-color-scheme') === 'dark';
        
        if (scrolled) {
            navbar.classList.add('scrolled');
            if (isDarkMode) {
                navbar.style.background = 'rgba(38, 40, 40, 0.98)';
                navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.12)';
            }
        } else {
            navbar.classList.remove('scrolled');
            if (isDarkMode) {
                navbar.style.background = 'rgba(38, 40, 40, 0.95)';
                navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.08)';
            }
        }
    }

    // Intersection Observer for animations
    function createIntersectionObserver() {
        const observerOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    entry.target.classList.add('animate-in');
                    
                    // Add staggered animation for child elements
                    const children = entry.target.querySelectorAll('.tech-tag, .experience-achievements li, .achievement-list li, .my-work-list li, .highlight-list li');
                    children.forEach((child, index) => {
                        setTimeout(() => {
                            child.style.opacity = '1';
                            child.style.transform = 'translateY(0)';
                        }, index * 50);
                    });
                }
            });
        }, observerOptions);

        // Observe elements that should animate in
        const animateElements = document.querySelectorAll(
            '.skill-category, .project-card, .contact-item, .experience-item, .about-highlights'
        );
        
        animateElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
            observer.observe(el);
        });

        // Prepare child elements for staggered animation
        const childElements = document.querySelectorAll('.tech-tag, .experience-achievements li, .achievement-list li, .my-work-list li, .highlight-list li');
        childElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        });
    }

    // Enhanced project card interactions with special effects
    function initProjectCardInteractions() {
        const projectCards = document.querySelectorAll('.project-card');
        
        projectCards.forEach(card => {
            const isFlashship = card.classList.contains('flagship-project');
            
            // Mouse enter effect
            card.addEventListener('mouseenter', function() {
                if (isFlashship) {
                    this.style.transform = 'translateY(-12px) scale(1.03)';
                    this.style.boxShadow = '0 25px 50px rgba(231, 76, 60, 0.3)';
                } else {
                    this.style.transform = 'translateY(-8px) scale(1.02)';
                    this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.1)';
                }
            });
            
            // Mouse leave effect
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
                this.style.boxShadow = '';
            });

            // Focus handling for accessibility
            card.addEventListener('focus', function() {
                if (isFlashship) {
                    this.style.transform = 'translateY(-12px) scale(1.03)';
                    this.style.boxShadow = '0 25px 50px rgba(231, 76, 60, 0.3)';
                } else {
                    this.style.transform = 'translateY(-8px) scale(1.02)';
                    this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.1)';
                }
            });

            card.addEventListener('blur', function() {
                this.style.transform = 'translateY(0) scale(1)';
                this.style.boxShadow = '';
            });
        });
    }

    // Enhanced tech tag interactions with infrastructure emphasis
    function initTechTagInteractions() {
        const techTags = document.querySelectorAll('.tech-tag');
        
        techTags.forEach(tag => {
            const isPrimary = tag.classList.contains('primary');
            
            tag.addEventListener('mouseenter', function() {
                if (isPrimary) {
                    this.style.transform = 'scale(1.15) translateY(-3px)';
                    this.style.boxShadow = '0 12px 25px rgba(44, 62, 80, 0.4)';
                } else {
                    this.style.transform = 'scale(1.1) translateY(-2px)';
                    this.style.boxShadow = '0 8px 20px rgba(52, 152, 219, 0.3)';
                }
                this.style.zIndex = '10';
            });
            
            tag.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1) translateY(0)';
                this.style.boxShadow = 'none';
                this.style.zIndex = '1';
            });

            // Add tooltip functionality with infrastructure context
            const techName = tag.textContent;
            if (isPrimary) {
                tag.setAttribute('title', `${techName} - 핵심 인프라 기술`);
            } else {
                tag.setAttribute('title', `${techName} 기술 스택`);
            }
        });
    }

    // Infrastructure-specific animations for "내가 한 일" sections
    function initMyWorkHighlighting() {
        const myWorkSections = document.querySelectorAll('.my-work-section');
        
        myWorkSections.forEach(section => {
            // Add subtle pulse animation on hover
            section.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.02)';
                this.style.boxShadow = '0 12px 40px rgba(231, 76, 60, 0.25)';
            });
            
            section.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
                this.style.boxShadow = '';
            });
            
            // Special click effect for mobile
            section.addEventListener('click', function(e) {
                if (window.innerWidth <= 768) {
                    this.style.transform = 'scale(0.98)';
                    setTimeout(() => {
                        this.style.transform = 'scale(1.02)';
                        setTimeout(() => {
                            this.style.transform = 'scale(1)';
                        }, 200);
                    }, 100);
                }
            });
        });
        
        // Animate individual work items on scroll
        const myWorkItems = document.querySelectorAll('.my-work-list li');
        myWorkItems.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.1}s`;
        });
    }

    // Scroll to top functionality with infrastructure styling
    function initScrollToTop() {
        const scrollToTopBtn = document.createElement('button');
        scrollToTopBtn.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="18 15 12 9 6 15"></polyline>
            </svg>
        `;
        scrollToTopBtn.className = 'scroll-to-top';
        scrollToTopBtn.setAttribute('aria-label', '페이지 상단으로 이동');
        scrollToTopBtn.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 56px;
            height: 56px;
            border-radius: 50%;
            background: var(--infra-primary);
            color: white;
            border: none;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            z-index: 1000;
            box-shadow: 0 8px 25px rgba(44, 62, 80, 0.3);
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        document.body.appendChild(scrollToTopBtn);
        
        // Show/hide button based on scroll position
        function toggleScrollToTopBtn() {
            const shouldShow = window.scrollY > 500;
            scrollToTopBtn.style.opacity = shouldShow ? '1' : '0';
            scrollToTopBtn.style.visibility = shouldShow ? 'visible' : 'hidden';
            scrollToTopBtn.style.transform = shouldShow ? 'scale(1)' : 'scale(0.8)';
        }
        
        // Scroll to top when clicked
        scrollToTopBtn.addEventListener('click', function() {
            smoothScrollTo(document.body, 0);
        });
        
        // Hover effects
        scrollToTopBtn.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
            this.style.background = 'var(--infra-primary-light)';
        });
        
        scrollToTopBtn.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.background = 'var(--infra-primary)';
        });
        
        // Keyboard support
        scrollToTopBtn.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
        
        return toggleScrollToTopBtn;
    }

    // Professional typing effect for hero subtitle
    function initTypingEffect() {
        const subtitle = document.querySelector('.hero-subtitle');
        if (!subtitle) return;
        
        const text = subtitle.textContent;
        subtitle.textContent = '';
        subtitle.style.borderRight = '2px solid var(--infra-secondary)';
        
        let i = 0;
        function typeWriter() {
            if (i < text.length) {
                subtitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100 + Math.random() * 50); // Professional speed
            } else {
                // Remove cursor after typing is complete
                setTimeout(() => {
                    subtitle.style.borderRight = 'none';
                }, 1500);
            }
        }
        
        // Start typing effect after hero elements are visible
        setTimeout(typeWriter, 1200);
    }

    // Enhanced contact link interactions
    function initContactLinkInteractions() {
        const contactLinks = document.querySelectorAll('.contact-link');
        
        contactLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                // Add click feedback with infrastructure color
                this.style.transform = 'scale(0.95)';
                this.style.backgroundColor = 'var(--infra-primary)';
                this.style.color = 'white';
                
                setTimeout(() => {
                    this.style.transform = '';
                    this.style.backgroundColor = '';
                    this.style.color = '';
                }, 200);

                // Track interaction for analytics
                const linkType = this.href.includes('mailto') ? 'email' : 
                               this.href.includes('github') ? 'github' : 'external';
                console.log(`Contact link clicked: ${linkType}`);
            });
            
            // Enhanced hover effects
            link.addEventListener('mouseenter', function() {
                this.style.borderColor = 'var(--infra-secondary)';
                this.style.boxShadow = '0 4px 15px rgba(52, 152, 219, 0.3)';
            });
            
            link.addEventListener('mouseleave', function() {
                this.style.borderColor = '';
                this.style.boxShadow = '';
            });
        });
    }

    // Infrastructure skill category highlighting
    function initInfrastructureHighlighting() {
        const infraCategories = document.querySelectorAll('.infrastructure-highlight');
        
        infraCategories.forEach(category => {
            category.addEventListener('mouseenter', function() {
                this.style.borderColor = 'var(--infra-primary)';
                this.style.background = 'linear-gradient(145deg, var(--color-surface) 0%, rgba(44, 62, 80, 0.08) 100%)';
            });
            
            category.addEventListener('mouseleave', function() {
                this.style.borderColor = '';
                this.style.background = '';
            });
        });
    }

    // Keyboard navigation support for infrastructure professionals
    function initKeyboardNavigation() {
        document.addEventListener('keydown', function(e) {
            // Escape key closes mobile menu
            if (e.key === 'Escape' && isMenuOpen) {
                closeMobileMenu();
            }
            
            // Alt + Arrow keys for section navigation (professional shortcut)
            if (e.altKey) {
                if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                    e.preventDefault();
                    const sectionsArray = Array.from(sections);
                    const currentIndex = sectionsArray.findIndex(section => 
                        section.id === currentSection
                    );
                    
                    let nextIndex;
                    if (e.key === 'ArrowDown') {
                        nextIndex = (currentIndex + 1) % sectionsArray.length;
                    } else {
                        nextIndex = currentIndex === 0 ? sectionsArray.length - 1 : currentIndex - 1;
                    }
                    
                    const targetSection = sectionsArray[nextIndex];
                    if (targetSection) {
                        smoothScrollTo(targetSection, navbar.offsetHeight + 20);
                    }
                }
            }
            
            // Ctrl + Home to go to top (infrastructure professional shortcut)
            if (e.ctrlKey && e.key === 'Home') {
                e.preventDefault();
                smoothScrollTo(document.body, 0);
            }
        });
    }

    // Performance optimization for scroll events
    const handleScroll = throttle(() => {
        updateActiveNavLink();
        updateNavbarOnScroll();
    }, 16); // ~60fps

    // Window resize handler
    const handleResize = debounce(() => {
        // Close mobile menu on larger screens
        if (window.innerWidth > 768 && isMenuOpen) {
            closeMobileMenu();
        }
        
        // Recalculate positions if needed
        updateActiveNavLink();
    }, 250);

    // Dark mode system preference handling
    function initDarkModeSupport() {
        const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
        
        function updateForDarkMode(e) {
            updateNavbarOnScroll(); // Refresh navbar styling
            
            // Update infrastructure colors
            const root = document.documentElement;
            if (e.matches) {
                root.style.setProperty('--infra-primary', '#5DADE2');
                root.style.setProperty('--infra-secondary', '#52C4B0');
            } else {
                root.style.setProperty('--infra-primary', '#2C3E50');
                root.style.setProperty('--infra-secondary', '#3498DB');
            }
        }
        
        prefersDarkScheme.addEventListener('change', updateForDarkMode);
        updateForDarkMode(prefersDarkScheme);
    }

    // Project achievement counters (for impressive numbers)
    function initAchievementCounters() {
        const achievementItems = document.querySelectorAll('.achievement-list li');
        
        achievementItems.forEach(item => {
            const text = item.textContent;
            const numberMatch = text.match(/(\d+)%/);
            
            if (numberMatch) {
                const targetNumber = parseInt(numberMatch[1]);
                const numberElement = item;
                let currentNumber = 0;
                
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const increment = targetNumber / 50; // 50 steps
                            const timer = setInterval(() => {
                                currentNumber += increment;
                                if (currentNumber >= targetNumber) {
                                    currentNumber = targetNumber;
                                    clearInterval(timer);
                                }
                                numberElement.textContent = text.replace(/\d+%/, Math.floor(currentNumber) + '%');
                            }, 20);
                            observer.unobserve(entry.target);
                        }
                    });
                });
                
                observer.observe(item);
            }
        });
    }

    // Initialize all functionality
    function init() {
        // Set up event listeners
        hamburger?.addEventListener('click', toggleMobileMenu);
        
        navLinks.forEach(link => {
            link.addEventListener('click', handleNavLinkClick);
        });
        
        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', handleResize);
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (isMenuOpen && !navbar.contains(e.target)) {
                closeMobileMenu();
            }
        });
        
        // Initialize features
        createIntersectionObserver();
        initProjectCardInteractions();
        initTechTagInteractions();
        initMyWorkHighlighting();
        initInfrastructureHighlighting();
        const toggleScrollToTop = initScrollToTop();
        window.addEventListener('scroll', throttle(toggleScrollToTop, 100));
        initTypingEffect();
        initContactLinkInteractions();
        initKeyboardNavigation();
        initDarkModeSupport();
        initAchievementCounters();
        
        // Set initial states
        updateActiveNavLink();
        updateNavbarOnScroll();
        
        // Handle initial hash in URL
        if (window.location.hash) {
            setTimeout(() => {
                const targetId = window.location.hash.substring(1);
                const targetSection = document.getElementById(targetId);
                if (targetSection) {
                    smoothScrollTo(targetSection, navbar.offsetHeight + 20);
                }
            }, 100);
        }
    }

    // Start the application
    init();

    // Handle page visibility changes for performance
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            // Pause animations when page is not visible
            document.body.style.animationPlayState = 'paused';
        } else {
            // Resume animations when page is visible
            document.body.style.animationPlayState = 'running';
        }
    });

    // Professional page load effect
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
        
        // Smooth fade-in for the entire page
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.8s ease-in-out';
        
        requestAnimationFrame(() => {
            document.body.style.opacity = '1';
        });
        
        // Trigger hero animations with infrastructure feel
        setTimeout(() => {
            const heroElements = document.querySelectorAll('.hero-title, .hero-subtitle, .hero-description, .hero-buttons');
            heroElements.forEach((el, index) => {
                setTimeout(() => {
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                    el.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
                }, index * 200);
            });
        }, 400);
    });

    // Print styles handling for professional documentation
    window.addEventListener('beforeprint', function() {
        // Expand all collapsed sections for printing
        document.body.classList.add('printing');
        
        // Make sure all project details are visible
        const myWorkSections = document.querySelectorAll('.my-work-section');
        myWorkSections.forEach(section => {
            section.style.pageBreakInside = 'avoid';
        });
    });

    window.addEventListener('afterprint', function() {
        document.body.classList.remove('printing');
    });

    // Expose infrastructure portfolio functions for external use
    window.infrastructurePortfolio = {
        scrollToSection: (sectionId) => {
            const section = document.getElementById(sectionId);
            if (section) {
                smoothScrollTo(section, navbar.offsetHeight + 20);
            }
        },
        updateActiveSection: updateActiveNavLink,
        closeMenu: closeMobileMenu,
        highlightInfrastructure: () => {
            const infraElements = document.querySelectorAll('.infrastructure-highlight, .my-work-section');
            infraElements.forEach(el => {
                el.style.animation = 'pulse 1s ease-in-out';
            });
        }
    };

    // Enhanced error handling for production
    window.addEventListener('error', function(e) {
        console.error('Infrastructure Portfolio Error:', e.error);
        
        // Graceful degradation for critical errors
        if (e.error && e.error.message.includes('navigation')) {
            // Fallback to basic navigation
            navLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    const targetId = this.getAttribute('href');
                    if (targetId.startsWith('#')) {
                        const target = document.querySelector(targetId);
                        if (target) {
                            target.scrollIntoView({ behavior: 'smooth' });
                        }
                    }
                });
            });
        }
    });

    // Performance monitoring for infrastructure metrics
    if (window.performance && window.performance.mark) {
        window.performance.mark('infrastructure-portfolio-loaded');
        
        // Log performance metrics after load
        setTimeout(() => {
            const navigation = performance.getEntriesByType('navigation')[0];
            if (navigation) {
                console.log('Infrastructure Portfolio Performance:', {
                    domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
                    loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
                    totalLoadTime: navigation.loadEventEnd - navigation.fetchStart
                });
            }
        }, 1000);
    }
    
    // Infrastructure-specific console message
    console.log(`
    🏗️ Infrastructure Portfolio Loaded Successfully
    ⚡ Built with modern web technologies
    🎯 Optimized for performance and accessibility
    📱 Responsive design for all devices
    `);
});