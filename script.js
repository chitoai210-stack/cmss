document.addEventListener('DOMContentLoaded', () => {
    // Elements cho Pass
    const passwordScreen = document.getElementById('password-screen');
    const passInput = document.getElementById('pass-input');
    const passBtn = document.getElementById('pass-btn');
    const passError = document.getElementById('pass-error');

    // Elements cũ
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
    const popSound = document.getElementById('pop-sound');

    // --- LOGIC 1: KIỂM TRA MẬT KHẨU ---
    passBtn.addEventListener('click', checkPass);
    
    // Cho phép ấn Enter để submit pass
    passInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            checkPass();
        }
    });

    function checkPass() {
        const password = passInput.value;
        if (password === 'CT011002') { // Mật khẩu bạn yêu cầu
            // Ẩn màn hình pass
            passwordScreen.classList.add('hidden');
            // Hiện màn hình Start
            startScreen.classList.remove('hidden');
        } else {
            // Hiện lỗi
            passError.classList.remove('hidden');
            // Rung nhẹ khung nhập (hiệu ứng CSS nếu muốn, ở đây làm đơn giản)
            passInput.value = ''; // Xóa pass nhập sai
        }
    }

    // --- LOGIC 2: CLICK START (Giữ nguyên để kích hoạt âm thanh) ---
    startScreen.addEventListener('click', () => {
        startScreen.classList.add('hidden');
        countdownScreen.classList.remove('hidden');
        ringCircle.classList.add('animate-ring');
        
        // Mẹo kích hoạt âm thanh
        if(popSound) { popSound.muted = true; popSound.play().catch(()=>{}); popSound.pause(); popSound.currentTime=0; popSound.muted = false; }
        
        runCountdown();
    });

    // --- LOGIC 3: ĐẾM NGƯỢC ---
    let count = 5;
    let timer = null;

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

    // --- LOGIC 4: GAME ---
    let score = 0;
    const targetScore = 10;
    let isGameRunning = false;
    let gameInterval = null;

    function startGame() {
        score = 0;
        scoreDisplay.innerText = score;
        isGameRunning = true;
        gameInterval = setInterval(spawnMole, 1000); // 1 giây 1 con
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
            if(popSound) { popSound.currentTime = 0; popSound.play().catch(()=>{}); }
            score++;
            scoreDisplay.innerText = score;
            this.remove();
            if (score >= targetScore) endGame();
        });

        finalScene.appendChild(mole);
        setTimeout(() => { if (mole.parentElement) mole.remove(); }, 1200); 
    }

    function endGame() {
        isGameRunning = false;
        clearInterval(gameInterval);
        document.querySelectorAll('.mole').forEach(m => m.remove());
        setTimeout(() => {
            finalScene.classList.add('hidden');
            victoryScreen.classList.remove('hidden');
        }, 500);
    }
});
