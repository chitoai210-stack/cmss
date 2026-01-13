document.addEventListener('DOMContentLoaded', () => {
    const countdownScreen = document.getElementById('countdown-screen');
    const countdownNumber = document.getElementById('countdown-number');
    const mainScene = document.getElementById('main-scene');
    const beepSound = document.getElementById('beep-sound');
    const birthdayVideo = document.getElementById('birthday-video');

    let count = 5;

    // Phát tiếng beep lần đầu tiên ngay khi tải (cho số 5)
    // Lưu ý: Một số trình duyệt chặn âm thanh nếu người dùng chưa click
    playBeep();

    const timer = setInterval(() => {
        count--; // Giảm số trước

        if (count >= 0) {
            // Cập nhật số hiển thị
            countdownNumber.innerText = count;
            
            // Hiệu ứng zoom nhẹ số
            countdownNumber.style.transform = "scale(1.2)";
            setTimeout(() => {
                countdownNumber.style.transform = "scale(1)";
            }, 200);

            // Logic tiếng Beep: Chỉ kêu khi count > 0 (Số 0 không kêu)
            if (count > 0) {
                playBeep();
            }
        }

        if (count === 0) {
            // Đợi 1 giây ở số 0 rồi mới chuyển cảnh
            setTimeout(() => {
                clearInterval(timer);
                finishCountdown();
            }, 1000);
        }
    }, 1000);

    function playBeep() {
        if(beepSound) {
            beepSound.currentTime = 0;
            beepSound.play().catch(e => console.log("Chưa có tương tác, không thể phát tiếng"));
        }
    }

    function finishCountdown() {
        // Ẩn màn hình đếm ngược
        countdownScreen.classList.add('hidden');
        
        // Hiện màn hình video
        mainScene.classList.remove('hidden');

        // Phát video
        if (birthdayVideo) {
            birthdayVideo.play().catch(e => {
                console.log("Trình duyệt chặn tự phát video có tiếng.");
                // Nếu bị chặn, hiển thị nút play hoặc yêu cầu người dùng bấm (tùy chọn)
                birthdayVideo.muted = true; // Thử mute để play được
                birthdayVideo.play();
            });
        }
    }
});
