const PAUSE = ',,,'; // roughly 6 seconds; add/remove commas if your phone needs more/less time

const zones = [
  {
    id: 'south',
    name: 'South Central / Calgary',
    lineName: 'South Central and Calgary OLMC & ER Patch Line',
    number: '+18442001888',
    groups: [
      { digit: '1', name: 'OLMC', items: [{ name: 'OLMC', special: true }] },
      { digit: '2', name: 'Community Care Consult', items: [{ name: 'Community Care Consult', special: true, aliases: ['MIH', 'Mobile Integrated Health', 'community paramedic', 'community paramedics'] }] },
      { digit: '3', name: 'Calgary Metro Hospitals', items: ['Foothills', "Children's Hospital", 'South Health Campus', 'Rockyview', 'PLC', 'Sheldon Chumir', 'South Calgary UCC', 'Trochu'] },
      { digit: '4', name: 'Hwy 2 North Hospitals', items: ['Ponoka', 'Lacombe', 'Red Deer', 'Innisfail', 'Olds', 'Rocky Mountain House', 'Sundre', 'Didsbury', 'Airdrie Urgent Care'] },
      { digit: '5', name: 'Hwy 2 South Hospitals', items: ['Okotoks', 'Black Diamond', 'High River', 'Vulcan', 'Claresholm', 'Fort Macleod', 'Cardston'] },
      { digit: '6', name: 'Hwy 4 Hospitals', items: ['Lethbridge', 'Raymond', 'Milk River'] },
      { digit: '7', name: 'Hwy 9 & 12 Hospitals', items: ['Coronation', 'Castor', 'Stettler', 'Oyen', 'Hanna', 'Drumheller', 'Three Hills'] },
      { digit: '8', name: 'Hwy 1 Hospitals', items: ['Medicine Hat', 'Brooks', 'Bassano', 'Strathmore', 'Cochrane', 'Canmore', 'Banff'] },
      { digit: '9', name: 'Hwy 3 Hospitals', items: ['Med Hat', 'Bow Island', 'Taber', 'Coaldale', 'Lethbridge', 'Fort MacLeod', 'Pincher Creek', 'Crowsnest Pass'] },
      { digit: '0', name: 'Labour and Delivery, NICU, EMS Dispatch (SCC/CCC)', items: [{ name: 'Labour and Delivery / NICU / EMS Dispatch (SCC/CCC)', special: true }] },
    ],
  },
  {
    id: 'north',
    name: 'North / Edmonton',
    lineName: 'North and Edmonton Zone OLMC & ER Patch Line',
    number: '+18556177329',
    groups: [
      { digit: '1', name: 'OLMC', items: [{ name: 'OLMC', special: true }] },
      { digit: '2', name: 'VHR', items: [{ name: 'VHR', special: true }] },
      { digit: '3', name: 'Edmonton Metro Hospitals', items: ['Royal Alexander', 'University of Alberta', 'Misericordia', 'Grey Nuns', 'Sturgeon', 'Fort Saskatchewan', 'Sherwood Park', 'East Edmonton UCC', 'Stoney Plain'] },
      { digit: '4', name: 'Hwy 35 North Hospitals', items: ['High level', 'Fort Vermilion', 'La Crête', 'Manning', 'Grimshaw'] },
      { digit: '5', name: 'Hwy 2 Hospitals', items: ['Wabasca', 'Slave lake', 'High Prairie', 'McLennan', 'Peace river', 'Fair View', 'Spirt River', 'Grande Prairie', 'Beaver Lodge'] },
      { digit: '6', name: 'Hwy 16 Hospitals', items: ['Drayton Valley', 'Westlock', 'Barrhead', 'Edson', 'Hinton', 'Jasper', 'Grande Cache'] },
      { digit: '7', name: 'Hwy 43 Hospitals', items: ['Mayerthorpe', 'Swan Hills', 'White Court', 'Fox Creek', 'Valley View'] },
      { digit: '8', name: 'Hwy 63 Hospitals', items: ['Fort McMurray', 'Lac la Biche', 'Boyle', 'Athabasca', 'Red water'] },
      { digit: '9', name: 'Hwy 28 Hospitals', items: ['Cold Lake', 'Bonnyville', 'Elk Point', 'St. Paul', 'Smokey Lake'] },
      { digit: '0', name: 'Labour and Delivery, NICU, EMS Dispatch (NCC)', items: [{ name: 'Labour and Delivery / NICU / EMS Dispatch (NCC)', special: true }] },
      { digit: '10', name: 'Public Safety Communications Centre', items: [{ name: 'Public Safety Communications Centre', special: true }] },
    ],
  },
];

const specialLines = [
  { name: 'STARS Patch Line', zone: 'All zones', number: '+18885078277', path: [] },
];

function normalize(value) { return value.toLowerCase().replace(/[^a-z0-9]/g, ''); }

function buildEntries() {
  const entries = [];
  for (const zone of zones) {
    for (const group of zone.groups) {
      group.items.forEach((item, index) => {
        const itemObj = typeof item === 'string' ? { name: item } : item;
        const hasSecondDigit = !itemObj.special;
        entries.push({
          name: itemObj.name,
          type: itemObj.special ? 'service' : 'hospital',
          aliases: itemObj.aliases || [],
          zoneId: zone.id,
          zone: zone.name,
          lineName: zone.lineName,
          number: zone.number,
          group: group.name,
          path: hasSecondDigit ? [group.digit, String(index + 1)] : [group.digit],
          special: itemObj.special || false,
        });
      });
    }
  }
  return entries.concat(specialLines.map(line => ({
    ...line, type: 'service', aliases: line.aliases || [], zoneId: 'all', lineName: line.name, special: true, group: 'Direct line',
  })));
}

const entries = buildEntries();
const search = document.querySelector('#search');
const zoneSelect = document.querySelector('#zone');
const results = document.querySelector('#results');
const dialog = document.querySelector('#dialDialog');
const modalTitle = document.querySelector('#modalTitle');
const tree = document.querySelector('#tree');
const manualDial = document.querySelector('#manualDial');
const autoDial = document.querySelector('#autoDial');
const tabButtons = document.querySelectorAll('.tab');

let activeTab = 'hospital';

for (const zone of zones) {
  const option = document.createElement('option');
  option.value = zone.id;
  option.textContent = zone.name;
  zoneSelect.append(option);
}

function telWithTree(entry) {
  if (!entry.path.length) return `tel:${entry.number}`;
  return `tel:${entry.number}${PAUSE}${entry.path.join(PAUSE)}`;
}

function render() {
  const q = normalize(search.value);
  const selectedZone = zoneSelect.value;
  const filtered = entries
    .filter(entry => {
      if (entry.type !== activeTab) return false;
      const zoneOk = selectedZone === 'all' || entry.zoneId === selectedZone || entry.zoneId === 'all';
      const text = normalize(`${entry.name} ${entry.zone} ${entry.group} ${entry.lineName} ${entry.aliases.join(' ')}`);
      return zoneOk && (!q || text.includes(q));
    })
    .sort((a, b) => a.name.localeCompare(b.name) || a.zone.localeCompare(b.zone));

  results.innerHTML = '';
  if (!filtered.length) {
    results.innerHTML = '<p class="empty">No match found.</p>';
    return;
  }

  filtered.forEach(entry => {
    const button = document.createElement('button');
    button.className = `result ${entry.special ? 'special' : ''}`;
    button.innerHTML = `
      <h3>${entry.name}</h3>
      <div class="meta">
        <span class="badge">${entry.zone}</span>
        <span>${entry.group}</span>
        ${entry.path.length ? `<span>Press ${entry.path.join(' → ')}</span>` : '<span>Direct dial</span>'}
      </div>`;
    button.addEventListener('click', () => openDial(entry));
    results.append(button);
  });
}

tabButtons.forEach(tab => {
  tab.addEventListener('click', () => {
    activeTab = tab.dataset.tab;
    tabButtons.forEach(t => t.setAttribute('aria-selected', String(t === tab)));
    search.value = '';
    search.placeholder = activeTab === 'hospital'
      ? 'e.g. Foothills, Red Deer, Lethbridge'
      : 'e.g. STARS, L&D, MIH, OLMC';
    render();
  });
});

function openDial(entry) {
  modalTitle.textContent = entry.name;
  const rows = [
    ['Dial', formatPhone(entry.number)],
    ...entry.path.map((digit, i) => [`Then press ${digit}`, i === 0 ? entry.group : entry.name]),
  ];
  tree.innerHTML = rows.map(([left, right]) => `<div class="step"><strong>${left}</strong><span>${right}</span></div>`).join('');
  manualDial.href = `tel:${entry.number}`;
  autoDial.href = telWithTree(entry);
  autoDial.textContent = entry.path.length ? `Dial ${entry.path.join(' → ')}` : 'Dial now';
  dialog.showModal();
}

function formatPhone(number) {
  return number.replace('+1', '1-').replace(/(\d{1})-(\d{3})(\d{3})(\d{4})/, '$1-$2-$3-$4');
}

search.addEventListener('input', render);
zoneSelect.addEventListener('change', render);
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
