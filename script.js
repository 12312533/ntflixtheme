/**
 * SYAKIRA: THE BIRTHDAY CHAPTER - MAIN SCRIPT
 * Final Version - Watchlist Dinamis & Video Bebas Fullscreen
 */

document.addEventListener("DOMContentLoaded", () => {
    initApp();
});

function initApp() {
    setTimeout(() => {
        const loadingScreen = document.getElementById('loading-screen');
        const profileScreen = document.getElementById('profile-screen');
        
        loadingScreen.classList.add('fade-out');
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            loadingScreen.classList.remove('fade-out');
            profileScreen.classList.remove('hidden');
        }, 800);
    }, 2000);

    initProfileSelection();
    initNavbar();
    initWatchButton();
    initModals();
    initEasterEgg();
}

function initProfileSelection() {
    const profileLovee = document.getElementById('profile-lovee');
    const profileGuest = document.getElementById('profile-guest');
    const guestTooltip = document.getElementById('guest-tooltip');
    
    const profileScreen = document.getElementById('profile-screen');
    const introScreen = document.getElementById('intro-screen');
    const mainContent = document.getElementById('main-content');
    const introVideo = document.getElementById('intro-video');
    const skipBtn = document.getElementById('skip-intro');
    
    profileGuest.addEventListener('click', () => {
        profileGuest.classList.add('shake');
        guestTooltip.classList.add('show');
        setTimeout(() => {
            profileGuest.classList.remove('shake');
            guestTooltip.classList.remove('show');
        }, 2000);
    });

    profileLovee.addEventListener('click', () => {
        profileScreen.classList.add('fade-out');
        setTimeout(() => {
            profileScreen.classList.add('hidden');
            profileScreen.classList.remove('fade-out');
            
            introScreen.classList.remove('hidden');
            const playPromise = introVideo.play();
            
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.log("Video autoplay blocked or missing. Skipping...");
                    skipToMainContent();
                });
            }
        }, 800);
    });

    introVideo.addEventListener('ended', skipToMainContent);
    skipBtn.addEventListener('click', skipToMainContent);

    function skipToMainContent() {
        introVideo.pause();
        introScreen.classList.add('fade-out');
        
        setTimeout(() => {
            introScreen.classList.add('hidden');
            introScreen.classList.remove('fade-out');
            mainContent.classList.remove('hidden');
        }, 800);
    }
}

function initNavbar() {
    const navbar = document.getElementById('navbar');
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const closeBtn = document.getElementById('close-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    mobileBtn.addEventListener('click', () => mobileMenu.classList.remove('hidden'));
    closeBtn.addEventListener('click', () => mobileMenu.classList.add('hidden'));
    mobileLinks.forEach(link => { link.addEventListener('click', () => mobileMenu.classList.add('hidden')); });
}

function initWatchButton() {
    const watchBtn = document.getElementById('btn-watch');
    let isTransitioning = false;

    watchBtn.addEventListener('click', () => {
        if(isTransitioning) return;
        isTransitioning = true;
        document.getElementById('episodes').scrollIntoView({behavior: 'smooth'});
        isTransitioning = false;
    });
}

function initModals() {
    // ==========================================
    // 1. UNIVERSAL EPISODE MODAL (Anti-Fullscreen)
    // ==========================================
    const episodeCards = document.querySelectorAll('.episode-card');
    const univModal = document.getElementById('universal-episode-modal');
    const closeUnivModalBtn = document.getElementById('close-univ-ep');
    
    const modalVideo = document.getElementById('univ-ep-video');
    const modalTitle = document.getElementById('univ-ep-title');
    const modalSubtitle = document.getElementById('univ-ep-subtitle');
    const modalDuration = document.getElementById('univ-ep-duration');
    const modalDesc = document.getElementById('univ-ep-desc');
    const playVideoBtn = document.getElementById('univ-ep-play-btn');
    const heartsCanvas = document.getElementById('hearts-canvas');

    episodeCards.forEach(card => {
        card.addEventListener('click', () => {
            const epNum = card.getAttribute('data-ep');
            const title = card.getAttribute('data-title');
            const duration = card.getAttribute('data-duration');
            const videoSrc = card.getAttribute('data-video');
            const posterSrc = card.getAttribute('data-poster');
            const desc = card.getAttribute('data-desc');

            modalTitle.textContent = epNum;
            modalSubtitle.textContent = title;
            modalDuration.textContent = duration;
            modalDesc.textContent = desc;
            
            modalVideo.src = videoSrc;
            modalVideo.poster = posterSrc;
            modalVideo.load();

            univModal.classList.remove('hidden');
            document.body.style.overflow = 'hidden'; 
            
            if (epNum === 'Episode 3') {
                heartsCanvas.classList.remove('hidden');
                initHeartsCanvas();
            } else {
                heartsCanvas.classList.add('hidden');
            }
        });
    });

    function closeUnivModal() {
        univModal.classList.add('hidden');
        document.body.style.overflow = '';
        modalVideo.pause(); 
        modalVideo.currentTime = 0;
        playVideoBtn.innerHTML = '<i class="fa-solid fa-play"></i> Putar Video';
        heartsCanvas.classList.add('hidden');
    }
    closeUnivModalBtn.addEventListener('click', closeUnivModal);
    
    // Logika Play / Pause menggunakan tombol khusus agar tidak lompat ke layar penuh
    playVideoBtn.addEventListener('click', () => {
        document.querySelector('.ep-modal-wrapper').scrollTo({top: 0, behavior: 'smooth'});
        if (modalVideo.paused) {
            modalVideo.play();
        } else {
            modalVideo.pause();
        }
    });

    // Menekan area video juga bisa untuk play/pause
    modalVideo.addEventListener('click', () => {
        if (modalVideo.paused) {
            modalVideo.play();
        } else {
            modalVideo.pause();
        }
    });

    modalVideo.addEventListener('play', () => {
        playVideoBtn.innerHTML = '<i class="fa-solid fa-pause"></i> Pause Video';
    });
    
    modalVideo.addEventListener('pause', () => {
        playVideoBtn.innerHTML = '<i class="fa-solid fa-play"></i> Putar Video';
    });


    // ==========================================
    // 2. FILM ROLL ALBUM MODAL (Isi Dinamis)
    // ==========================================
    const watchlistItems = document.querySelectorAll('.watchlist-item');
    const filmModal = document.getElementById('film-roll-modal');
    const closeFilmBtn = document.getElementById('close-film-roll');
    const filmModalTitle = document.getElementById('film-modal-title');
    const filmContainer = document.getElementById('film-strip-container');

    // Database foto untuk setiap album
    // Ubah nama file di sini jika foto aslimu memiliki nama yang berbeda
    const albumData = {
        movie: [
            'mvdate 1.jpg', 'mvdate 2.jpg', 'mvdate 3.jpg', 'mvdate 4.jpg',
            'mvdate 5.jpg', 'mvdate 6.jpg', 'mvdate 7.jpg', 'mvdate 8.jpg',
            'mvdate 9.jpg', 'mvdate 10.jpg', 'mvdate 11.jpg', 'mvdate 12.jpg'
        ],
        staycation: [
            'stdate 1.jpg', 'stdate 2.jpg', 'stdate 3.jpg', 'stdate 4.jpg',
            'stdate 5.jpg', 'stdate 6.jpg', 'stdate 7.jpg', 'stdate 8.jpg',
            'stdate 9.jpg', 'stdate 10.jpg', 'stdate 11.jpg', 'stdate 12.jpg'
        ],
        coffee: [
            'cfdate 1.jpg', 'cfdate 2.jpg', 'cfdate 3.jpg', 'cfdate 4.jpg',
            'cfdate 5.jpg', 'cfdate 6.jpg', 'cfdate 7.jpg', 'cfdate 8.jpg',
            'cfdate 9.jpg', 'cfdate 10.jpg', 'cfdate 11.jpg', 'cfdate 12.jpg'
        ],
        beach: [
            'bcdate 1.jpg', 'bcdate 2.jpg', 'bcdate 3.jpg', 'bcdate 4.jpg',
            'bcdate 5.jpg', 'bcdate 6.jpg', 'bcdate 7.jpg', 'bcdate 8.jpg',
            'bcdate 9.jpg', 'bcdate 10.jpg', 'bcdate 11.jpg', 'bcdate 12.jpg'
        ]
    };

    watchlistItems.forEach(item => {
        item.addEventListener('click', () => {
            const albumKey = item.getAttribute('data-album');
            const albumTitle = item.getAttribute('data-title');
            
            // Ubah judul modal sesuai nama album yang diklik
            filmModalTitle.textContent = albumTitle;

            // Bersihkan frame yang lama, lalu masukkan deretan foto yang baru
            filmContainer.innerHTML = '';
            const photos = albumData[albumKey] || albumData['movie']; // Default ke movie jika tidak ada

            photos.forEach(photoSrc => {
                const frame = document.createElement('div');
                frame.className = 'film-frame-item';
                
                // Perbaikan: Gunakan encodeURI agar spasi pada "mvdate 1.jpg" terbaca oleh CSS
                const safePath = encodeURI(photoSrc);
                frame.style.backgroundImage = `url('${safePath}')`;
                
                frame.style.backgroundColor = '#111';
                
                filmContainer.appendChild(frame);
            });

            filmModal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        });
    });

    function closeFilmModal() {
        filmModal.classList.add('hidden');
        document.body.style.overflow = '';
    }
    closeFilmBtn.addEventListener('click', closeFilmModal);

    // Fitur Drag-to-Scroll untuk Roll Film
    const slider = document.getElementById('film-strip-wrapper');
    let isDown = false;
    let startX;
    let scrollLeft;

    slider.addEventListener('mousedown', (e) => {
        isDown = true;
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
    });
    slider.addEventListener('mouseleave', () => { isDown = false; });
    slider.addEventListener('mouseup', () => { isDown = false; });
    slider.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 2; // Mengatur seberapa cepat guliran
        slider.scrollLeft = scrollLeft - walk;
    });

    // Global Escape Key (Menutup semua modal)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (!univModal.classList.contains('hidden')) closeUnivModal();
            if (!filmModal.classList.contains('hidden')) closeFilmModal();
        }
    });
}

function initEasterEgg() {
    const modal = document.getElementById('easter-egg-modal');
    const btnStillWatching = document.getElementById('btn-still-watching');
    let timer;

    function startTimer() {
        clearTimeout(timer);
        timer = setTimeout(() => {
            if(document.getElementById('universal-episode-modal').classList.contains('hidden') && 
               document.getElementById('film-roll-modal').classList.contains('hidden')) {
                modal.classList.remove('hidden');
            } else {
                startTimer(); 
            }
        }, 120000); 
    }

    document.getElementById('profile-lovee').addEventListener('click', startTimer);

    btnStillWatching.addEventListener('click', () => {
        modal.classList.add('hidden');
        fireConfetti();
        startTimer();
    });
}

function initHeartsCanvas() {
    const canvas = document.getElementById('hearts-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const hearts = [];
    for(let i = 0; i < 20; i++){
        hearts.push({ x: Math.random() * canvas.width, y: canvas.height + Math.random() * 200, size: Math.random() * 15 + 5, speedY: Math.random() * 1 + 0.5, opacity: Math.random() * 0.5 + 0.2 });
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        hearts.forEach(h => {
            ctx.globalAlpha = h.opacity; ctx.fillStyle = '#E50914'; ctx.beginPath();
            let topCurveHeight = h.size * 0.3;
            ctx.moveTo(h.x, h.y + topCurveHeight);
            ctx.bezierCurveTo(h.x, h.y, h.x - h.size / 2, h.y, h.x - h.size / 2, h.y + topCurveHeight);
            ctx.bezierCurveTo(h.x - h.size / 2, h.y + (h.size + topCurveHeight) / 2, h.x, h.y + (h.size + topCurveHeight) / 2, h.x, h.y + h.size);
            ctx.bezierCurveTo(h.x, h.y + (h.size + topCurveHeight) / 2, h.x + h.size / 2, h.y + (h.size + topCurveHeight) / 2, h.x + h.size / 2, h.y + topCurveHeight);
            ctx.bezierCurveTo(h.x + h.size / 2, h.y, h.x, h.y, h.x, h.y + topCurveHeight);
            ctx.fill();
            h.y -= h.speedY; if(h.y < -h.size) h.y = canvas.height + h.size;
        });
        if(!document.getElementById('universal-episode-modal').classList.contains('hidden')){ requestAnimationFrame(draw); }
    }
    draw();
}

function fireConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    canvas.classList.remove('hidden');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const pieces = [];
    const colors = ['#E50914', '#ffffff', '#cccccc', '#ff6666'];
    
    for (let i = 0; i < 100; i++) {
        pieces.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height - canvas.height, w: Math.random() * 10 + 5, h: Math.random() * 5 + 5, c: colors[Math.floor(Math.random() * colors.length)], dy: Math.random() * 3 + 2, dx: Math.random() * 2 - 1, rot: Math.random() * 360, rotSpeed: Math.random() * 5 - 2.5 });
    }

    let animationId;
    function render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let active = false;
        pieces.forEach(p => {
            if(p.y < canvas.height) active = true;
            ctx.save(); ctx.fillStyle = p.c; ctx.translate(p.x + p.w / 2, p.y + p.h / 2); ctx.rotate(p.rot * Math.PI / 180); ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); ctx.restore();
            p.y += p.dy; p.x += p.dx; p.rot += p.rotSpeed;
        });
        if (active) { animationId = requestAnimationFrame(render); } else { canvas.classList.add('hidden'); cancelAnimationFrame(animationId); }
    }
    render();
}