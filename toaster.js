/**
 * Toaster - The plug-and-play notification engine
 * Usage: Toaster.success("Message", "optional_url")
 *        Toaster.error("Message");
 */
class Toaster {
    static redirectTimer = null;
    static textInterval = null;

    static success(message, redirectUrl = null) {
        this._pop('success', message, redirectUrl);
    }

    static error(message) {
        this._pop('error', message);
    }

    static _pop(type, message, redirectUrl = null) {
        this._eject();

        const isSuccess = type === 'success';
        const themeColor = isSuccess ? '#10b981' : '#ef4444'; // Emerald-500 : Red-500
        const icon = isSuccess ? 'fa-check-circle' : 'fa-exclamation-circle';
        
        const toast = document.createElement('div');
        toast.className = `toaster-toast toast-${type}`;
        
        const progressId = `toast-bar-${Math.random().toString(36).substr(2, 5)}`;
        
        toast.innerHTML = `
            <div class="toaster-content">
                <div class="toaster-body">
                    <i class="fas ${icon} toaster-icon"></i>
                    <div class="toaster-text">
                        <p class="toaster-message">${message}</p>
                        ${redirectUrl ? `<p class="toaster-subtext">Redirecting in <span id="toast-count">3</span>s...</p>` : ''}
                    </div>
                </div>
                ${redirectUrl ? `
                    <button id="toast-cancel" class="toaster-btn">
                        Stay Here
                    </button>
                ` : ''}
            </div>
            <div id="${progressId}" class="toaster-progress-bar"></div>
        `;

        document.body.appendChild(toast);

        // Animate progress bar
        const bar = document.getElementById(progressId);
        setTimeout(() => { bar.style.width = '0%'; }, 10);

        if (redirectUrl) {
            let timeLeft = 3;
            const countEl = document.getElementById('toast-count');
            this.textInterval = setInterval(() => {
                timeLeft--;
                if (countEl) countEl.textContent = timeLeft;
                if (timeLeft <= 0) clearInterval(this.textInterval);
            }, 1000);

            this.redirectTimer = setTimeout(() => { window.location.href = redirectUrl; }, 3000);
            toast.querySelector('#toast-cancel').addEventListener('click', () => this._cancel(toast));
        } else {
            setTimeout(() => this._coolDown(toast), 3000);
        }
    }

    static _cancel(toast) {
        clearTimeout(this.redirectTimer);
        clearInterval(this.textInterval);
        
        toast.style.backgroundColor = '#2563eb'; // Blue-600
        toast.innerHTML = `
            <div class="toaster-content">
                <div class="toaster-body">
                    <i class="fas fa-hand-paper toaster-icon"></i>
                    <div class="toaster-text">
                        <p class="toaster-message">Redirect Cancelled</p>
                        <p class="toaster-subtext">You're staying here!</p>
                    </div>
                </div>
            </div>
        `;
        setTimeout(() => this._coolDown(toast), 2000);
    }

    static _coolDown(toast) {
        if (!toast) return;
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(30px)';
        setTimeout(() => toast.remove(), 300);
    }

    static _eject() {
        document.querySelectorAll('.toaster-toast').forEach(t => t.remove());
        clearTimeout(this.redirectTimer);
        clearInterval(this.textInterval);
    }
}

// Inject CSS that replaces all Tailwind requirements
(function injectStyles() {
    if (document.getElementById('toaster-css')) return;
    const style = document.createElement('style');
    style.id = 'toaster-css';
    style.textContent = `
        .toaster-toast {
            position: fixed; top: 20px; right: 20px; min-width: 300px;
            padding: 16px 24px; border-radius: 8px; color: white;
            font-family: sans-serif; z-index: 9999; overflow: hidden;
            box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            animation: toaster-slide-in 0.3s ease-out;
        }
        .toast-success { background-color: #10b981; }
        .toast-error { background-color: #ef4444; }
        
        .toaster-content { display: flex; align-items: center; justify-content: space-between; position: relative; z-index: 10; }
        .toaster-body { display: flex; align-items: center; gap: 12px; }
        .toaster-icon { font-size: 1.25rem; }
        .toaster-message { font-weight: 600; margin: 0; font-size: 0.95rem; }
        .toaster-subtext { margin: 2px 0 0 0; font-size: 0.8rem; opacity: 0.9; }
        
        .toaster-btn {
            background: none; border: none; color: white; text-decoration: underline;
            font-size: 0.8rem; font-weight: 500; cursor: pointer; padding: 0; margin-left: 15px;
        }
        .toaster-progress-bar {
            position: absolute; bottom: 0; left: 0; height: 4px; width: 100%;
            background-color: rgba(255,255,255,0.4); transition: width 3s linear;
        }
        @keyframes toaster-slide-in {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
})();