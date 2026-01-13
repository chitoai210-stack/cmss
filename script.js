document.addEventListener('DOMContentLoaded', () => {
    const startOverlay = document.getElementById('start-overlay');
    // Preload âm thanh click để đảm bảo không bị trễ
    const clickSound = document.getElementById('sound-click');
    clickSound.load();

    startOverlay.addEventListener('click', () => {
        startOverlay.style.display = 'none';
        runCountdownSequence();
    });
});

function runCountdownSequence() {
    const countdownScreen = document.getElementById('countdown-screen');
    const countdownElement = document.getElementById('countdown-number');
    const beepSound = document.getElementById('sound-beep');

    countdownScreen.style.display = 'flex';

    const playTick = () => {
        beepSound.pause();
        beepSound.currentTime = 0;
        beepSound.play().catch(e => console.log("Lỗi âm thanh:", e));
    };

    let count = 5;

    // Nhịp đầu tiên (Số 5)
    countdownElement.textContent = count;
    playTick();

    const interval = setInterval(() => {
        count--;
        
        if (count > 0) {
            countdownElement.textContent = count;
            playTick(); 
        } 
        else if (count === 0) {
            countdownElement.textContent = count;
            
            // Ngắt tiếng beep ngay lập tức
            beepSound.pause(); 
            beepSound.currentTime = 0;
            
            clearInterval(interval);
            
            setTimeout(() => {
                transitionToIntro();
            }, 1000);
        }
    }, 1000);
}

function transitionToIntro() {
    const countdownScreen = document.getElementById('countdown-screen');
    const introScreen = document.getElementById('intro-screen');
    const cuteMusic = document.getElementById('sound-cute');
    const dialogueBox = document.querySelector('.dialogue-box');
    const dialogueText = document.getElementById('dialogue-text');

    countdownScreen.style.display = 'none';
    introScreen.style.display = 'flex';

    cuteMusic.volume = 0.5;
    cuteMusic.currentTime = 0;
    cuteMusic.play();

    setTimeout(() => {
        introScreen.classList.add('start-animations');
        
        // Kịch bản Lời thoại
        setTimeout(() => {
            // Thoại 1 (Thêm dấu !)
            dialogueText.innerHTML = "Chào Sandwich GM, mình là Gwen!";
            dialogueBox.classList.add('show'); 

            setTimeout(() => {
                dialogueBox.classList.remove('show'); 

                setTimeout(() => {
                    // Thoại 2 (Thêm dấu !)
                    dialogueText.innerHTML = "Hãy đến nhận lấy chiếc cúp của mình đi nào,<br>bạn <span class='highlight'>Sandwich GM</span> dễ thương ơi!";
                    dialogueBox.classList.add('show'); 
                }, 500);

            }, 3000); 

        }, 1500); 

    }, 100);
}

function openGift() {
    // Lấy âm thanh
    const clickSound = document.getElementById('sound-click');
    const cuteMusic = document.getElementById('sound-cute');
    
    // --- FIX QUAN TRỌNG: CLICK SOUND ---
    // Đặt lại thời gian về 0 và phát ngay lập tức ở dòng đầu tiên của hàm
    clickSound.currentTime = 0;
    clickSound.play();
    
    // Giảm nhạc nền
    cuteMusic.pause();

    const intro = document.getElementById('intro-screen');
    const content = document.getElementById('content-screen');
    const whiteOverlay = document.getElementById('white-overlay');
    const trollContainer = document.getElementById('troll-container');
    const video = document.getElementById('gojo-video');

    whiteOverlay.style.opacity = '1';

    setTimeout(() => {
        trollContainer.style.display = 'flex';
        
        setTimeout(() => {
            intro.style.display = 'none';
            trollContainer.style.display = 'none';
            content.style.display = 'flex';
            whiteOverlay.style.opacity = '0';
            
            video.play();
            // Kích hoạt hàm theo dõi phụ đề
            handleVideoSubtitles(video);

            setTimeout(() => {
                whiteOverlay.style.display = 'none';
            }, 500);

        }, 3500); 

    }, 500); 
}

// --- HÀM XỬ LÝ PHỤ ĐỀ VIDEO (MỚI) ---
function handleVideoSubtitles(video) {
    const subtitleDiv = document.getElementById('video-subtitles');
    
    // BẠN CẦN CHỈNH SỐ GIÂY Ở ĐÂY CHO KHỚP VỚI VIDEO CỦA BẠN
    const subtitles = [
        { 
            start: 3.5, // Bắt đầu hiện ở giây 3.5
            end: 4.5,   // Kết thúc ở giây 4.5
            text: "Hư Thức, TỬ !" 
        },
        { 
            start: 7.5, // Bắt đầu hiện ở giây 7.5
            end: 8.0,   // Kết thúc ở giây 9
            // Thêm dòng just kidding nhỏ bên dưới
            text: "Bắn dô cái mỏ mày <span class='sub-small'>*just kidding*</span>" 
        }
    ];

    video.addEventListener('timeupdate', () => {
        const currentTime = video.currentTime;
        let activeSubtitle = "";

        // Kiểm tra xem thời gian hiện tại có nằm trong khoảng nào không
        subtitles.forEach(sub => {
            if (currentTime >= sub.start && currentTime <= sub.end) {
                activeSubtitle = sub.text;
            }
        });

        subtitleDiv.innerHTML = activeSubtitle;
    });
}
