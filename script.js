document.addEventListener('DOMContentLoaded', () => {
    const countdownScreen = document.getElementById('countdown-screen');
    const countdownNumber = document.getElementById('countdown-number');
    const mainScene = document.getElementById('main-scene');
    const finalScene = document.getElementById('final-scene');
    const beepSound = document.getElementById('beep-sound');
    const birthdayVideo = document.getElementById('birthday-video');
    const giftBox = document.getElementById('gift-box');

    let count = 5;

    // --- LOGIC ĐẾM NGƯỢC ---
    
    // Phát tiếng beep cho số 5 đầu tiên
    playBeep(); 

    const timer = setInterval(() => {
        count--; // Giảm số

        if (count > 0) {
            // Còn lớn hơn 0 thì hiện số và kêu BEEP
            countdownNumber.innerText = count;
            playBeep();
            
            // Hiệu ứng zoom nhẹ
            countdownNumber.style.transform = "scale(1.2)";
            setTimeout(() => countdownNumber.style.transform = "scale(1)", 200);

        } else if (count === 0) {
            // Nếu bằng 0: Chỉ hiện số, KHÔNG kêu beep nữa
            countdownNumber.innerText = count;
            
            // Đợi 1 giây ở số 0 rồi chuyển cảnh
            setTimeout(() => {
                clearInterval(timer);
                startMainScene();
            }, 1000);
        }
    }, 1000);

    // Hàm phát tiếng beep
    function playBeep() {
        if(beepSound) {
            beepSound.currentTime = 0;
            beepSound.play().catch(() => {}); // Bỏ qua lỗi nếu trình duyệt chặn
        }
    }

    // --- CHUYỂN QUA MÀN HÌNH VIDEO ---
    function startMainScene() {
        countdownScreen.classList.add('hidden');
        mainScene.classList.remove('hidden');

        // Phát video
        if (birthdayVideo) {
            birthdayVideo.play().catch(() => {
                // Nếu lỗi autoplay (do chưa click), thử mute để chạy
                birthdayVideo.muted = true;
                birthdayVideo.play();
            });
        }

        // --- ĐÚNG 5 GIÂY SAU THÌ HIỆN HỘP QUÀ ---
        setTimeout(() => {
            giftBox.classList.remove('hidden');
        }, 5000); // 5000ms = 5 giây
    }

    // --- SỰ KIỆN CLICK HỘP QUÀ ---
    giftBox.addEventListener('click', () => {
        // Tắt video (cho đỡ ồn)
        if(birthdayVideo) birthdayVideo.pause();
        
        // Ẩn màn hình video
        mainScene.classList.add('hidden');
        
        // Hiện màn hình cuối (đồng cỏ)
        finalScene.classList.remove('hidden');
    });
});
