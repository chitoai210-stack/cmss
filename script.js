document.addEventListener('DOMContentLoaded', () => {
    // Các element cũ
    const startScreen = document.getElementById('start-screen');
    const countdownScreen = document.getElementById('countdown-screen');
    const countdownNumber = document.getElementById('countdown-number');
    const ringCircle = document.querySelector('.progress-ring__circle');
    const mainScene = document.getElementById('main-scene');
    const beepSound = document.getElementById('beep-sound');
    const birthdayVideo = document.getElementById('birthday-video');
    const giftBox = document.getElementById('gift-box');
    
    // Các element mới cho Game
    const finalScene = document.getElementById('final-scene');
    const scoreDisplay = document.getElementById('score');
    const victoryScreen = document.getElementById('victory-screen');

    let count = 5;
    let timer = null;
    
    // Biến cho Game
    let score = 0;
    const targetScore = 10; // Mục tiêu 10 điểm
    let gameInterval = null;
    let isGameRunning = false;

    // --- PHẦN 1: LOGIC CŨ (START -> ĐẾM NGƯỢC -> VIDEO) ---
    startScreen.addEventListener('click', () => {
        startScreen.classList.add('hidden');
        countdownScreen.classList.remove('hidden');
        ringCircle.classList.add('animate-ring');
        runCountdown();
    });

    function runCountdown() {
        playBeep();
        timer = setInterval(() => {
            count--;
            if (count > 0) {
                updateDisplay(count);
                playBeep();
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
        // Hiện hộp quà sau 5 giây
        setTimeout(() => { giftBox.classList.remove('hidden'); }, 5000); 
    }

    // SỰ KIỆN CLICK HỘP QUÀ -> CHUYỂN SANG GAME
    giftBox.addEventListener('click', () => {
        if(birthdayVideo) birthdayVideo.pause();
        mainScene.classList.add('hidden');
        finalScene.classList.remove('hidden');
        
        // --- BẮT ĐẦU GAME TẠI ĐÂY ---
        startGame();
    });


    // --- PHẦN 2: LOGIC GAME ĐẬP CHUỘT (MỚI) ---

    function startGame() {
        score = 0;
        scoreDisplay.innerText = score;
        isGameRunning = true;
        
        // Cứ 0.5 giây (500ms) sinh ra một con 'to2' mới
        gameInterval = setInterval(spawnMole, 500);
    }

    function spawnMole() {
        if (!isGameRunning) return;

        // Tạo thẻ img mới
        const mole = document.createElement('img');
        mole.src = 'to2.png'; // Đảm bảo tên file đúng
        mole.classList.add('mole');

        // Tính toán vị trí ngẫu nhiên trong khung màn hình
        // Trừ đi kích thước khoảng 120px của ảnh để nó không bị tràn ra ngoài mép
        const maxX = finalScene.offsetWidth - 120; 
        const maxY = finalScene.offsetHeight - 120;

        const randomX = Math.floor(Math.random() * maxX);
        const randomY = Math.floor(Math.random() * maxY);

        mole.style.left = randomX + 'px';
        mole.style.top = randomY + 'px';

        // --- SỰ KIỆN: CLICK TRÚNG CHUỘT (ĐẬP) ---
        mole.addEventListener('click', function() {
            // Tăng điểm
            score++;
            scoreDisplay.innerText = score;
            
            // Xóa ngay lập tức con chuột vừa bị đập
            this.remove();

            // Kiểm tra điều kiện thắng
            if (score >= targetScore) {
                endGame();
            }
        });

        // Thêm chuột vào màn hình game
        finalScene.appendChild(mole);

        // Tự động biến mất sau 0.8 giây nếu không bị đập
        setTimeout(() => {
            if (mole.parentElement) {
                mole.remove();
            }
        }, 800); // Thời gian tồn tại: 800ms
    }

    function endGame() {
        isGameRunning = false;
        clearInterval(gameInterval); // Dừng sinh chuột mới
        
        // Xóa sạch các con chuột còn sót lại trên màn hình
        const remainingMoles = document.querySelectorAll('.mole');
        remainingMoles.forEach(m => m.remove());

        // Hiện màn hình chiến thắng sau 0.5s
        setTimeout(() => {
             // Ẩn màn hình game đi cho gọn
            finalScene.classList.add('hidden');
            // Hiện màn hình chúc mừng
            victoryScreen.classList.remove('hidden');
        }, 500);
    }
});
