// ============================================
// ACHIEVEMENTS SYSTEM
// ============================================

const ACHIEVEMENTS = [
    { id: 'first_visit', icon: 'images/achievements/ach1.png', name: 'First Visit', desc: 'Visit the portfolio' },
    { id: 'explorer', icon: 'images/achievements/ach2.png', name: 'Explorer', desc: 'Scroll to the footer' },
    { id: 'page_hopper', icon: 'images/achievements/ach3.png', name: 'Page Hopper', desc: 'Visit all 4 pages' },
    { id: 'flip_master', icon: 'images/achievements/ach4.png', name: 'Flip Master', desc: 'Flip the photo on About page' },
    { id: 'curious', icon: 'images/achievements/ach5.png', name: 'Curious', desc: 'Ask your first floating question' },
    { id: 'question_master', icon: 'images/achievements/ach6.png', name: 'Question Master', desc: 'Ask ALL floating questions' },
    { id: 'project_viewer', icon: 'images/achievements/ach7.png', name: 'Project Viewer', desc: 'Visit a project page' },
    { id: 'star_gazer', icon: 'images/achievements/ach8.png', name: 'Star Gazer', desc: 'Click a GitHub project link' },
    { id: 'messenger', icon: 'images/achievements/ach9.png', name: 'Messenger', desc: 'Submit a message via contact form' },
    { id: 'achievement_hunter', icon: 'images/achievements/ach10.png', name: 'Achievement Hunter', desc: 'Unlock 5 achievements' },
    { id: 'hidden', icon: 'images/achievements/ach11.png', name: '???', desc: 'Find the secret' },
    { id: 'completionist', icon: 'images/achievements/ach12.png', name: 'Completionist', desc: 'Unlock ALL achievements!' },
];

// ============================================
// STORAGE HELPERS
// ============================================
function getUnlocked() {
    try {
        const data = localStorage.getItem('achievements_unlocked');
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
}

function saveUnlocked(unlocked) {
    localStorage.setItem('achievements_unlocked', JSON.stringify(unlocked));
}

function unlockAchievement(id) {
    const unlocked = getUnlocked();
    if (unlocked.includes(id)) return false;
    
    unlocked.push(id);
    saveUnlocked(unlocked);
    return true;
}

function isUnlocked(id) {
    return getUnlocked().includes(id);
}

function getProgress() {
    const unlocked = getUnlocked();
    return {
        unlocked: unlocked.length,
        total: ACHIEVEMENTS.length,
        percentage: Math.round((unlocked.length / ACHIEVEMENTS.length) * 100)
    };
}

// ============================================
// UI UPDATE FUNCTIONS
// ============================================
function updateBadge() {
    const badge = document.querySelector('.achievement-badge');
    if (!badge) return;
    
    const progress = getProgress();
    const countEl = badge.querySelector('.achievement-badge-count');
    const fillEl = badge.querySelector('.achievement-badge-progress-fill');
    
    if (countEl) countEl.textContent = `${progress.unlocked}/${progress.total}`;
    if (fillEl) fillEl.style.width = `${progress.percentage}%`;
}

function updateModal() {
    const grid = document.querySelector('.achievement-grid');
    const progressText = document.querySelector('.achievement-modal-progress-text span:last-child');
    const progressFill = document.querySelector('.achievement-modal-progress-fill');
    
    if (!grid) return;
    
    const unlocked = getUnlocked();
    const progress = getProgress();
    
    if (progressText) progressText.textContent = `${progress.unlocked}/${progress.total}`;
    if (progressFill) progressFill.style.width = `${progress.percentage}%`;
    
    grid.innerHTML = '';
    
    ACHIEVEMENTS.forEach(ach => {
        const unlocked_ = unlocked.includes(ach.id);
        const div = document.createElement('div');
        div.className = `achievement-item ${unlocked_ ? 'unlocked' : 'locked'}`;
        div.innerHTML = `
            <img src="${ach.icon}" alt="${ach.name}" class="achievement-item-icon-img" />
            <div class="achievement-item-name">${ach.name}</div>
            <div class="achievement-item-desc">${ach.desc}</div>
            <span class="achievement-item-lock">${unlocked_ ? 'Unlocked' : 'Locked'}</span>
        `;
        grid.appendChild(div);
    });
}

function showToast(achievementId) {
    const ach = ACHIEVEMENTS.find(a => a.id === achievementId);
    if (!ach) return;
    
    const existing = document.querySelector('.achievement-toast');
    if (existing) existing.remove();
    
    const toast = document.createElement('div');
    toast.className = 'achievement-toast show';
    toast.innerHTML = `
        <img src="${ach.icon}" alt="${ach.name}" class="achievement-toast-icon-img" />
        <div class="achievement-toast-content">
            <div class="achievement-toast-title">Achievement Unlocked!</div>
            <div class="achievement-toast-desc">${ach.name}: ${ach.desc}</div>
        </div>
        <button class="achievement-toast-close">✕</button>
    `;
    
    document.body.appendChild(toast);
    
    // Auto-dismiss after 4 seconds
    const timeout = setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 500);
    }, 4000);
    
    // Close button
    toast.querySelector('.achievement-toast-close').addEventListener('click', () => {
        clearTimeout(timeout);
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 500);
    });
}

function triggerAchievement(id) {
    if (unlockAchievement(id)) {
        updateBadge();
        showToast(id);
        // If this was the last achievement, trigger completionist
        const progress = getProgress();
        if (progress.unlocked === progress.total) {
            // Completionist is already unlocked via the achievement check
        }
        return true;
    }
    return false;
}

// ============================================
// ACHIEVEMENT TRIGGER FUNCTIONS
// ============================================
function checkFirstVisit() {
    if (!localStorage.getItem('achievement_first_visit_triggered')) {
        localStorage.setItem('achievement_first_visit_triggered', 'true');
        triggerAchievement('first_visit');
    }
}

function checkExplorer() {
    triggerAchievement('explorer');
}

function checkPageHopper(pages) {
    const visited = JSON.parse(localStorage.getItem('achievement_pages_visited') || '[]');
    const newPages = pages.filter(p => !visited.includes(p));
    newPages.forEach(p => visited.push(p));
    localStorage.setItem('achievement_pages_visited', JSON.stringify(visited));
    
    const allPages = ['index', 'work', 'about', 'contact'];
    if (allPages.every(p => visited.includes(p))) {
        triggerAchievement('page_hopper');
    }
}

function checkFlipMaster() {
    triggerAchievement('flip_master');
}

function checkCurious() {
    // This will be called from the curiosity page when first question is dropped
    if (!localStorage.getItem('achievement_curious_triggered')) {
        localStorage.setItem('achievement_curious_triggered', 'true');
        triggerAchievement('curious');
    }
}

function checkQuestionMaster() {
    // This will be called when all questions are answered
    // Check if all qaData questions have been answered
    const answeredCount = parseInt(localStorage.getItem('achievement_answered_count') || '0');
    const totalQuestions = 16; // Match qaData.length in curiosity.html
    
    if (answeredCount >= totalQuestions) {
        triggerAchievement('question_master');
    }
}

function checkProjectViewer() {
    triggerAchievement('project_viewer');
}

function checkStarGazer() {
    triggerAchievement('star_gazer');
}

function checkMessenger() {
    triggerAchievement('messenger');
}

function checkAchievementHunter() {
    const progress = getProgress();
    if (progress.unlocked >= 5) {
        triggerAchievement('achievement_hunter');
    }
}

function checkCompletionist() {
    const progress = getProgress();
    // Check if ALL achievements are unlocked (minus completionist itself)
    if (progress.unlocked >= ACHIEVEMENTS.length - 1) {
        triggerAchievement('completionist');
    }
}

// ============================================
// MODAL TOGGLE
// ============================================
function toggleAchievementModal() {
    const overlay = document.getElementById('achievementModal');
    if (!overlay) return;
    
    const isActive = overlay.classList.contains('active');
    if (isActive) {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    } else {
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        updateModal();
    }
}

// ============================================
// INITIALIZATION
// ============================================
function initAchievements() {
    // Check first visit
    checkFirstVisit();
    
    // Update badge
    updateBadge();
    
    // Close modal on overlay click
    document.getElementById('achievementModal')?.addEventListener('click', function(e) {
        if (e.target === this) {
            toggleAchievementModal();
        }
    });
    
    // Close modal with the "X" button
    document.getElementById('achievementModalClose')?.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleAchievementModal();
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const overlay = document.getElementById('achievementModal');
            if (overlay && overlay.classList.contains('active')) {
                toggleAchievementModal();
            }
        }
    });
    
    checkAchievementHunter();
    // Check completionist
    checkCompletionist();
}

// ============================================
// EXPOSE FUNCTIONS GLOBALLY
// ============================================
window.Achievements = {
    trigger: triggerAchievement,
    getUnlocked: getUnlocked,
    getProgress: getProgress,
    isUnlocked: isUnlocked,
    toggleModal: toggleAchievementModal,
    checkExplorer: checkExplorer,
    checkPageHopper: checkPageHopper,
    checkFlipMaster: checkFlipMaster,
    checkCurious: checkCurious,
    checkQuestionMaster: checkQuestionMaster,
    checkProjectViewer: checkProjectViewer,
    checkStarGazer: checkStarGazer,
    checkMessenger: checkMessenger,
    updateBadge: updateBadge,
    updateModal: updateModal,
};

// Auto-init when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAchievements);
} else {
    initAchievements();
}

console.log('Achievements system initialized!');