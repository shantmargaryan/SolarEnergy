document.addEventListener('DOMContentLoaded', () => {
    const videoModal = document.querySelector('.video-modal');
    const videoPlayer = document.querySelector('.video-modal__player-video');
    const playBtn = document.querySelector('.hero__play-btn');
    const playControl = document.querySelector('.video-modal__play-btn');
    const pauseControl = document.querySelector('.video-modal__pause-btn');
    const overlay = videoModal.querySelector('.video-modal__overlay');

    // Close modal functions
    const closeModal = () => {
        videoModal.classList.remove('active');
        videoPlayer.pause();
        videoPlayer.currentTime = 0;
    };

    // Play/pause video functions
    const playVideo = () => {
        videoPlayer.play();
        playControl.style.display = 'none';
        pauseControl.style.display = 'block';
    };

    const pauseVideo = () => {
        videoPlayer.pause();
        playControl.style.display = 'block';
        pauseControl.style.display = 'none';
    };

    // Event listeners
    playBtn.addEventListener('click', () => {
        videoModal.classList.add('active');
        playVideo();
        if (typeof disableScroll === 'function') disableScroll();
    });

    // Close modal when clicking overlay
    if (overlay) {
        overlay.addEventListener('click', () => {
            closeModal();
            if (typeof enableScroll === 'function') enableScroll();
        });
    }

    playControl.addEventListener('click', playVideo);
    pauseControl.addEventListener('click', pauseVideo);

    videoPlayer.addEventListener('play', () => {
        playControl.style.display = 'none';
        pauseControl.style.display = 'block';
    });

    videoPlayer.addEventListener('pause', () => {
        playControl.style.display = 'block';
        pauseControl.style.display = 'none';
    });

    // Close modal when pressing ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
});