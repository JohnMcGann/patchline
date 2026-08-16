import React, { useMemo, useState } from 'react';
import {
  View, Text, TextInput, Pressable, FlatList, Modal,
  StyleSheet, Linking, Share, Image, StatusBar, Platform,
} from 'react-native';
import {
  entries, ZONES, DISTRICT_ZONES, normalize, telFor, telMain, formatPhone, districtsFor, subLabel, subAllLabel,
  type Entry, type Route,
} from './src/data';

const APP_URL = 'https://patchline.responsecore.ca/';

const C = {
  bg: '#f4f6f9', card: '#ffffff', text: '#102033', muted: '#607089', line: '#dbe2ea',
  brand: '#10233f', accent: '#1f6feb', badgeBg: '#edf4ff', badgeTx: '#174ea6',
  zone2Bg: '#eef7ee', zone2Tx: '#1d6b2a', specialBg: '#fff4e5', specialTx: '#8a4b00',
  secondary: '#edf1f7',
};

const HEADER_TOP = Platform.select({
  android: (StatusBar.currentHeight || 24) + 14,
  ios: 56,
  default: 20,
});

type Tab = 'hospital' | 'service';

export default function App() {
  const [tab, setTab] = useState<Tab>('hospital');
  const [query, setQuery] = useState('');
  const [zone, setZone] = useState('all');
  const [district, setDistrict] = useState('all');
  const [selected, setSelected] = useState<Entry | null>(null);
  const [shareOpen, setShareOpen] = useState(false);

  const showDistrict = tab === 'hospital' && DISTRICT_ZONES.includes(zone);
  const districtOptions = showDistrict ? districtsFor(zone) : [];

  const filtered = useMemo(() => {
    const q = normalize(query);
    return entries
      .filter((e) => {
        if (e.type !== tab) return false;
        const zoneOk = tab !== 'hospital' || zone === 'all' || e.zone === zone;
        const districtOk = !showDistrict || district === 'all' || e.districts.includes(district);
        const text = normalize(`${e.name} ${e.zone} ${e.district} ${e.routes.map((r) => r.group).join(' ')} ${e.aliases.join(' ')}`);
        return zoneOk && districtOk && (!q || text.includes(q));
      })
      .sort((a, b) => a.name.localeCompare(b.name) || a.zone.localeCompare(b.zone));
  }, [tab, query, zone, district, showDistrict]);

  const switchTab = (t: Tab) => { setTab(t); setQuery(''); setZone('all'); setDistrict('all'); };
  const pickZone = (z: string) => { setZone(z); setDistrict('all'); };

  const dial = (url: string) => { Linking.openURL(url).catch(() => {}); };
  const shareApp = async () => {
    try { await Share.share({ message: `OLMC Patch Line dialer — ${APP_URL}`, url: APP_URL }); } catch {}
  };

  const renderCard = ({ item }: { item: Entry }) => {
    const primary = item.routes[0];
    const extra = item.routes.length - 1;
    return (
      <Pressable style={styles.card} onPress={() => setSelected(item)}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <View style={styles.metaRow}>
          <Text style={[styles.badge, styles.badgeZone]}>{item.zone}</Text>
          {item.districts.map((d) => (<Text key={d} style={[styles.badge, styles.badgeDistrict]}>{d}</Text>))}
          <Text style={styles.metaText}>{primary.group}</Text>
          {primary.path.length ? <Text style={styles.metaText}>Press {primary.path.join(' → ')}</Text> : <Text style={styles.metaText}>Direct dial</Text>}
          {extra > 0 ? <Text style={[styles.badge, styles.badgeAlt]}>+{extra} other route{extra > 1 ? 's' : ''}</Text> : null}
        </View>
      </Pressable>
    );
  };

  const header = (
    <View>
      <View style={styles.tabs}>
        {(['hospital', 'service'] as Tab[]).map((t) => (
          <Pressable key={t} style={[styles.tab, tab === t && styles.tabActive]} onPress={() => switchTab(t)}>
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>{t === 'hospital' ? 'Hospitals' : 'Services'}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.controls}>
        <Text style={styles.label}>Search</Text>
        <TextInput
          style={styles.search}
          placeholder={tab === 'hospital' ? 'e.g. Foothills, Red Deer, Lethbridge' : 'e.g. STARS, L&D, MIH, OLMC'}
          placeholderTextColor={C.muted}
          value={query}
          onChangeText={setQuery}
          autoCorrect={false}
        />

        {tab === 'hospital' && (
          <Dropdown
            label="Zone"
            value={zone}
            options={['all', ...ZONES]}
            display={(z) => (z === 'all' ? 'All zones' : `${z} Zone`)}
            onSelect={pickZone}
          />
        )}

        {showDistrict && districtOptions.length > 0 && (
          <Dropdown
            label={subLabel(zone)}
            value={district}
            options={['all', ...districtOptions]}
            display={(d) => (d === 'all' ? subAllLabel(zone) : d)}
            onSelect={setDistrict}
          />
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <View style={[styles.header, { paddingTop: HEADER_TOP }]}>
        <View style={{ flex: 1 }}>
          <Text style={styles.h1}>OLMC Patch Line</Text>
          <Text style={styles.sub}>Select a hospital or line, confirm the number tree, then tap dial.</Text>
        </View>
        <Pressable style={styles.shareBtn} onPress={() => setShareOpen(true)}>
          <Text style={styles.shareBtnText}>Share</Text>
        </Pressable>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item, i) => `${item.name}-${item.zone}-${i}`}
        renderItem={renderCard}
        ListHeaderComponent={header}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={<Text style={styles.empty}>No match found.</Text>}
      />

      {/* Dial modal */}
      <Modal visible={!!selected} transparent animationType="fade" onRequestClose={() => setSelected(null)}>
        <View style={styles.backdrop}>
          <View style={styles.modal}>
            {selected && <DialContent entry={selected} onDial={dial} onClose={() => setSelected(null)} />}
          </View>
        </View>
      </Modal>

      {/* Share modal */}
      <Modal visible={shareOpen} transparent animationType="fade" onRequestClose={() => setShareOpen(false)}>
        <View style={styles.backdrop}>
          <View style={styles.modal}>
            <View style={styles.modalHead}>
              <Text style={styles.modalTitle}>Share this app</Text>
              <Pressable onPress={() => setShareOpen(false)}><Text style={styles.close}>×</Text></Pressable>
            </View>
            <Image source={require('./assets/qr.png')} style={styles.qr} resizeMode="contain" />
            <Text style={styles.small}>Scan the code, or share the link:</Text>
            <Text style={styles.url}>patchline.responsecore.ca</Text>
            <Pressable style={[styles.button, styles.primary]} onPress={shareApp}>
              <Text style={styles.primaryText}>Share…</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function Dropdown({ label, value, options, display, onSelect }: {
  label: string; value: string; options: string[]; display: (v: string) => string; onSelect: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <Pressable style={styles.select} onPress={() => setOpen(true)}>
        <Text style={styles.selectText}>{display(value)}</Text>
        <Text style={styles.chev}>▾</Text>
      </Pressable>
      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <View style={styles.sheet}>
            {options.map((o) => (
              <Pressable key={o} style={styles.sheetItem} onPress={() => { onSelect(o); setOpen(false); }}>
                <Text style={[styles.sheetItemText, o === value && styles.sheetItemActive]}>{display(o)}</Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

function DialContent({ entry, onDial, onClose }: { entry: Entry; onDial: (u: string) => void; onClose: () => void }) {
  const primary = entry.routes[0];
  const rows: [string, string][] = [
    ['Dial', formatPhone(primary.number)],
    ...primary.path.map((digit, i): [string, string] => {
      const right = i === 0 && primary.group && primary.group !== 'Direct line' ? primary.group : entry.name;
      return [`Then press ${digit}`, right];
    }),
  ];
  return (
    <>
      <View style={styles.modalHead}>
        <Text style={styles.modalTitle}>{entry.name}</Text>
        <Pressable onPress={onClose}><Text style={styles.close}>×</Text></Pressable>
      </View>

      <View style={styles.tree}>
        {rows.map(([left, right], i) => (
          <View key={i} style={[styles.step, i < rows.length - 1 && styles.stepBorder]}>
            <Text style={styles.stepLeft}>{left}</Text>
            <Text style={styles.stepRight}>{right}</Text>
          </View>
        ))}
      </View>

      {entry.routes.length > 1 && (
        <View style={styles.altBox}>
          <Text style={styles.altHead}>Other routes to {entry.name}:</Text>
          {entry.routes.slice(1).map((r: Route, i) => (
            <View key={i} style={styles.altRoute}>
              <Text style={styles.altText}>{r.group}: press {r.path.join(' → ')}</Text>
              <Pressable style={styles.altDial} onPress={() => onDial(telFor(r))}><Text style={styles.altDialText}>Dial</Text></Pressable>
            </View>
          ))}
        </View>
      )}

      <Text style={styles.small}>
        After the call connects, your phone holds each digit and asks before sending it — tap send when you hear the matching menu prompt. If your phone ignores this, use “Dial main line” and press the digits yourself.
      </Text>

      <View style={styles.buttons}>
        <Pressable style={[styles.button, styles.secondary]} onPress={() => onDial(telMain(primary))}>
          <Text style={styles.secondaryText}>Dial main line</Text>
        </Pressable>
        <Pressable style={[styles.button, styles.primary]} onPress={() => onDial(telFor(primary))}>
          <Text style={styles.primaryText}>{primary.path.length ? `Dial + send ${primary.path.join(' → ')}` : 'Dial now'}</Text>
        </Pressable>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.bg },
  header: { backgroundColor: C.brand, paddingBottom: 16, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  h1: { color: '#fff', fontSize: 22, fontWeight: '800' },
  sub: { color: '#d9e5f5', fontSize: 13, marginTop: 4 },
  shareBtn: { backgroundColor: '#fff', borderRadius: 12, paddingVertical: 9, paddingHorizontal: 14, marginTop: 2 },
  shareBtnText: { color: C.brand, fontWeight: '800' },

  tabs: { flexDirection: 'row', gap: 8, padding: 12, paddingBottom: 6 },
  tab: { flex: 1, borderWidth: 1, borderColor: C.line, backgroundColor: C.card, borderRadius: 12, paddingVertical: 13, alignItems: 'center' },
  tabActive: { backgroundColor: C.brand, borderColor: C.brand },
  tabText: { color: C.muted, fontWeight: '800', fontSize: 16 },
  tabTextActive: { color: '#fff' },

  controls: { backgroundColor: C.card, borderWidth: 1, borderColor: C.line, borderRadius: 16, padding: 14, marginHorizontal: 12, marginTop: 6, marginBottom: 4, gap: 6 },
  label: { fontWeight: '700', fontSize: 14, color: C.text, marginTop: 4 },
  search: { borderWidth: 1, borderColor: C.line, borderRadius: 12, paddingHorizontal: 13, paddingVertical: 12, fontSize: 16, backgroundColor: '#fff', color: C.text },
  select: { borderWidth: 1, borderColor: C.line, borderRadius: 12, paddingHorizontal: 13, paddingVertical: 13, backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  selectText: { fontSize: 16, color: C.text },
  chev: { fontSize: 14, color: C.muted },

  sheet: { backgroundColor: '#fff', borderRadius: 16, padding: 8 },
  sheetItem: { paddingVertical: 13, paddingHorizontal: 12, borderRadius: 10 },
  sheetItemText: { fontSize: 16, color: C.text },
  sheetItemActive: { color: C.accent, fontWeight: '800' },

  list: { paddingHorizontal: 12, paddingTop: 0, paddingBottom: 90, gap: 10 },
  card: { backgroundColor: '#fff', borderWidth: 1, borderColor: C.line, borderRadius: 16, padding: 14 },
  cardTitle: { fontSize: 17, fontWeight: '700', color: C.text, marginBottom: 6 },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 6 },
  metaText: { color: C.muted, fontSize: 13 },
  badge: { overflow: 'hidden', borderRadius: 999, paddingVertical: 3, paddingHorizontal: 8, fontSize: 12, fontWeight: '600' },
  badgeZone: { backgroundColor: C.badgeBg, color: C.badgeTx },
  badgeDistrict: { backgroundColor: C.zone2Bg, color: C.zone2Tx },
  badgeAlt: { backgroundColor: C.specialBg, color: C.specialTx },
  empty: { textAlign: 'center', color: C.muted, padding: 30 },

  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', padding: 18 },
  modal: { backgroundColor: '#fff', borderRadius: 20, padding: 18 },
  modalHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  modalTitle: { fontSize: 19, fontWeight: '800', color: C.text, flex: 1, paddingRight: 10 },
  close: { fontSize: 30, color: C.muted, lineHeight: 30 },

  tree: { borderWidth: 1, borderColor: C.line, borderRadius: 14, overflow: 'hidden', marginBottom: 12 },
  step: { flexDirection: 'row', justifyContent: 'space-between', gap: 10, padding: 12 },
  stepBorder: { borderBottomWidth: 1, borderBottomColor: C.line },
  stepLeft: { fontWeight: '700', color: C.text },
  stepRight: { color: C.text, flexShrink: 1, textAlign: 'right' },

  altBox: { borderWidth: 1, borderColor: C.line, borderRadius: 14, paddingHorizontal: 12, paddingVertical: 6, marginBottom: 12 },
  altHead: { fontWeight: '700', fontSize: 13, marginVertical: 8 },
  altRoute: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, paddingVertical: 6, borderTopWidth: 1, borderTopColor: C.line },
  altText: { fontSize: 13, color: C.text, flexShrink: 1 },
  altDial: { backgroundColor: C.accent, borderRadius: 10, paddingVertical: 8, paddingHorizontal: 14 },
  altDialText: { color: '#fff', fontWeight: '800' },

  small: { color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 18 },
  buttons: { gap: 10 },
  button: { borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  primary: { backgroundColor: C.accent },
  primaryText: { color: '#fff', fontWeight: '800', fontSize: 16 },
  secondary: { backgroundColor: C.secondary },
  secondaryText: { color: C.text, fontWeight: '800', fontSize: 16 },

  qr: { width: 220, height: 220, alignSelf: 'center', marginBottom: 12, borderWidth: 1, borderColor: C.line, borderRadius: 12 },
  url: { textAlign: 'center', fontWeight: '700', color: C.accent, marginBottom: 12 },
});
