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

// Function to parse CSV data
function parseCSV(text) {
    const lines = text.split('\n');
    const headers = lines[0].split(',');
    const result = [];
    
    for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue; // Skip empty lines
        const values = lines[i].split(',');
        const entry = {};
        headers.forEach((header, index) => {
            entry[header.trim()] = values[index] ? values[index].trim() : '';
        });
        result.push(entry);
    }
    
    return result;
}

// Function to format academy name with URL if available
function formatAcademyName(academy) {
    if (academy['academy_url'] && academy['academy_url'] !== 'NO') {
        return `<a href="${academy['academy_url']}" target="_blank" rel="noopener">${academy['academy name']}</a>`;
    }
    return academy['academy name'];
}

// Function to load and display academias data
async function loadAcademiasData() {
    try {
        console.log('Loading academias data...');
        const response = await fetch('static/academias.csv');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const csvText = await response.text();
        console.log('CSV content:', csvText);
        const academias = parseCSV(csvText);
        console.log('Parsed data:', academias);
        
        const tableBody = document.getElementById('comparison-table-body');
        if (!tableBody) {
            console.error('Table body element not found!');
            return;
        }
        
        // Clear existing content
        tableBody.innerHTML = '';
        
        // Add each academia to the table
        academias.forEach((academia, index) => {
            const row = document.createElement('tr');
            if (index === 0) row.classList.add('fixed-row');
            
            row.innerHTML = `
                <td>${index === 0 ? '<strong>' : ''}${formatAcademyName(academia)}${index === 0 ? '</strong>' : ''}</td>
                <td>${academia.price_available !== 'NO' ? academia.price_available : 'No disponible'}</td>
                <td>${academia.sessions_per_week || 'No especificado'}</td>
                <td>${academia.go_to_school === 'SI' ? 'Sí' : 'No disponible'}</td>
            `;
            
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading academias data:', error);
        const tableBody = document.getElementById('comparison-table-body');
        if (tableBody) {
            tableBody.innerHTML = '<tr><td colspan="4">Error cargando los datos. Por favor, inténtelo de nuevo más tarde.</td></tr>';
        }
    }
}

// Load academias data when the page loads
document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.comparison-table')) {
        loadAcademiasData();
    }
}); 