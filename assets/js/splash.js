        window.addEventListener('load', function() {
            const splashScreen = document.getElementById('splashScreen');
            const mainContent = document.getElementById('mainContent');
            
            setTimeout(() => {
                splashScreen.classList.add('hidden');
                
                setTimeout(() => {
                    document.body.style.overflow = 'auto'; 
                    mainContent.classList.add('visible');
                }, 800); 
                
            }, 5500); 
        });

        document.getElementById('splashScreen').addEventListener('click', function() {
            this.classList.add('hidden');
            setTimeout(() => {
                document.body.style.overflow = 'auto';
                document.getElementById('mainContent').classList.add('visible');
            }, 800);
        });

        document.addEventListener('keydown', function(e) {
            if (document.getElementById('splashScreen').classList.contains('hidden')) return;
            
            document.getElementById('splashScreen').classList.add('hidden');
            setTimeout(() => {
                document.body.style.overflow = 'auto';
                document.getElementById('mainContent').classList.add('visible');
            }, 800);
        });