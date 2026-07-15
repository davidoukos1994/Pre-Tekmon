const STORAGE_KEY = 'preTekmonMeasurementsV1';
const THEME_KEY = 'preTekmonTheme';
const DRAFT_KEY = 'preTekmonCurrentDraftV1';
const LAST_SAVED_KEY = 'preTekmonLastSavedIdV1';

const sections = [
  {
    title: 'Γενικές μετρήσεις',
    groups: [
      { title: '', fields: [
        'A/C ηλεκτρολύτη', 'Δεξαμενές υδροχ/ΑΒ', 'Δεξαμενή Σόδας Α', 'Στρατσώνα', 'Ηλεκτροβάνα'
      ]}
    ]
  },
  {
    title: 'Νερό ψυκτικού – Γλυκόλη',
    groups: [
      { title: '', fields: ['Γλυκόλη Αντλ. 302', 'Γλυκόλη Αντλ. 303', 'Στάθμη δεξαμενής', 'Αλάτι', 'Θερμοδοχείο'] }
    ]
  },
  {
    title: 'Ηλεκτρικός ατμολέβητας',
    groups: [
      { title: '', fields: ['Πίεση PV', 'Βάνα ατμού', 'Εξωτερικός ατμός'] }
    ]
  },
  {
    title: 'Λέβητας πετρελαίου / Λεβητοστάσιο',
    groups: [
      { title: 'Καύσιμο', fields: ['Δεξαμενή πετρελαίου', 'Μετρητής'] },
      { title: 'Πιέσεις και καυσαέρια', fields: ['Πίεση PV', 'Πίεση SV (σταθερό)', 'Πίεση εισόδου', 'Πίεση εξόδου', 'Καυσαέρια', 'Πίεση bar / βάνα'] }
    ]
  },
  {
    title: 'Ψυκτικές μετρήσεις',
    groups: [
      { title: 'Ψυκτικό Β', fields: ['Ψυκτικό Β', 'Set Point', 'Πίεση αντλίας', 'Διαφορική πίεση', 'Διαφορική γλυκόλης', 'Νερού θερμοκρασία (είσοδος/έξοδος)', 'Γλυκόλη θερμοκρασία (είσοδος/έξοδος)', 'Ψυκτικό μικρή/μεγάλη 1', 'Ψυκτικό μικρή/μεγάλη 2'] },
      { title: 'Ψυκτικό Α', fields: ['Ψυκτικό Α', 'Set Point', 'Πίεση αντλίας', 'Διαφορική πίεση', 'Διαφορική γλυκόλης', 'Νερού θερμοκρασία (είσοδος/έξοδος)', 'Γλυκόλη θερμοκρασία (είσοδος/έξοδος)', 'Ψυκτικό μικρή/μεγάλη 1', 'Ψυκτικό μικρή/μεγάλη 2'] },
      { title: 'Ψυκτικό C', fields: ['Ψυκτικό C', 'Set Point', 'Capacity', 'Πίεση αντλίας', 'Διαφορική πίεση', 'Διαφορική γλυκόλης', 'Νερού θερμοκρασία (είσοδος/έξοδος)', 'Γλυκόλη θερμοκρασία (είσοδος/έξοδος)', 'Ψυκτικό μικρή/μεγάλη'] }
    ]
  },
  {
    title: 'Δεξαμενές χημικών',
    groups: [
      { title: '', fields: ['Stabifluid δεξαμενή', 'Na₂CO₃ δεξαμενή', 'Αγωγιμότητα', 'pH'] }
    ]
  },
  {
    title: 'RO 2nd pass / Ώσμωση 3–4',
    groups: [
      { title: '', fields: ['Βάνα φρεατίου', 'Αντλία P800-18', 'Βάνα εισόδου', 'Αντλία P800-19', 'Αγωγιμότητα 3/4', 'Ώρες λειτουργίας 3/4', 'Απόβλητα βυτίο', 'Απόβλητα επεξεργασία', 'Προς Άσωπο', 'Προς γεώτρηση'] }
    ]
  },
  {
    title: 'UF Μετρήσεις',
    groups: [
      { title: '', fields: ['UF στάθμη', 'Αγωγιμότητα'] }
    ]
  }
];

const defaults = {
  'Δεξαμενές υδροχ/ΑΒ': '1.29', 'Δεξαμενή Σόδας Α': '3.4',
  'Γλυκόλη Αντλ. 302': '4.2', 'Γλυκόλη Αντλ. 303': '2.9', 'Στάθμη δεξαμενής': '1.25', 'Αλάτι': '2.5',
  'Βάνα ατμού': 'On', 'Πίεση SV (σταθερό)': '4',
  'Stabifluid δεξαμενή': '35 (20%)', 'Na₂CO₃ δεξαμενή': '760 (20%)',
  'Αγωγιμότητα 3/4': '6.63 / 5.67', 'Ώρες λειτουργίας 3/4': '9859 / 9437',
  'Απόβλητα βυτίο': '9560', 'Απόβλητα επεξεργασία': '15047', 'Προς γεώτρηση': '492065',
  'UF στάθμη': '3.21'
};

const toggleFields = new Set([
  'Βάνα ατμού', 'Βάνα φρεατίου', 'Βάνα εισόδου',
  'Αντλία P800-18', 'Αντλία P800-19',
  'Ψυκτικό Α', 'Ψυκτικό Β', 'Ψυκτικό C'
]);

const toggleWithValueFields = new Set(['Ηλεκτροβάνα']);

function isSplitField(field) {
  return field.startsWith('Ψυκτικό μικρή/μεγάλη');
}

function splitKey(section, group, field, side) {
  return `${keyFor(section, group, field)}|||${side}`;
}

const root = document.getElementById('sectionsRoot');
const form = document.getElementById('measurementsForm');
const dateInput = document.getElementById('entryDate');
const timeInput = document.getElementById('entryTime');
const operatorInput = document.getElementById('operator');
const notesInput = document.getElementById('notes');
let editingId = null;
let isRestoring = false;
let draftTimer = null;

function keyFor(section, group, field) {
  return `${section}|||${group || 'Γενικά'}|||${field}`;
}

function renderForm() {
  root.innerHTML = '';
  sections.forEach(section => {
    const card = document.createElement('section');
    card.className = 'card measurement-section';
    card.innerHTML = `<h2 class="section-title">${escapeHtml(section.title)}</h2>`;
    const body = document.createElement('div');
    body.className = 'section-body';

    section.groups.forEach(group => {
      if (group.title) {
        const h3 = document.createElement('h3');
        h3.className = 'subsection-title';
        h3.textContent = group.title;
        body.appendChild(h3);
      }
      const grid = document.createElement('div');
      grid.className = 'measurement-grid';
      group.fields.forEach(field => {
        const row = document.createElement('div');
        row.className = 'measurement-row';
        const key = keyFor(section.title, group.title, field);
        const initial = defaults[field] || '';

        if (toggleWithValueFields.has(field)) {
          const valueKey = `${key}|||Τιμή`;
          row.classList.add('toggle-value-row');
          row.innerHTML = `<span class="measurement-label">${escapeHtml(field)}</span>
            <div class="toggle-with-input">
              <div class="toggle-wrap">
                <input class="measurement-input toggle-value" data-key="${escapeAttr(key)}" type="hidden" value="${escapeAttr(initial)}" />
                <button type="button" class="toggle-btn" data-value="On">ON</button>
                <button type="button" class="toggle-btn" data-value="Off">OFF</button>
              </div>
              <input class="measurement-input" data-key="${escapeAttr(valueKey)}" type="text" placeholder="Τιμή" />
            </div>`;
          const hidden = row.querySelector('.toggle-value');
          const buttons = row.querySelectorAll('.toggle-btn');
          const updateToggle = value => {
            hidden.value = value;
            buttons.forEach(button => button.classList.toggle('active', button.dataset.value === value));
            scheduleDraftSave();
          };
          buttons.forEach(button => button.addEventListener('click', () => updateToggle(button.dataset.value)));
          if (initial) updateToggle(initial.toLowerCase() === 'off' ? 'Off' : 'On');
        } else if (toggleFields.has(field)) {
          row.innerHTML = `<span class="measurement-label">${escapeHtml(field)}</span>
            <div class="toggle-wrap">
              <input class="measurement-input toggle-value" data-key="${escapeAttr(key)}" type="hidden" value="${escapeAttr(initial)}" />
              <button type="button" class="toggle-btn" data-value="On">ON</button>
              <button type="button" class="toggle-btn" data-value="Off">OFF</button>
            </div>`;
          const hidden = row.querySelector('.toggle-value');
          const buttons = row.querySelectorAll('.toggle-btn');
          const updateToggle = value => {
            hidden.value = value;
            buttons.forEach(button => button.classList.toggle('active', button.dataset.value === value));
            scheduleDraftSave();
          };
          buttons.forEach(button => button.addEventListener('click', () => updateToggle(button.dataset.value)));
          if (initial) updateToggle(initial.toLowerCase() === 'off' ? 'Off' : 'On');
        } else if (isSplitField(field)) {
          row.classList.add('split-row');
          row.innerHTML = `<span class="measurement-label">${escapeHtml(field)}</span>
            <div class="split-inputs">
              <label><small>Μικρή</small><input class="measurement-input" data-key="${escapeAttr(splitKey(section.title, group.title, field, 'Μικρή'))}" type="text" placeholder="Μικρή" /></label>
              <label><small>Μεγάλη</small><input class="measurement-input" data-key="${escapeAttr(splitKey(section.title, group.title, field, 'Μεγάλη'))}" type="text" placeholder="Μεγάλη" /></label>
            </div>`;
        } else {
          const suffix = field === 'Capacity' ? '<span class="input-suffix">%</span>' : '';
          row.innerHTML = `<span class="measurement-label">${escapeHtml(field)}</span>
            <div class="input-with-suffix"><input class="measurement-input" data-key="${escapeAttr(key)}" type="text" value="${escapeAttr(initial)}" placeholder="Τιμή" />${suffix}</div>`;
        }
        grid.appendChild(row);
      });
      body.appendChild(grid);
    });
    card.appendChild(body);
    root.appendChild(card);
  });
}

function setNow() {
  const now = new Date();
  dateInput.value = now.toLocaleDateString('en-CA');
  timeInput.value = now.toTimeString().slice(0, 5);
}

function getEntries() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { return []; }
}
function setEntries(entries) { localStorage.setItem(STORAGE_KEY, JSON.stringify(entries)); }


function currentFormState() {
  const values = {};
  document.querySelectorAll('.measurement-input').forEach(input => {
    values[input.dataset.key] = input.value;
  });
  return {
    editingId,
    date: dateInput.value,
    time: timeInput.value,
    operator: operatorInput.value,
    notes: notesInput.value,
    values,
    updatedAt: new Date().toISOString()
  };
}

function saveDraftNow() {
  if (isRestoring) return;
  try { localStorage.setItem(DRAFT_KEY, JSON.stringify(currentFormState())); }
  catch (error) { console.warn('Δεν ήταν δυνατή η προσωρινή αποθήκευση.', error); }
}

function scheduleDraftSave() {
  if (isRestoring) return;
  clearTimeout(draftTimer);
  draftTimer = setTimeout(saveDraftNow, 120);
}

function applyState(state) {
  if (!state || !state.values) return false;
  isRestoring = true;
  dateInput.value = state.date || '';
  timeInput.value = state.time || '';
  operatorInput.value = state.operator || '';
  notesInput.value = state.notes || '';
  document.querySelectorAll('.measurement-input').forEach(input => {
    input.value = state.values[input.dataset.key] ?? '';
  });
  document.querySelectorAll('.toggle-wrap').forEach(wrap => {
    const hidden = wrap.querySelector('.toggle-value');
    wrap.querySelectorAll('.toggle-btn').forEach(button => {
      button.classList.toggle('active', button.dataset.value === hidden.value);
    });
  });
  editingId = state.editingId || state.id || null;
  document.getElementById('saveBtn').textContent = editingId ? 'Ενημέρωση' : 'Αποθήκευση';
  isRestoring = false;
  return true;
}

function restoreInitialState() {
  let draft = null;
  try { draft = JSON.parse(localStorage.getItem(DRAFT_KEY)); } catch {}
  if (draft && applyState(draft)) return;

  const entries = getEntries();
  const lastId = localStorage.getItem(LAST_SAVED_KEY);
  const latest = entries.find(entry => entry.id === lastId) || entries[0];
  if (latest) {
    applyState({ ...latest, editingId: latest.id });
    saveDraftNow();
    return;
  }
  setNow();
  saveDraftNow();
}

function bindDraftAutosave() {
  form.addEventListener('input', scheduleDraftSave);
  form.addEventListener('change', scheduleDraftSave);
  dateInput.addEventListener('input', scheduleDraftSave);
  timeInput.addEventListener('input', scheduleDraftSave);
  operatorInput.addEventListener('input', scheduleDraftSave);
  notesInput.addEventListener('input', scheduleDraftSave);
  window.addEventListener('pagehide', saveDraftNow);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') saveDraftNow();
  });
}

function collectData() {
  const values = {};
  document.querySelectorAll('.measurement-input').forEach(input => { values[input.dataset.key] = input.value.trim(); });
  return {
    id: editingId || (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`),
    date: dateInput.value,
    time: timeInput.value,
    operator: operatorInput.value.trim(),
    notes: notesInput.value.trim(),
    values,
    savedAt: new Date().toISOString()
  };
}

form.addEventListener('submit', event => {
  event.preventDefault();
  if (!dateInput.value || !timeInput.value) return showToast('Συμπλήρωσε ημερομηνία και ώρα.');
  const entry = collectData();
  const entries = getEntries();
  const index = entries.findIndex(item => item.id === entry.id);
  if (index >= 0) entries[index] = entry; else entries.unshift(entry);
  setEntries(entries);
  editingId = entry.id;
  localStorage.setItem(LAST_SAVED_KEY, entry.id);
  document.getElementById('saveBtn').textContent = 'Ενημέρωση';
  saveDraftNow();
  renderHistory();
  showToast(index >= 0 ? 'Η καταχώρηση ενημερώθηκε και θα ανοίγει αυτόματα.' : 'Η καταχώρηση αποθηκεύτηκε και θα ανοίγει αυτόματα.');
});

document.getElementById('clearBtn').addEventListener('click', () => {
  if (!confirm('Να καθαριστούν όλες οι τρέχουσες τιμές;')) return;

  clearTimeout(draftTimer);
  isRestoring = true;
  editingId = null;

  // Καθαρίζει κάθε πεδίο της τρέχουσας φόρμας, μαζί με τα κρυφά ON/OFF.
  form.querySelectorAll('input, textarea').forEach(field => {
    if (field.type !== 'date' && field.type !== 'time') field.value = '';
  });

  document.querySelectorAll('.toggle-btn').forEach(button => button.classList.remove('active'));
  operatorInput.value = '';
  notesInput.value = '';

  // Η ημερομηνία και η ώρα παραμένουν χρήσιμες και επανέρχονται στην τρέχουσα στιγμή.
  setNow();
  document.getElementById('saveBtn').textContent = 'Αποθήκευση';

  // Αφαιρεί την προηγούμενη πρόχειρη/τελευταία κατάσταση και γράφει αμέσως την καθαρή φόρμα.
  localStorage.removeItem(DRAFT_KEY);
  localStorage.removeItem(LAST_SAVED_KEY);
  isRestoring = false;
  localStorage.setItem(DRAFT_KEY, JSON.stringify(currentFormState()));

  showToast('Καθαρίστηκαν όλες οι τιμές της φόρμας.');
});

function renderHistory(filter = '') {
  const list = document.getElementById('historyList');
  const empty = document.getElementById('emptyHistory');
  const entries = getEntries();
  document.getElementById('historyCount').textContent = entries.length;
  const q = filter.trim().toLocaleLowerCase('el');
  const filtered = entries.filter(e => JSON.stringify(e).toLocaleLowerCase('el').includes(q));
  list.innerHTML = '';
  empty.hidden = filtered.length > 0;

  filtered.forEach(entry => {
    const fragment = document.getElementById('historyItemTemplate').content.cloneNode(true);
    const article = fragment.querySelector('.history-item');
    article.dataset.id = entry.id;
    fragment.querySelector('.history-title').textContent = `${formatDate(entry.date)} • ${entry.time}`;
    fragment.querySelector('.history-subtitle').textContent = entry.operator ? `Υπεύθυνος/Βάρδια: ${entry.operator}` : 'Χωρίς στοιχεία υπευθύνου/βάρδιας';
    fragment.querySelector('.history-details').innerHTML = historyHtml(entry);
    fragment.querySelector('.load-entry').addEventListener('click', () => loadEntry(entry.id));
    fragment.querySelector('.delete-entry').addEventListener('click', () => deleteEntry(entry.id));
    fragment.querySelector('.print-entry').addEventListener('click', () => printEntry(article));
    list.appendChild(fragment);
  });
}

function historyHtml(entry) {
  let html = '';
  sections.forEach(section => {
    const rows = [];
    section.groups.forEach(group => group.fields.forEach(field => {
      let value = '';
      if (isSplitField(field)) {
        const small = entry.values[splitKey(section.title, group.title, field, 'Μικρή')] || '';
        const large = entry.values[splitKey(section.title, group.title, field, 'Μεγάλη')] || '';
        if (small || large) value = `Μικρή: ${small || '—'} / Μεγάλη: ${large || '—'}`;
      } else if (toggleWithValueFields.has(field)) {
        const status = entry.values[keyFor(section.title, group.title, field)] || '';
        const measuredValue = entry.values[`${keyFor(section.title, group.title, field)}|||Τιμή`] || '';
        if (status || measuredValue) value = `${status || '—'}${measuredValue ? ` / Τιμή: ${measuredValue}` : ''}`;
      } else {
        value = entry.values[keyFor(section.title, group.title, field)] || '';
        if (field === 'Capacity' && value) value = `${value}%`;
      }
      if (value) rows.push(`<tr><td>${escapeHtml(group.title ? `${group.title} – ${field}` : field)}</td><td>${escapeHtml(value)}</td></tr>`);
    }));
    if (rows.length) html += `<section class="history-section"><h4>${escapeHtml(section.title)}</h4><table class="history-table">${rows.join('')}</table></section>`;
  });
  if (entry.notes) html += `<section class="history-section"><h4>Σημειώσεις</h4><p>${escapeHtml(entry.notes).replace(/\n/g, '<br>')}</p></section>`;
  return html || '<p>Δεν καταχωρήθηκαν τιμές.</p>';
}

function loadEntry(id) {
  const entry = getEntries().find(item => item.id === id);
  if (!entry) return;
  applyState({ ...entry, editingId: id });
  localStorage.setItem(LAST_SAVED_KEY, id);
  saveDraftNow();
  switchView('formView');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  showToast('Η καταχώρηση άνοιξε για επεξεργασία.');
}

function deleteEntry(id) {
  if (!confirm('Να διαγραφεί αυτή η καταχώρηση;')) return;
  setEntries(getEntries().filter(item => item.id !== id));
  renderHistory(document.getElementById('historySearch').value);
  showToast('Η καταχώρηση διαγράφηκε.');
}

function printEntry(article) {
  article.classList.add('printing');
  const details = article.querySelector('details');
  details.open = true;
  window.print();
  setTimeout(() => article.classList.remove('printing'), 300);
}

function switchView(id) {
  document.querySelectorAll('.view').forEach(v => v.classList.toggle('active', v.id === id));
  document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.view === id));
}

document.querySelectorAll('.tab').forEach(tab => tab.addEventListener('click', () => switchView(tab.dataset.view)));
document.getElementById('historySearch').addEventListener('input', e => renderHistory(e.target.value));

document.getElementById('deleteAllBtn').addEventListener('click', () => {
  if (!getEntries().length) return;
  if (!confirm('Να διαγραφεί ολόκληρο το ιστορικό; Η ενέργεια δεν αναιρείται.')) return;
  localStorage.removeItem(STORAGE_KEY);
  renderHistory();
  showToast('Το ιστορικό διαγράφηκε.');
});

document.getElementById('exportJsonBtn').addEventListener('click', () => downloadFile(
  `metriseis-pre-tekmon-${new Date().toISOString().slice(0,10)}.json`,
  JSON.stringify(getEntries(), null, 2),
  'application/json'
));

document.getElementById('exportCsvBtn').addEventListener('click', () => {
  const entries = getEntries();
  const allKeys = [...new Set(entries.flatMap(e => Object.keys(e.values)))];
  const header = ['Ημερομηνία', 'Ώρα', 'Υπεύθυνος/Βάρδια', ...allKeys, 'Σημειώσεις'];
  const rows = entries.map(e => [e.date, e.time, e.operator || '', ...allKeys.map(k => e.values[k] || ''), e.notes || '']);
  const csv = [header, ...rows].map(row => row.map(csvCell).join(';')).join('\n');
  downloadFile(`metriseis-pre-tekmon-${new Date().toISOString().slice(0,10)}.csv`, '\ufeff' + csv, 'text/csv;charset=utf-8');
});

document.getElementById('importJsonInput').addEventListener('change', async event => {
  const file = event.target.files[0];
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    if (!Array.isArray(data)) throw new Error('invalid');
    const existing = getEntries();
    const map = new Map(existing.map(e => [e.id, e]));
    data.forEach(e => { if (e && e.id && e.values) map.set(e.id, e); });
    setEntries([...map.values()].sort((a,b) => (b.savedAt || '').localeCompare(a.savedAt || '')));
    renderHistory();
    showToast('Η εισαγωγή ολοκληρώθηκε.');
  } catch { alert('Το αρχείο JSON δεν είναι έγκυρο.'); }
  event.target.value = '';
});

function downloadFile(name, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = name; a.click();
  URL.revokeObjectURL(url);
}
function csvCell(value) { return `"${String(value).replace(/"/g, '""')}"`; }
function formatDate(value) {
  if (!value) return 'Χωρίς ημερομηνία';
  return new Date(`${value}T00:00:00`).toLocaleDateString('el-GR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}
function escapeHtml(value) { return String(value).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }
function escapeAttr(value) { return escapeHtml(value).replace(/'/g, '&#39;'); }
let toastTimer;
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message; toast.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('show'), 2300);
}

const themeBtn = document.getElementById('themeBtn');
function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem(THEME_KEY, theme);
}
themeBtn.addEventListener('click', () => applyTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'));
applyTheme(localStorage.getItem(THEME_KEY) || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));

renderForm();
bindDraftAutosave();
restoreInitialState();
renderHistory();
if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
