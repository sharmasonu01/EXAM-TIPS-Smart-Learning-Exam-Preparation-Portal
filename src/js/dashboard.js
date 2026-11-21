import { icon } from './icons.js';
import { getAllQuestions, store } from './state.js';
import { escapeHtml } from './utils.js';

export function renderDashboardPage() {
  const { units, stats } = store.catalog;
  const student = store.studentState;

  const totalTopics = stats.totalTopics || (units || []).reduce((acc, u) => acc + (u.topics?.length || 0), 0);
  const completedCount = student.completedTopicIds.length;
  const overallPercent = totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0;

  // Map topicId -> { topic, unit }
  const topicLookup = new Map();
  (units || []).forEach((u) => {
    (u.topics || []).forEach((t) => topicLookup.set(t.id, { topic: t, unit: u }));
  });

  const recentViewed = (student.viewedTopics || [])
    .map((v) => ({ ...v, ...(topicLookup.get(v.topicId) || {}) }))
    .filter((x) => x.topic)
    .slice(0, 5);

  const continueEntry = recentViewed[0] || (units?.[0]?.topics?.[0] ? { unit: units[0], topic: units[0].topics[0] } : null);

  const allQuestions = getAllQuestions();
  const bookmarkedQuestions = allQuestions.filter((q) => student.bookmarkedQuestionIds.includes(q.id));
  const importantQuestions = allQuestions.filter((q) => student.importantQuestionIds.includes(q.id));
  const latestAttempts = (student.quizAttempts || []).slice(0, 4);

  const greetingName = store.userProfile?.displayName || 'Student';

  return `
    <div class="flex-col gap-6">
      <!-- Welcome Banner -->
      <div class="card" style="background:linear-gradient(135deg, var(--primary-soft), var(--surface));border-color:var(--primary-border)">
        <div class="flex items-center justify-between flex-wrap gap-4">
          <div>
            <span class="badge badge-primary">LMS Student Dashboard</span>
            <h1 style="font-size:1.65rem;margin-top:8px">Welcome back, ${escapeHtml(greetingName)}</h1>
            <p class="text-secondary mt-2" style="max-width:620px;font-size:0.92rem">
              Track your unit-wise Web Technology syllabus coverage, revise bookmarked exam questions, and test your readiness with timed MCQs.
            </p>
          </div>
          <div class="flex items-center gap-3 flex-wrap">
            ${
              continueEntry
                ? `<button class="btn btn-primary" data-action="navigate" data-route="unit" data-unit="${continueEntry.unit.unitNumber}" data-tab="notes" data-topic-id="${continueEntry.topic.id}">
                    Continue Learning ${icon('arrowRight', 'icon-sm')}
                  </button>`
                : ''
            }
            ${
              !store.userProfile
                ? `<button class="btn btn-secondary" data-action="sign-in">${icon('logIn', 'icon-sm')} Sign In to Sync Cloud Progress</button>`
                : `<span class="badge badge-emerald">${icon('checkCircle', 'icon-sm')} Cloud Sync Active</span>`
            }
          </div>
        </div>
      </div>

      <!-- KPI Summary Row -->
      <div class="grid-4">
        <div class="stat-card">
          <div class="flex items-center justify-between">
            <span class="text-muted" style="font-size:0.8rem">Total Units</span>
            <span class="badge badge-primary">${icon('layers', 'icon-sm')}</span>
          </div>
          <div class="stat-value mt-2">${units.length || 5}</div>
          <div class="stat-label">${totalTopics} structured topics</div>
        </div>

        <div class="stat-card">
          <div class="flex items-center justify-between">
            <span class="text-muted" style="font-size:0.8rem">Completed Lessons</span>
            <span class="badge badge-emerald">${icon('checkCircle', 'icon-sm')}</span>
          </div>
          <div class="stat-value mt-2">${completedCount} / ${totalTopics}</div>
          <div class="progress-track mt-2"><div class="progress-fill progress-fill-emerald" style="width:${overallPercent}%"></div></div>
        </div>

        <div class="stat-card">
          <div class="flex items-center justify-between">
            <span class="text-muted" style="font-size:0.8rem">Overall Progress</span>
            <span class="badge badge-indigo">${icon('award', 'icon-sm')}</span>
          </div>
          <div class="stat-value mt-2">${overallPercent}%</div>
          <div class="stat-label">${student.completedQuestionIds.length} exam Q&amp;As mastered</div>
        </div>

        <div class="stat-card">
          <div class="flex items-center justify-between">
            <span class="text-muted" style="font-size:0.8rem">Saved Items</span>
            <span class="badge badge-amber">${icon('bookmark', 'icon-sm')}</span>
          </div>
          <div class="stat-value mt-2">${bookmarkedQuestions.length + student.bookmarkedTopicIds.length}</div>
          <div class="stat-label">${importantQuestions.length} marked important</div>
        </div>
      </div>

      <!-- Unit-Wise Progress Grid -->
      <section>
        <div class="flex items-center justify-between mb-3">
          <h2 style="font-size:1.2rem">Unit-Wise Study Roadmap</h2>
          <button class="btn btn-ghost btn-sm" data-action="navigate" data-route="practice">
            Open Practice Tests ${icon('arrowRight', 'icon-sm')}
          </button>
        </div>

        <div class="grid-3">
          ${(units || [])
            .map((unit) => {
              const uTopics = unit.topics || [];
              const uDone = uTopics.filter((t) => student.completedTopicIds.includes(t.id)).length;
              const pct = uTopics.length ? Math.round((uDone / uTopics.length) * 100) : 0;
              return `
                <div class="card card-hover flex-col justify-between gap-4">
                  <div>
                    <div class="flex items-center justify-between gap-2 mb-2">
                      <span class="badge badge-primary">UNIT ${unit.unitNumber}</span>
                      <span class="font-mono text-muted" style="font-size:0.75rem">${escapeHtml(unit.examWeight)}</span>
                    </div>
                    <h3 style="font-size:1.05rem">${escapeHtml(unit.title)}</h3>
                    <p class="text-muted" style="font-size:0.82rem;margin-top:4px">${escapeHtml(unit.subtitle)}</p>

                    <div class="mt-4">
                      <div class="flex justify-between" style="font-size:0.78rem;margin-bottom:5px">
                        <span class="text-muted">${uDone} of ${uTopics.length} lessons completed</span>
                        <strong>${pct}%</strong>
                      </div>
                      <div class="progress-track">
                        <div class="progress-fill" style="width:${pct}%"></div>
                      </div>
                    </div>
                  </div>

                  <div class="flex items-center gap-2 flex-wrap">
                    <button class="btn btn-primary btn-sm" style="flex:1" data-action="navigate" data-route="unit" data-unit="${unit.unitNumber}" data-tab="notes">
                      Study Notes
                    </button>
                    <button class="btn btn-secondary btn-sm" data-action="navigate" data-route="unit" data-unit="${unit.unitNumber}" data-tab="questions">
                      Q&amp;As (${(unit.questions || []).length})
                    </button>
                    <button class="btn btn-secondary btn-sm" data-action="navigate" data-route="unit" data-unit="${unit.unitNumber}" data-tab="mcq">
                      MCQ
                    </button>
                  </div>
                </div>
              `;
            })
            .join('')}
        </div>
      </section>

      <!-- Bottom Split: Recently Viewed + Bookmarked Questions + Recent Tests -->
      <div class="grid-2">
        <!-- Recently Viewed Notes -->
        <div class="card">
          <div class="flex items-center justify-between mb-3">
            <h3 style="font-size:1.05rem">Recently Viewed Notes</h3>
            <span class="badge">${recentViewed.length} items</span>
          </div>
          ${
            recentViewed.length > 0
              ? `<div class="flex-col gap-2">
                  ${recentViewed
                    .map(
                      (item) => `
                      <button class="card-muted flex items-center justify-between gap-3" style="padding:11px 14px;text-align:left;width:100%" data-action="navigate" data-route="unit" data-unit="${item.unit.unitNumber}" data-tab="notes" data-topic-id="${item.topic.id}">
                        <div>
                          <div style="font-size:0.88rem;font-weight:600">${escapeHtml(item.topic.title)}</div>
                          <div class="text-muted" style="font-size:0.76rem">Unit ${item.unit.unitNumber} · ${escapeHtml(item.unit.title)}</div>
                        </div>
                        ${icon('arrowRight', 'icon-sm')}
                      </button>
                    `
                    )
                    .join('')}
                </div>`
              : `<div class="card-muted text-center" style="padding:26px">
                  <p class="text-muted" style="font-size:0.86rem">You haven't opened a note yet. Start with Unit 1 – History of the Internet!</p>
                  <button class="btn btn-soft btn-sm mt-3" data-action="navigate" data-route="unit" data-unit="1" data-tab="notes">
                    Open Unit 1 Notes
                  </button>
                </div>`
          }
        </div>

        <!-- Bookmarked Questions & Quiz History -->
        <div class="card">
          <div class="flex items-center justify-between mb-3">
            <h3 style="font-size:1.05rem">Bookmarked Exam Questions</h3>
            <button class="btn btn-ghost btn-sm" data-action="navigate" data-route="questions">View All</button>
          </div>
          ${
            bookmarkedQuestions.length > 0
              ? `<div class="flex-col gap-2">
                  ${bookmarkedQuestions
                    .slice(0, 4)
                    .map(
                      (q) => `
                      <button class="card-muted flex items-center justify-between gap-3" style="padding:11px 14px;text-align:left;width:100%" data-action="navigate" data-route="unit" data-unit="${q.unitNumber}" data-tab="questions">
                        <div>
                          <div style="font-size:0.86rem;font-weight:600">${escapeHtml(q.questionText)}</div>
                          <div class="text-muted" style="font-size:0.75rem">Unit ${q.unitNumber} · ${q.marks} Marks · Section ${escapeHtml(q.section)}</div>
                        </div>
                        <span class="badge badge-amber">${q.marks}M</span>
                      </button>
                    `
                    )
                    .join('')}
                </div>`
              : `<div class="card-muted text-center" style="padding:26px">
                  <p class="text-muted" style="font-size:0.86rem">Bookmark tough 5-mark &amp; 10-mark questions for quick exam-night revision.</p>
                  <button class="btn btn-soft btn-sm mt-3" data-action="navigate" data-route="questions">
                    Browse Question Bank
                  </button>
                </div>`
          }

          ${
            latestAttempts.length > 0
              ? `
                <div class="mt-6" style="padding-top:16px;border-top:1px solid var(--border)">
                  <h4 style="font-size:0.9rem;margin-bottom:10px">Recent MCQ Test Scores</h4>
                  <div class="flex-col gap-2">
                    ${latestAttempts
                      .map((a) => {
                        const pct = a.total > 0 ? Math.round((a.score / a.total) * 100) : 0;
                        return `
                          <div class="flex items-center justify-between" style="font-size:0.82rem;padding:7px 10px;border-radius:8px;background:var(--surface-subtle);border:1px solid var(--border)">
                            <span>${a.unitNumber ? `Unit ${a.unitNumber}` : 'All Units'} · ${escapeHtml(a.mode || 'practice')}</span>
                            <span class="badge ${pct >= 70 ? 'badge-emerald' : 'badge-amber'}">${a.score}/${a.total} (${pct}%)</span>
                          </div>
                        `;
                      })
                      .join('')}
                  </div>
                </div>
              `
              : ''
          }
        </div>
      </div>
    </div>
  `;
}
