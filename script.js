// DOM読み込み完了後に実行
document.addEventListener('DOMContentLoaded', function() {
    
    // デバッグ用：ページ読み込み確認
    console.log('Page loaded, initializing scripts...');
    console.log('User agent:', navigator.userAgent);
    console.log('Touch support:', 'ontouchstart' in window);
    
    // 確実に動作するモバイルハンバーガーメニュー - 最終版
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    
    console.log('=== Mobile Navigation Debug ===');
    console.log('Hamburger found:', !!hamburger);
    console.log('NavMenu found:', !!navMenu);
    console.log('NavLinks found:', navLinks.length);
    
    // メニューを閉じる関数
    function closeMenu() {
        if (navMenu && hamburger) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            console.log('Menu closed');
        }
    }
    
    // スクロール処理関数
    function scrollToTarget(targetId) {
        console.log('Scrolling to:', targetId);
        
        if (targetId === '#home' || targetId === '#') {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            console.log('Scrolled to top');
            return;
        }
        
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            const header = document.querySelector('.header');
            const headerHeight = header ? header.offsetHeight : 80;
            const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            
            console.log('Target section found:', targetSection);
            console.log('Calculated position:', targetPosition);
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        } else {
            console.error('Target section not found:', targetId);
        }
    }
    
    if (hamburger && navMenu) {
        // ハンバーガーボタンのクリック処理
        hamburger.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const isOpen = navMenu.classList.contains('active');
            
            if (isOpen) {
                closeMenu();
            } else {
                navMenu.classList.add('active');
                hamburger.classList.add('active');
                hamburger.setAttribute('aria-expanded', 'true');
                console.log('Menu opened');
            }
        });
        
        // 各リンクに個別にイベントリスナーを設定（確実な方法）
        navLinks.forEach((link, index) => {
            const href = link.getAttribute('href');
            console.log(`Setting up link ${index}: ${href}`);
            
            link.addEventListener('click', function(e) {
                console.log('=== Link clicked ===');
                console.log('Link:', this);
                console.log('Href:', this.getAttribute('href'));
                console.log('Event:', e);
                
                // 確実にデフォルト動作を停止
                e.preventDefault();
                e.stopPropagation();
                
                // メニューを閉じる
                closeMenu();
                
                // スクロールを実行
                const targetId = this.getAttribute('href');
                
                // 少し遅延してスクロールを実行（メニューアニメーション待ち）
                setTimeout(() => {
                    scrollToTarget(targetId);
                }, 100);
            });
        });
        
        // メニュー外クリックで閉じる
        document.addEventListener('click', function(e) {
            if (navMenu.classList.contains('active') && 
                !navMenu.contains(e.target) && 
                !hamburger.contains(e.target)) {
                closeMenu();
            }
        });
        
        console.log('Mobile hamburger menu setup complete with individual link listeners');
    } else {
        console.error('Required elements not found!');
    }
    
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
    console.log('Touch events enabled');
    document.addEventListener('touchstart', function() {}, true);
    
    // iOS Safari用のタッチイベント強制有効化
    document.addEventListener('touchstart', function() {}, { passive: true });
} else {
    console.log('Touch events not supported');
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

