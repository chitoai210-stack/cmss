document.addEventListener('DOMContentLoaded', () => {
    const startScreen = document.getElementById('start-screen');
    const countdownScreen = document.getElementById('countdown-screen');
    const countdownNumber = document.getElementById('countdown-number');
    const ringCircle = document.querySelector('.progress-ring__circle');
    
    const mainScene = document.getElementById('main-scene');
    const finalScene = document.getElementById('final-scene');
    const beepSound = document.getElementById('beep-sound');
    const birthdayVideo = document.getElementById('birthday-video');
    const giftBox = document.getElementById('gift-box');

    let count = 5;
    let timer = null;

    // --- SỰ KIỆN 1: CLICK ĐỂ BẮT ĐẦU ---
    startScreen.addEventListener('click', () => {
        // Ẩn màn hình Start
        startScreen.classList.add('hidden');
        
        // Hiện màn hình đếm ngược
        countdownScreen.classList.remove('hidden');
        
        // Kích hoạt xoay vòng tròn
        ringCircle.classList.add('animate-ring');

        // Bắt đầu chạy logic đếm
        runCountdown();
    });

    function runCountdown() {
        // Phát tiếng beep cho số 5 ngay lập tức
        playBeep();

        timer = setInterval(() => {
            count--;

            if (count > 0) {
                // Vẫn còn đếm: Cập nhật số và kêu Beep
                updateDisplay(count);
                playBeep();
            } else if (count === 0) {
                // --- QUAN TRỌNG: XỬ LÝ SỐ 0 ---
                
                // 1. Cập nhật số 0
                updateDisplay(count);
                
                // 2. CẮT NGAY LẬP TỨC tiếng beep nếu nó đang còn kêu
                if(beepSound) {
                    beepSound.pause(); // Dừng lại
                    beepSound.currentTime = 0; // Tua về đầu
                }

                // 3. Đợi 1 giây rồi chuyển cảnh
                setTimeout(() => {
                    clearInterval(timer);
                    startMainScene();
                }, 1000);
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
            // Reset về 0 trước khi phát để tránh lỗi chồng âm
            beepSound.pause();
            beepSound.currentTime = 0;
            beepSound.play().catch(() => {});
        }
    }

    function startMainScene() {
        countdownScreen.classList.add('hidden');
        mainScene.classList.remove('hidden');

        // Phát video (lúc này đã có tương tác click từ đầu nên chắc chắn chạy được)
        if (birthdayVideo) {
            birthdayVideo.play().catch(() => {
                birthdayVideo.muted = true;
                birthdayVideo.play();
            });
        }

        // Hiện hộp quà sau 5 giây (5000ms)
        setTimeout(() => {
            giftBox.classList.remove('hidden');
        }, 5000); 
    }

    // Sự kiện click hộp quà
    giftBox.addEventListener('click', () => {
        if(birthdayVideo) birthdayVideo.pause(); // Tắt video
        mainScene.classList.add('hidden');
        finalScene.classList.remove('hidden');
    });
});
