document.addEventListener('DOMContentLoaded', () => {
    const countdownScreen = document.getElementById('countdown-screen');
    const countdownNumber = document.getElementById('countdown-number');
    const mainScene = document.getElementById('main-scene');
    const finalScene = document.getElementById('final-scene');
    const beepSound = document.getElementById('beep-sound');
    const birthdayVideo = document.getElementById('birthday-video');
    const giftBox = document.getElementById('gift-box');

    let count = 5;

    // Phát tiếng beep đầu tiên (số 5)
    playBeep();

    const timer = setInterval(() => {
        count--;

        if (count > 0) {
            // Chỉ cập nhật số và beep nếu > 0
            updateDisplay(count);
            playBeep();
        } else if (count === 0) {
            // Đến số 0: Chỉ cập nhật số, KHÔNG BEEP
            updateDisplay(count);
            
            // Đợi 1 giây ở số 0 rồi chuyển cảnh
            setTimeout(() => {
                clearInterval(timer);
                startMainScene();
            }, 1000);
        }
    }, 1000);

    function updateDisplay(num) {
        countdownNumber.innerText = num;
        countdownNumber.style.transform = "scale(1.2)";
        setTimeout(() => countdownNumber.style.transform = "scale(1)", 200);
    }

    function playBeep() {
        if(beepSound) {
            beepSound.currentTime = 0;
            beepSound.play().catch(e => {});
        }
    }

    function startMainScene() {
        countdownScreen.classList.add('hidden');
        mainScene.classList.remove('hidden');

        if (birthdayVideo) {
            birthdayVideo.play().catch(e => {
                birthdayVideo.muted = true; 
                birthdayVideo.play();
            });
        }

        // --- CÀI ĐẶT THỜI GIAN HIỆN HỘP QUÀ ---
        // Vì mình không biết clip của bạn dài bao nhiêu và 3 con đi mất mấy giây
        // Bạn hãy chỉnh số 8000 bên dưới (tức là 8 giây) cho khớp nhé!
        setTimeout(() => {
            giftBox.classList.remove('hidden');
        }, 8000); 
    }

    // Sự kiện click vào hộp quà
    giftBox.addEventListener('click', () => {
        // Ẩn màn hình video
        mainScene.classList.add('hidden');
        // Hiện màn hình cuối (đồng cỏ)
        finalScene.classList.remove('hidden');
    });
});
