const STORAGE_KEY = 'preTekmonMeasurementsV1';
const THEME_KEY = 'preTekmonTheme';
const CUSTOM_SECTIONS_KEY = 'preTekmonCustomSectionsV1';

const baseSections = [
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
      { title: 'Ψυκτικό Β', fields: ['Ψυκτικό Α', 'Πίεση αντλίας', 'Διαφορική πίεση', 'Διαφορική γλυκόλης', 'Νερού θερμοκρασία (είσοδος/έξοδος)', 'Γλυκόλη θερμοκρασία (είσοδος/έξοδος)', 'Ψυκτικό μικρή/μεγάλη 1', 'Ψυκτικό μικρή/μεγάλη 2'] },
      { title: 'Ψυκτικό Α', fields: ['Ψυκτικό Β', 'Πίεση αντλίας', 'Διαφορική πίεση', 'Διαφορική γλυκόλης', 'Νερού θερμοκρασία (είσοδος/έξοδος)', 'Γλυκόλη θερμοκρασία (είσοδος/έξοδος)', 'Ψυκτικό μικρή/μεγάλη 1', 'Ψυκτικό μικρή/μεγάλη 2'] },
      { title: 'Ψυκτικό C', fields: ['Ψυκτικό C', 'Capacity', 'Πίεση αντλίας', 'Διαφορική πίεση', 'Διαφορική γλυκόλης', 'Νερού θερμοκρασία (είσοδος/έξοδος)', 'Γλυκόλη θερμοκρασία (είσοδος/έξοδος)', 'Ψυκτικό μικρή/μεγάλη'] }
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


function getCustomSections() {
  try {
    const value = JSON.parse(localStorage.getItem(CUSTOM_SECTIONS_KEY));
    return Array.isArray(value) ? value : [];
  } catch { return []; }
}

function setCustomSections(value) {
  localStorage.setItem(CUSTOM_SECTIONS_KEY, JSON.stringify(value));
}

function allSections() {
  return [...baseSections, ...getCustomSections().map(section => ({ ...section, custom: true }))];
}

function makeId(prefix = 'item') {
  return `${prefix}-${crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`}`;
}

const defaults = {
  'Δεξαμενές υδροχ/ΑΒ': '1.29', 'Δεξαμενή Σόδας Α': '3.4',
  'Γλυκόλη Αντλ. 302': '4.2', 'Γλυκόλη Αντλ. 303': '2.9', 'Στάθμη δεξαμενής': '1.25', 'Αλάτι': '2.5',
  'Βάνα ατμού': 'On', 'Πίεση SV (σταθερό)': '4',
  'Stabifluid δεξαμενή': '35 (20%)', 'Na₂CO₃ δεξαμενή': '760 (20%)',
  'Αγωγιμότητα 3/4': '6.63 / 5.67', 'Ώρες λειτουργίας 3/4': '9859 / 9437',
  'Απόβλητα βυτίο': '9560', 'Απόβλητα επεξεργασία': '15047', 'Προς γεώτρηση': '492065',
  'UF στάθμη': '3.21'
};

const root = document.getElementById('sectionsRoot');
const form = document.getElementById('measurementsForm');
const dateInput = document.getElementById('entryDate');
const timeInput = document.getElementById('entryTime');
const operatorInput = document.getElementById('operator');
const notesInput = document.getElementById('notes');
let editingId = null;

function keyFor(section, group, field, sectionId = '', fieldId = '') {
  if (sectionId && fieldId) return `custom|||${sectionId}|||${fieldId}`;
  return `${section}|||${group || 'Γενικά'}|||${field}`;
}

function renderForm(preservedValues = null, useDefaults = true) {
  if (!preservedValues) {
    preservedValues = {};
    document.querySelectorAll('.measurement-input').forEach(input => { preservedValues[input.dataset.key] = input.value; });
  }
  root.innerHTML = '';
  allSections().forEach(section => {
    const card = document.createElement('section');
    card.className = 'card measurement-section';

    if (section.custom) {
      const head = document.createElement('div');
      head.className = 'section-title-row';
      head.innerHTML = `<h2 class="section-title">${escapeHtml(section.title)}</h2>
        <div class="section-tools">
          <button class="small-btn add-field" type="button">+ Μέτρηση</button>
          <button class="small-btn danger remove-section" type="button">Διαγραφή τομέα</button>
        </div>`;
      head.querySelector('.add-field').addEventListener('click', () => addFieldToSection(section.id));
      head.querySelector('.remove-section').addEventListener('click', () => removeCustomSection(section.id));
      card.appendChild(head);
    } else {
      card.innerHTML = `<h2 class="section-title">${escapeHtml(section.title)}</h2>`;
    }

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
      group.fields.forEach(rawField => {
        const field = typeof rawField === 'string' ? { label: rawField, id: '' } : rawField;
        const row = document.createElement('label');
        row.className = 'measurement-row';
        const key = keyFor(section.title, group.title, field.label, section.custom ? section.id : '', field.id || '');
        const initial = Object.prototype.hasOwnProperty.call(preservedValues, key) ? preservedValues[key] : (useDefaults ? (defaults[field.label] || '') : '');
        row.innerHTML = `<span class="measurement-label">${escapeHtml(field.label)}</span>
          <input class="measurement-input" data-key="${escapeAttr(key)}" type="text" value="${escapeAttr(initial)}" placeholder="Τιμή" />`;
        grid.appendChild(row);
      });
      body.appendChild(grid);
    });
    card.appendChild(body);
    root.appendChild(card);
  });
}

function addCustomSection() {
  const titleInput = document.getElementById('newSectionName');
  const fieldsInput = document.getElementById('newSectionFields');
  const title = titleInput.value.trim();
  const labels = fieldsInput.value.split(/\n|,/).map(value => value.trim()).filter(Boolean);
  if (!title) return showToast('Γράψε το όνομα του νέου τομέα.');
  if (!labels.length) return showToast('Πρόσθεσε τουλάχιστον μία μέτρηση.');
  const custom = getCustomSections();
  custom.push({
    id: makeId('section'),
    title,
    groups: [{ title: '', fields: labels.map(label => ({ id: makeId('field'), label })) }]
  });
  setCustomSections(custom);
  titleInput.value = '';
  fieldsInput.value = '';
  document.getElementById('addSectionPanel').hidden = true;
  renderForm();
  showToast('Ο νέος τομέας προστέθηκε.');
}

function addFieldToSection(sectionId) {
  const label = prompt('Όνομα νέας μέτρησης:');
  if (!label || !label.trim()) return;
  const custom = getCustomSections();
  const section = custom.find(item => item.id === sectionId);
  if (!section) return;
  section.groups[0].fields.push({ id: makeId('field'), label: label.trim() });
  setCustomSections(custom);
  renderForm();
  showToast('Η μέτρηση προστέθηκε.');
}

function removeCustomSection(sectionId) {
  const section = getCustomSections().find(item => item.id === sectionId);
  if (!section || !confirm(`Να διαγραφεί ο τομέας «${section.title}» από τη φόρμα; Οι παλιές αποθηκευμένες καταχωρήσεις θα παραμείνουν στο ιστορικό.`)) return;
  setCustomSections(getCustomSections().filter(item => item.id !== sectionId));
  renderForm();
  showToast('Ο τομέας διαγράφηκε από τη φόρμα.');
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
    schema: allSections(),
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
  editingId = null;
  document.getElementById('saveBtn').textContent = 'Αποθήκευση';
  renderHistory();
  showToast(index >= 0 ? 'Η καταχώρηση ενημερώθηκε.' : 'Η καταχώρηση αποθηκεύτηκε.');
});

document.getElementById('clearBtn').addEventListener('click', () => {
  if (!confirm('Να καθαριστούν όλες οι τρέχουσες τιμές;')) return;
  editingId = null;
  renderForm({}, false);
  operatorInput.value = '';
  notesInput.value = '';
  setNow();
  document.getElementById('saveBtn').textContent = 'Αποθήκευση';
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
  const schema = Array.isArray(entry.schema) ? entry.schema : allSections();
  schema.forEach(section => {
    const rows = [];
    section.groups.forEach(group => group.fields.forEach(rawField => {
      const field = typeof rawField === 'string' ? { label: rawField, id: '' } : rawField;
      const key = keyFor(section.title, group.title, field.label, section.custom ? section.id : '', field.id || '');
      const value = entry.values[key] || '';
      if (value) rows.push(`<tr><td>${escapeHtml(group.title ? `${group.title} – ${field.label}` : field.label)}</td><td>${escapeHtml(value)}</td></tr>`);
    }));
    if (rows.length) html += `<section class="history-section"><h4>${escapeHtml(section.title)}</h4><table class="history-table">${rows.join('')}</table></section>`;
  });
  if (entry.notes) html += `<section class="history-section"><h4>Σημειώσεις</h4><p>${escapeHtml(entry.notes).replace(/\n/g, '<br>')}</p></section>`;
  return html || '<p>Δεν καταχωρήθηκαν τιμές.</p>';
}

function loadEntry(id) {
  const entry = getEntries().find(item => item.id === id);
  if (!entry) return;
  dateInput.value = entry.date;
  timeInput.value = entry.time;
  operatorInput.value = entry.operator || '';
  notesInput.value = entry.notes || '';
  document.querySelectorAll('.measurement-input').forEach(input => { input.value = entry.values[input.dataset.key] || ''; });
  editingId = id;
  document.getElementById('saveBtn').textContent = 'Ενημέρωση';
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
  JSON.stringify({ version: 2, entries: getEntries(), customSections: getCustomSections() }, null, 2),
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
    const importedEntries = Array.isArray(data) ? data : data.entries;
    if (!Array.isArray(importedEntries)) throw new Error('invalid');
    const existing = getEntries();
    const map = new Map(existing.map(e => [e.id, e]));
    importedEntries.forEach(e => { if (e && e.id && e.values) map.set(e.id, e); });
    setEntries([...map.values()].sort((a,b) => (b.savedAt || '').localeCompare(a.savedAt || '')));
    if (!Array.isArray(data) && Array.isArray(data.customSections)) {
      const existingSections = getCustomSections();
      const sectionMap = new Map(existingSections.map(section => [section.id, section]));
      data.customSections.forEach(section => { if (section && section.id && section.title && section.groups) sectionMap.set(section.id, section); });
      setCustomSections([...sectionMap.values()]);
      renderForm();
    }
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

document.getElementById('showAddSectionBtn').addEventListener('click', () => {
  const panel = document.getElementById('addSectionPanel');
  panel.hidden = !panel.hidden;
  if (!panel.hidden) document.getElementById('newSectionName').focus();
});
document.getElementById('cancelAddSectionBtn').addEventListener('click', () => {
  document.getElementById('addSectionPanel').hidden = true;
});
document.getElementById('addSectionBtn').addEventListener('click', addCustomSection);

const themeBtn = document.getElementById('themeBtn');
function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem(THEME_KEY, theme);
}
themeBtn.addEventListener('click', () => applyTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'));
applyTheme(localStorage.getItem(THEME_KEY) || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));

renderForm();
setNow();
renderHistory();
if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
