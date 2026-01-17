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
            
            if (bgMusic) {
                bgMusic.volume = 1.0; 
                bgMusic.play().catch(() => {
                    console.log("Auto-play blocked.");
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
        
        // Mồi âm thanh
        if(popSound) { popSound.muted = true; popSound.play().catch(()=>{}); popSound.pause(); popSound.currentTime=0; popSound.muted = false; }
        if(bgMusic && bgMusic.paused) { bgMusic.play().catch(()=>{}); }
        
        runCountdown();
    });

    // --- 3. ĐẾM NGƯỢC ---
    let count = 5;
    let timer = null;
    function runCountdown() {
        updateDisplay(count);
        timer = setInterval(() => {
            count--;
            if (count > 0) {
                updateDisplay(count);
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
        
        // --- YÊU CẦU 3: HỘP QUÀ XUẤT HIỆN SAU 1.5 GIÂY ---
        setTimeout(() => { 
            giftBox.classList.remove('hidden'); 
        }, 1500); 
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
    
    document.addEventListener('mousedown', () => { hammer.classList.add('hammer-down'); });
    document.addEventListener('mouseup', () => { hammer.classList.remove('hammer-down'); });

    let score = 0;
    // --- YÊU CẦU 1: TỔNG 15 CON (5 con đầu + 10 con cuối) ---
    const targetScore = 15; 
    let isGameRunning = false;
    let gameInterval = null;
    let isSpeedUp = false; // Cờ kiểm tra đã tăng tốc chưa

    function startGame() {
        if(bgMusic) { bgMusic.volume = 0.3; } 
        score = 0; scoreDisplay.innerText = score;
        isGameRunning = true;
        isSpeedUp = false;
        
        // Tốc độ ban đầu: 1.4s
        gameInterval = setInterval(spawnMole, 1400); 
    }

    function spawnMole() {
        if (!isGameRunning) return;

        // --- YÊU CẦU 1 & 2: LOGIC TĂNG TỐC VÀ TROLL ---
        if (score >= 5) {
            // Nếu chưa tăng tốc thì reset interval để chạy nhanh hơn (0.8s)
            if (!isSpeedUp) {
                clearInterval(gameInterval);
                gameInterval = setInterval(spawnMole, 800); // 0.8 giây
                isSpeedUp = true;
            }

            // Xuất hiện chữ troll
            spawnTrollText();
        }

        const mole = document.createElement('img');
        mole.src = 'to2.png';
        mole.classList.add('mole');
        mole.draggable = false;

        let randomX, randomY;
        const maxX = finalScene.offsetWidth - 120; 
        const maxY = finalScene.offsetHeight - 120;

        if (score >= 5) {
            // Vị trí cố định (30% ngang, 25% dọc)
            randomX = finalScene.offsetWidth * 0.30; 
            randomY = finalScene.offsetHeight * 0.25;
        } else {
            // Ngẫu nhiên
            randomX = Math.floor(Math.random() * maxX);
            randomY = Math.floor(Math.random() * maxY);
        }

        mole.style.left = randomX + 'px';
        mole.style.top = randomY + 'px';

        // Thời gian tồn tại của chuột cũng giảm đi khi tăng tốc
        let duration = isSpeedUp ? 800 : 1400;

        mole.addEventListener('mousedown', function() {
            // KHÔNG CÓ TIẾNG POP
            score++;
            scoreDisplay.innerText = score;
            this.remove();
            if (score >= targetScore) endGame();
        });

        finalScene.appendChild(mole);
        setTimeout(() => { if (mole.parentElement) mole.remove(); }, duration); 
    }

    // --- HÀM TẠO CHỮ TROLL ---
    function spawnTrollText() {
        const phrases = ["Đập dzô mặt idol", "đập dô, đập dô", "A á ớ", "Mạnh lên !"];
        const text = document.createElement('div');
        text.innerText = phrases[Math.floor(Math.random() * phrases.length)];
        
        // Style ngẫu nhiên cho chữ
        text.style.position = 'absolute';
        text.style.left = (Math.random() * 80 + 10) + '%'; // 10% - 90% màn hình
        text.style.top = (Math.random() * 80 + 10) + '%';
        text.style.color = Math.random() > 0.5 ? '#ff0055' : '#ffcc00'; // Đỏ hoặc Vàng
        text.style.fontSize = (Math.random() * 20 + 20) + 'px'; // 20px - 40px
        text.style.fontWeight = 'bold';
        text.style.fontFamily = 'Arial, sans-serif';
        text.style.transform = `rotate(${Math.random() * 60 - 30}deg)`; // Xoay nghiêng
        text.style.zIndex = '45'; // Nằm dưới chuột nhưng trên nền
        text.style.pointerEvents = 'none'; // Không chặn click chuột
        text.style.textShadow = '2px 2px 0 #000';
        text.style.transition = 'all 0.5s ease-out';
        
        finalScene.appendChild(text);

        // Hiệu ứng bay lên và biến mất
        setTimeout(() => {
            text.style.transform += ' scale(1.5)';
            text.style.opacity = '0';
        }, 100);

        setTimeout(() => {
            if(text.parentElement) text.remove();
        }, 600);
    }

    // --- 5. END GAME & MESSAGE ---
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
        // Xóa sạch chữ troll nếu còn sót
        finalScene.querySelectorAll('div').forEach(d => {
            if(d.id !== 'score-board') d.remove(); 
        });
        hammer.classList.add('hidden');

        setTimeout(() => {
            finalScene.classList.add('hidden');
            victoryScreen.classList.remove('hidden');
            if(bgMusic) bgMusic.volume = 1.0; 
            
            setTimeout(() => {
                slidingImg.classList.add('show-center');
                setTimeout(() => {
                    slidingImg.classList.remove('show-center');
                    slidingImg.classList.add('slide-left');
                    
                    setTimeout(() => {
                        messageContainer.classList.add('box-visible');
                        setTimeout(() => {
                            showMessagesRecursive(0);
                        }, 1000);
                    }, 1500);
                }, 2000);
            }, 100);
        }, 500);
    }

    function showMessagesRecursive(index) {
        if (index >= messages.length) {
            startFireworks();

            setTimeout(() => {
                // 1. Làm mờ và ẩn khung tin nhắn
                messageContainer.style.transition = "opacity 2s ease"; 
                messageContainer.style.opacity = "0";

                // 2. Hình tn chạy từ trái về trung tâm chậm rãi
                slidingImg.classList.remove('slide-left');
                slidingImg.style.transition = "all 5s ease-in-out";
                slidingImg.classList.add('show-center');

            }, 2000); 

            return;
        }

        const msgData = messages[index];
        const p = document.createElement('p');
        p.textContent = msgData.text;
        p.classList.add('msg-line');
        messageContainer.appendChild(p);

        requestAnimationFrame(() => {
            p.classList.add('msg-visible');
            messageContainer.scrollTop = messageContainer.scrollHeight;
        });

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
