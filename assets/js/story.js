(function () {
    const track = document.querySelector('[data-story-track]');
    if (!track || !window.NivoVitals) return;

    const STEPS = 5;
    const navItems = document.querySelectorAll('[data-story-goto]');
    const texts = document.querySelectorAll('[data-story-text]');
    const scenes = document.querySelectorAll('[data-story-scene]');
    const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));

    // --- Scene 1: pre-anesthetic checklist -------------------------------
    const preItems = document.querySelectorAll('[data-story-checklist="pre"] li');
    const preCount = document.querySelector('[data-story-pre-count]');

    function drawPre(p) {
        const done = Math.min(preItems.length, Math.floor(p * (preItems.length + 1)));
        preItems.forEach((item, i) => item.classList.toggle('is-done', i < done));
        preCount.textContent = `${done} / ${preItems.length}`;
        preCount.classList.toggle('is-ok', done === preItems.length);
    }

    // --- Scene 2: intra-operative vitals, scrubbed by scroll ---------------
    const { createChart, generator, timeLabel, WINDOW } = window.NivoVitals;
    const renderChart = createChart(document.querySelector('[data-story-chart]'));
    const next = generator(7);
    const series = Array.from({ length: WINDOW }, next);
    const clock = document.querySelector('[data-story-clock]');
    const toast = document.querySelector('[data-story-toast]');
    const found = document.querySelector('[data-story-found]');
    const table = {};
    document.querySelectorAll('[data-story-table]').forEach(el => (table[el.dataset.storyTable] = el));
    const values = {};
    document.querySelectorAll('[data-story-value]').forEach(el => (values[el.dataset.storyValue] = el));
    let lastShown = -1;

    function drawIntra(p) {
        const shown = Math.max(1, Math.round(p * WINDOW));
        if (shown === lastShown) return;
        const grew = shown > lastShown;
        lastShown = shown;

        const visible = series.slice(0, shown);
        renderChart(visible, { animateLast: grew });
        const latest = visible[visible.length - 1];
        Object.keys(values).forEach(key => (values[key].textContent = latest[key]));
        clock.textContent = timeLabel(latest.minutes);

        // Table parameters imported alongside the chart (illustrative, derived from the series)
        table.spo2.textContent = `${97 + (latest.fc % 3)}%`;
        table.etco2.textContent = 33 + (latest.pad % 4);
        table.pvc.textContent = 6 + (latest.pas % 3);
        table.temp.textContent = `36,${4 + (latest.fc % 4)}°`;

        // Import summary, as the app reports it once the time range is loaded
        found.textContent = shown * 4;
        toast.classList.toggle('is-visible', shown === WINDOW);
    }

    // --- Scene 3: recovery --------------------------------------------------
    const postItems = document.querySelectorAll('[data-story-checklist="post"] li');
    const pain = document.querySelector('[data-story-pain]');
    const painMarker = document.querySelector('[data-story-pain-marker]');
    const discharge = document.querySelector('[data-story-discharge]');

    function drawPost(p) {
        // Pain eases from 7 to 2 during the first half of the step
        const eva = Math.round(7 - clamp(p / 0.5) * 5);
        pain.textContent = eva;
        painMarker.style.left = `${eva * 10}%`;

        const done = Math.min(postItems.length, Math.floor(clamp((p - 0.3) / 0.6) * (postItems.length + 1)));
        postItems.forEach((item, i) => item.classList.toggle('is-done', i < done));

        const ready = done === postItems.length;
        discharge.textContent = ready ? 'Apto para egreso' : 'En observación';
        discharge.classList.toggle('is-ok', ready);
    }

    // --- Scene 4: automatic report ---------------------------------------------
    const typed = document.querySelector('[data-story-typed]');
    const sections = document.querySelectorAll('[data-story-sections] span');
    const pdf = document.querySelector('[data-story-pdf]');
    const SPEECH = 'Paciente ingresa a quirófano en condiciones estables. Se realiza monitoreo según normas vigentes. Se registran técnica anestésica, ventilación y fármacos administrados. Egresa a sala de recuperación en condiciones estables.';

    function drawReport(p) {
        typed.textContent = SPEECH.slice(0, Math.round(clamp(p / 0.75) * SPEECH.length));
        const lit = Math.floor(clamp(p / 0.85) * sections.length);
        sections.forEach((section, i) => section.classList.toggle('is-on', i < lit));
        const ready = p >= 0.85;
        pdf.textContent = ready ? 'PDF listo' : 'Generando…';
        pdf.classList.toggle('is-ok', ready);
    }

    // --- Scene 5: automatic send to billing --------------------------------------
    const billingItems = document.querySelectorAll('[data-story-checklist="billing"] li');
    const billing = document.querySelector('[data-story-billing]');
    const sync = document.querySelector('[data-story-sync]');
    const packet = document.querySelector('[data-story-packet]');
    const target = document.querySelector('[data-story-target]');

    function drawBilling(p) {
        // Data gets ready first, then the one-click send travels between 35% and 80%
        const done = Math.min(billingItems.length, Math.floor(clamp(p / 0.3) * (billingItems.length + 1)));
        billingItems.forEach((item, i) => item.classList.toggle('is-done', i < done));

        const travel = clamp((p - 0.35) / 0.45);
        sync.style.transform = `scaleX(${travel})`;
        packet.style.left = `${travel * 100}%`;
        packet.classList.toggle('is-moving', travel > 0 && travel < 1);

        const sent = travel === 1;
        target.classList.toggle('is-ok', sent);
        billing.textContent = sent
            ? 'Enviado correctamente'
            : travel > 0 ? 'Enviando…' : done === billingItems.length ? 'Listo para enviar' : 'Preparando';
        billing.classList.toggle('is-ok', sent);
    }

    const draws = [drawPre, drawIntra, drawPost, drawReport, drawBilling];

    // --- Scroll driver -----------------------------------------------------------
    let current = -1;

    function setStep(step) {
        if (step === current) return;
        current = step;
        texts.forEach((el, i) => el.classList.toggle('is-active', i === step));
        scenes.forEach((el, i) => el.classList.toggle('is-active', i === step));
        navItems.forEach((el, i) => {
            el.classList.toggle('is-active', i === step);
            el.classList.toggle('is-done', i < step);
        });
    }

    function update() {
        const rect = track.getBoundingClientRect();
        const distance = rect.height - window.innerHeight;
        const progress = clamp(-rect.top / distance);
        const scaled = progress * STEPS;
        const step = Math.min(STEPS - 1, Math.floor(scaled));
        // Each step finishes its animation at 80% so it rests complete before switching
        const local = clamp((scaled - step) / 0.8);

        setStep(step);
        navItems.forEach((el, i) => {
            const fill = i < step ? 1 : i === step ? local : 0;
            el.style.setProperty('--fill', fill);
        });
        draws.forEach((draw, i) => draw(i < step ? 1 : i === step ? local : 0));
    }

    let queued = false;
    window.addEventListener('scroll', () => {
        if (queued) return;
        queued = true;
        requestAnimationFrame(() => {
            queued = false;
            update();
        });
    }, { passive: true });
    window.addEventListener('resize', update);

    // Jump to a stage from the step navigation
    navItems.forEach((el, i) => {
        el.addEventListener('click', () => {
            const top = track.getBoundingClientRect().top + window.scrollY;
            const distance = track.offsetHeight - window.innerHeight;
            window.scrollTo({ top: top + distance * (i / STEPS) + 2, behavior: 'smooth' });
        });
    });

    update();
})();
