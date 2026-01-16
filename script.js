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
    const bgMusic = document.getElementById('bg-music'); // Nhạc nền mới
    
    // Game Elements
    const finalScene = document.getElementById('final-scene');
    const scoreDisplay = document.getElementById('score');
    const victoryScreen = document.getElementById('victory-screen');
    const popSound = document.getElementById('pop-sound');
    const hammer = document.getElementById('custom-hammer'); // Cây búa

    // --- LOGIC 1: KIỂM TRA MẬT KHẨU ---
    passBtn.addEventListener('click', checkPass);
    passInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') checkPass();
    });

    function checkPass() {
        const password = passInput.value;
        if (password === 'CT011002') { 
            passwordScreen.classList.add('hidden');
            startScreen.classList.remove('hidden');
        } else {
            passError.classList.remove('hidden');
            passInput.value = ''; 
        }
    }

    // --- LOGIC 2: CLICK START ---
    startScreen.addEventListener('click', () => {
        startScreen.classList.add('hidden');
        countdownScreen.classList.remove('hidden');
        ringCircle.classList.add('animate-ring');
        
        // Mẹo kích hoạt âm thanh cho trình duyệt
        if(popSound) { popSound.muted = true; popSound.play().catch(()=>{}); popSound.pause(); popSound.currentTime=0; popSound.muted = false; }
        if(bgMusic) { bgMusic.muted = true; bgMusic.play().catch(()=>{}); bgMusic.pause(); bgMusic.currentTime=0; bgMusic.muted = false; }
        
        runCountdown();
    });

    // --- LOGIC 3: ĐẾM NGƯỢC (Đã sửa lỗi delay tiếng Beep) ---
    let count = 5;
    let timer = null;

    function runCountdown() {
        // Phát tiếng beep NGAY LẬP TỨC cho số 5
        updateDisplay(count);
        playBeep(); 

        timer = setInterval(() => {
            count--;
            if (count > 0) {
                updateDisplay(count); 
                playBeep(); // Phát tiếng beep cho 4,3,2,1
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
        if(beepSound) { 
            beepSound.pause(); 
            beepSound.currentTime = 0; 
            beepSound.play().catch(() => {}); 
        }
    }

    function startMainScene() {
        countdownScreen.classList.add('hidden');
        mainScene.classList.remove('hidden');
        
        // Phát nhạc nền nhactn
        if (bgMusic) {
            bgMusic.volume = 1.0; // Volume to nhất
            bgMusic.play().catch(() => {});
        }

        // Phát video
        if (birthdayVideo) { 
            birthdayVideo.play().catch(() => { 
                birthdayVideo.muted = true; 
                birthdayVideo.play(); 
            }); 
        }
        setTimeout(() => { giftBox.classList.remove('hidden'); }, 5000); 
    }

    giftBox.addEventListener('click', () => {
        if(birthdayVideo) birthdayVideo.pause();
        mainScene.classList.add('hidden');
        finalScene.classList.remove('hidden');
        startGame();
    });

    // --- LOGIC 4: GAME & CÂY BÚA ---
    
    // Logic di chuyển búa theo chuột
    document.addEventListener('mousemove', (e) => {
        // Căn chỉnh để mũi búa nằm đúng vị trí con trỏ
        hammer.style.left = (e.pageX - 20) + 'px'; 
        hammer.style.top = (e.pageY - 50) + 'px';
    });

    // Logic hiệu ứng đập búa (Animation)
    document.addEventListener('mousedown', () => {
        hammer.classList.add('hammer-down');
        // Phát tiếng gõ ngay khi nhấn chuột (khớp với búa)
        if(isGameRunning && popSound) {
            popSound.currentTime = 0;
            popSound.play().catch(()=>{});
        }
    });

    document.addEventListener('mouseup', () => {
        hammer.classList.remove('hammer-down');
    });


    let score = 0;
    const targetScore = 10;
    let isGameRunning = false;
    let gameInterval = null;

    function startGame() {
        // Giảm nhạc nền còn 30%
        if(bgMusic) { bgMusic.volume = 0.3; }

        score = 0;
        scoreDisplay.innerText = score;
        isGameRunning = true;
        gameInterval = setInterval(spawnMole, 1000); 
    }

    function spawnMole() {
        if (!isGameRunning) return;

        const mole = document.createElement('img');
        mole.src = 'to2.png';
        mole.classList.add('mole');
        // Không cho phép kéo ảnh (tránh lỗi hiển thị khi chơi game)
        mole.draggable = false; 

        const maxX = finalScene.offsetWidth - 120; 
        const maxY = finalScene.offsetHeight - 120;
        const randomX = Math.floor(Math.random() * maxX);
        const randomY = Math.floor(Math.random() * maxY);

        mole.style.left = randomX + 'px';
        mole.style.top = randomY + 'px';

        mole.addEventListener('mousedown', function() {
            // Logic tính điểm khi click trúng
            score++;
            scoreDisplay.innerText = score;
            this.remove(); // Xóa ngay con chuột bị đập
            if (score >= targetScore) endGame();
        });

        finalScene.appendChild(mole);
        
        // Tự biến mất sau 1.2s nếu không bị đập
        setTimeout(() => { if (mole.parentElement) mole.remove(); }, 1200); 
    }

    function endGame() {
        isGameRunning = false;
        clearInterval(gameInterval);
        document.querySelectorAll('.mole').forEach(m => m.remove());
        
        // Ẩn búa đi khi thắng
        hammer.classList.add('hidden');

        setTimeout(() => {
            finalScene.classList.add('hidden');
            victoryScreen.classList.remove('hidden');
            // Có thể trả lại volume nhạc nền nếu muốn
            // if(bgMusic) bgMusic.volume = 1.0; 
        }, 500);
    }
});
