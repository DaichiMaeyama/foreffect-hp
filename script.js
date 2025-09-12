// DOM要素の取得
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-menu a');
const header = document.querySelector('.header');
const sections = document.querySelectorAll('section');
const contactForm = document.querySelector('.contact-form');


// ページ読み込み時の初期化
document.addEventListener('DOMContentLoaded', function() {
    // ローディング画面の処理
    setTimeout(() => {
        document.body.classList.remove('loading');
    }, 500);

    // スムーズスクロールの設定
    initSmoothScroll();
    
    // ヘッダーのスクロール効果
    initHeaderScroll();
    
    // モバイルメニューの初期化
    initMobileMenu();
    
    // フォームの初期化
    initContactForm();
    
    // アニメーションの初期化
    initScrollAnimations();
    

});

// スムーズスクロールの初期化
function initSmoothScroll() {
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // モバイルメニューを閉じる
                if (navMenu.classList.contains('active')) {
                    toggleMobileMenu();
                }
            }
        });
    });
}

// ヘッダーのスクロール効果
function initHeaderScroll() {
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // ヘッダーの背景透明度を調整
        if (scrollTop > 100) {
            header.style.background = 'rgba(26, 35, 50, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = 'linear-gradient(135deg, #1a2332 0%, #2c3e50 100%)';
            header.style.backdropFilter = 'none';
        }
        
        // アクティブなナビゲーションリンクの更新
        updateActiveNavLink();
        
        lastScrollTop = scrollTop;
    });
}

// アクティブなナビゲーションリンクの更新
function updateActiveNavLink() {
    const scrollPosition = window.scrollY + header.offsetHeight + 50;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// モバイルメニューの初期化
function initMobileMenu() {
    if (hamburger) {
        hamburger.addEventListener('click', toggleMobileMenu);
    }
    
    // メニュー外クリックで閉じる
    document.addEventListener('click', function(e) {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            if (navMenu.classList.contains('active')) {
                toggleMobileMenu();
            }
        }
    });
}

// モバイルメニューの切り替え
function toggleMobileMenu() {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.classList.toggle('menu-open');
    
    // ハンバーガーアイコンのアニメーション
    const spans = hamburger.querySelectorAll('span');
    spans.forEach((span, index) => {
        if (hamburger.classList.contains('active')) {
            if (index === 0) span.style.transform = 'rotate(45deg) translate(5px, 5px)';
            if (index === 1) span.style.opacity = '0';
            if (index === 2) span.style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            span.style.transform = 'none';
            span.style.opacity = '1';
        }
    });
}

// お問い合わせフォームの初期化
function initContactForm() {
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // フォームデータの取得
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const subject = formData.get('subject');
            const message = formData.get('message');
            
            // バリデーション
            if (!validateForm(name, email, subject, message)) {
                return;
            }
            
            // メール送信の処理
            sendEmail(name, email, subject, message);
        });
        
        // リアルタイムバリデーション
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    validateField(this);
                }
            });
        });
    }
}

// フォームバリデーション
function validateForm(name, email, subject, message) {
    let isValid = true;
    
    // 名前のバリデーション
    if (!name || name.trim().length < 2) {
        showFieldError('name', 'お名前は2文字以上で入力してください');
        isValid = false;
    } else {
        clearFieldError('name');
    }
    
    // メールアドレスのバリデーション
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        showFieldError('email', '正しいメールアドレスを入力してください');
        isValid = false;
    } else {
        clearFieldError('email');
    }
    
    // 件名のバリデーション
    if (!subject || subject.trim().length < 3) {
        showFieldError('subject', '件名は3文字以上で入力してください');
        isValid = false;
    } else {
        clearFieldError('subject');
    }
    
    // メッセージのバリデーション
    if (!message || message.trim().length < 10) {
        showFieldError('message', 'メッセージは10文字以上で入力してください');
        isValid = false;
    } else {
        clearFieldError('message');
    }
    
    return isValid;
}

// 個別フィールドのバリデーション
function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    
    switch (fieldName) {
        case 'name':
            if (value.length < 2) {
                showFieldError(fieldName, 'お名前は2文字以上で入力してください');
                return false;
            }
            break;
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                showFieldError(fieldName, '正しいメールアドレスを入力してください');
                return false;
            }
            break;
        case 'subject':
            if (value.length < 3) {
                showFieldError(fieldName, '件名は3文字以上で入力してください');
                return false;
            }
            break;
        case 'message':
            if (value.length < 10) {
                showFieldError(fieldName, 'メッセージは10文字以上で入力してください');
                return false;
            }
            break;
    }
    
    clearFieldError(fieldName);
    return true;
}

// フィールドエラーの表示
function showFieldError(fieldName, message) {
    const field = document.getElementById(fieldName);
    const formGroup = field.closest('.form-group');
    
    // 既存のエラーメッセージを削除
    const existingError = formGroup.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // エラースタイルを追加
    field.classList.add('error');
    field.style.borderColor = '#e74c3c';
    
    // エラーメッセージを追加
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    errorElement.style.color = '#e74c3c';
    errorElement.style.fontSize = '0.8rem';
    errorElement.style.marginTop = '0.25rem';
    
    formGroup.appendChild(errorElement);
}

// フィールドエラーのクリア
function clearFieldError(fieldName) {
    const field = document.getElementById(fieldName);
    const formGroup = field.closest('.form-group');
    
    field.classList.remove('error');
    field.style.borderColor = '';
    
    const errorMessage = formGroup.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

// メール送信処理
function sendEmail(name, email, subject, message) {
    // 送信ボタンを無効化
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = '送信中...';
    
    // メール本文の作成
    const emailBody = `お名前: ${name}\nメールアドレス: ${email}\n件名: ${subject}\n\nメッセージ:\n${message}`;
    
    // mailto リンクを作成
    const mailtoLink = `mailto:daimercurial@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
    
    // メールクライアントを開く
    window.location.href = mailtoLink;
    
    // 送信完了メッセージを表示
    setTimeout(() => {
        showSuccessMessage('お問い合わせありがとうございます。メールクライアントが開きます。');
        
        // フォームをリセット
        contactForm.reset();
        
        // ボタンを元に戻す
        submitButton.disabled = false;
        submitButton.textContent = originalText;
    }, 1000);
}

// 成功メッセージの表示
function showSuccessMessage(message) {
    // 既存の成功メッセージを削除
    const existingSuccess = document.querySelector('.success-message');
    if (existingSuccess) {
        existingSuccess.remove();
    }
    
    const successElement = document.createElement('div');
    successElement.className = 'success-message';
    successElement.textContent = message;
    successElement.style.cssText = `
        background: #2ecc71;
        color: white;
        padding: 1rem;
        border-radius: 8px;
        margin-top: 1rem;
        text-align: center;
        animation: fadeInUp 0.5s ease-out;
    `;
    
    contactForm.appendChild(successElement);
    
    // 3秒後に自動削除
    setTimeout(() => {
        if (successElement.parentNode) {
            successElement.remove();
        }
    }, 3000);
}

// スクロールアニメーションの初期化
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // アニメーション対象要素を監視
    const animateElements = document.querySelectorAll('.service-card, .portfolio-item, .info-item');
    animateElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(element);
    });
}

// ウィンドウリサイズ時の処理
window.addEventListener('resize', function() {
    // モバイルメニューが開いている場合は閉じる
    if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
        toggleMobileMenu();
    }
});

// パフォーマンス最適化: スクロールイベントのスロットリング
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// スクロールイベントをスロットリング
window.addEventListener('scroll', throttle(function() {
    updateActiveNavLink();
}, 100));

// ページ離脱時の確認（フォーム入力中の場合）
window.addEventListener('beforeunload', function(e) {
    const formInputs = contactForm.querySelectorAll('input, textarea');
    let hasContent = false;
    
    formInputs.forEach(input => {
        if (input.value.trim() !== '') {
            hasContent = true;
        }
    });
    
    if (hasContent) {
        e.preventDefault();
        e.returnValue = '';
    }
});

// エラーハンドリング
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
});

// 未処理のPromise拒否をキャッチ
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled Promise Rejection:', e.reason);
});

// ポートフォリオアイテムのホバー効果を強化
function initPortfolioHover() {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    portfolioItems.forEach(item => {
        const img = item.querySelector('.portfolio-img');
        if (!img) return;
        
        item.addEventListener('mouseenter', function() {
            // 画像を全画面表示用にクローン
            const clone = img.cloneNode(true);
            clone.classList.add('portfolio-fullscreen');
            
            // オーバーレイを作成
            const overlay = document.createElement('div');
            overlay.classList.add('portfolio-overlay');
            
            // スタイルを適用
            clone.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 80vw;
                height: 80vh;
                max-width: 800px;
                max-height: 600px;
                object-fit: contain;
                z-index: 9999;
                background: rgba(0, 0, 0, 0.9);
                border-radius: 10px;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
                margin: 0;
                padding: 20px;
                transition: all 0.3s ease;
            `;
            
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.8);
                z-index: 9998;
                transition: all 0.3s ease;
            `;
            
            document.body.appendChild(overlay);
            document.body.appendChild(clone);
        });
        
        item.addEventListener('mouseleave', function() {
            // 全画面表示要素を削除
            const fullscreenImg = document.querySelector('.portfolio-fullscreen');
            const overlay = document.querySelector('.portfolio-overlay');
            
            if (fullscreenImg) fullscreenImg.remove();
            if (overlay) overlay.remove();
        });
    });
}

// ポートフォリオホバー効果を初期化
initPortfolioHover();