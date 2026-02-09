class Toaster {
    static SETTINGS = {
        REDIRECT_MS: 3000,
        STAY_CONFIRM_MS: 2000,
        AUTO_CLOSE_MS: 4000,
        FADE_MS: 300,
        COUNTDOWN_START: 3
    };

    static _container = null;

    static success(message, redirectUrl = null) {
        this._pop('success', message, redirectUrl);
    }

    static error(message) {
        this._pop('error', message);
    }

    static _createContainer() {
        if (this._container && document.body.contains(this._container)) return this._container;
        this._container = document.createElement('div');
        this._container.id = 'toaster-stack-container';
        document.body.appendChild(this._container);
        return this._container;
    }

    static _pop(type, message, redirectUrl = null) {
        const container = this._createContainer();
        const isSuccess = type === 'success';
        const toast = document.createElement('div');
        
        // 6. Accessibility & Class Scoping
        toast.className = `toaster-toast toaster-toast--${type}`;
        toast.setAttribute('role', isSuccess ? 'status' : 'alert');
        toast.setAttribute('aria-live', isSuccess ? 'polite' : 'assertive');
        
        toast._timers = []; 

        toast.innerHTML = `
            <div class="toaster-content">
                <div class="toaster-body">
                    <i class="fas ${isSuccess ? 'fa-check-circle' : 'fa-exclamation-circle'} toaster-icon"></i>
                    <div class="toaster-text">
                        <p class="toaster-message"></p>
                        <p class="toaster-subtext" style="display:none"></p>
                    </div>
                </div>
                <div class="toaster-actions"></div>
                <button class="toaster-close" aria-label="Close Toast">&times;</button>
            </div>
            <div class="toaster-progress-bar"></div>
        `;

        // 1. Strict XSS Prevention (No innerHTML for dynamic content)
        toast.querySelector('.toaster-message').textContent = message;

        const bar = toast.querySelector('.toaster-progress-bar');

        if (redirectUrl) {
            const subtext = toast.querySelector('.toaster-subtext');
            subtext.style.display = 'block';
            
            // Securely build subtext DOM
            const countSpan = document.createElement('span');
            countSpan.className = 'toast-count';
            countSpan.textContent = this.SETTINGS.COUNTDOWN_START;
            subtext.textContent = 'Redirecting in ';
            subtext.append(countSpan, 's...');
            
            const cancelBtn = document.createElement('button');
            cancelBtn.className = 'toaster-btn';
            cancelBtn.textContent = 'Stay Here';
            toast.querySelector('.toaster-actions').appendChild(cancelBtn);

            let timeLeft = this.SETTINGS.COUNTDOWN_START;
            
            const textInterval = setInterval(() => {
                timeLeft--;
                if (countSpan) countSpan.textContent = timeLeft;
                if (timeLeft <= 0) clearInterval(textInterval);
            }, 1000);
            toast._timers.push(textInterval);

            const redirectTimer = setTimeout(() => {
                window.location.href = redirectUrl;
            }, this.SETTINGS.REDIRECT_MS);
            toast._timers.push(redirectTimer);

            if (bar) bar.style.transitionDuration = `${this.SETTINGS.REDIRECT_MS}ms`;
            
            // 4. Proper Event Listeners
            cancelBtn.addEventListener('click', () => this._toStayState(toast));
        } else {
            const expiryTimer = setTimeout(() => this._coolDown(toast), this.SETTINGS.AUTO_CLOSE_MS);
            toast._timers.push(expiryTimer);
            if (bar) bar.style.transitionDuration = `${this.SETTINGS.AUTO_CLOSE_MS}ms`;
        }

        container.prepend(toast);

        // Deterministic Reflow
        if (bar) {
            bar.offsetWidth; 
            bar.style.width = '0%';
        }

        const closeBtn = toast.querySelector('.toaster-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this._coolDown(toast));
        }
    }

    static _toStayState(toast) {
        this._clearInstanceTimers(toast);
        
        // 3. Presentation via CSS Class, not inline styles
        toast.classList.remove('toaster-toast--success', 'toaster-toast--error');
        toast.classList.add('toaster-toast--cancelled');
        
        const bar = toast.querySelector('.toaster-progress-bar');
        if (bar) bar.style.display = 'none';
        
        toast.querySelector('.toaster-message').textContent = 'Redirect Cancelled';
        const sub = toast.querySelector('.toaster-subtext');
        if (sub) sub.textContent = "You're staying here!";
        
        const actions = toast.querySelector('.toaster-actions');
        if (actions) actions.innerHTML = '';
        
        const stayTimer = setTimeout(() => this._coolDown(toast), this.SETTINGS.STAY_CONFIRM_MS);
        toast._timers.push(stayTimer);
    }

    static _clearInstanceTimers(toast) {
        if (toast._timers) {
            toast._timers.forEach(t => {
                clearTimeout(t);
                clearInterval(t);
            });
            toast._timers = [];
        }
    }

    static _coolDown(toast) {
        if (!toast) return;
        this._clearInstanceTimers(toast);

        toast.style.opacity = '0';
        toast.style.transform = 'translateX(30px)';
        
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
                // 2. Container Lifecycle Management
                if (this._container && !this._container.children.length) {
                    this._container.remove();
                    this._container = null;
                }
            }
        }, this.SETTINGS.FADE_MS);
    }
}

// 5. Clamped Layout & Variables Injected Styles
(function injectStyles() {
    if (document.getElementById('toaster-css')) return;
    const style = document.createElement('style');
    style.id = 'toaster-css';
    style.textContent = `
        :root {
            --toaster-success: #10b981;
            --toaster-error: #ef4444;
            --toaster-cancel: #2563eb;
            --toaster-text: #ffffff;
            --toaster-width: 340px;
        }
        #toaster-stack-container {
            position: fixed; top: 20px; right: 20px;
            display: flex; flex-direction: column;
            gap: 12px; z-index: 9999; pointer-events: none;
        }
        .toaster-toast {
            pointer-events: auto; min-width: var(--toaster-width); max-width: 450px;
            padding: 16px 20px; border-radius: 8px; color: var(--toaster-text);
            font-family: system-ui, -apple-system, sans-serif;
            position: relative; overflow: hidden;
            box-shadow: 0 10px 15px -3px rgba(0,0,0,0.2);
            transition: all ${Toaster.SETTINGS.FADE_MS}ms ease;
            animation: toaster-slide-in 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .toaster-toast--success { background-color: var(--toaster-success); }
        .toaster-toast--error { background-color: var(--toaster-error); }
        .toaster-toast--cancelled { background-color: var(--toaster-cancel); }

        .toaster-content { display: flex; align-items: center; justify-content: space-between; gap: 15px; position: relative; z-index: 10; }
        .toaster-body { display: flex; align-items: center; gap: 12px; flex: 1; min-width: 0; }
        
        /* 5. Clamped Layout for insane message lengths */
        .toaster-message { 
            font-weight: 600; margin: 0; font-size: 0.95rem; 
            max-height: 4.5em; overflow: hidden; 
            display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical;
        }
        
        .toaster-subtext { margin: 0; font-size: 0.8rem; opacity: 0.9; }
        .toaster-btn {
            background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.3);
            color: var(--toaster-text); border-radius: 4px; padding: 4px 8px;
            font-size: 0.75rem; cursor: pointer; white-space: nowrap; transition: background 0.2s;
        }
        .toaster-close {
            background: none; border: none; color: var(--toaster-text); font-size: 1.5rem;
            cursor: pointer; opacity: 0.7; padding: 0; line-height: 1;
        }
        .toaster-progress-bar {
            position: absolute; bottom: 0; left: 0; height: 3px; width: 100%;
            background-color: rgba(255,255,255,0.5); transition-property: width; transition-timing-function: linear;
        }
        @keyframes toaster-slide-in {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
})();