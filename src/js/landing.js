import { icon } from './icons.js';
import { getAllQuestions, store } from './state.js';
import { escapeHtml } from './utils.js';

export function renderLandingPage() {
  const { units, stats } = store.catalog;
  const featuredQuestions = getAllQuestions().slice(0, 6);
  const isDark = store.theme === 'dark';

  return `
    <div class="landing-page">
      <!-- Top Navigation -->
      <header class="landing-nav">
        <div class="container landing-nav-inner">
          <button class="brand" data-action="navigate" data-route="landing">
            <span class="brand-mark">${icon('graduationCap')}</span>
            <span style="text-align:left">
              <span style="font-size:1.05rem;display:block;line-height:1.1">EXAM TIPS</span>
              <span class="brand-sub">Web Tech LMS</span>
            </span>
          </button>

          <nav class="landing-nav-links" aria-label="Main navigation">
            <a href="#hero">Home</a>
            <a href="#courses">Courses</a>
            <button data-action="navigate" data-route="unit" data-unit="1" data-tab="notes">Study Materials</button>
            <button data-action="navigate" data-route="questions">Important Questions</button>
            <button data-action="navigate" data-route="practice">Practice Tests</button>
            <a href="#why-exam-tips">About</a>
            <a href="#contact">Contact</a>
          </nav>

          <div class="flex items-center gap-2">
            <button class="btn-icon" data-action="toggle-theme" title="Toggle light/dark theme">
              ${icon(isDark ? 'sun' : 'moon', 'icon-sm')}
            </button>
            ${
              store.userProfile
                ? `<button class="btn btn-secondary btn-sm" data-action="navigate" data-route="dashboard">
                    ${escapeHtml(store.userProfile.displayName || store.userProfile.email)}
                  </button>`
                : `<button class="btn btn-secondary btn-sm" data-action="sign-in">${icon('logIn', 'icon-sm')} Sign In</button>`
            }
            <button class="btn btn-primary btn-sm" data-action="navigate" data-route="dashboard">
              Start Learning ${icon('arrowRight', 'icon-sm')}
            </button>
          </div>
        </div>
      </header>

      <!-- Hero Section -->
      <section id="hero" class="hero-section">
        <div class="container hero-grid">
          <div>
            <span class="badge badge-primary">${icon('award', 'icon-sm')} University Web Technology Exam Portal</span>
            <h1 class="hero-title">
              Prepare Smart. <span class="accent">Learn Better.</span> Score Higher.
            </h1>
            <p class="hero-lead">
              Your complete university exam preparation workspace for Web Technology — structured unit-wise notes, 2/5/8/10-mark bilingual exam answers (English &amp; Hinglish), interactive technical SVG diagrams, MCQs, and A4 Print-to-PDF sheets in one fast portal.
            </p>
            <div class="flex items-center gap-3 flex-wrap mt-6">
              <button class="btn btn-primary btn-lg" data-action="navigate" data-route="dashboard">
                Start Learning ${icon('arrowRight')}
              </button>
              <a href="#courses" class="btn btn-secondary btn-lg">
                ${icon('bookOpen')} Explore Courses
              </a>
              <button class="btn btn-soft btn-lg" data-action="navigate" data-route="unit" data-unit="1" data-tab="questions">
                Unit 1 Q&amp;A Bank
              </button>
            </div>

            <!-- KPI Strip -->
            <div class="grid-4 mt-8">
              <div class="stat-card">
                <div class="stat-value">${stats.totalUnits || 5}</div>
                <div class="stat-label">Syllabus Units</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">${stats.totalTopics || 62}</div>
                <div class="stat-label">Detailed Topics</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">${stats.totalQuestions || 44}</div>
                <div class="stat-label">Exam Q&amp;As</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">${stats.totalDiagrams || 32}</div>
                <div class="stat-label">SVG Diagrams</div>
              </div>
            </div>
          </div>

          <div class="hero-image-card">
            <img src="/src/assets/images/hero_exam_prep_portal_1794835991664.jpg" alt="EXAM TIPS Web Technology Learning Workspace" />
            <div class="hero-image-caption">
              <div>
                <strong>Complete 5-Unit Web Tech Syllabus</strong>
                <div class="text-muted" style="font-size:0.76rem">Internet &amp; WWW · HTML5 &amp; CSS3 · JavaScript · Server &amp; DB · Security</div>
              </div>
              <span class="badge badge-emerald">Ready</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Courses & Featured Study Material -->
      <section id="courses" class="section">
        <div class="container">
          <div class="flex items-center justify-between flex-wrap gap-4 mb-6">
            <div>
              <div class="section-kicker">Complete Curriculum</div>
              <h2 class="section-heading">5-Unit Web Technology Study Modules</h2>
              <p class="section-sub">Every unit includes syllabus notes, code examples, interactive architecture diagrams, bilingual exam answers, MCQs, and A4 PDF printing.</p>
            </div>
            <button class="btn btn-secondary" data-action="navigate" data-route="diagrams">
              ${icon('network')} View All ${stats.totalDiagrams || 32} Diagrams
            </button>
          </div>

          <div class="grid-3">
            ${(units || [])
              .map(
                (unit) => `
                <article class="card card-hover flex-col justify-between gap-4">
                  <div>
                    <div class="flex items-center justify-between gap-2 mb-3">
                      <span class="badge badge-primary">UNIT ${unit.unitNumber}</span>
                      <span class="badge">${escapeHtml(unit.examWeight)}</span>
                    </div>
                    <h3 style="font-size:1.12rem">${escapeHtml(unit.title)}</h3>
                    <p class="text-muted" style="font-size:0.85rem;margin-top:6px">${escapeHtml(unit.description)}</p>
                    <div class="flex flex-wrap gap-2 mt-4">
                      <span class="badge">${(unit.topics || []).length} Topics</span>
                      <span class="badge">${(unit.questions || []).length} Q&amp;As</span>
                      <span class="badge">${(unit.mcqs || []).length} MCQs</span>
                      <span class="badge">${(unit.diagrams || []).length} Diagrams</span>
                    </div>
                  </div>
                  <div class="flex items-center gap-2 mt-2">
                    <button class="btn btn-primary btn-sm" style="flex:1" data-action="navigate" data-route="unit" data-unit="${unit.unitNumber}" data-tab="overview">
                      Open Unit ${unit.unitNumber} ${icon('arrowRight', 'icon-sm')}
                    </button>
                    <button class="btn btn-secondary btn-sm" data-action="navigate" data-route="unit" data-unit="${unit.unitNumber}" data-tab="notes">
                      Notes
                    </button>
                  </div>
                </article>
              `
              )
              .join('')}
          </div>
        </div>
      </section>

      <!-- Featured Important Questions -->
      <section class="section section-alt">
        <div class="container">
          <div class="flex items-center justify-between flex-wrap gap-4 mb-6">
            <div>
              <div class="section-kicker">Exam-Oriented Question Bank</div>
              <h2 class="section-heading">High-Frequency University Questions</h2>
              <p class="section-sub">Switch effortlessly between Exam Mode (formal university English) and Learning Mode (easy Hinglish) to master every concept.</p>
            </div>
            <button class="btn btn-primary" data-action="navigate" data-route="questions">
              Explore Full Question Bank ${icon('arrowRight', 'icon-sm')}
            </button>
          </div>

          <div class="grid-2">
            ${featuredQuestions
              .map(
                (q) => `
                <div class="card card-hover">
                  <div class="flex items-center justify-between gap-2 mb-2">
                    <div class="flex items-center gap-2">
                      <span class="badge badge-primary">Unit ${q.unitNumber}</span>
                      <span class="badge badge-amber">${q.marks} Marks</span>
                      <span class="badge">Section ${escapeHtml(q.section)}</span>
                    </div>
                    ${q.hinglishExplanation ? `<span class="badge badge-emerald">English + Hinglish</span>` : ''}
                  </div>
                  <h3 style="font-size:1rem">${escapeHtml(q.questionText)}</h3>
                  <p class="text-muted" style="font-size:0.84rem;margin-top:8px">${escapeHtml((q.introduction || '').slice(0, 145))}...</p>
                  <button class="btn btn-soft btn-sm mt-4" data-action="navigate" data-route="unit" data-unit="${q.unitNumber}" data-tab="questions">
                    Read Full Answer ${icon('arrowRight', 'icon-sm')}
                  </button>
                </div>
              `
              )
              .join('')}
          </div>
        </div>
      </section>

      <!-- Why Choose EXAM TIPS -->
      <section id="why-exam-tips" class="section">
        <div class="container">
          <div class="grid-2 items-center gap-8">
            <div>
              <div class="section-kicker">Why Choose EXAM TIPS</div>
              <h2 class="section-heading">Built Specifically for College Exam Scoring</h2>
              <p class="section-sub">No fluff, no distractions — structured around exactly how university examiners grade 2-mark, 5-mark, and 8/10-mark answers.</p>

              <div class="flex-col gap-4 mt-6">
                <div class="card-muted flex items-start gap-3">
                  <span class="badge badge-primary" style="padding:8px">${icon('languages')}</span>
                  <div>
                    <h4 style="font-size:0.95rem">Dual Answer Modes: Exam English + Learning Hinglish</h4>
                    <p class="text-muted" style="font-size:0.84rem;margin-top:3px">Understand tough protocols in friendly Hinglish, then switch to structured university English with keywords for writing in exams.</p>
                  </div>
                </div>
                <div class="card-muted flex items-start gap-3">
                  <span class="badge badge-emerald" style="padding:8px">${icon('network')}</span>
                  <div>
                    <h4 style="font-size:0.95rem">32 Interactive SVG Technical Diagrams</h4>
                    <p class="text-muted" style="font-size:0.84rem;margin-top:3px">Click steps to highlight packet flows, zoom in for details, or open fullscreen to sketch clean diagrams in your answer booklet.</p>
                  </div>
                </div>
                <div class="card-muted flex items-start gap-3">
                  <span class="badge badge-amber" style="padding:8px">${icon('printer')}</span>
                  <div>
                    <h4 style="font-size:0.95rem">One-Click A4 Print-to-PDF &amp; Offline Notes</h4>
                    <p class="text-muted" style="font-size:0.84rem;margin-top:3px">Print single topics, complete units, or individual Q&amp;As with clean paper-ready typography and diagrams.</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex-col gap-4">
              <div class="hero-image-card">
                <img src="/src/assets/images/unit_architecture_banner_1794835994011.jpg" alt="Technical architecture diagrams" />
              </div>
              <div class="hero-image-card">
                <img src="/src/assets/images/exam_practice_illustration_1794835993350.jpg" alt="MCQ Practice and Timed Mock Exams" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Contact Section -->
      <section id="contact" class="section section-alt">
        <div class="container">
          <div class="grid-2 gap-8 items-start">
            <div>
              <div class="section-kicker">Student Support</div>
              <h2 class="section-heading">Have a Syllabus Question or Suggestion?</h2>
              <p class="section-sub">Send a message directly to the EXAM TIPS course team. Every submission is stored securely in our PostgreSQL database for faculty review.</p>
              <div class="flex-col gap-3 mt-6">
                <div class="card-muted flex items-center gap-3">
                  ${icon('mail')}
                  <div>
                    <strong style="font-size:0.88rem">Direct Academic Inbox</strong>
                    <div class="text-muted" style="font-size:0.8rem">Request extra previous-year questions or diagram clarifications</div>
                  </div>
                </div>
                <div class="card-muted flex items-center gap-3">
                  ${icon('clipboardCheck')}
                  <div>
                    <strong style="font-size:0.88rem">MCQ &amp; Mock Test Feedback</strong>
                    <div class="text-muted" style="font-size:0.8rem">Timed 48-MCQ full syllabus exam simulator included free</div>
                  </div>
                </div>
              </div>
            </div>

            <form id="contact-form" class="card flex-col gap-4" data-action="submit-contact">
              <h3 style="font-size:1.15rem">Send a Message</h3>
              <div>
                <label class="label" for="contact-name">Full Name</label>
                <input id="contact-name" name="name" class="input" type="text" required placeholder="e.g., Priya Sharma" />
              </div>
              <div>
                <label class="label" for="contact-email">College / Personal Email</label>
                <input id="contact-email" name="email" class="input" type="email" required placeholder="student@college.edu" />
              </div>
              <div>
                <label class="label" for="contact-subject">Subject</label>
                <input id="contact-subject" name="subject" class="input" type="text" required placeholder="Unit 1 DNS question or study notes request" />
              </div>
              <div>
                <label class="label" for="contact-message">Message</label>
                <textarea id="contact-message" name="message" class="textarea" required placeholder="Write your question or feedback here..."></textarea>
              </div>
              <div id="contact-feedback" class="hidden"></div>
              <button type="submit" class="btn btn-primary">
                ${icon('mail', 'icon-sm')} Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="landing-footer">
        <div class="container">
          <div class="grid-3 gap-6">
            <div>
              <div class="brand">
                <span class="brand-mark">${icon('graduationCap')}</span>
                <span>EXAM TIPS</span>
              </div>
              <p class="text-muted mt-3" style="font-size:0.85rem">
                Smart Learning &amp; Exam Preparation Portal built with pure HTML5, CSS3, JavaScript, Node.js, and PostgreSQL for college Web Technology students.
              </p>
            </div>
            <div>
              <h4 style="font-size:0.9rem;margin-bottom:10px">Quick Links</h4>
              <div class="flex-col gap-2 text-muted" style="font-size:0.85rem">
                <button style="text-align:left" data-action="navigate" data-route="dashboard">Student Dashboard</button>
                <button style="text-align:left" data-action="navigate" data-route="unit" data-unit="1" data-tab="notes">Unit 1 – Internet &amp; WWW</button>
                <button style="text-align:left" data-action="navigate" data-route="questions">Important Question Bank</button>
                <button style="text-align:left" data-action="navigate" data-route="practice">MCQ Practice &amp; Mock Tests</button>
                <button style="text-align:left" data-action="navigate" data-route="diagrams">Technical Diagrams</button>
              </div>
            </div>
            <div>
              <h4 style="font-size:0.9rem;margin-bottom:10px">Exam Modes</h4>
              <div class="flex-col gap-2 text-muted" style="font-size:0.85rem">
                <span>2 / 5 / 8 / 10 Marks Exam Answers</span>
                <span>Bilingual English + Hinglish Explanations</span>
                <span>Interactive SVG Architecture Flowcharts</span>
                <span>A4 Print-to-PDF Ready Study Sheets</span>
              </div>
            </div>
          </div>
          <div class="mt-8" style="padding-top:18px;border-top:1px solid var(--border);display:flex;justify-content:space-between;flex-wrap:wrap;gap:12px;font-size:0.8rem;color:var(--text-muted)">
            <span>&copy; ${new Date().getFullYear()} EXAM TIPS – Smart Learning &amp; Exam Preparation Portal</span>
            <span>Built with HTML5 · CSS3 · Vanilla JavaScript · PostgreSQL</span>
          </div>
        </div>
      </footer>
    </div>
  `;
}
