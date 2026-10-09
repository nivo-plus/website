(function () {
    const splashScreen = document.getElementById('splashScreen');
    const mainContent = document.getElementById('mainContent');
    if (!splashScreen || !mainContent) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let revealed = false;

    // A short brand moment, never a wall: the page is usable in under a second.
    function reveal() {
        if (revealed) return;
        revealed = true;
        splashScreen.classList.add('hidden');
        mainContent.classList.add('visible');
    }

    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(reveal, reduceMotion ? 0 : 900);
    });

    splashScreen.addEventListener('click', reveal);
    document.addEventListener('keydown', reveal, { once: true });
})();
