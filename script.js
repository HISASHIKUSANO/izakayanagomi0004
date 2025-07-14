// DOM読み込み完了後に実行
document.addEventListener('DOMContentLoaded', function() {
    
    // デバッグ用：ページ読み込み確認
    console.log('Page loaded, initializing scripts...');
    console.log('User agent:', navigator.userAgent);
    console.log('Touch support:', 'ontouchstart' in window);
    
    // ハンバーガーメニュー機能 - 改善版（スクロール制御＋イベント統一）
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const body = document.body;
    
    console.log('Hamburger element found:', hamburger);
    console.log('Nav menu element found:', navMenu);
    
    if (hamburger && navMenu) {
        // 背景スクロール位置を保存する変数
        let scrollPosition = 0;
        
        // メニュー切り替え関数 - 改善版
        function toggleMenu() {
            console.log('Menu toggle function called');
            const isCurrentlyOpen = navMenu.classList.contains('active');
            
            if (!isCurrentlyOpen) {
                // メニューを開く
                // 現在のスクロール位置を保存
                scrollPosition = window.pageYOffset;
                
                // 背景スクロールを無効化
                body.classList.add('no-scroll');
                body.style.top = `-${scrollPosition}px`;
                
                // メニューを表示
                navMenu.classList.add('active');
                hamburger.classList.add('active');
                
                console.log('Menu opened, scroll disabled');
            } else {
                // メニューを閉じる
                // 背景スクロールを有効化
                body.classList.remove('no-scroll');
                body.style.top = '';
                
                // スクロール位置を復元
                window.scrollTo(0, scrollPosition);
                
                // メニューを非表示
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
                
                console.log('Menu closed, scroll enabled');
            }
            
            // アクセシビリティ用のaria-expanded属性を更新
            const isExpanded = navMenu.classList.contains('active');
            hamburger.setAttribute('aria-expanded', isExpanded);
            console.log('Menu is now:', isExpanded ? 'open' : 'closed');
        }
        
        // 統一されたクリックイベント - 改善版（touchイベント削除）
        hamburger.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Hamburger click event fired');
            toggleMenu();
        });
        
        // キーボードナビゲーション（EnterとSpaceキー）
        hamburger.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                console.log('Hamburger keyboard event fired');
                toggleMenu();
            }
        });
        
        // メニュー外クリックで閉じる機能 - 改善版
        document.addEventListener('click', function(e) {
            if (navMenu.classList.contains('active') && 
                !navMenu.contains(e.target) && 
                !hamburger.contains(e.target)) {
                console.log('Clicked outside menu, closing');
                toggleMenu();
            }
        });
        
        // ESCキーでメニューを閉じる機能 - 新機能
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                console.log('ESC key pressed, closing menu');
                toggleMenu();
            }
        });
        
        // デバッグ用：要素の状態確認
        console.log('Hamburger menu initialized successfully with improved functionality');
        
    } else {
        console.error('Hamburger menu elements not found!');
    }
    
    // スムーススクロール - 改善版（新しいメニュー閉じる処理対応）
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');

    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const navMenuElement = document.querySelector('.nav-menu');
            const hamburgerElement = document.querySelector('.hamburger');

            // スマホメニューが開いている場合、改善されたメニュー閉じる処理を実行
            if (hamburgerElement && navMenuElement && navMenuElement.classList.contains('active')) {
                // 改善: 背景スクロール制御も含めてメニューを閉じる
                body.classList.remove('no-scroll');
                body.style.top = '';
                window.scrollTo(0, scrollPosition);
                
                navMenuElement.classList.remove('active');
                hamburgerElement.classList.remove('active');
                hamburgerElement.setAttribute('aria-expanded', 'false');
                
                console.log('Menu closed via navigation link');
            }

            const targetId = this.getAttribute('href');
            console.log('Clicking link with target:', targetId); // デバッグ用
            
            // hrefが"#"だけであればトップに移動
            if (targetId === '#') {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                return;
            }
            
            const targetSection = document.querySelector(targetId);
            console.log('Target section found:', targetSection); // デバッグ用

            if (targetSection) {
                const header = document.querySelector('.header');
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = targetSection.offsetTop - headerHeight;

                console.log('Scrolling to position:', targetPosition); // デバッグ用
                
                // 改善: メニューが閉じられた後、少し遅延してからスクロール
                setTimeout(() => {
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }, 100);
            } else {
                console.warn('Target section not found for:', targetId); // デバッグ用
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

