const PAUSE = ',,,'; // ~6s of dial pauses before each menu digit; add/remove commas to tune timing

const LINES = {
  south: { number: '+18442001888', name: 'South Central and Calgary OLMC & ER Patch Line', region: 'South Central / Calgary' },
  north: { number: '+18556177329', name: 'North and Edmonton Zone OLMC & ER Patch Line', region: 'North / Edmonton' },
};

const ZONES = ['Calgary', 'Central South', 'Edmonton', 'North'];
// Zones that have a further District sub-filter. North map to be added later.
const DISTRICT_ZONES = ['Central South'];

// Correct/tidy display names; original spelling is kept as a search alias automatically.
const NAME_FIX = {
  'PLC': 'Peter Lougheed Centre (PLC)',
  'Med Hat': 'Medicine Hat',
  'Fort MacLeod': 'Fort Macleod',
  'Royal Alexander': 'Royal Alexandra',
  'High level': 'High Level',
  'Slave lake': 'Slave Lake',
  'Peace river': 'Peace River',
  'Fair View': 'Fairview',
  'Spirt River': 'Spirit River',
  'Beaver Lodge': 'Beaverlodge',
  'White Court': 'Whitecourt',
  'Red water': 'Redwater',
  'Valley View': 'Valleyview',
};

// Hospital menu. Item: [name, zone, district?]. District applies to Central South only for now.
const menu = [
  { line: 'south', digit: '3', group: 'Calgary Metro Hospitals', items: [
    ['Foothills', 'Calgary'], ["Children's Hospital", 'Calgary'], ['South Health Campus', 'Calgary'],
    ['Rockyview', 'Calgary'], ['PLC', 'Calgary'], ['Sheldon Chumir', 'Calgary'], ['South Calgary UCC', 'Calgary'],
  ]},
  { line: 'south', digit: '4', group: 'Hwy 2 North Hospitals', items: [
    ['Ponoka', 'Central South', 'District 2'], ['Lacombe', 'Central South', 'District 2'], ['Red Deer', 'Central South', 'District 2'],
    ['Innisfail', 'Central South', 'District 2'], ['Olds', 'Central South', 'District 2'], ['Rocky Mountain House', 'Central South', 'District 2'],
    ['Sundre', 'Central South', 'District 2'], ['Didsbury', 'Calgary'], ['Airdrie Urgent Care', 'Calgary'],
  ]},
  { line: 'south', digit: '5', group: 'Hwy 2 South Hospitals', items: [
    ['Okotoks', 'Calgary'], ['Black Diamond', 'Calgary'], ['High River', 'Calgary'], ['Vulcan', 'Calgary'],
    ['Claresholm', 'Calgary'], ['Fort Macleod', 'Central South', 'District 5'], ['Cardston', 'Central South', 'District 5'],
  ]},
  { line: 'south', digit: '6', group: 'Hwy 4 Hospitals', items: [
    ['Lethbridge', 'Central South', 'District 5'], ['Raymond', 'Central South', 'District 5'], ['Milk River', 'Central South', 'District 5'],
  ]},
  { line: 'south', digit: '7', group: 'Hwy 9 & 12 Hospitals', items: [
    ['Coronation', 'Central South', 'District 1'], ['Castor', 'Central South', 'District 1'], ['Stettler', 'Central South', 'District 1'],
    ['Oyen', 'Central South', 'District 3'], ['Hanna', 'Central South', 'District 3'], ['Drumheller', 'Central South', 'District 3'], ['Three Hills', 'Central South', 'District 2'],
  ]},
  { line: 'south', digit: '8', group: 'Hwy 1 Hospitals', items: [
    ['Medicine Hat', 'Central South', 'District 4'], ['Brooks', 'Central South', 'District 3'], ['Bassano', 'Central South', 'District 3'],
    ['Strathmore', 'Central South', 'District 3'], ['Cochrane', 'Calgary'], ['Canmore', 'Calgary'], ['Banff', 'Calgary'],
  ]},
  { line: 'south', digit: '9', group: 'Hwy 3 Hospitals', items: [
    ['Med Hat', 'Central South', 'District 4'], ['Bow Island', 'Central South', 'District 4'], ['Taber', 'Central South', 'District 4'],
    ['Coaldale', 'Central South', 'District 5'], ['Lethbridge', 'Central South', 'District 5'], ['Fort MacLeod', 'Central South', 'District 5'],
    ['Pincher Creek', 'Central South', 'District 5'], ['Crowsnest Pass', 'Central South', 'District 5'],
  ]},
  { line: 'north', digit: '3', group: 'Edmonton Metro Hospitals', items: [
    ['Royal Alexander', 'Edmonton'], ['University of Alberta', 'Edmonton'], ['Misericordia', 'Edmonton'],
    ['Grey Nuns', 'Edmonton'], ['Sturgeon', 'Edmonton'], ['Fort Saskatchewan', 'Edmonton'],
    ['Sherwood Park', 'Edmonton'], ['East Edmonton UCC', 'Edmonton'], ['Stoney Plain', 'Edmonton'],
  ]},
  { line: 'north', digit: '4', group: 'Hwy 35 North Hospitals', items: [
    ['High level', 'North'], ['Fort Vermilion', 'North'], ['La Crête', 'North'], ['Manning', 'North'], ['Grimshaw', 'North'],
  ]},
  { line: 'north', digit: '5', group: 'Hwy 2 Hospitals', items: [
    ['Wabasca', 'North'], ['Slave lake', 'North'], ['High Prairie', 'North'], ['McLennan', 'North'],
    ['Peace river', 'North'], ['Fair View', 'North'], ['Spirt River', 'North'], ['Grande Prairie', 'North'], ['Beaver Lodge', 'North'],
  ]},
  { line: 'north', digit: '6', group: 'Hwy 16 Hospitals', items: [
    ['Drayton Valley', 'North'], ['Westlock', 'North'], ['Barrhead', 'North'], ['Edson', 'North'],
    ['Hinton', 'North'], ['Jasper', 'North'], ['Grande Cache', 'North'],
  ]},
  { line: 'north', digit: '7', group: 'Hwy 43 Hospitals', items: [
    ['Mayerthorpe', 'North'], ['Swan Hills', 'North'], ['White Court', 'North'], ['Fox Creek', 'North'], ['Valley View', 'North'],
  ]},
  { line: 'north', digit: '8', group: 'Hwy 63 Hospitals', items: [
    ['Fort McMurray', 'North'], ['Lac la Biche', 'North'], ['Boyle', 'North'], ['Athabasca', 'North'], ['Red water', 'North'],
  ]},
  { line: 'north', digit: '9', group: 'Hwy 28 Hospitals', items: [
    ['Cold Lake', 'North'], ['Bonnyville', 'North'], ['Elk Point', 'North'], ['St. Paul', 'North'], ['Smokey Lake', 'North'],
  ]},
];

const services = [
  { name: 'OLMC', line: 'south', path: ['1'] },
  { name: 'OLMC', line: 'north', path: ['1'] },
  { name: 'Community Care Consult', line: 'south', path: ['2'], aliases: ['MIH', 'Mobile Integrated Health', 'community paramedic', 'community paramedics'] },
  { name: 'VHR', line: 'north', path: ['2'] },
  { name: 'Labour and Delivery / NICU / EMS Dispatch (SCC/CCC)', line: 'south', path: ['0'], aliases: ['L&D', 'Labour and Delivery', 'NICU', 'EMS Dispatch'] },
  { name: 'Labour and Delivery / NICU / EMS Dispatch (NCC)', line: 'north', path: ['0'], aliases: ['L&D', 'Labour and Delivery', 'NICU', 'EMS Dispatch'] },
  { name: 'Public Safety Communications Centre', line: 'north', path: ['10'], aliases: ['PSCC'] },
  { name: 'STARS Patch Line', line: null, number: '+18885078277', path: [], aliases: ['STARS', 'air ambulance'] },
];

function tidy(name) { return name.trim().replace(/\s+/g, ' '); }
function canonical(name) { const t = tidy(name); return NAME_FIX[t] || t; }
function normalize(value) { return value.toLowerCase().replace(/[^a-z0-9]/g, ''); }

function buildHospitals() {
  const map = new Map();
  for (const g of menu) {
    g.items.forEach((item, index) => {
      const raw = item[0];
      const zone = item[1];
      const district = item[2] || '';
      const name = canonical(raw);
      const key = normalize(name);
      if (!map.has(key)) map.set(key, { name, zone, district, type: 'hospital', aliasSet: new Set(), routes: [] });
      const entry = map.get(key);
      if (tidy(raw) !== name) entry.aliasSet.add(raw);
      entry.routes.push({
        number: LINES[g.line].number,
        lineName: LINES[g.line].name,
        group: g.group,
        path: [g.digit, String(index + 1)],
      });
    });
  }
  return [...map.values()].map(e => ({ name: e.name, zone: e.zone, district: e.district, type: e.type, aliases: [...e.aliasSet], routes: e.routes }));
}

function buildServices() {
  return services.map(s => {
    const number = s.number || LINES[s.line].number;
    const region = s.line ? LINES[s.line].region : 'All zones';
    return {
      name: s.name, zone: region, district: '', type: 'service', aliases: s.aliases || [],
      routes: [{ number, lineName: s.line ? LINES[s.line].name : s.name, group: 'Direct line', path: s.path }],
    };
  });
}

const entries = [...buildHospitals(), ...buildServices()];

const search = document.querySelector('#search');
const zoneSelect = document.querySelector('#zone');
const zoneWrap = document.querySelector('#zoneWrap');
const districtSelect = document.querySelector('#district');
const districtWrap = document.querySelector('#districtWrap');
const results = document.querySelector('#results');
const dialog = document.querySelector('#dialDialog');
const modalTitle = document.querySelector('#modalTitle');
const tree = document.querySelector('#tree');
const altRoutes = document.querySelector('#altRoutes');
const manualDial = document.querySelector('#manualDial');
const autoDial = document.querySelector('#autoDial');
const tabButtons = document.querySelectorAll('.tab');

let activeTab = 'hospital';

for (const zone of ZONES) {
  const option = document.createElement('option');
  option.value = zone;
  option.textContent = zone + ' Zone';
  zoneSelect.append(option);
}

function refreshDistricts() {
  const z = zoneSelect.value;
  const hasDistricts = activeTab === 'hospital' && DISTRICT_ZONES.includes(z);
  districtWrap.hidden = !hasDistricts;
  if (!hasDistricts) { districtSelect.value = 'all'; return; }
  const present = [...new Set(entries.filter(e => e.type === 'hospital' && e.zone === z && e.district).map(e => e.district))].sort();
  const current = districtSelect.value;
  districtSelect.innerHTML = '<option value="all">All districts</option>' + present.map(d => `<option value="${d}">${d}</option>`).join('');
  districtSelect.value = present.includes(current) ? current : 'all';
}

function telFor(route) {
  if (!route.path.length) return `tel:${route.number}`;
  return `tel:${route.number}${PAUSE}${route.path.join(PAUSE)}`;
}

function render() {
  const q = normalize(search.value);
  const selectedZone = zoneSelect.value;
  const filtered = entries
    .filter(entry => {
      if (entry.type !== activeTab) return false;
      const zoneOk = activeTab !== 'hospital' || selectedZone === 'all' || entry.zone === selectedZone;
      const districtOk = districtWrap.hidden || districtSelect.value === 'all' || entry.district === districtSelect.value;
      const text = normalize(`${entry.name} ${entry.zone} ${entry.district} ${entry.routes.map(r => r.group).join(' ')} ${entry.aliases.join(' ')}`);
      return zoneOk && districtOk && (!q || text.includes(q));
    })
    .sort((a, b) => a.name.localeCompare(b.name) || a.zone.localeCompare(b.zone));

  results.innerHTML = '';
  if (!filtered.length) {
    results.innerHTML = '<p class="empty">No match found.</p>';
    return;
  }

  filtered.forEach(entry => {
    const primary = entry.routes[0];
    const extra = entry.routes.length - 1;
    const button = document.createElement('button');
    button.className = `result ${entry.type === 'service' ? 'special' : ''}`;
    button.innerHTML = `
      <h3>${entry.name}</h3>
      <div class="meta">
        <span class="badge">${entry.zone}</span>
        ${entry.district ? `<span class="badge zone2">${entry.district}</span>` : ''}
        <span>${primary.group}</span>
        ${primary.path.length ? `<span>Press ${primary.path.join(' → ')}</span>` : '<span>Direct dial</span>'}
        ${extra > 0 ? `<span class="alt">+${extra} other route${extra > 1 ? 's' : ''}</span>` : ''}
      </div>`;
    button.addEventListener('click', () => openDial(entry));
    results.append(button);
  });
}

tabButtons.forEach(tab => {
  tab.addEventListener('click', () => {
    activeTab = tab.dataset.tab;
    tabButtons.forEach(t => t.setAttribute('aria-selected', String(t === tab)));
    zoneWrap.hidden = activeTab !== 'hospital';
    search.value = '';
    search.placeholder = activeTab === 'hospital'
      ? 'e.g. Foothills, Red Deer, Lethbridge'
      : 'e.g. STARS, L&D, MIH, OLMC';
    refreshDistricts();
    render();
  });
});

function stepRows(entry, route) {
  return [
    ['Dial', formatPhone(route.number)],
    ...route.path.map((digit, i) => {
      const right = (i === 0 && route.group && route.group !== 'Direct line') ? route.group : entry.name;
      return [`Then press ${digit}`, right];
    }),
  ];
}

function openDial(entry) {
  modalTitle.textContent = entry.name;
  const primary = entry.routes[0];
  tree.innerHTML = stepRows(entry, primary)
    .map(([left, right]) => `<div class="step"><strong>${left}</strong><span>${right}</span></div>`).join('');
  manualDial.href = `tel:${primary.number}`;
  autoDial.href = telFor(primary);
  autoDial.textContent = primary.path.length ? `Dial ${primary.path.join(' → ')}` : 'Dial now';

  if (entry.routes.length > 1) {
    const alts = entry.routes.slice(1).map(r => `
      <div class="alt-route">
        <span>${r.group}: press ${r.path.join(' → ')}</span>
        <a class="button small" href="${telFor(r)}">Dial</a>
      </div>`).join('');
    altRoutes.innerHTML = `<p class="alt-head">Other routes to ${entry.name}:</p>${alts}`;
    altRoutes.hidden = false;
  } else {
    altRoutes.innerHTML = '';
    altRoutes.hidden = true;
  }
  dialog.showModal();
}

function formatPhone(number) {
  return number.replace('+1', '1-').replace(/(\d{1})-(\d{3})(\d{3})(\d{4})/, '$1-$2-$3-$4');
}

search.addEventListener('input', render);
zoneSelect.addEventListener('change', () => { refreshDistricts(); render(); });
districtSelect.addEventListener('change', render);
refreshDistricts();
render();

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js');
}

let deferredPrompt;
const installBtn = document.querySelector('#installBtn');
window.addEventListener('beforeinstallprompt', event => {
  event.preventDefault();
  deferredPrompt = event;
  installBtn.hidden = false;
});
installBtn.addEventListener('click', async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt = null;
  installBtn.hidden = true;
});
