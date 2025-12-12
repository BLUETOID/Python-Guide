// ===== Dark Mode Toggle =====
const initTheme = () => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
};
initTheme();

const toggleTheme = () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
};

// ===== Loading Skeleton =====
const LoadingSkeleton = {
    show() {
        const skeleton = document.createElement('div');
        skeleton.className = 'loading-skeleton';
        skeleton.id = 'loadingSkeleton';
        skeleton.innerHTML = `
            <div class="skeleton-header"></div>
            <div class="skeleton-content">
                <div class="skeleton-line long"></div>
                <div class="skeleton-line medium"></div>
                <div class="skeleton-line short"></div>
                <div class="skeleton-line long"></div>
                <div class="skeleton-line medium"></div>
            </div>
        `;
        document.body.prepend(skeleton);
    },
    
    hide() {
        const skeleton = document.getElementById('loadingSkeleton');
        if (skeleton) {
            skeleton.classList.add('fade-out');
            setTimeout(() => skeleton.remove(), 300);
        }
    }
};

// Show skeleton initially
LoadingSkeleton.show();

// Hide skeleton when page loads
window.addEventListener('load', () => {
    LoadingSkeleton.hide();
});

// ===== Confetti Effect =====
const ConfettiEffect = {
    trigger() {
        const colors = ['#3776ab', '#ffd43b', '#28a745', '#dc3545', '#17a2b8', '#6f42c1'];
        const container = document.createElement('div');
        container.className = 'confetti-container';
        document.body.appendChild(container);
        
        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = Math.random() * 2 + 's';
            confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
            container.appendChild(confetti);
        }
        
        setTimeout(() => container.remove(), 5000);
    }
};

// ===== Smooth Page Transitions =====
const PageTransition = {
    init() {
        // Add fade-in class to body
        document.body.classList.add('page-transition');
        
        // Intercept link clicks for smooth transitions
        document.querySelectorAll('a').forEach(link => {
            const href = link.getAttribute('href');
            if (href && href.endsWith('.html') && !href.startsWith('http') && !href.startsWith('#')) {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    document.body.classList.add('page-fade-out');
                    setTimeout(() => {
                        window.location.href = href;
                    }, 200);
                });
            }
        });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    PageTransition.init();
});

// ===== Breadcrumb Navigation =====
const Breadcrumb = {
    pageNames: {
        'index.html': 'Home',
        'unit1.html': 'Unit I - Introduction',
        'unit2.html': 'Unit II - Control Structures',
        'unit3.html': 'Unit III - Data Structures',
        'unit4.html': 'Unit IV - Functions & Modules',
        'unit5.html': 'Unit V - File Handling & OOP',
        'practice.html': 'Practice Questions',
        'theory.html': 'Theory Questions',
        'comparisons.html': 'Comparisons',
        'errors.html': 'Common Errors',
        'extras.html': 'Extras',
        'mcq.html': 'MCQ Question Bank'
    },
    
    init() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        // Don't show breadcrumb on home page
        if (currentPage === 'index.html' || currentPage === '') return;
        
        const pageName = this.pageNames[currentPage] || currentPage.replace('.html', '');
        
        const breadcrumb = document.createElement('nav');
        breadcrumb.className = 'breadcrumb';
        breadcrumb.setAttribute('aria-label', 'Breadcrumb');
        breadcrumb.innerHTML = `
            <div class="container">
                <a href="index.html"><i class="fas fa-home"></i> Home</a>
                <span class="breadcrumb-separator"><i class="fas fa-chevron-right"></i></span>
                <span class="breadcrumb-current">${pageName}</span>
            </div>
        `;
        
        const header = document.querySelector('.unit-header') || document.querySelector('header');
        if (header) {
            header.parentNode.insertBefore(breadcrumb, header);
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    Breadcrumb.init();
});

// Add theme toggle button to navbar
document.addEventListener('DOMContentLoaded', () => {
    const navContainer = document.querySelector('.nav-container');
    if (navContainer) {
        const themeBtn = document.createElement('button');
        themeBtn.className = 'theme-toggle';
        themeBtn.setAttribute('aria-label', 'Toggle dark mode');
        themeBtn.innerHTML = '<i class="fas fa-moon"></i><i class="fas fa-sun"></i>';
        themeBtn.addEventListener('click', toggleTheme);
        navContainer.insertBefore(themeBtn, document.getElementById('navToggle'));
    }
});

// ===== Search Functionality =====
const SearchSystem = {
    searchData: [
        { title: 'Introduction to Python', page: 'unit1.html', keywords: 'python history features installation ide syntax variables operators data types' },
        { title: 'Control Structures', page: 'unit2.html', keywords: 'if else elif loops for while break continue pass nested conditions' },
        { title: 'Data Structures', page: 'unit3.html', keywords: 'list tuple set dictionary comprehension append remove pop sort methods' },
        { title: 'Functions & Modules', page: 'unit4.html', keywords: 'function def return arguments lambda recursion module import package pip' },
        { title: 'File Handling & OOP', page: 'unit5.html', keywords: 'file read write open close exception try except class object inheritance' },
        { title: 'Practice Questions', page: 'practice.html', keywords: 'coding practice exercises solutions problems' },
        { title: 'Theory Questions', page: 'theory.html', keywords: 'theory viva questions answers exam preparation' },
        { title: 'Comparisons', page: 'comparisons.html', keywords: 'list tuple comparison difference vs function method' },
        { title: 'Common Errors', page: 'errors.html', keywords: 'error exception syntax runtime name type value index key' },
        { title: 'Extras', page: 'extras.html', keywords: 'tips shortcuts best practices resources' },
        { title: 'MCQ Questions', page: 'mcq.html', keywords: 'mcq multiple choice questions quiz exam test' }
    ],
    
    init() {
        this.createSearchUI();
        this.bindEvents();
    },
    
    createSearchUI() {
        // Search button in navbar
        const searchBtn = document.createElement('button');
        searchBtn.className = 'search-btn';
        searchBtn.innerHTML = '<i class="fas fa-search"></i>';
        searchBtn.setAttribute('aria-label', 'Search');
        
        const navContainer = document.querySelector('.nav-container');
        if (navContainer) {
            const themeToggle = document.querySelector('.theme-toggle');
            if (themeToggle) {
                navContainer.insertBefore(searchBtn, themeToggle);
            }
        }
        
        // Search modal
        const modal = document.createElement('div');
        modal.className = 'search-modal';
        modal.innerHTML = `
            <div class="search-modal-content">
                <div class="search-header">
                    <input type="text" class="search-input" placeholder="Search topics, units, questions..." autofocus>
                    <button class="search-close"><i class="fas fa-times"></i></button>
                </div>
                <div class="search-results"></div>
                <div class="search-hint">Press ESC to close</div>
            </div>
        `;
        document.body.appendChild(modal);
    },
    
    bindEvents() {
        const searchBtn = document.querySelector('.search-btn');
        const modal = document.querySelector('.search-modal');
        const input = document.querySelector('.search-input');
        const closeBtn = document.querySelector('.search-close');
        const results = document.querySelector('.search-results');
        
        if (!searchBtn || !modal) return;
        
        searchBtn.addEventListener('click', () => {
            modal.classList.add('active');
            input.focus();
        });
        
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
            input.value = '';
            results.innerHTML = '';
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                input.value = '';
                results.innerHTML = '';
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                modal.classList.remove('active');
                input.value = '';
                results.innerHTML = '';
            }
            // Ctrl+K or Cmd+K to open search
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                modal.classList.add('active');
                input.focus();
            }
        });
        
        input.addEventListener('input', (e) => {
            this.performSearch(e.target.value);
        });
    },
    
    performSearch(query) {
        const results = document.querySelector('.search-results');
        if (!query.trim()) {
            results.innerHTML = '';
            return;
        }
        
        const matches = this.searchData.filter(item => {
            const searchText = `${item.title} ${item.keywords}`.toLowerCase();
            return query.toLowerCase().split(' ').every(word => searchText.includes(word));
        });
        
        if (matches.length === 0) {
            results.innerHTML = '<div class="no-results">No results found</div>';
            return;
        }
        
        results.innerHTML = matches.map(item => `
            <a href="${item.page}" class="search-result-item">
                <i class="fas fa-file-alt"></i>
                <span>${item.title}</span>
            </a>
        `).join('');
    }
};

document.addEventListener('DOMContentLoaded', () => {
    SearchSystem.init();
});

// ===== Mobile Navigation Toggle =====
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking a link
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });
}

// ===== Scroll to Top Button =====
const scrollTopBtn = document.createElement('button');
scrollTopBtn.className = 'scroll-top';
scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
document.body.appendChild(scrollTopBtn);

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ===== Copy Code Functionality =====
document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const codeBlock = this.closest('.code-example').querySelector('code');
        const text = codeBlock.textContent;
        
        navigator.clipboard.writeText(text).then(() => {
            const originalText = this.textContent;
            this.textContent = 'Copied!';
            this.style.background = '#28a745';
            
            setTimeout(() => {
                this.textContent = originalText;
                this.style.background = '';
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy:', err);
        });
    });
});

// ===== Smooth Scroll for Anchor Links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===== Active Sidebar Link Highlighting =====
const observerOptions = {
    root: null,
    rootMargin: '-100px 0px -50% 0px',
    threshold: 0
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            document.querySelectorAll('.sidebar-nav a').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}, observerOptions);

// Observe all topic sections
document.querySelectorAll('.topic-section[id]').forEach(section => {
    observer.observe(section);
});

// ===== Animate Elements on Scroll =====
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.unit-card, .feature-card, .topic-section');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight - 100) {
            element.classList.add('fade-in');
        }
    });
};

window.addEventListener('scroll', animateOnScroll);
window.addEventListener('load', animateOnScroll);

// ===== Interactive Code Examples =====
document.querySelectorAll('.code-example').forEach(example => {
    example.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.01)';
        this.style.transition = 'transform 0.3s ease';
    });
    
    example.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
});

// ===== Table of Contents Generator (for unit pages) =====
function generateTOC() {
    const mainContent = document.querySelector('.main-content');
    const sidebar = document.querySelector('.sidebar-nav');
    
    if (mainContent && sidebar) {
        const headings = mainContent.querySelectorAll('.topic-section h2');
        
        headings.forEach((heading, index) => {
            const id = `topic-${index}`;
            heading.parentElement.setAttribute('id', id);
            
            const link = document.createElement('a');
            link.href = `#${id}`;
            link.textContent = heading.textContent;
            sidebar.appendChild(link);
        });
    }
}

// ===== Initialize Prism.js for Code Highlighting =====
if (typeof Prism !== 'undefined') {
    Prism.highlightAll();
}

// ===== Keyboard Navigation =====
document.addEventListener('keydown', (e) => {
    // Press 'Home' to go to top
    if (e.key === 'Home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    // Press 'End' to go to bottom
    if (e.key === 'End') {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
});

// ===== Dark Mode Toggle (Optional) =====
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

// Check for saved dark mode preference
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
}

// ===== Quiz System =====
class QuizManager {
    constructor(containerId, questions) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;
        
        this.questions = questions;
        this.currentQuestion = 0;
        this.answers = [];
        this.score = 0;
        this.isReviewMode = false;
        
        this.init();
    }
    
    init() {
        this.renderQuestion();
    }
    
    renderQuestion() {
        const question = this.questions[this.currentQuestion];
        const answered = this.answers[this.currentQuestion] !== undefined;
        
        let html = `
            <div class="quiz-header">
                <h3><i class="fas fa-question-circle"></i> Topic Quiz</h3>
                <div class="quiz-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${((this.currentQuestion + 1) / this.questions.length) * 100}%"></div>
                    </div>
                    <span class="progress-text">${this.currentQuestion + 1} / ${this.questions.length}</span>
                </div>
            </div>
            
            <div class="question-card ${answered ? (this.answers[this.currentQuestion] === question.correct ? 'answered-correct' : 'answered-wrong') : ''}">
                <span class="question-number">Question ${this.currentQuestion + 1}</span>
                <p class="question-text">${question.question}</p>
                
                <div class="options-list">
                    ${question.options.map((option, index) => {
                        let classes = 'option-item';
                        let icon = '';
                        
                        if (answered) {
                            classes += ' disabled';
                            if (index === question.correct) {
                                classes += ' correct';
                                icon = '<i class="fas fa-check option-icon"></i>';
                            } else if (index === this.answers[this.currentQuestion] && index !== question.correct) {
                                classes += ' incorrect';
                                icon = '<i class="fas fa-times option-icon"></i>';
                            }
                        } else if (this.answers[this.currentQuestion] === index) {
                            classes += ' selected';
                        }
                        
                        return `
                            <div class="${classes}" onclick="quiz.selectOption(${index})">
                                <span class="option-letter">${String.fromCharCode(65 + index)}</span>
                                <span class="option-text">${option}</span>
                                ${icon}
                            </div>
                        `;
                    }).join('')}
                </div>
                
                <div class="explanation ${answered ? 'show' : ''}">
                    <h5><i class="fas fa-lightbulb"></i> Explanation</h5>
                    <p>${question.explanation}</p>
                </div>
            </div>
            
            <div class="quiz-navigation">
                <button class="quiz-btn prev-btn" onclick="quiz.prevQuestion()" ${this.currentQuestion === 0 ? 'disabled' : ''}>
                    <i class="fas fa-arrow-left"></i> Previous
                </button>
                
                ${this.currentQuestion === this.questions.length - 1 ? 
                    `<button class="quiz-btn submit-btn" onclick="quiz.showResults()">
                        <i class="fas fa-check-circle"></i> View Results
                    </button>` :
                    `<button class="quiz-btn next-btn" onclick="quiz.nextQuestion()">
                        Next <i class="fas fa-arrow-right"></i>
                    </button>`
                }
            </div>
        `;
        
        this.container.innerHTML = html;
    }
    
    selectOption(index) {
        if (this.answers[this.currentQuestion] !== undefined) return;
        
        this.answers[this.currentQuestion] = index;
        if (index === this.questions[this.currentQuestion].correct) {
            this.score++;
        }
        this.renderQuestion();
    }
    
    nextQuestion() {
        if (this.currentQuestion < this.questions.length - 1) {
            this.currentQuestion++;
            this.renderQuestion();
        }
    }
    
    prevQuestion() {
        if (this.currentQuestion > 0) {
            this.currentQuestion--;
            this.renderQuestion();
        }
    }
    
    showResults() {
        const percentage = Math.round((this.score / this.questions.length) * 100);
        let icon, iconClass, message;
        
        if (percentage >= 90) {
            icon = 'fa-trophy';
            iconClass = 'excellent';
            message = 'Excellent! You\'ve mastered this topic!';
        } else if (percentage >= 70) {
            icon = 'fa-medal';
            iconClass = 'good';
            message = 'Good job! Keep practicing!';
        } else if (percentage >= 50) {
            icon = 'fa-thumbs-up';
            iconClass = 'average';
            message = 'Not bad! Review the topics and try again.';
        } else {
            icon = 'fa-book-reader';
            iconClass = 'poor';
            message = 'Keep learning! Review the material and try again.';
        }
        
        // Save quiz score to progress tracker
        const unitName = document.title.split('-')[0].trim() || 'Quiz';
        ProgressTracker.saveQuizScore(unitName, this.score, this.questions.length);
        
        // Trigger confetti for 80%+ score
        if (percentage >= 80) {
            ConfettiEffect.trigger();
        }
        
        this.container.innerHTML = `
            <div class="quiz-results">
                <div class="results-icon ${iconClass}">
                    <i class="fas ${icon}"></i>
                </div>
                <div class="results-score">${percentage}%</div>
                <p class="results-message">${message}</p>
                
                <div class="results-details">
                    <div class="result-stat correct">
                        <div class="number">${this.score}</div>
                        <div class="label">Correct</div>
                    </div>
                    <div class="result-stat incorrect">
                        <div class="number">${this.questions.length - this.score}</div>
                        <div class="label">Incorrect</div>
                    </div>
                </div>
                
                <button class="retry-btn" onclick="quiz.restart()">
                    <i class="fas fa-redo"></i> Try Again
                </button>
                <button class="review-btn" onclick="quiz.reviewAnswers()">
                    <i class="fas fa-eye"></i> Review Answers
                </button>
            </div>
        `;
    }
    
    restart() {
        this.currentQuestion = 0;
        this.answers = [];
        this.score = 0;
        this.isReviewMode = false;
        this.renderQuestion();
    }
    
    reviewAnswers() {
        this.isReviewMode = true;
        this.currentQuestion = 0;
        this.renderQuestion();
    }
}

// Quiz questions will be defined in each unit page
let quiz;

// ===== Progress Tracker =====
const ProgressTracker = {
    // Save quiz score for a unit
    saveQuizScore(unitName, score, total) {
        const progress = this.getProgress();
        progress.quizScores[unitName] = { score, total, percentage: Math.round((score / total) * 100), date: new Date().toISOString() };
        localStorage.setItem('pythonProgress', JSON.stringify(progress));
        this.updateProgressUI();
    },
    
    // Mark page as visited
    markVisited(pageName) {
        const progress = this.getProgress();
        if (!progress.visitedPages.includes(pageName)) {
            progress.visitedPages.push(pageName);
            localStorage.setItem('pythonProgress', JSON.stringify(progress));
        }
    },
    
    // Get all progress data
    getProgress() {
        const stored = localStorage.getItem('pythonProgress');
        return stored ? JSON.parse(stored) : { quizScores: {}, visitedPages: [] };
    },
    
    // Get overall completion percentage
    getCompletionPercentage() {
        const progress = this.getProgress();
        const totalPages = 11; // All main pages
        return Math.round((progress.visitedPages.length / totalPages) * 100);
    },
    
    // Update progress indicator in navbar
    updateProgressUI() {
        const existing = document.querySelector('.progress-indicator');
        if (existing) existing.remove();
        
        const progress = this.getProgress();
        const quizCount = Object.keys(progress.quizScores).length;
        const visitedCount = progress.visitedPages.length;
        
        if (quizCount > 0 || visitedCount > 1) {
            const indicator = document.createElement('div');
            indicator.className = 'progress-indicator';
            indicator.title = `${visitedCount} pages visited, ${quizCount} quizzes completed`;
            indicator.innerHTML = `<i class="fas fa-chart-line"></i> ${this.getCompletionPercentage()}%`;
            
            const navContainer = document.querySelector('.nav-container');
            if (navContainer) {
                navContainer.insertBefore(indicator, document.querySelector('.theme-toggle'));
            }
        }
    }
};

// Track current page visit
document.addEventListener('DOMContentLoaded', () => {
    const pageName = window.location.pathname.split('/').pop() || 'index.html';
    ProgressTracker.markVisited(pageName);
    ProgressTracker.updateProgressUI();
});

console.log('Python Learning Hub - Loaded Successfully!');
