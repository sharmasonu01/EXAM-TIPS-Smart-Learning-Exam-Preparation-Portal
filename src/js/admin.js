import { icon } from './icons.js';
import { apiFetch, loadCatalog, notify, store } from './state.js';
import { escapeHtml, showToast } from './utils.js';

export async function loadAdminMeta() {
  if (!store.userProfile || store.userProfile.role !== 'admin') return;
  store.admin.loading = true;
  notify();
  try {
    const overview = await apiFetch('/api/admin/overview');
    store.admin.users = overview.users || [];
    store.admin.messages = overview.messages || [];
  } catch (err) {
    showToast(err.message || 'Could not load admin data.');
  } finally {
    store.admin.loading = false;
    notify();
  }
}

export async function handleAdminDelete(entity, id) {
  try {
    await apiFetch(`/api/admin/${entity}/${id}`, { method: 'DELETE' });
    showToast(`Deleted ${entity.slice(0, -1)} #${id}`);
    await loadCatalog();
  } catch (err) {
    showToast(err.message || 'Delete failed.');
  }
}

export async function handleAdminRoleToggle(userId, nextRole) {
  try {
    await apiFetch(`/api/admin/users/${userId}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role: nextRole }),
    });
    showToast(`Updated user role to ${nextRole}.`);
    await loadAdminMeta();
  } catch (err) {
    showToast(err.message || 'Role update failed.');
  }
}

export async function handleAdminFormSubmit(form) {
  const formType = form.dataset.adminForm;
  const fd = new FormData(form);
  const unitId = Number(fd.get('unitId') || store.admin.selectedUnitId);

  try {
    if (formType === 'topic') {
      const title = String(fd.get('title') || '').trim();
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || `topic-${Date.now()}`;
      await apiFetch('/api/admin/topics', {
        method: 'POST',
        body: JSON.stringify({
          unitId,
          orderIndex: Number(fd.get('orderIndex') || 10),
          slug,
          title,
          definition: String(fd.get('definition') || '').trim(),
          explanation: String(fd.get('explanation') || '').trim(),
          keyTakeaways: String(fd.get('keyTakeaways') || '')
            .split('\n')
            .map((s) => s.trim())
            .filter(Boolean),
          examples: [],
          diagramKey: String(fd.get('diagramKey') || '').trim() || null,
        }),
      });
      showToast('Study topic created!');
    } else if (formType === 'question') {
      const marks = Number(fd.get('marks') || 5);
      await apiFetch('/api/admin/questions', {
        method: 'POST',
        body: JSON.stringify({
          unitId,
          marks,
          section: marks <= 2 ? 'A' : marks <= 5 ? 'B' : 'C',
          questionText: String(fd.get('questionText') || '').trim(),
          practiceBadge: String(fd.get('practiceBadge') || 'Important'),
          introduction: String(fd.get('introduction') || '').trim(),
          mainExplanation: String(fd.get('mainExplanation') || '').trim(),
          examples: String(fd.get('examples') || '').trim(),
          conclusion: String(fd.get('conclusion') || '').trim(),
          keywords: String(fd.get('keywords') || '')
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean),
          hinglishIntro: String(fd.get('hinglishIntro') || '').trim(),
          hinglishExplanation: String(fd.get('hinglishExplanation') || '').trim(),
        }),
      });
      showToast('Exam question added!');
    } else if (formType === 'mcq') {
      await apiFetch('/api/admin/mcqs', {
        method: 'POST',
        body: JSON.stringify({
          unitId,
          questionText: String(fd.get('questionText') || '').trim(),
          options: [
            String(fd.get('opt0') || '').trim(),
            String(fd.get('opt1') || '').trim(),
            String(fd.get('opt2') || '').trim(),
            String(fd.get('opt3') || '').trim(),
          ],
          correctIndex: Number(fd.get('correctIndex') || 0),
          explanation: String(fd.get('explanation') || '').trim(),
          difficulty: String(fd.get('difficulty') || 'Medium'),
        }),
      });
      showToast('MCQ added!');
    } else if (formType === 'diagram') {
      const title = String(fd.get('title') || '').trim();
      await apiFetch('/api/admin/diagrams', {
        method: 'POST',
        body: JSON.stringify({
          unitId,
          diagramKey: String(fd.get('diagramKey') || '').trim() || `custom-${Date.now()}`,
          title,
          category: String(fd.get('category') || 'Architecture').trim(),
          summary: String(fd.get('summary') || '').trim(),
          steps: [
            { step: 1, label: String(fd.get('step1') || 'Input').trim(), detail: 'Primary entry stage' },
            { step: 2, label: String(fd.get('step2') || 'Process').trim(), detail: 'Core protocol / logic' },
            { step: 3, label: String(fd.get('step3') || 'Output').trim(), detail: 'Rendered response' },
          ],
        }),
      });
      showToast('Diagram saved!');
    }

    form.reset();
    await loadCatalog();
  } catch (err) {
    showToast(err.message || 'Save failed.');
  }
}

export function renderAdminPage() {
  if (!store.userProfile || store.userProfile.role !== 'admin') {
    return `
      <div class="card text-center" style="padding:48px">
        <div class="badge badge-rose mb-3">${icon('shield', 'icon-sm')} Admin Access Required</div>
        <h2>Admin Studio is Restricted</h2>
        <p class="text-muted mt-2">Sign in with an authorized administrator account to manage syllabus units, study notes, exam questions, MCQs, and student messages.</p>
        <button class="btn btn-primary mt-4" data-action="sign-in">${icon('logIn', 'icon-sm')} Sign In with Google</button>
      </div>
    `;
  }

  const units = store.catalog.units || [];
  const selectedUnit =
    units.find((u) => u.id === Number(store.admin.selectedUnitId)) || units[0] || null;
  const tab = store.admin.tab || 'units';

  const tabs = [
    { key: 'units', label: `Units (${units.length})` },
    { key: 'topics', label: 'Study Notes' },
    { key: 'questions', label: 'Exam Q&As' },
    { key: 'mcqs', label: 'MCQs' },
    { key: 'diagrams', label: 'Diagrams' },
    { key: 'users', label: `Users (${store.admin.users.length}) & Inbox (${store.admin.messages.length})` },
  ];

  const unitSelector = `
    <div class="flex items-center gap-2">
      <label class="text-muted" style="font-size:0.82rem;font-weight:600">Manage Unit:</label>
      <select class="select" style="width:auto" data-change-action="admin-unit-select">
        ${units
          .map(
            (u) =>
              `<option value="${u.id}" ${selectedUnit && u.id === selectedUnit.id ? 'selected' : ''}>Unit ${u.unitNumber}: ${escapeHtml(u.title)}</option>`
          )
          .join('')}
      </select>
    </div>
  `;

  let body = '';

  if (tab === 'units') {
    body = `
      <div class="table-wrap card" style="padding:0">
        <table class="data-table">
          <thead>
            <tr>
              <th>Unit</th>
              <th>Title</th>
              <th>Weight</th>
              <th>Topics</th>
              <th>Questions</th>
              <th>MCQs</th>
              <th>Diagrams</th>
            </tr>
          </thead>
          <tbody>
            ${units
              .map(
                (u) => `
                <tr>
                  <td><span class="badge badge-primary">Unit ${u.unitNumber}</span></td>
                  <td><strong>${escapeHtml(u.title)}</strong><div class="text-muted" style="font-size:0.78rem">${escapeHtml(u.subtitle)}</div></td>
                  <td>${escapeHtml(u.examWeight)}</td>
                  <td>${(u.topics || []).length}</td>
                  <td>${(u.questions || []).length}</td>
                  <td>${(u.mcqs || []).length}</td>
                  <td>${(u.diagrams || []).length}</td>
                </tr>
              `
              )
              .join('')}
          </tbody>
        </table>
      </div>
    `;
  } else if (tab === 'topics' && selectedUnit) {
    body = `
      <div class="grid-2 items-start">
        <form class="card flex-col gap-3" data-action="admin-submit" data-admin-form="topic">
          <h3 style="font-size:1.05rem">Add Study Topic to Unit ${selectedUnit.unitNumber}</h3>
          <input type="hidden" name="unitId" value="${selectedUnit.id}" />
          <div><label class="label">Topic Title</label><input class="input" name="title" required placeholder="e.g., WebSockets & Real-Time HTTP" /></div>
          <div><label class="label">Order Index</label><input class="input" name="orderIndex" type="number" value="${(selectedUnit.topics || []).length + 1}" /></div>
          <div><label class="label">Exam Definition</label><textarea class="textarea" name="definition" required></textarea></div>
          <div><label class="label">Explanation Paragraphs (one per line)</label><textarea class="textarea" name="explanation" required></textarea></div>
          <div><label class="label">Key Takeaways (one per line)</label><textarea class="textarea" name="keyTakeaways"></textarea></div>
          <button type="submit" class="btn btn-primary btn-sm">${icon('plus', 'icon-sm')} Save Topic</button>
        </form>

        <div class="card">
          <h3 style="font-size:1.05rem;margin-bottom:12px">Existing Topics (${(selectedUnit.topics || []).length})</h3>
          <div class="flex-col gap-2">
            ${(selectedUnit.topics || [])
              .map(
                (t) => `
                <div class="card-muted flex items-center justify-between gap-2" style="padding:10px 12px">
                  <div>
                    <strong style="font-size:0.86rem">${t.orderIndex}. ${escapeHtml(t.title)}</strong>
                    <div class="text-muted" style="font-size:0.76rem">${escapeHtml((t.definition || '').slice(0, 75))}...</div>
                  </div>
                  <button class="btn btn-danger btn-sm" data-action="admin-delete" data-entity="topics" data-id="${t.id}">${icon('trash', 'icon-sm')}</button>
                </div>
              `
              )
              .join('')}
          </div>
        </div>
      </div>
    `;
  } else if (tab === 'questions' && selectedUnit) {
    body = `
      <div class="grid-2 items-start">
        <form class="card flex-col gap-3" data-action="admin-submit" data-admin-form="question">
          <h3 style="font-size:1.05rem">Add Exam Question to Unit ${selectedUnit.unitNumber}</h3>
          <input type="hidden" name="unitId" value="${selectedUnit.id}" />
          <div><label class="label">Question Text</label><input class="input" name="questionText" required /></div>
          <div class="grid-2" style="gap:10px">
            <div>
              <label class="label">Marks</label>
              <select class="select" name="marks">
                <option value="2">2 Marks (Section A)</option>
                <option value="5" selected>5 Marks (Section B)</option>
                <option value="8">8 Marks (Section C)</option>
                <option value="10">10 Marks (Section C)</option>
              </select>
            </div>
            <div><label class="label">Badge</label><input class="input" name="practiceBadge" value="University Exam" /></div>
          </div>
          <div><label class="label">Introduction</label><textarea class="textarea" name="introduction" required></textarea></div>
          <div><label class="label">Detailed Points (one per line)</label><textarea class="textarea" name="mainExplanation" required></textarea></div>
          <div><label class="label">Conclusion</label><input class="input" name="conclusion" required /></div>
          <div><label class="label">Keywords (comma-separated)</label><input class="input" name="keywords" placeholder="HTTP, Stateless, Request" /></div>
          <div><label class="label">Learning Mode Hinglish (Optional)</label><textarea class="textarea" name="hinglishExplanation" placeholder="Simple Hinglish explanation..."></textarea></div>
          <button type="submit" class="btn btn-primary btn-sm">${icon('plus', 'icon-sm')} Save Question</button>
        </form>

        <div class="card">
          <h3 style="font-size:1.05rem;margin-bottom:12px">Existing Questions (${(selectedUnit.questions || []).length})</h3>
          <div class="flex-col gap-2">
            ${(selectedUnit.questions || [])
              .map(
                (q) => `
                <div class="card-muted flex items-center justify-between gap-2" style="padding:10px 12px">
                  <div>
                    <span class="badge badge-amber">${q.marks}M</span>
                    <strong style="font-size:0.84rem;margin-left:6px">${escapeHtml(q.questionText)}</strong>
                  </div>
                  <button class="btn btn-danger btn-sm" data-action="admin-delete" data-entity="questions" data-id="${q.id}">${icon('trash', 'icon-sm')}</button>
                </div>
              `
              )
              .join('')}
          </div>
        </div>
      </div>
    `;
  } else if (tab === 'mcqs' && selectedUnit) {
    body = `
      <div class="grid-2 items-start">
        <form class="card flex-col gap-3" data-action="admin-submit" data-admin-form="mcq">
          <h3 style="font-size:1.05rem">Add MCQ to Unit ${selectedUnit.unitNumber}</h3>
          <input type="hidden" name="unitId" value="${selectedUnit.id}" />
          <div><label class="label">Question</label><input class="input" name="questionText" required /></div>
          <div class="grid-2" style="gap:10px">
            <div><label class="label">Option A</label><input class="input" name="opt0" required /></div>
            <div><label class="label">Option B</label><input class="input" name="opt1" required /></div>
            <div><label class="label">Option C</label><input class="input" name="opt2" required /></div>
            <div><label class="label">Option D</label><input class="input" name="opt3" required /></div>
          </div>
          <div class="grid-2" style="gap:10px">
            <div>
              <label class="label">Correct Option</label>
              <select class="select" name="correctIndex">
                <option value="0">Option A</option>
                <option value="1">Option B</option>
                <option value="2">Option C</option>
                <option value="3">Option D</option>
              </select>
            </div>
            <div>
              <label class="label">Difficulty</label>
              <select class="select" name="difficulty">
                <option value="Easy">Easy</option>
                <option value="Medium" selected>Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>
          <div><label class="label">Explanation</label><textarea class="textarea" name="explanation" required></textarea></div>
          <button type="submit" class="btn btn-primary btn-sm">${icon('plus', 'icon-sm')} Save MCQ</button>
        </form>

        <div class="card">
          <h3 style="font-size:1.05rem;margin-bottom:12px">Existing MCQs (${(selectedUnit.mcqs || []).length})</h3>
          <div class="flex-col gap-2">
            ${(selectedUnit.mcqs || [])
              .map(
                (m) => `
                <div class="card-muted flex items-center justify-between gap-2" style="padding:10px 12px">
                  <div style="font-size:0.84rem"><strong>${escapeHtml(m.questionText)}</strong></div>
                  <button class="btn btn-danger btn-sm" data-action="admin-delete" data-entity="mcqs" data-id="${m.id}">${icon('trash', 'icon-sm')}</button>
                </div>
              `
              )
              .join('')}
          </div>
        </div>
      </div>
    `;
  } else if (tab === 'diagrams' && selectedUnit) {
    body = `
      <div class="grid-2 items-start">
        <form class="card flex-col gap-3" data-action="admin-submit" data-admin-form="diagram">
          <h3 style="font-size:1.05rem">Add Technical Diagram to Unit ${selectedUnit.unitNumber}</h3>
          <input type="hidden" name="unitId" value="${selectedUnit.id}" />
          <div><label class="label">Title</label><input class="input" name="title" required /></div>
          <div class="grid-2" style="gap:10px">
            <div><label class="label">Diagram Key</label><input class="input" name="diagramKey" required placeholder="u1-custom-flow" /></div>
            <div><label class="label">Category</label><input class="input" name="category" value="Architecture" /></div>
          </div>
          <div><label class="label">Summary</label><textarea class="textarea" name="summary" required></textarea></div>
          <div class="grid-3" style="gap:8px">
            <div><label class="label">Step 1</label><input class="input" name="step1" value="Client Request" /></div>
            <div><label class="label">Step 2</label><input class="input" name="step2" value="Server Process" /></div>
            <div><label class="label">Step 3</label><input class="input" name="step3" value="Response" /></div>
          </div>
          <button type="submit" class="btn btn-primary btn-sm">${icon('plus', 'icon-sm')} Save Diagram</button>
        </form>

        <div class="card">
          <h3 style="font-size:1.05rem;margin-bottom:12px">Existing Diagrams (${(selectedUnit.diagrams || []).length})</h3>
          <div class="flex-col gap-2">
            ${(selectedUnit.diagrams || [])
              .map(
                (d) => `
                <div class="card-muted flex items-center justify-between gap-2" style="padding:10px 12px">
                  <div>
                    <strong style="font-size:0.86rem">${escapeHtml(d.title)}</strong>
                    <div class="text-muted font-mono" style="font-size:0.74rem">${escapeHtml(d.diagramKey)} · ${escapeHtml(d.category)}</div>
                  </div>
                  <button class="btn btn-danger btn-sm" data-action="admin-delete" data-entity="diagrams" data-id="${d.id}">${icon('trash', 'icon-sm')}</button>
                </div>
              `
              )
              .join('')}
          </div>
        </div>
      </div>
    `;
  } else if (tab === 'users') {
    body = `
      <div class="grid-2 items-start">
        <div class="card">
          <div class="flex items-center justify-between mb-3">
            <h3 style="font-size:1.05rem">Registered Students &amp; Admins (${store.admin.users.length})</h3>
            <button class="btn btn-secondary btn-sm" data-action="admin-refresh">${icon('rotateCcw', 'icon-sm')} Refresh</button>
          </div>
          <div class="flex-col gap-2">
            ${store.admin.users
              .map(
                (u) => `
                <div class="card-muted flex items-center justify-between gap-3" style="padding:10px 12px">
                  <div>
                    <strong style="font-size:0.86rem">${escapeHtml(u.displayName || u.email)}</strong>
                    <div class="text-muted" style="font-size:0.76rem">${escapeHtml(u.email)}</div>
                  </div>
                  <button
                    class="btn btn-sm ${u.role === 'admin' ? 'btn-soft' : 'btn-secondary'}"
                    data-action="admin-toggle-role"
                    data-user-id="${u.id}"
                    data-next-role="${u.role === 'admin' ? 'student' : 'admin'}"
                  >${escapeHtml(u.role)}</button>
                </div>
              `
              )
              .join('') || `<p class="text-muted">No users loaded yet.</p>`}
          </div>
        </div>

        <div class="card">
          <h3 style="font-size:1.05rem;margin-bottom:12px">Contact Form Inbox (${store.admin.messages.length})</h3>
          <div class="flex-col gap-3">
            ${store.admin.messages
              .map(
                (m) => `
                <div class="card-muted">
                  <div class="flex items-center justify-between gap-2">
                    <strong style="font-size:0.88rem">${escapeHtml(m.subject)}</strong>
                    <span class="badge">${escapeHtml(m.name)}</span>
                  </div>
                  <div class="text-muted" style="font-size:0.75rem">${escapeHtml(m.email)}</div>
                  <p class="mt-2" style="font-size:0.84rem">${escapeHtml(m.message)}</p>
                </div>
              `
              )
              .join('') || `<p class="text-muted">No student messages yet.</p>`}
          </div>
        </div>
      </div>
    `;
  }

  return `
    <div class="flex-col gap-5">
      <div class="flex items-center justify-between flex-wrap gap-3">
        <div>
          <span class="badge badge-indigo">${icon('shield', 'icon-sm')} Role-Based Admin Studio</span>
          <h1 style="font-size:1.6rem;margin-top:6px">Curriculum &amp; Student Management</h1>
        </div>
        ${tab !== 'units' && tab !== 'users' ? unitSelector : ''}
      </div>

      <div class="tab-bar">
        ${tabs
          .map(
            (t) => `
            <button class="tab-btn ${tab === t.key ? 'active' : ''}" data-action="admin-tab" data-tab="${t.key}">
              ${escapeHtml(t.label)}
            </button>
          `
          )
          .join('')}
      </div>

      ${body}
    </div>
  `;
}
