// OLMC Patch Line — data model (shared logic with the web app)

export const WAIT = ';'; // 'wait' char: phone holds each digit until you tap send

type LineKey = 'south' | 'north';
const LINES: Record<LineKey, { number: string; name: string; region: string }> = {
  south: { number: '+18442001888', name: 'South Central and Calgary OLMC & ER Patch Line', region: 'South Central / Calgary' },
  north: { number: '+18556177329', name: 'North and Edmonton Zone OLMC & ER Patch Line', region: 'North / Edmonton' },
};

export const ZONES = ['Calgary', 'Central South', 'Edmonton', 'North'];
// Zones with a second-level sub-filter (Districts, or Areas for Calgary).
export const DISTRICT_ZONES = ['Calgary', 'Central South', 'North'];
const AREA_ORDER = ['Metro', 'Suburban', 'Urgent Care Centres'];

// Label shown for the second-level filter, per zone.
export function subLabel(zone: string): string { return zone === 'Calgary' ? 'Area' : 'District'; }
export function subAllLabel(zone: string): string { return zone === 'Calgary' ? 'All areas' : 'All districts'; }

const NAME_FIX: Record<string, string> = {
  'PLC': 'Peter Lougheed Centre (PLC)',
  'Foothills': 'Foothills Medical Centre (FMC)',
  'Rockyview': 'Rockyview General Hospital (RGH)',
  'Sheldon Chumir': 'Sheldon Chumir (SCC)',
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

// [name, zone] or [name, zone, district(s)]. District(s) = string or string[].
type Sub = string | string[];
type Item = [string, string] | [string, string, Sub];
type Group = { line: LineKey; digit: string; group: string; items: Item[] };

const menu: Group[] = [
  { line: 'south', digit: '3', group: 'Calgary Metro Hospitals', items: [
    ['Foothills', 'Calgary', ['Metro']], ["Children's Hospital", 'Calgary', ['Metro']], ['South Health Campus', 'Calgary', ['Metro']],
    ['Rockyview', 'Calgary', ['Metro']], ['PLC', 'Calgary', ['Metro']], ['Sheldon Chumir', 'Calgary', ['Metro', 'Urgent Care Centres']],
    ['South Calgary UCC', 'Calgary', ['Metro', 'Urgent Care Centres']],
  ]},
  { line: 'south', digit: '4', group: 'Hwy 2 North Hospitals', items: [
    ['Ponoka', 'Central South', 'District 2'], ['Lacombe', 'Central South', 'District 2'], ['Red Deer', 'Central South', 'District 2'],
    ['Innisfail', 'Central South', 'District 2'], ['Olds', 'Central South', 'District 2'], ['Rocky Mountain House', 'Central South', 'District 2'],
    ['Sundre', 'Central South', 'District 2'], ['Didsbury', 'Calgary', ['Suburban']], ['Airdrie Urgent Care', 'Calgary', ['Suburban', 'Urgent Care Centres']],
  ]},
  { line: 'south', digit: '5', group: 'Hwy 2 South Hospitals', items: [
    ['Okotoks', 'Calgary', ['Suburban']], ['Black Diamond', 'Calgary', ['Suburban']], ['High River', 'Calgary', ['Suburban']], ['Vulcan', 'Calgary', ['Suburban']],
    ['Claresholm', 'Calgary', ['Suburban']], ['Fort Macleod', 'Central South', 'District 5'], ['Cardston', 'Central South', 'District 5'],
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
    ['Strathmore', 'Central South', 'District 3'], ['Cochrane', 'Calgary', ['Suburban']], ['Canmore', 'Calgary', ['Suburban']], ['Banff', 'Calgary', ['Suburban']],
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
    ['High level', 'North', 'District 1'], ['Fort Vermilion', 'North', 'District 1'], ['La Crête', 'North', 'District 1'], ['Manning', 'North', 'District 2'], ['Grimshaw', 'North', 'District 1'],
  ]},
  { line: 'north', digit: '5', group: 'Hwy 2 Hospitals', items: [
    ['Wabasca', 'North', 'District 6'], ['Slave lake', 'North', 'District 6'], ['High Prairie', 'North', 'District 6'], ['McLennan', 'North', 'District 6'],
    ['Peace river', 'North', 'District 2'], ['Fair View', 'North', 'District 2'], ['Spirt River', 'North', 'District 3'], ['Grande Prairie', 'North', 'District 9'], ['Beaver Lodge', 'North', 'District 3'],
  ]},
  { line: 'north', digit: '6', group: 'Hwy 16 Hospitals', items: [
    ['Drayton Valley', 'North', 'District 4'], ['Westlock', 'North', 'District 5'], ['Barrhead', 'North', 'District 5'], ['Edson', 'North', 'District 4'],
    ['Hinton', 'North', 'District 4'], ['Jasper', 'North', 'District 4'], ['Grande Cache', 'North', 'District 3'],
  ]},
  { line: 'north', digit: '7', group: 'Hwy 43 Hospitals', items: [
    ['Mayerthorpe', 'North', 'District 4'], ['Swan Hills', 'North', 'District 5'], ['White Court', 'North', 'District 4'], ['Fox Creek', 'North', 'District 3'], ['Valley View', 'North', 'District 3'],
  ]},
  { line: 'north', digit: '8', group: 'Hwy 63 Hospitals', items: [
    ['Fort McMurray', 'North', 'District 10'], ['Lac la Biche', 'North', 'District 7'], ['Boyle', 'North', 'District 7'], ['Athabasca', 'North', 'District 7'], ['Red water', 'North', 'District 5'],
  ]},
  { line: 'north', digit: '9', group: 'Hwy 28 Hospitals', items: [
    ['Cold Lake', 'North', 'District 8'], ['Bonnyville', 'North', 'District 8'], ['Elk Point', 'North', 'District 8'], ['St. Paul', 'North', 'District 8'], ['Smokey Lake', 'North', 'District 7'],
  ]},
];

type Service = { name: string; line: LineKey | null; path: string[]; number?: string; aliases?: string[] };
const services: Service[] = [
  { name: 'OLMC', line: 'south', path: ['1'] },
  { name: 'OLMC', line: 'north', path: ['1'] },
  { name: 'Community Care Consult', line: 'south', path: ['2'], aliases: ['MIH', 'Mobile Integrated Health', 'community paramedic', 'community paramedics'] },
  { name: 'VHR', line: 'north', path: ['2'] },
  { name: 'Labour and Delivery / NICU / EMS Dispatch (SCC/CCC)', line: 'south', path: ['0'], aliases: ['L&D', 'Labour and Delivery', 'NICU', 'EMS Dispatch'] },
  { name: 'Labour and Delivery / NICU / EMS Dispatch (NCC)', line: 'north', path: ['0'], aliases: ['L&D', 'Labour and Delivery', 'NICU', 'EMS Dispatch'] },
  { name: 'Public Safety Communications Centre', line: 'north', path: ['10'], aliases: ['PSCC'] },
  { name: 'STARS Patch Line', line: null, number: '+18885078277', path: [], aliases: ['STARS', 'air ambulance'] },
];

export type Route = { number: string; lineName: string; group: string; path: string[] };
export type Entry = {
  name: string;
  zone: string;
  districts: string[];
  type: 'hospital' | 'service';
  aliases: string[];
  routes: Route[];
};

const tidy = (name: string) => name.trim().replace(/\s+/g, ' ');
const canonical = (name: string) => { const t = tidy(name); return NAME_FIX[t] || t; };
export const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, '');
const toSubs = (v: Sub | undefined): string[] => (Array.isArray(v) ? v : v ? [v] : []);

function buildHospitals(): Entry[] {
  const map = new Map<string, Entry & { aliasSet: Set<string> }>();
  for (const g of menu) {
    g.items.forEach((item, index) => {
      const raw = item[0];
      const zone = item[1];
      const districts = toSubs(item[2]);
      const name = canonical(raw);
      const key = normalize(name);
      if (!map.has(key)) map.set(key, { name, zone, districts, type: 'hospital', aliases: [], aliasSet: new Set(), routes: [] });
      const entry = map.get(key)!;
      if (tidy(raw) !== name) entry.aliasSet.add(raw);
      entry.routes.push({
        number: LINES[g.line].number,
        lineName: LINES[g.line].name,
        group: g.group,
        path: [g.digit, String(index + 1)],
      });
    });
  }
  return [...map.values()].map((e) => ({
    name: e.name, zone: e.zone, districts: e.districts, type: e.type, aliases: [...e.aliasSet], routes: e.routes,
  }));
}

function buildServices(): Entry[] {
  return services.map((s) => {
    const number = s.number || LINES[s.line as LineKey].number;
    const region = s.line ? LINES[s.line].region : 'All zones';
    return {
      name: s.name, zone: region, districts: [], type: 'service' as const, aliases: s.aliases || [],
      routes: [{ number, lineName: s.line ? LINES[s.line].name : s.name, group: 'Direct line', path: s.path }],
    };
  });
}

export const entries: Entry[] = [...buildHospitals(), ...buildServices()];

export function telFor(route: Route): string {
  if (!route.path.length) return `tel:${route.number}`;
  return `tel:${route.number}${WAIT}${route.path.join(WAIT)}`;
}

export function telMain(route: Route): string {
  return `tel:${route.number}`;
}

export function formatPhone(number: string): string {
  return number.replace('+1', '1-').replace(/(\d{1})-(\d{3})(\d{3})(\d{4})/, '$1-$2-$3-$4');
}

export function districtsFor(zone: string): string[] {
  const vals = [...new Set(
    entries.filter((e) => e.type === 'hospital' && e.zone === zone).flatMap((e) => e.districts)
  )];
  if (zone === 'Calgary') return AREA_ORDER.filter((a) => vals.includes(a));
  return vals.sort((a, b) => (parseInt(a.replace(/\D/g, ''), 10) || 0) - (parseInt(b.replace(/\D/g, ''), 10) || 0));
}
