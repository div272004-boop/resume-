/* ==========================================
   Divyanshi's Portfolio - Interactive Logic
   Vanilla JavaScript for DOM Manipulations
   Sticky Nav, Theme Switcher, Certificate Vault, Feedback Widget
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavbar();
  initCertificates();
  initFeedback();
  initContactForm();
});

/* 1. Theme Configuration (Persistent Light/Dark Mode) */
function initTheme() {
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const htmlElement = document.documentElement;
  
  // Check local storage or system preference
  const savedTheme = localStorage.getItem('theme') || 'dark';
  htmlElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
  });
}

function updateThemeIcon(theme) {
  const icon = document.querySelector('#themeToggleBtn i');
  if (theme === 'dark') {
    icon.className = 'fa-solid fa-sun';
  } else {
    icon.className = 'fa-solid fa-moon';
  }
}

/* 2. Navbar Scrolling Effects & Mobile Toggle */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');

  // Sticky navbar on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  menuToggle.addEventListener('click', () => {
    navbar.classList.toggle('active');
  });

  // Close menu when clicking nav links on mobile
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navbar.classList.remove('active');
    });
  });

  // Footer Year Auto-update
  document.getElementById('currentYear').textContent = new Date().getFullYear();
}

/* 3. Interactive Certificate Vault Controller */
function initCertificates() {
  const certItems = document.querySelectorAll('.vault-item');
  const certTitle = document.getElementById('certTitle');
  const certIssuer = document.getElementById('certIssuer');
  const certIcon = document.getElementById('certIcon');
  const certCounter = document.getElementById('certCounter');
  const prevCertBtn = document.getElementById('prevCertBtn');
  const nextCertBtn = document.getElementById('nextCertBtn');
  
  // Lightbox Elements
  const activeCertCard = document.getElementById('activeCertCard');
  const certModal = document.getElementById('certModal');
  const certModalImg = document.getElementById('certModalImg');
  const certModalCaption = document.getElementById('certModalCaption');
  const closeCertModal = document.getElementById('closeCertModal');
  
  let currentIndex = 0;
  const certData = Array.from(certItems).map(item => ({
    title: item.getAttribute('data-title'),
    issuer: item.getAttribute('data-issuer'),
    icon: item.getAttribute('data-icon'),
    image: item.getAttribute('data-image')
  }));

  function updateCertDisplay(index) {
    // Clear active class from all items
    certItems.forEach(item => item.classList.remove('active'));
    
    // Set active class on target item
    const activeItem = document.querySelector(`.vault-item[data-index="${index}"]`);
    if (activeItem) activeItem.classList.add('active');

    // Update display text values in fallback
    certTitle.textContent = certData[index].title;
    certIssuer.textContent = certData[index].issuer;
    certIcon.innerHTML = `<i class="fa-solid ${certData[index].icon}"></i>`;
    
    // Toggle Image / Fallback state
    const activeImg = document.getElementById('activeCertImg');
    const certFallback = document.getElementById('certFallback');
    
    if (certData[index].image) {
      activeImg.src = certData[index].image;
      activeImg.style.display = 'block';
      certFallback.style.display = 'none';
    } else {
      activeImg.src = '';
      activeImg.style.display = 'none';
      certFallback.style.display = 'flex';
    }
    
    // Update counter
    certCounter.textContent = `${index + 1} of ${certData.length}`;
    currentIndex = index;
  }

  // Handle image load error to show text fallback gracefully
  const activeImg = document.getElementById('activeCertImg');
  if (activeImg) {
    activeImg.addEventListener('error', () => {
      activeImg.style.display = 'none';
      document.getElementById('certFallback').style.display = 'flex';
    });
  }

  // Lightbox Modal trigger
  if (activeCertCard) {
    activeCertCard.addEventListener('click', () => {
      if (activeImg && activeImg.src && activeImg.style.display !== 'none') {
        certModal.style.display = 'flex';
        certModalImg.src = activeImg.src;
        certModalCaption.textContent = certData[currentIndex].title + " — " + certData[currentIndex].issuer;
      }
    });
  }

  if (closeCertModal) {
    closeCertModal.addEventListener('click', () => {
      certModal.style.display = 'none';
    });
  }

  if (certModal) {
    certModal.addEventListener('click', (e) => {
      if (e.target === certModal) {
        certModal.style.display = 'none';
      }
    });
  }

  // Click on list item
  certItems.forEach(item => {
    item.addEventListener('click', () => {
      const index = parseInt(item.getAttribute('data-index'));
      updateCertDisplay(index);
    });
  });

  // Prev / Next button actions
  prevCertBtn.addEventListener('click', () => {
    let index = currentIndex - 1;
    if (index < 0) index = certData.length - 1;
    updateCertDisplay(index);
  });

  nextCertBtn.addEventListener('click', () => {
    let index = (currentIndex + 1) % certData.length;
    updateCertDisplay(index);
  });
}

/* 4. Feedback Rating System */
function initFeedback() {
  const stars = document.querySelectorAll('.rating-star');
  const ratingComment = document.getElementById('ratingComment');
  const submitFeedbackBtn = document.getElementById('submitFeedbackBtn');
  let selectedRating = 0;

  // Star mouseover/click animations
  stars.forEach(star => {
    star.addEventListener('click', () => {
      selectedRating = parseInt(star.getAttribute('data-val'));
      updateStars(selectedRating);
    });
  });

  function updateStars(rating) {
    stars.forEach(star => {
      const starVal = parseInt(star.getAttribute('data-val'));
      if (starVal <= rating) {
        star.classList.add('active');
      } else {
        star.classList.remove('active');
      }
    });
  }

  submitFeedbackBtn.addEventListener('click', () => {
    if (selectedRating === 0) {
      alert('Please select a star rating first!');
      return;
    }
    
    alert(`Thank you for submitting a ${selectedRating}-star review!`);
    
    // Reset state
    selectedRating = 0;
    updateStars(0);
    ratingComment.value = '';
  });
}

/* 5. Contact Form Handler */
function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  const contactSuccessMsg = document.getElementById('contactSuccessMsg');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Visual submit validation and state reset
    contactSuccessMsg.style.display = 'flex';
    contactForm.reset();

    // Auto fadeout success message after 4s
    setTimeout(() => {
      contactSuccessMsg.style.display = 'none';
    }, 4000);
  });
}