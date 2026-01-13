document.addEventListener('DOMContentLoaded', () => {
    const countdownScreen = document.getElementById('countdown-screen');
    const countdownNumber = document.getElementById('countdown-number');
    const mainScene = document.getElementById('main-scene');
    const beepSound = document.getElementById('beep-sound');

    let count = 5;

    // Hàm đếm ngược
    const timer = setInterval(() => {
        // Cập nhật số hiển thị
        countdownNumber.innerText = count;

        // Phát tiếng beep mỗi nhịp (cố gắng phát lại từ đầu nếu file ngắn)
        playBeep();

        // Hiệu ứng zoom nhẹ cho số mỗi lần đếm
        countdownNumber.style.transform = "scale(1.2)";
        setTimeout(() => {
            countdownNumber.style.transform = "scale(1)";
        }, 200);

        if (count === 0) {
            clearInterval(timer);
            finishCountdown();
        }

        count--;
    }, 1000); // 1000ms = 1 giây

    function playBeep() {
        // Reset thời gian về 0 để phát lại ngay lập tức
        if(beepSound) {
            beepSound.currentTime = 0;
            beepSound.play().catch(e => console.log("Cần tương tác người dùng để phát âm thanh"));
        }
    }

    function finishCountdown() {
        // Ẩn màn hình đếm ngược
        countdownScreen.classList.add('hidden');
        
        // Hiện màn hình chính
        mainScene.classList.remove('hidden');

        // Tại đây animation CSS sẽ tự động chạy do class .totoro-wrapper đã có sẵn trong DOM
        console.log("Bắt đầu đi bộ!");
    }
});
