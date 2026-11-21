// Shared HTML escaping, clipboard, timer, toast, and download/print utilities

export function escapeHtml(value) {
  if (value === null || value === undefined) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function formatTimer(totalSeconds) {
  const s = Math.max(0, Number(totalSeconds) || 0);
  const mins = Math.floor(s / 60);
  const secs = s % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function showToast(message) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container no-print';
    document.body.appendChild(container);
  }
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = message;
  container.appendChild(el);
  setTimeout(() => {
    el.remove();
  }, 3000);
}

export async function copyTextToClipboard(text, successMsg = 'Copied to clipboard!') {
  try {
    await navigator.clipboard.writeText(text);
    showToast(successMsg);
  } catch {
    const area = document.createElement('textarea');
    area.value = text;
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    document.execCommand('copy');
    area.remove();
    showToast(successMsg);
  }
}

export function downloadTextFile(filename, content) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  showToast(`Downloaded ${filename}`);
}

export function toParagraphs(value) {
  if (Array.isArray(value)) return value.map((s) => String(s).trim()).filter(Boolean);
  if (typeof value === 'string') {
    return value
      .split(/\n+/)
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

export function formatQuestionAsText(q, mode = 'exam') {
  const lines = [
    `EXAM TIPS – Web Technology Study Material`,
    `============================================================`,
    `Question (${q.marks} Marks | Section ${q.section}): ${q.questionText}`,
    ``,
  ];

  if (mode === 'learning' && q.hinglishExplanation) {
    lines.push(`LEARNING MODE (HINGLISH EXPLANATION):`);
    if (q.hinglishIntro) lines.push(`Intro: ${q.hinglishIntro}`, '');
    lines.push(q.hinglishExplanation, '');
    if (q.hinglishExample) lines.push(`Example: ${q.hinglishExample}`, '');
    if (q.hinglishConclusion) lines.push(`Takeaway: ${q.hinglishConclusion}`, '');
  } else {
    lines.push(`1. INTRODUCTION:`, q.introduction, '');
    lines.push(`2. DETAILED EXPLANATION:`);
    toParagraphs(q.mainExplanation).forEach((p, idx) => lines.push(`   ${idx + 1}. ${p}`));
    lines.push('');
    const exList = toParagraphs(q.examples);
    if (exList.length > 0) {
      lines.push(`3. EXAMPLES:`);
      exList.forEach((ex) => lines.push(`   - ${ex}`));
      lines.push('');
    }
    if ((q.advantages || []).length > 0) {
      lines.push(`4. ADVANTAGES:`);
      q.advantages.forEach((a) => lines.push(`   + ${a}`));
      lines.push('');
    }
    if ((q.disadvantages || []).length > 0) {
      lines.push(`5. DISADVANTAGES:`);
      q.disadvantages.forEach((d) => lines.push(`   - ${d}`));
      lines.push('');
    }
    lines.push(`CONCLUSION:`, q.conclusion, '');
  }

  if ((q.keywords || []).length > 0) {
    lines.push(`IMPORTANT KEYWORDS: ${q.keywords.join(', ')}`);
  }

  return lines.join('\n');
}

export function formatUnitStudyMaterialText(unit) {
  const lines = [
    `====================================================================`,
    `EXAM TIPS – WEB TECHNOLOGY COMPLETE STUDY MATERIAL`,
    `UNIT ${unit.unitNumber}: ${unit.title.toUpperCase()}`,
    `${unit.subtitle}`,
    `Exam Weightage: ${unit.examWeight} | Estimated Study Time: ${unit.estimatedHours} hrs`,
    `====================================================================`,
    ``,
    `SYLLABUS TOPICS:`,
    ...(unit.syllabus || []).map((s, i) => `  ${i + 1}. ${s}`),
    ``,
    `--------------------------------------------------------------------`,
    `COMPLETE TOPIC-WISE NOTES`,
    `--------------------------------------------------------------------`,
  ];

  (unit.topics || []).forEach((t, idx) => {
    lines.push(``, `${idx + 1}. ${t.title.toUpperCase()}`);
    lines.push(`Definition: ${t.definition}`, '');
    toParagraphs(t.explanation).forEach((p) => lines.push(`  • ${p}`));
    if ((t.keyTakeaways || []).length) {
      lines.push(`  Key Exam Takeaways:`);
      t.keyTakeaways.forEach((k) => lines.push(`    - ${k}`));
    }
  });

  lines.push(
    ``,
    `--------------------------------------------------------------------`,
    `IMPORTANT EXAM QUESTIONS & ANSWERS (${(unit.questions || []).length} Questions)`,
    `--------------------------------------------------------------------`
  );

  (unit.questions || []).forEach((q, idx) => {
    lines.push(``, `Q${idx + 1} [${q.marks} Marks | Section ${q.section}]: ${q.questionText}`);
    lines.push(`Introduction: ${q.introduction}`);
    toParagraphs(q.mainExplanation).forEach((p) => lines.push(`  - ${p}`));
    lines.push(`Conclusion: ${q.conclusion}`);
    if ((q.keywords || []).length) {
      lines.push(`Keywords: ${q.keywords.join(', ')}`);
    }
  });

  lines.push(
    ``,
    `--------------------------------------------------------------------`,
    `QUICK REVISION POINTS`,
    `--------------------------------------------------------------------`,
    ...(unit.quickRevision || []).map((r, i) => `  ${i + 1}. ${r}`)
  );

  return lines.join('\n');
}
