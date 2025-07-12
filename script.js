// DOM読み込み完了後に実行
document.addEventListener('DOMContentLoaded', function() {
    
    // ハンバーガーメニュー機能
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
        
    }
    
    // スムーススクロール
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            // メニューが開いている場合は閉じる処理を追加
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }

            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ページトップへ戻るボタン
    const backToTopButton = document.createElement('a');
    backToTopButton.href = '#home';
    backToTopButton.className = 'back-to-top';
    backToTopButton.innerHTML = '↑';
    backToTopButton.title = 'ページトップへ戻る';
    document.body.appendChild(backToTopButton);
    
    // スクロール時の処理
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        // パララックス効果（ヒーローセクション）
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.transform = `translateY(${rate}px)`;
        }
        
        // ページトップボタンの表示/非表示
        if (scrolled > 300) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
        
        // ヘッダーの背景透明度変更
        const header = document.querySelector('.header');
        if (header) {
            if (scrolled > 100) {
                header.style.backgroundColor = 'rgba(44, 24, 16, 0.95)';
            } else {
                header.style.backgroundColor = '#2c1810';
            }
        }
    });
    
    // フェードインアニメーション
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
            }
        });
    }, observerOptions);
    
    // アニメーション対象要素を監視
    const animateElements = document.querySelectorAll('.about-item, .menu-category, .drink-category, .info-item');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        observer.observe(el);
    });
    
    
    // 電話番号リンクのクリック処理
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    phoneLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // 電話をかける前の確認（モバイルでは不要だが、PCでは確認）
            if (window.innerWidth > 768) {
                const phoneNumber = this.textContent;
                if (!confirm(`${phoneNumber} に電話をかけますか？`)) {
                    e.preventDefault();
                }
            }
        });
    });
    
    // メニューアイテムのホバー効果強化
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.02)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // 現在時刻に基づく営業状況の表示
    function updateBusinessStatus() {
        const now = new Date();
        const currentHour = now.getHours();
        const currentDay = now.getDay(); // 0: 日曜日, 6: 土曜日
        
        let status = '';
        let statusClass = '';
        
        // 定休日チェック（日曜日: 0）
        if (currentDay === 0) {
            status = '本日は定休日です';
            statusClass = 'closed';
        } else {
            // 営業時間チェック（17:00-22:00）
            if (currentHour >= 17 && currentHour < 22) {
                status = '営業中';
                statusClass = 'open';
            } else if (currentHour >= 22 || currentHour < 17) {
                status = '営業時間外';
                statusClass = 'closed';
            }
        }
        
        // 営業状況を表示する要素があれば更新
        const statusElement = document.getElementById('business-status');
        if (statusElement) {
            statusElement.textContent = status;
            statusElement.className = `business-status ${statusClass}`;
        }
    }
    
    // 初回実行と1分ごとの更新
    updateBusinessStatus();
    setInterval(updateBusinessStatus, 60000);
    
    // ローディング画面（必要に応じて）
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
    });
    
    // 画像の遅延読み込み（Lazy Loading）
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    }
});

// モバイル向けタッチイベント処理
if ('ontouchstart' in window) {
    document.addEventListener('touchstart', function() {}, true);
}

// エラーハンドリング
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
});

// リサイズ時の処理
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
        // ウィンドウサイズ変更時の処理
        const navMenu = document.querySelector('.nav-menu');
        const hamburger = document.querySelector('.hamburger');
        
        if (window.innerWidth > 768) {
            if (navMenu) navMenu.classList.remove('active');
            if (hamburger) hamburger.classList.remove('active');
        }
    }, 250);
});

