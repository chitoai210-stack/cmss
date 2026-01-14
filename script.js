document.addEventListener('DOMContentLoaded', () => {
    const startScreen = document.getElementById('start-screen');
    const countdownScreen = document.getElementById('countdown-screen');
    const countdownNumber = document.getElementById('countdown-number');
    const ringCircle = document.querySelector('.progress-ring__circle');
    const mainScene = document.getElementById('main-scene');
    const beepSound = document.getElementById('beep-sound');
    const birthdayVideo = document.getElementById('birthday-video');
    const giftBox = document.getElementById('gift-box');
    
    // Game Elements
    const finalScene = document.getElementById('final-scene');
    const scoreDisplay = document.getElementById('score');
    const victoryScreen = document.getElementById('victory-screen');
    const popSound = document.getElementById('pop-sound'); // Âm thanh mới

    let count = 5;
    let timer = null;
    let score = 0;
    const targetScore = 10;
    let gameInterval = null;
    let isGameRunning = false;

    // --- LOGIC BAN ĐẦU ---
    startScreen.addEventListener('click', () => {
        startScreen.classList.add('hidden');
        countdownScreen.classList.remove('hidden');
        ringCircle.classList.add('animate-ring');
        
        // Kích hoạt trước âm thanh pop (mute) để lát nữa chạy mượt
        if(popSound) { popSound.muted = true; popSound.play().catch(()=>{}); popSound.pause(); popSound.currentTime=0; popSound.muted = false; }
        
        runCountdown();
    });

    function runCountdown() {
        playBeep();
        timer = setInterval(() => {
            count--;
            if (count > 0) {
                updateDisplay(count); playBeep();
            } else if (count === 0) {
                updateDisplay(count);
                if(beepSound) { beepSound.pause(); beepSound.currentTime = 0; }
                setTimeout(() => { clearInterval(timer); startMainScene(); }, 1000);
            }
        }, 1000);
    }

    function updateDisplay(num) {
        countdownNumber.innerText = num;
        countdownNumber.style.transform = "scale(1.2)";
        setTimeout(() => countdownNumber.style.transform = "scale(1)", 200);
    }

    function playBeep() {
        if(beepSound) { beepSound.pause(); beepSound.currentTime = 0; beepSound.play().catch(() => {}); }
    }

    function startMainScene() {
        countdownScreen.classList.add('hidden');
        mainScene.classList.remove('hidden');
        if (birthdayVideo) { birthdayVideo.play().catch(() => { birthdayVideo.muted = true; birthdayVideo.play(); }); }
        setTimeout(() => { giftBox.classList.remove('hidden'); }, 5000); 
    }

    giftBox.addEventListener('click', () => {
        if(birthdayVideo) birthdayVideo.pause();
        mainScene.classList.add('hidden');
        finalScene.classList.remove('hidden');
        startGame();
    });

    // --- LOGIC GAME ĐẬP CHUỘT ---
    function startGame() {
        score = 0;
        scoreDisplay.innerText = score;
        isGameRunning = true;
        
        // Tốc độ: 1000ms = 1 giây xuất hiện 1 con
        gameInterval = setInterval(spawnMole, 1000);
    }

    function spawnMole() {
        if (!isGameRunning) return;

        const mole = document.createElement('img');
        mole.src = 'to2.png';
        mole.classList.add('mole');

        const maxX = finalScene.offsetWidth - 120; 
        const maxY = finalScene.offsetHeight - 120;
        const randomX = Math.floor(Math.random() * maxX);
        const randomY = Math.floor(Math.random() * maxY);

        mole.style.left = randomX + 'px';
        mole.style.top = randomY + 'px';

        mole.addEventListener('click', function() {
            // --- PHÁT TIẾNG BÓC ---
            if(popSound) {
                popSound.currentTime = 0; // Tua về đầu để tiếng nổ giòn, dứt khoát
                popSound.play().catch(()=>{});
            }

            score++;
            scoreDisplay.innerText = score;
            this.remove();

            if (score >= targetScore) {
                endGame();
            }
        });

        finalScene.appendChild(mole);

        // Tự biến mất sau 1.2 giây (cho người chơi có thời gian phản xạ)
        setTimeout(() => {
            if (mole.parentElement) mole.remove();
        }, 1200); 
    }

    function endGame() {
        isGameRunning = false;
        clearInterval(gameInterval);
        const remainingMoles = document.querySelectorAll('.mole');
        remainingMoles.forEach(m => m.remove());
        
        setTimeout(() => {
            finalScene.classList.add('hidden');
            victoryScreen.classList.remove('hidden');
        }, 500);
    }
});
