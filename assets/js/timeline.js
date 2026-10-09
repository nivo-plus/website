// Hero: a looping "trailer" of one anesthetic act, from OR admission to discharge
(function () {
    const root = document.querySelector('[data-timeline]');
    if (!root) return;

    const clock = root.querySelector('[data-timeline-clock]');
    const status = root.querySelector('[data-timeline-status]');
    const fill = root.querySelector('[data-timeline-fill]');
    const count = root.querySelector('[data-timeline-count]');
    const steps = root.querySelectorAll('[data-at]');
    const events = root.querySelectorAll('[data-on]');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const START = 12 * 60;      // 12:00, OR admission
    const FIRST = -5;           // the loop opens 5 minutes before admission
    const END = 115;            // 13:55, discharge
    const VITALS_FROM = 10;     // anesthesia start
    const VITALS_TO = 105;      // anesthesia end
    const STEP_MIN = 5;         // one record every 5 minutes
    const TICK_MS = 450;
    const HOLD_MS = 3200;       // pause on the finished act before looping

    const label = minutes => {
        const total = START + minutes;
        return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
    };

    function draw(t) {
        clock.textContent = label(Math.max(t, FIRST));
        fill.style.transform = `scaleX(${Math.max(0, t) / END})`;
        steps.forEach(step => step.classList.toggle('is-reached', t >= Number(step.dataset.at)));
        events.forEach(event => event.classList.toggle('is-on', t >= Number(event.dataset.on)));

        const recorded = Math.max(0, Math.min(t, VITALS_TO) - VITALS_FROM);
        count.textContent = t >= VITALS_FROM ? (Math.floor(recorded / STEP_MIN) + 1) * 4 : 0;

        const done = t >= END;
        status.lastChild.textContent = done ? 'Finalizado' : 'En curso';
        status.classList.toggle('is-done', done);
    }

    if (reduceMotion) {
        draw(END);
        return;
    }

    let t = FIRST;
    let timer = null;
    let onScreen = false;

    function tick() {
        draw(t);
        if (t >= END) {
            pause();
            timer = setTimeout(() => {
                timer = null;
                t = FIRST;
                play();
            }, HOLD_MS);
            return;
        }
        t += STEP_MIN;
    }

    function play() {
        if (!timer && onScreen && !document.hidden) timer = setInterval(tick, TICK_MS);
    }

    function pause() {
        clearInterval(timer);
        clearTimeout(timer);
        timer = null;
    }

    draw(t);

    new IntersectionObserver(([entry]) => {
        onScreen = entry.isIntersecting;
        onScreen ? play() : pause();
    }).observe(root);

    document.addEventListener('visibilitychange', () => (document.hidden ? pause() : play()));
})();
