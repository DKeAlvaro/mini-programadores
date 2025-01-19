// Add smooth scrolling to all links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Add animation to CTA button
const ctaButton = document.querySelector('.cta-button');
if (ctaButton) {
    ctaButton.addEventListener('mouseover', function() {
        this.style.transform = 'scale(1.05)';
        this.style.transition = 'transform 0.3s ease';
    });

    ctaButton.addEventListener('mouseout', function() {
        this.style.transform = 'scale(1)';
    });
} 

// Botón de menú móvil
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

// Cerrar menú móvil al hacer clic fuera
document.addEventListener('click', (e) => {
    if (navLinks.classList.contains('active') && 
        !e.target.closest('.navbar')) {
        navLinks.classList.remove('active');
    }
});

// Cerrar menú móvil cuando la ventana se redimensiona
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        navLinks.classList.remove('active');
    }
});

// Form handling
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    const submitButton = form?.querySelector('.submit-button');
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');

    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Show loading state
            submitButton.classList.add('loading');
            submitButton.disabled = true;
            
            // Hide any existing messages
            successMessage.style.display = 'none';
            errorMessage.style.display = 'none';

            try {
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: new FormData(form),
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    // Show success message
                    form.reset();
                    successMessage.style.display = 'block';
                    setTimeout(() => {
                        successMessage.style.display = 'none';
                    }, 5000);
                } else {
                    // Show error message
                    errorMessage.style.display = 'block';
                    setTimeout(() => {
                        errorMessage.style.display = 'none';
                    }, 5000);
                }
            } catch (error) {
                // Show error message
                errorMessage.style.display = 'block';
                setTimeout(() => {
                    errorMessage.style.display = 'none';
                }, 5000);
            } finally {
                // Remove loading state
                submitButton.classList.remove('loading');
                submitButton.disabled = false;
            }
        });
    }
}); 

// Modal functionality
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Restore scrolling
}

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const modals = document.getElementsByClassName('modal');
        for (let modal of modals) {
            if (modal.style.display === 'block') {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        }
    }
});

// Game carousel functionality
function changeGame(direction) {
    const slides = document.querySelectorAll('.game-slide');
    let activeSlide = document.querySelector('.game-slide.active');
    let currentIndex = Array.from(slides).indexOf(activeSlide);
    let nextIndex;

    if (direction === 'next') {
        nextIndex = (currentIndex + 1) % slides.length;
    } else {
        nextIndex = (currentIndex - 1 + slides.length) % slides.length;
    }

    activeSlide.classList.remove('active');
    slides[nextIndex].classList.add('active');
} 