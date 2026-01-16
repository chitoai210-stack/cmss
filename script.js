document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const passwordScreen = document.getElementById('password-screen');
    const passInput = document.getElementById('pass-input');
    const passBtn = document.getElementById('pass-btn');
    const passError = document.getElementById('pass-error');
    const startScreen = document.getElementById('start-screen');
    const countdownScreen = document.getElementById('countdown-screen');
    const countdownNumber = document.getElementById('countdown-number');
    const ringCircle = document.querySelector('.progress-ring__circle');
    const mainScene = document.getElementById('main-scene');
    const birthdayVideo = document.getElementById('birthday-video');
    const giftBox = document.getElementById('gift-box');
    const bgMusic = document.getElementById('bg-music');
    
    // Game Elements
    const finalScene = document.getElementById('final-scene');
    const scoreDisplay = document.getElementById('score');
    const popSound = document.getElementById('pop-sound');
    const hammer = document.getElementById('custom-hammer');

    // Victory Elements
    const victoryScreen = document.getElementById('victory-screen');
    const slidingImg = document.getElementById('sliding-img');
    const messageContainer = document.getElementById('message-container');
    const canvas = document.getElementById('fireworks');
    const ctx = canvas.getContext('2d');

    // --- 1. KIỂM TRA MẬT KHẨU ---
    passBtn.addEventListener('click', checkPass);
    passInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') checkPass(); });

    function checkPass() {
        if (passInput.value === 'CT011002') { 
            passwordScreen.classList.add('hidden');
            startScreen.classList.remove('hidden');
            
            // YÊU CẦU 1: PHÁT NHẠC NGAY KHI NHẬP PASS
            if (bgMusic) {
                bgMusic.volume = 1.0; 
                bgMusic.play().catch(() => {
                    // Nếu trình duyệt chặn, nó sẽ phát ở lần click tiếp theo (nút Start)
                    console.log("Auto-play blocked, waiting for interaction.");
                });
            }
        } else {
            passError.classList.remove('hidden');
            passInput.value = ''; 
        }
    }

    // --- 2. START SCREEN ---
    startScreen.addEventListener('click', () => {
        startScreen.classList.add('hidden');
        countdownScreen.classList.remove('hidden');
        ringCircle.classList.add('animate-ring');
        
        // Mồi âm thanh khác để đảm bảo chạy
        if(popSound) { popSound.muted = true; popSound.play().catch(()=>{}); popSound.pause(); popSound.currentTime=0; popSound.muted = false; }
        // Đảm bảo nhạc nền chạy nếu bước nhập pass bị chặn
        if(bgMusic && bgMusic.paused) { bgMusic.play().catch(()=>{}); }
        
        runCountdown();
    });

    // --- 3. ĐẾM NGƯỢC (YÊU CẦU 3: BỎ TIẾNG BEEP) ---
    let count = 5;
    let timer = null;
    function runCountdown() {
        updateDisplay(count);
        // Đã xóa playBeep() ở đây
        timer = setInterval(() => {
            count--;
            if (count > 0) {
                updateDisplay(count);
                // Đã xóa playBeep() ở đây
            } else if (count === 0) {
                updateDisplay(count);
                setTimeout(() => { clearInterval(timer); startMainScene(); }, 1000);
            }
        }, 1000);
    }
    function updateDisplay(num) {
        countdownNumber.innerText = num;
        countdownNumber.style.transform = "scale(1.2)";
        setTimeout(() => countdownNumber.style.transform = "scale(1)", 200);
    }

    function startMainScene() {
        countdownScreen.classList.add('hidden');
        mainScene.classList.remove('hidden');
        
        if (birthdayVideo) { birthdayVideo.play().catch(() => { birthdayVideo.muted = true; birthdayVideo.play(); }); }
        
        // YÊU CẦU 4: HỘP QUÀ XUẤT HIỆN SAU 9 GIÂY (Đợi Totoro đi qua)
        setTimeout(() => { 
            giftBox.classList.remove('hidden'); 
        }, 9000); // Bạn chỉnh số này: 9000 = 9 giây
    }

    giftBox.addEventListener('click', () => {
        if(birthdayVideo) birthdayVideo.pause();
        mainScene.classList.add('hidden');
        finalScene.classList.remove('hidden');
        startGame();
    });

    // --- 4. GAME ---
    document.addEventListener('mousemove', (e) => {
        hammer.style.left = (e.pageX - 20) + 'px'; 
        hammer.style.top = (e.pageY - 50) + 'px';
    });
    document.addEventListener('mousedown', () => {
        hammer.classList.add('hammer-down');
        if(isGameRunning && popSound) { popSound.currentTime = 0; popSound.play().catch(()=>{}); }
    });
    document.addEventListener('mouseup', () => { hammer.classList.remove('hammer-down'); });

    let score = 0;
    const targetScore = 10;
    let isGameRunning = false;
    let gameInterval = null;

    function startGame() {
        if(bgMusic) { bgMusic.volume = 0.3; } // Nhạc nhỏ lại khi chơi
        score = 0; scoreDisplay.innerText = score;
        isGameRunning = true;
        gameInterval = setInterval(spawnMole, 1400); 
    }

    function spawnMole() {
        if (!isGameRunning) return;
        const mole = document.createElement('img');
        mole.src = 'to2.png';
        mole.classList.add('mole');
        mole.draggable = false;

        let randomX, randomY;
        const maxX = finalScene.offsetWidth - 120; 
        const maxY = finalScene.offsetHeight - 120;

        if (score >= 5) {
            const minFaceX = finalScene.offsetWidth * 0.40; 
            const maxFaceX = finalScene.offsetWidth * 0.60;
            const minFaceY = finalScene.offsetHeight * 0.10;
            const maxFaceY = finalScene.offsetHeight * 0.30;
            randomX = Math.floor(minFaceX + Math.random() * (maxFaceX - minFaceX));
            randomY = Math.floor(minFaceY + Math.random() * (maxFaceY - minFaceY));
        } else {
            randomX = Math.floor(Math.random() * maxX);
            randomY = Math.floor(Math.random() * maxY);
        }

        mole.style.left = randomX + 'px';
        mole.style.top = randomY + 'px';

        mole.addEventListener('mousedown', function() {
            score++;
            scoreDisplay.innerText = score;
            this.remove();
            if (score >= targetScore) endGame();
        });

        finalScene.appendChild(mole);
        setTimeout(() => { if (mole.parentElement) mole.remove(); }, 1400); 
    }

    // --- 5. END GAME & MESSAGE CONFIG (YÊU CẦU 5) ---
    
    // CẤU HÌNH TIN NHẮN VÀ THỜI GIAN
    // delay: là thời gian chờ (ms) sau khi hiện dòng trước đó thì mới hiện dòng này
    const messages = [
        { text: "- 13/02/2026 -", delay: 1000 },
        { text: "Mong là có người giữ lời, đến ngày mới mở ra xem, nhưng nếu có mở trước thì thoai z biết sao giờ =)))). Oke thì là, hãy xem đây là 1 món quà tinh thần, của 1 ai đó trên thế giới này, not me !", delay: 3000 },
        { text: "Không biết ngày hôm nay của bạn như thế nào, sẽ có chuyện vui, chuyện buồn, tức dzận, hay chỉ là 1 ngày bình thường như bao ngày ? Có nhận được những lời chúc mừng từ những người mình yêu thương và trân trọng ?", delay: 5000 },
        { text: "Dù có chuyện gì đi nữa, sau tất cả, đến thời điểm hiện tại, bạn hãy thật vui vẻ và hạnh phúc nhé ! Vì những điều đã trải qua, vì khi đọc những dòng này, bạn vẫn có thể mỉm cười, có thể khóc, có thể ở bên những người mình yêu quý và chia sẻ những cảm xúc ấy !", delay: 6000 },
        { text: "Có thể là ngày mai, 1 tháng, 1 năm, 10 năm hay 20 năm nữa, tất cả chúng ta sẽ còn ở bên nhau, có thể không, có thể sẽ quên đi nhau theo dòng thời gian, nhưng với mình, những điều chúng ta đã từng, những kỷ niệm đó sẽ không bị lãng quên và sẽ mãi ở 1 góc của não bộ. (gì chứ tui say đắm trong quá khứ lắm, vui buồn gì cũng nhớ)", delay: 7000 },
        { text: "Nếu sau này không ai chúc mừng sinh nhật bạn nữa, thề với bạn là sẽ luôn có 1 người ghi nhớ điều đó, chỉ cần . 1 cái là sẽ có lời chúc tới ngay và luôn ! (thặc ra là nhớ hết, tại tùy hoàn cảnh có chúc được hay ko thoai)", delay: 6000 },
        { text: "Nãy giờ nói cũng hơi nhiều, nhưng chúc thì cũng như mọi lần. Cầu mong cho bạn luôn được bình an và khỏe mạnh (à thì sức khỏe thôi chứ tiền tài học hành tự thân lo nhóe, ngắn gọn cho nó linh)", delay: 5000 },
        { text: "Bonus: thật ra tụi mình ko có hình nào đẹp hết, nên mò trên trang cá nhân mới có hình", delay: 3000 },
        { text: "Hết rồi đó. SINH NHỰT ZUI ZẺ NHE <3", delay: 2000 },
        { text: "Tiểu Ngân Ngân", delay: 1500 }
    ];

    function endGame() {
        isGameRunning = false;
        clearInterval(gameInterval);
        document.querySelectorAll('.mole').forEach(m => m.remove());
        hammer.classList.add('hidden');

        setTimeout(() => {
            finalScene.classList.add('hidden');
            victoryScreen.classList.remove('hidden');
            // Trả lại nhạc nền volume to
            if(bgMusic) bgMusic.volume = 1.0; 
            
            // LOGIC HOẠT CẢNH KẾT THÚC
            // B1: Hiện ảnh tn.jpg ở giữa
            setTimeout(() => {
                slidingImg.classList.add('show-center');
                
                // B2: Sau 2 giây, ảnh trượt sang trái
                setTimeout(() => {
                    slidingImg.classList.remove('show-center');
                    slidingImg.classList.add('slide-left');
                    
                    // B3: Đợi ảnh trượt xong (khoảng 1.5s) -> Khung đen trượt từ phải vào (YÊU CẦU 2)
                    setTimeout(() => {
                        messageContainer.classList.add('box-visible');

                        // B4: Đợi khung đen ổn định (1s) -> Bắt đầu hiện chữ
                        setTimeout(() => {
                            showMessagesRecursive(0); // Gọi hàm hiện chữ đệ quy
                        }, 1000);

                    }, 1500);
                }, 2000);
            }, 100);
        }, 500);
    }

    // Hàm đệ quy để hiện từng dòng theo thời gian delay riêng
    function showMessagesRecursive(index) {
        if (index >= messages.length) {
            startFireworks();
            return;
        }

        const msgData = messages[index];
        const p = document.createElement('p');
        p.textContent = msgData.text;
        p.classList.add('msg-line');
        messageContainer.appendChild(p);

        // Fade in
        requestAnimationFrame(() => {
            p.classList.add('msg-visible');
            messageContainer.scrollTop = messageContainer.scrollHeight;
        });

        // Gọi dòng tiếp theo sau khoảng thời gian delay đã cấu hình
        setTimeout(() => {
            showMessagesRecursive(index + 1);
        }, msgData.delay);
    }

    // --- 6. FIREWORKS ---
    function startFireworks() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        loop(); 
    }

    let particles = [];
    function loop() {
        requestAnimationFrame(loop);
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = 'lighter';

        if (Math.random() < 0.05) {
            createFirework(Math.random() * canvas.width, canvas.height, Math.random() * canvas.width, Math.random() * (canvas.height / 2));
        }

        for (let i = particles.length - 1; i >= 0; i--) {
            particles[i].update();
            particles[i].draw();
            if (particles[i].alpha <= 0) particles.splice(i, 1);
        }
    }

    function createFirework(x, y, targetX, targetY) {
        const particleCount = 50;
        const color = `hsl(${Math.random() * 360}, 50%, 50%)`;
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle(targetX, targetY, color));
        }
    }

    class Particle {
        constructor(x, y, color) {
            this.x = x; this.y = y; this.color = color;
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 5 + 1; 
            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed;
            this.alpha = 1; this.decay = Math.random() * 0.015 + 0.005;
        }
        update() {
            this.x += this.vx; this.y += this.vy; this.vy += 0.05; 
            this.alpha -= this.decay;
        }
        draw() {
            ctx.save(); ctx.globalAlpha = this.alpha; ctx.fillStyle = this.color;
            ctx.beginPath(); ctx.arc(this.x, this.y, 2, 0, Math.PI * 2); ctx.fill(); ctx.restore();
        }
    }
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    });
});
