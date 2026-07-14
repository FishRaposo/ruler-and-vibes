(function () {
  'use strict';

  const CONFIG = window.BENCH_CONFIG;
  const DATA = window.BENCH_DATA;
  const S = window.BENCH_SCORING;
  const COLORS = ['#5aa7ff', '#ff776d', '#63d69a', '#be8cff', '#f2bf5b', '#44c7c2', '#f28ad1', '#9bb66c'];
  const VIEW_LABELS = {
    combined: 'Combined ability',
    objective: 'Objective',
    subjective: 'Subjective ability',
    worklog: 'Worklog quality',
  };

  const $ = (selector) => document.querySelector(selector);
  const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character]);
  const fmt = (value) => typeof value === 'number' ? value.toFixed(1) : '—';
  const pct = (value) => typeof value === 'number' ? `${Math.round(value * 100)}%` : '—';

  function showStatus(message, error = false) {
    const element = $('#report-status');
    element.hidden = !message;
    element.textContent = message || '';
    element.classList.toggle('error', error);
  }

  function suiteIds(name) {
    const configured = CONFIG.suites[name];
    return configured === null ? Object.keys(TESTS) : configured;
  }

  function parseHash() {
    const params = new URLSearchParams(location.hash.replace(/^#/, ''));
    const suite = Object.hasOwn(CONFIG.suites, params.get('suite'))
      ? params.get('suite') : CONFIG.defaultSuite;
    const view = Object.hasOwn(VIEW_LABELS, params.get('view')) ? params.get('view') : 'combined';
    return {
      suite,
      view,
      harness: params.get('harness') || 'all',
      effort: params.get('effort') || 'all',
      selected: params.get('selected') || null,
      hidden: new Set((params.get('hidden') || '').split(',').filter(Boolean)),
    };
  }

  const state = parseHash();

  function writeHash() {
    const params = new URLSearchParams();
    params.set('suite', state.suite);
    params.set('view', state.view);
    if (state.harness !== 'all') params.set('harness', state.harness);
    if (state.effort !== 'all') params.set('effort', state.effort);
    if (state.selected) params.set('selected', state.selected);
    if (state.hidden.size) params.set('hidden', [...state.hidden].join(','));
    history.replaceState(null, '', `#${params}`);
  }

  function loadRuns() {
    if (!DATA || DATA.schemaVersion !== 2 || !DATA.runs || typeof DATA.runs !== 'object') return [];
    return Object.entries(DATA.runs).map(([id, run], index) => ({
      id,
      color: COLORS[index % COLORS.length],
      model: run.model || id,
      effort: run.effort || 'unspecified',
      harness: run.harness || 'unspecified',
      date: run.date || '',
      suite: run.suite || null,
      wall_time_min: typeof run.wall_time_min === 'number' ? run.wall_time_min : null,
      approx_cost_usd: typeof run.approx_cost_usd === 'number' ? run.approx_cost_usd : null,
      notes: run.notes || '',
      reviewedBy: run.reviewedBy || null,
      metajudgedBy: run.metajudgedBy || null,
      metajudgedOn: run.metajudgedOn || null,
      tests: run.tests || {},
    }));
  }

  const ALL_RUNS = loadRuns();

  function filteredRuns(includeHidden = false) {
    return ALL_RUNS.filter((run) =>
      (state.harness === 'all' || run.harness === state.harness)
      && (state.effort === 'all' || run.effort === state.effort)
      && (includeHidden || !state.hidden.has(run.id)));
  }

  function displayRuns() {
    const runs = filteredRuns();
    return matchMedia('(max-width: 700px)').matches
      ? runs.filter((run) => run.id === state.selected)
      : runs;
  }

  function ensureSelection() {
    const runs = filteredRuns();
    if (!runs.some((run) => run.id === state.selected)) state.selected = runs[0]?.id || null;
  }

  function runLabel(run) {
    return `${run.model} · ${run.effort} · ${run.harness}`;
  }

  function runStatus(run, ids) {
    return S.reviewStatus(run, ids, TESTS);
  }

  function integrityStatus(run, ids) {
    const entries = ids.map((id) => run.tests[id]).filter(Boolean);
    if (entries.some((entry) => entry.integrity === 'invalidated')) return 'invalidated';
    if (entries.some((entry) => entry.integrity === 'flagged')) return 'flagged';
    return 'clean';
  }

  function statusBadge(status) {
    const icons = {
      single: '○', 'partially-reviewed': '◐', corroborated: '✓', disputed: '△',
      adjudicated: '⚖', provisional: '△', invalidated: '×', flagged: '!', clean: '✓', error: '×',
    };
    return `<span class="badge status-${esc(status)}"><span aria-hidden="true">${icons[status] || '○'}</span>${esc(status.replaceAll('-', ' '))}</span>`;
  }

  function renderControls() {
    const suite = $('#suite');
    suite.innerHTML = Object.keys(CONFIG.suites).map((id) => {
      const count = CONFIG.suites[id] === null ? Object.keys(TESTS).length : CONFIG.suites[id].length;
      return `<option value="${esc(id)}">${esc(id)} (${count})</option>`;
    }).join('');
    suite.value = state.suite;
    $('#view').value = state.view;

    for (const [id, field] of [['harness', 'harness'], ['effort', 'effort']]) {
      const values = [...new Set(ALL_RUNS.map((run) => run[field]))].sort();
      const select = $(`#${id}`);
      select.innerHTML = '<option value="all">All</option>'
        + values.map((value) => `<option value="${esc(value)}">${esc(value)}</option>`).join('');
      if (!values.includes(state[id])) state[id] = 'all';
      select.value = state[id];
    }

    const mobile = $('#mobile-run');
    mobile.innerHTML = filteredRuns().map((run) =>
      `<option value="${esc(run.id)}">${esc(runLabel(run))}</option>`).join('');
    mobile.value = state.selected || '';

    $('#run-toggles').innerHTML = filteredRuns(true).map((run) => `
      <label class="run-toggle" style="--run-color:${run.color}">
        <input type="checkbox" data-run="${esc(run.id)}" ${state.hidden.has(run.id) ? '' : 'checked'}>
        <span class="run-dot" aria-hidden="true"></span>
        <span>${esc(runLabel(run))}</span>
      </label>`).join('');
  }

  function renderSummary() {
    const ids = suiteIds(state.suite);
    const runs = displayRuns();
    if (!runs.length) {
      $('#summary-content').innerHTML = '<p class="empty">No runs match the active filters.</p>';
      return;
    }
    const rows = runs.map((run) => {
      const combined = S.suiteSummary(run, 'combined', ids, TESTS);
      const objective = S.suiteSummary(run, 'objective', ids, TESTS);
      const subjective = S.suiteSummary(run, 'subjective', ids, TESTS);
      const worklog = S.suiteSummary(run, 'worklog', ids, TESTS);
      const judgment = runStatus(run, ids);
      const integrity = integrityStatus(run, ids);
      const provisional = combined.provisional;
      return `<tr>
        <td data-label="Run"><span class="run-name" style="--run-color:${run.color}"><span class="run-dot"></span>${esc(runLabel(run))}</span></td>
        <td data-label="Combined ability" class="score-strong">${fmt(combined.score)}${provisional ? '<span class="provisional-mark" aria-label="provisional"> △</span>' : ''}</td>
        <td data-label="Objective">${fmt(objective.score)}</td>
        <td data-label="Subjective ability">${fmt(subjective.score)}</td>
        <td data-label="Worklog quality">${fmt(worklog.score)}${worklog.disputed ? '<span class="provisional-mark"> △</span>' : ''}</td>
        <td data-label="Coverage">${pct(combined.coverage)} <span class="evidence">${combined.scoredTests}/${combined.expectedTests}</span></td>
        <td data-label="Judgment">${statusBadge(judgment)}</td>
        <td data-label="Integrity">${statusBadge(integrity)}</td>
        <td data-label="Time">${run.wall_time_min === null ? '—' : `${run.wall_time_min}m`}</td>
        <td data-label="Cost">${run.approx_cost_usd === null ? '—' : `$${run.approx_cost_usd.toFixed(2)}`}</td>
      </tr>`;
    }).join('');
    $('#summary-content').innerHTML = `<table class="summary-table">
      <thead><tr><th>Run</th><th>Combined ability</th><th>Objective</th><th>Subjective ability</th><th>Worklog quality</th><th>Coverage</th><th>Judgment</th><th>Integrity</th><th>Time</th><th>Cost</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>`;
  }

  function renderDomainDots() {
    const ids = suiteIds(state.suite);
    const visible = filteredRuns();
    const selectedOnly = matchMedia('(max-width: 700px)').matches;
    const runs = selectedOnly ? visible.filter((run) => run.id === state.selected) : visible;
    if (!runs.length) {
      $('#domains-content').innerHTML = '<p class="empty">No domain evidence for this selection.</p>';
      return;
    }
    if (selectedOnly) {
      const run = runs[0];
      $('#domains-content').innerHTML = CONFIG.domains.map((domain) => {
        const summary = S.domainSummary(run, domain.categories, state.view, ids, TESTS);
        const width = typeof summary.score === 'number' ? summary.score * 10 : 0;
        const statusLabel = summary.provisional ? ' provisional' : '';
        const statusMark = summary.provisional ? '<span class="provisional-mark" aria-label="provisional"> △</span>' : '';
        return `<div class="domain-row"><span class="domain-label">${esc(domain.label)}</span>
          <div class="domain-bar" aria-label="${esc(`${domain.label}: ${fmt(summary.score)}${statusLabel}`)}"><span style="width:${width}%;--run-color:${run.color}"></span><b>${fmt(summary.score)}${statusMark}</b></div></div>`;
      }).join('');
      return;
    }
    $('#domains-content').innerHTML = CONFIG.domains.map((domain) => {
      const points = runs.map((run, index) => {
        const summary = S.domainSummary(run, domain.categories, state.view, ids, TESTS);
        if (summary.score === null) return '';
        const offset = runs.length > 1 ? (index - (runs.length - 1) / 2) * 7 : 0;
        const statusLabel = summary.provisional ? ' provisional' : '';
        const statusMark = summary.provisional ? '<span class="provisional-mark" aria-label="provisional"> △</span>' : '';
        return `<span class="dot" style="--run-color:${run.color};left:${summary.score * 10}%;top:${5 + offset}px" aria-label="${esc(runLabel(run))}: ${fmt(summary.score)}${statusLabel}"></span>
          <span class="dot-value" style="--run-color:${run.color};left:${summary.score * 10}%;top:${-5 + offset}px">${fmt(summary.score)}${statusMark}</span>`;
      }).join('');
      return `<div class="domain-row"><span class="domain-label">${esc(domain.label)}</span><div class="dot-track">${points}</div></div>`;
    }).join('');
  }

  function heatColor(score) {
    if (typeof score !== 'number') return 'transparent';
    const lightness = 14 + score * 3.7;
    return `hsl(181 38% ${lightness}%)`;
  }

  function renderHeatmap() {
    const ids = suiteIds(state.suite);
    const runs = filteredRuns();
    const categories = CONFIG.categories.filter((category) =>
      ids.some((testId) => TESTS[testId]?.category === category.id));
    if (!runs.length) {
      $('#heatmap-content').innerHTML = '<p class="empty">No runs match the active filters.</p>';
      return;
    }
    const head = runs.map((run) =>
      `<th class="${run.id === state.selected ? 'mobile-selected' : ''}">${esc(run.model)}</th>`).join('');
    const body = categories.map((category) => {
      const cells = runs.map((run) => {
        const summary = S.categorySummary(run, category.id, state.view, ids, TESTS);
        const range = summary.range ? ` · range ${fmt(summary.range[0])}–${fmt(summary.range[1])}` : '';
        const depth = summary.formCount > summary.attemptedFacets
          ? ` · depth ${summary.formCount} scored forms (${summary.facetsAtTarget}/${summary.attemptedFacets} at target)`
          : '';
        const evidence = `${summary.attemptedFacets}/${summary.expectedFacets} facets · ${summary.completeForms}/${summary.expectedForms} complete forms${depth}${range}${summary.disputed ? ' · disputed' : ''}`;
        const title = summary.score === null ? 'No data' : `${fmt(summary.score)}; ${evidence}`;
        return `<td class="heat-cell ${run.id === state.selected ? 'mobile-selected' : ''}" style="background:${heatColor(summary.score)}" aria-label="${esc(`${category.label}, ${runLabel(run)}: ${title}`)}">
          ${fmt(summary.score)}<span class="evidence">${evidence}</span>
        </td>`;
      }).join('');
      return `<tr><td>${esc(category.label)}</td>${cells}</tr>`;
    }).join('');
    $('#heatmap-content').innerHTML = `<table class="heat-table"><thead><tr><th>Category</th>${head}</tr></thead><tbody>${body}</tbody></table>`;
  }

  function criterionRows(testId, run, entry) {
    const config = TESTS[testId];
    const objective = (config.objective || []).map(([criterionId, label]) => {
      const value = entry.objective?.[criterionId];
      return `<tr><td><span class="criterion-kind">Objective</span><br>${esc(label)}</td><td>${fmt(value)}</td><td>—</td><td>—</td><td>${fmt(value)}</td><td>${esc(entry.comments?.[criterionId] || '')}</td></tr>`;
    });
    const subjective = (config.subjective || []).map(([criterionId, label]) => {
      const effective = S.effectiveCriterionScore(entry, criterionId);
      const review = entry.reviews?.[criterionId];
      const adjudication = entry.adjudications?.[criterionId];
      const status = effective.status;
      const comments = [entry.comments?.[criterionId], review?.comment, adjudication?.comment].filter(Boolean).join(' · ');
      return `<tr><td><span class="criterion-kind">${criterionId === 'sub-reasoning' ? 'Worklog' : 'Subjective ability'}</span><br>${esc(label)}</td>
        <td>${fmt(effective.primary)}</td><td>${fmt(effective.reviewer)}</td><td>${fmt(effective.adjudicated)}</td><td>${fmt(effective.score)} ${statusBadge(status)}</td><td>${esc(comments)}</td></tr>`;
    });
    return objective.concat(subjective).join('');
  }

  function renderDetails() {
    const ids = suiteIds(state.suite);
    const runs = displayRuns();
    const groups = [];
    for (const testId of ids) {
      const withData = runs.filter((run) => run.tests[testId]);
      if (!withData.length) continue;
      const config = TESTS[testId];
      const bodies = withData.map((run) => {
        const entry = run.tests[testId];
        if (entry.integrity === 'invalidated') {
          return `<div class="test-body"><p>${statusBadge('invalidated')} ${esc(runLabel(run))}: ${esc(entry.integrityNote || 'Invalidated by integrity evidence.')}</p></div>`;
        }
        return `<div class="test-body"><p class="run-name" style="--run-color:${run.color}"><span class="run-dot"></span>${esc(runLabel(run))}</p>
          <div class="table-scroll"><table class="criterion-table"><thead><tr><th>Criterion</th><th>Primary</th><th>Reviewer</th><th>Adjudicator</th><th>Effective</th><th>Evidence</th></tr></thead>
          <tbody>${criterionRows(testId, run, entry)}</tbody></table></div>
          ${entry.note ? `<p class="profile-note">${esc(entry.note)}</p>` : ''}</div>`;
      }).join('');
      groups.push(`<details class="test-group"><summary><span>${esc(config.title)}</span><span class="muted">${esc(config.category)} · ${esc(testId)}</span></summary>${bodies}</details>`);
    }
    $('#details-content').innerHTML = groups.length ? groups.join('') : '<p class="empty">No scored tests in this view.</p>';
  }

  function radarSvg(categories, runs, ids) {
    const width = 720;
    const height = 430;
    const cx = 360;
    const cy = 210;
    const radius = 145;
    const angle = (index) => -Math.PI / 2 + index * Math.PI * 2 / categories.length;
    const point = (index, score) => [cx + Math.cos(angle(index)) * radius * score / 10, cy + Math.sin(angle(index)) * radius * score / 10];
    const rings = [2.5, 5, 7.5, 10].map((value) => `<polygon points="${categories.map((_, index) => point(index, value).join(',')).join(' ')}" fill="none" stroke="#2b3b4a"/>`).join('');
    const axes = categories.map((category, index) => {
      const [x, y] = point(index, 10);
      const [lx, ly] = [cx + Math.cos(angle(index)) * (radius + 34), cy + Math.sin(angle(index)) * (radius + 34)];
      return `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="#2b3b4a"/><text x="${lx}" y="${ly}" text-anchor="middle">${esc(category.label)}</text>`;
    }).join('');
    const series = runs.map((run) => {
      const values = categories.map((category) => S.categorySummary(run, category.id, state.view, ids, TESTS).score);
      if (values.some((v) => v === null)) return '';
      const points = values.map((value, index) => point(index, value).join(',')).join(' ');
      return `<polygon points="${points}" fill="${run.color}22" stroke="${run.color}" stroke-width="2"/><text x="16" y="${28 + runs.indexOf(run) * 18}" fill="${run.color}">${esc(run.model)}</text>`;
    }).join('');
    return `<svg viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="profile-svg-title profile-svg-desc"><title id="profile-svg-title">Workflow category profile</title><desc id="profile-svg-desc">Radar comparison for ${categories.length} categories. Exact values remain available in the heatmap.</desc>${rings}${axes}${series}</svg>`;
  }

  function renderProfile() {
    const ids = suiteIds(state.suite);
    const runs = filteredRuns();
    const categories = CONFIG.categories.filter((category) =>
      ids.some((testId) => TESTS[testId]?.category === category.id));
    if (!runs.length || !categories.length) {
      $('#profile-content').innerHTML = '<p class="empty">No workflow profile for this selection.</p>';
      return;
    }
    const mobile = matchMedia('(max-width: 700px)').matches;
    if (!mobile && categories.length >= 3 && categories.length <= 12) {
      $('#profile-content').innerHTML = radarSvg(categories, runs, ids)
        + '<p class="profile-note">Secondary profile; official suite scores use equal category means.</p>';
      return;
    }
    const selectedRuns = mobile ? runs.filter((run) => run.id === state.selected) : runs;
    $('#profile-content').innerHTML = categories.map((category) => {
      const points = selectedRuns.map((run) => {
        const score = S.categorySummary(run, category.id, state.view, ids, TESTS).score;
        return typeof score === 'number'
          ? `<span class="dot" style="--run-color:${run.color};left:${score * 10}%" aria-label="${esc(`${runLabel(run)} ${fmt(score)}`)}"></span><span class="dot-value" style="--run-color:${run.color};left:${score * 10}%">${fmt(score)}</span>` : '';
      }).join('');
      return `<div class="dot-row"><span>${esc(category.label)}</span><div class="dot-track">${points}</div></div>`;
    }).join('') + '<p class="profile-note">Ordered dots replace dense radars for wide and mobile profiles.</p>';
  }

  function renderAll() {
    ensureSelection();
    renderControls();
    renderSummary();
    renderDomainDots();
    renderHeatmap();
    renderDetails();
    renderProfile();
    writeHash();
  }

  function bindEvents() {
    for (const id of ['suite', 'view', 'harness', 'effort']) {
      $(`#${id}`).addEventListener('change', (event) => {
        state[id] = event.target.value;
        renderAll();
      });
    }
    $('#mobile-run').addEventListener('change', (event) => {
      state.selected = event.target.value;
      renderAll();
    });
    $('#run-toggles').addEventListener('change', (event) => {
      const id = event.target.dataset.run;
      if (!id) return;
      if (event.target.checked) state.hidden.delete(id); else state.hidden.add(id);
      renderAll();
    });
    let mobile = matchMedia('(max-width: 700px)').matches;
    addEventListener('resize', () => {
      const next = matchMedia('(max-width: 700px)').matches;
      if (next !== mobile) {
        mobile = next;
        renderAll();
      }
    });
  }

  function init() {
    if (!CONFIG || !CONFIG.suites || !S || typeof TESTS !== 'object') {
      showStatus('Report configuration is missing or malformed.', true);
      return;
    }
    if (!DATA || DATA.schemaVersion !== 2) {
      showStatus(`Unsupported or missing BENCH_DATA schemaVersion. Expected 2; received ${DATA?.schemaVersion ?? 'none'}.`, true);
      return;
    }
    $('#updated').textContent = `Data updated ${DATA.updated || 'unknown'} · schema v${DATA.schemaVersion}`;
    if (!ALL_RUNS.length) showStatus('No judged runs are available yet.');
    bindEvents();
    renderAll();
  }

  window.BENCH_APP = { init, parseHash, runStatus, integrityStatus, heatColor };
  init();
})();
