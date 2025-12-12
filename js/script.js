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

console.log('Python Learning Hub - Loaded Successfully! 🐍');
