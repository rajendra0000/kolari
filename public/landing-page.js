// Landing Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Generate Session Button Handler
    const generateSessionBtn = document.getElementById('generateSessionBtn');

    // Join Session Button Handler
    const connectSessionBtn = document.getElementById('connectSessionBtn');

    connectSessionBtn.addEventListener('click', async function () {
        const sessionId = prompt('Enter the session ID to join:');
        if (sessionId && sessionId.trim()) {
            connectSessionBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Joining...';
            connectSessionBtn.disabled = true;

            await new Promise(resolve => setTimeout(resolve, 500)); // slight delay

            window.location.href = `/${sessionId.trim()}`;
        }
    });

    
    // Add loading state functionality
    function setLoadingState(isLoading) {
        if (isLoading) {
            generateSessionBtn.disabled = true;
            generateSessionBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Creating Session...';
            generateSessionBtn.classList.add('loading');
        } else {
            generateSessionBtn.disabled = false;
            generateSessionBtn.innerHTML = '<i class="fas fa-plus me-2"></i>Generate New Session';
            generateSessionBtn.classList.remove('loading');
        }
    }
    
    // Session generation handler
    generateSessionBtn.addEventListener('click', async function() {
        try {
            setLoadingState(true);
            
            // Add a small delay for better UX
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const response = await fetch('/generate-session');
            const data = await response.json();

             
            
            if (data.uuid) {
                // Add success animation
                generateSessionBtn.innerHTML = '<i class="fas fa-check me-2"></i>Session Created!';
                generateSessionBtn.style.background = 'linear-gradient(135deg, #28a745 0%, #20c997 100%)';
                
                // Navigate to session after a short delay
                setTimeout(() => {
                    window.location.href = `/${data.uuid}`;
                }, 1000);
            } else {
                throw new Error('Failed to generate session');
            }
        } catch (error) {
            console.error('Error generating session:', error);
            
            // Show error state
            generateSessionBtn.innerHTML = '<i class="fas fa-exclamation-triangle me-2"></i>Error - Try Again';
            generateSessionBtn.style.background = 'linear-gradient(135deg, #dc3545 0%, #fd7e14 100%)';
            
            // Reset button after 3 seconds
            setTimeout(() => {
                setLoadingState(false);
                generateSessionBtn.style.background = '';
            }, 3000);
        }
    });
    
    // Add hover effect for features
    const featureItems = document.querySelectorAll('.feature-item');
    featureItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Add subtle parallax effect to floating shapes
    function addParallaxEffect() {
        const shapes = document.querySelectorAll('.shape');
        
        document.addEventListener('mousemove', function(e) {
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;
            
            shapes.forEach((shape, index) => {
                const speed = (index + 1) * 0.5;
                const x = (mouseX * speed) - (speed / 2);
                const y = (mouseY * speed) - (speed / 2);
                
                shape.style.transform = `translate(${x}px, ${y}px)`;
            });
        });
    }
    
    // Initialize parallax effect
    addParallaxEffect();
    
    // Add smooth scroll reveal animation
    function addScrollReveal() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                }
            });
        }, observerOptions);
        
        // Observe elements that should be revealed
        const revealElements = document.querySelectorAll('.feature-item, .glass-card');
        revealElements.forEach(el => {
            el.classList.add('reveal-element');
            observer.observe(el);
        });
    }
    
    // Add CSS for reveal animation
    const revealStyle = document.createElement('style');
    revealStyle.textContent = `
        .reveal-element {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s ease;
        }
        
        .reveal-element.revealed {
            opacity: 1;
            transform: translateY(0);
        }
        
        .loading {
            pointer-events: none;
        }
    `;
    document.head.appendChild(revealStyle);
    
    // Initialize scroll reveal
    addScrollReveal();
    
    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && e.target === generateSessionBtn) {
            generateSessionBtn.click();
        }
    });
    
    // Add focus management
    generateSessionBtn.addEventListener('focus', function() {
        this.style.boxShadow = '0 0 0 3px rgba(0, 180, 219, 0.25)';
    });
    
    generateSessionBtn.addEventListener('blur', function() {
        this.style.boxShadow = '';
    });
});