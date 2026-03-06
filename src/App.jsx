import React, { useState, useMemo, useRef, useEffect } from 'react';

// --- 0. 아이콘 내장 (외부 라이브러리 의존성 100% 제거) ---
const Icons = {
  Users: ({size=24, className=""}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Activity: ({size=24, className=""}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  MousePointer2: ({size=24, className=""}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m14 4.1 2.8 2.8L21 2.7l1.3 1.3-4.2 4.2L21 11l-7 1Z"/><path d="m3 3 7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/></svg>,
  TrendingUp: ({size=24, className=""}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>,
  BarChart3: ({size=24, className=""}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 3v18h18"/><rect width="4" height="7" x="7" y="10" rx="1"/><rect width="4" height="12" x="15" y="5" rx="1"/></svg>,
  BarChart: ({size=24, className=""}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" x2="12" y1="20" y2="10"/><line x1="18" x2="18" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="16"/></svg>,
  ListFilter: ({size=24, className=""}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 6h18"/><path d="M7 12h10"/><path d="M10 18h4"/></svg>,
  ChevronDown: ({size=24, className=""}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="6 9 12 15 18 9"/></svg>,
  Sigma: ({size=24, className=""}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 7V4H6l6 8-6 8h12v-3"/></svg>,
  Upload: ({size=24, className=""}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>,
  AlertCircle: ({size=24, className=""}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>,
  ArrowUpRight: ({size=24, className=""}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>,
  ArrowDownRight: ({size=24, className=""}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M7 17h10V7"/><path d="M7 7l10 10"/></svg>,
  Table: ({size=24, className=""}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="3" x2="21" y1="9" y2="9"/><line x1="3" x2="21" y1="15" y2="15"/><line x1="12" x2="12" y1="3" y2="21"/></svg>,
  Layers: ({size=24, className=""}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>,
  Trophy: ({size=24, className=""}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>,
  DollarSign: ({size=24, className=""}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  PieChart: ({size=24, className=""}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>,
  Building: ({size=24, className=""}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>,
  MonitorSmartphone: ({size=24, className=""}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 8V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h8"/><path d="M10 19v-3.96 3.15"/><path d="M7 19h5"/><rect width="6" height="10" x="16" y="12" rx="2"/></svg>
};

// --- 1. 기본 내장 데이터 ---
const rawDataComplete = `FLAG	AGE	MEDIA	REACH				GRP				A.F.				IMP.			
			202510	202511	202512	202601	202510	202511	202512	202601	202510	202511	202512	202601	202510	202511	202512	202601
PC∪MO	개인전체	Afreecatv	1.87	1.65	1.17	1.64	28.01	16.78	10.1	6.87	15.01	10.18	8.67	4.18	14,749,050	9,742,663	10,442,247	8,493,232
PC∪MO	개인전체	Daum	4.84	4.32	5	5.45	31.36	23.69	24.9	32.3	6.48	5.48	4.98	5.93	15,419,105	15,573,797	15,311,292	17,847,877
PC∪MO	개인전체	Instagram	34.23	32.58	31.16	29.35	605.83	650.53	692.54	623.71	17.7	19.97	22.23	21.25	381,680,254	430,774,993	454,781,505	514,169,171
PC∪MO	개인전체	Naver	39.88	41.97	36.32	38.52	372.1	463.95	369.26	411.24	9.33	11.05	10.17	10.68	196,475,282	244,552,343	210,564,557	233,497,365
PC∪MO	개인전체	SMR	57.45	58.43	55.53	47.73	305.55	313.5	257.57	234.66	5.32	5.36	4.64	4.92	159,331,988	179,098,521	175,203,907	128,326,471
PC∪MO	개인전체	Youtube	79.97	77.64	76.11	75.54	3,755.95	3,792.66	3,710.82	4,312.51	46.97	48.85	48.75	57.09	1,945,047,853	2,045,685,392	2,249,224,315	2,491,469,595`;

const rawDataPanel = `MONTHCODE	ACCESS_DAY	PANEL_NO	FUSION	FLAG	SITE_CODE	COPYLINE_ID	START_TIME	AD_SEC	MEDIA	PRICE	package_name/path_name	REF_URL	GUBUN	YT_SMR	MEDIA_GROUP	BRAND	AGE_CLS	AGE
202510	20251023	103983	o	MO	89001	L14	72324	6	Youtube	0	com.youtube		A		Youtube	브랜드A	5054	50대
202510	20251023	103983	o	MO	89001	L14	72500	6	Youtube	0	com.youtube		A		Youtube	브랜드A	5054	50대
202510	20251015	36926	x	MO	89001	L14	124413	6	Instagram	0	com.instagram		A		Instagram	브랜드B	6069	60대
202511	20251114	36926		PC	89001	L14	203434	5	Youtube	0	YOUTUBE		A		Youtube	브랜드B	6069	60대
202511	20251103	102325	o	MO	89001	L14	195417	6	Youtube	0	com.youtube		A		Youtube	브랜드C	5559	50대
202512	20251231	31057	o	MO	89011	L14	2948	6	Instagram	0	com.instagram		A		Instagram	브랜드D	1924	20대
202512	20251206	22296	x	MO	89011	L14	204327	6	Naver	0	com.naver		A		Naver	브랜드A	4549	40대
202601	20260106	30022	o	MO	89001	L14	13547	11	Youtube	0	com.youtube		A		Youtube	브랜드E	5559	50대
202601	20260126	37708	o	MO	89001	L14	181102	6	Youtube	0	com.youtube		A		Youtube	브랜드F	4044	40대
202601	20260126	37708	o	MO	89001	L14	74732	6	Instagram	0	com.instagram		A		Instagram	브랜드G	4044	40대
202601	20260126	37708	o	MO	89001	L14	74301	6	Youtube	0	com.youtube		A		Youtube	브랜드H	4044	40대`;

const rawDataCost = `Date	Media	Brand	Advertiser	Category	Imp.PC	Imp.MO	Default Cost	Cost.PC	Cost.MO	Est Default	Est. Cost(PC)	Est. Cost(MO)	Est. CPM(PC)	Est. CPM(MO)
Dec-25	GOMTV	그랜저	현대자동차	대형승용차	2,244	1,100			118,166	118,166.29	50,000	52,659	26,000
Dec-25	Naver	네이버파이낸셜	네이버파이낸셜	바코드	2400	5000			3,029	3,029.43	1,500	126,226	150,000
Dec-25	Youtube	넷플릭스	넷플릭스	인터넷서비스	33,780	80000			1,055,013	1,055,013.05	31,232	500,000	800,000
Nov-25	GOMTV	그랜저	현대자동차	대형승용차	2,000	1,000			100,000	100,000.00	40,000	50,000	25,000
Nov-25	Naver	네이버파이낸셜	네이버파이낸셜	바코드	2000	4000			2,500	2,500.00	1,000	100,000	120,000
Nov-25	Youtube	넷플릭스	넷플릭스	인터넷서비스	30,000	70000			900,000	900,000.00	25,000	450,000	750,000
Oct-25	GOMTV	그랜저	현대자동차	대형승용차	1,800	900			90,000	90,000.00	30,000	45,000	20,000
Oct-25	Naver	네이버파이낸셜	네이버파이낸셜	바코드	1800	3500			2,000	2,000.00	800	90,000	110,000
Oct-25	Youtube	넷플릭스	넷플릭스	인터넷서비스	28,000	60000			800,000	800,000.00	20,000	400,000	650,000`;

// --- 2. 메트릭 및 디자인 설정 ---
const METRICS_COMPLETE = {
  reach: { label: 'Reach (%)', color: 'blue', type: 'avg' },
  grp: { label: 'GRP', color: 'red', type: 'sum' },
  af: { label: 'Avg. Freq', color: 'green', type: 'avg' },
  imp: { label: 'Impressions', color: 'yellow', type: 'sum' }
};

const METRICS_PANEL = {
  reach: { label: 'Panel Cnt (명)', color: 'blue', type: 'sum' },
  imp: { label: 'Impressions', color: 'yellow', type: 'sum' }
};

const METRICS_COST = {
  estCost: { label: 'Est. Cost (원)', color: 'green', type: 'sum' },
  imp: { label: 'Impressions', color: 'yellow', type: 'sum' }
};

const BASE_COLORS = {
  'SMR': '#84cc16', 'AFREECATV': '#ec4899', 'GOMTV': '#f43f5e',
  'YOUTUBE': '#ef4444', 'NAVER': '#22c55e', 'DAUM': '#3b82f6',
  'TVING': '#ef4444', 'INSTAGRAM': '#8b5cf6', 'TOTAL': '#111827', '전체': '#111827'
};

const getColor = (media) => {
  if (!media) return '#9ca3af'; 
  const up = media.toUpperCase();
  if (BASE_COLORS[up]) return BASE_COLORS[up];
  let h = 0; for (let i = 0; i < media.length; i++) h = media.charCodeAt(i) + ((h << 5) - h);
  return `hsl(${Math.abs(h) % 360}, 70%, 50%)`;
};

const getDashArray = (idx) => ["", "6, 6", "2, 4", "8, 4, 2, 4"][idx % 4];
const safeTrim = (str) => typeof str === 'string' ? str.replace(/["\r\n\t]/g, '').trim() : '';

// --- 3. 데이터 파서 ---
const parseCompleteData = (texts) => {
  const textArray = Array.isArray(texts) ? texts : [texts];
  let allParsed = [];

  textArray.forEach(text => {
    const lines = text.split(/\r?\n/);
    let headerIdx = lines.findIndex(l => l.toUpperCase().includes('REACH') || l.toUpperCase().includes('IMP'));
    if (headerIdx === -1) return;
    const sep = lines[headerIdx].includes('\t') ? '\t' : ',';
    
    const getCols = (line) => {
      let inQuote = false, cur = '', cols = [];
      for (let char of line) {
         if (char === '"') inQuote = !inQuote; 
         else if (char === sep && !inQuote) { cols.push(cur.trim()); cur = ''; }
         else cur += char;
      }
      cols.push(cur.trim()); return cols;
    };
    
    const h1 = getCols(lines[headerIdx]), h2 = getCols(lines[headerIdx + 1]);
    let rIdx = -1, gIdx = -1, aIdx = -1, iIdx = -1;
    h1.forEach((v, i) => {
      const up = v.toUpperCase();
      if (up.includes('REACH') || up.includes('도달')) rIdx = i;
      else if (up.includes('GRP')) gIdx = i;
      else if (up.includes('A.F') || up.includes('빈도')) aIdx = i;
      else if (up.includes('IMP') || up.includes('노출')) iIdx = i;
    });

    const months = [];
    const sIdx = Math.max(0, rIdx !== -1 ? rIdx : (iIdx !== -1 ? iIdx : 3));
    for (let i = sIdx; i < h2.length; i++) {
      const m = h2[i].replace(/[^\d]/g, '');
      if (m.length >= 4 && !months.includes(m)) months.push(m);
      else if (months.length > 0 && months[0] === m) break; 
    }

    for (let i = headerIdx + 2; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      const cols = getCols(lines[i]);
      if (cols.length < 3) continue;
      
      const flag = safeTrim(cols[0]);
      const age = safeTrim(cols[1]);
      const media = safeTrim(cols[2]);
      
      if (!flag || !age || !media || flag === '' || age === '' || media === '') continue;
      if (flag.toUpperCase() === 'TV' || (!isNaN(media) && media !== '')) continue;
      
      for (let m = 0; m < months.length; m++) {
         const sp = (idx) => idx === -1 || !cols[idx] ? 0 : (parseFloat(cols[idx].replace(/,/g, '').replace(/\s/g, '')) || 0);
         allParsed.push({ 
           month: months[m], flag, age, media, 
           reach: sp(rIdx !== -1 ? rIdx + m : -1),
           grp: sp(gIdx !== -1 ? gIdx + m : -1),
           af: sp(aIdx !== -1 ? aIdx + m : -1),
           imp: sp(iIdx !== -1 ? iIdx + m : -1)
         });
      }
    }
  });
  
  const uniqueMap = new Map();
  allParsed.forEach(item => {
      uniqueMap.set(`${item.month}|${item.flag}|${item.age}|${item.media}`, item);
  });
  return Array.from(uniqueMap.values());
};

const parsePanelData = (texts) => {
  const textArray = Array.isArray(texts) ? texts : [texts];
  const agg = {};
  const brandAgg = {}; 

  textArray.forEach(text => {
    const lines = text.split(/\r?\n/);
    const headerLine = lines.find(l => l.toUpperCase().includes('MONTHCODE') && l.toUpperCase().includes('PANEL_NO'));
    if (!headerLine) return;

    const sep = headerLine.includes('\t') ? '\t' : ',';
    const headers = headerLine.split(sep).map(h => h.trim().toUpperCase());
    const mIdx = headers.indexOf('MONTHCODE'), pIdx = headers.indexOf('PANEL_NO');
    const fIdx = headers.indexOf('FLAG'), medIdx = headers.indexOf('MEDIA'), aIdx = headers.indexOf('AGE');
    const bIdx = headers.indexOf('BRAND');

    if ([mIdx, pIdx, fIdx, medIdx, aIdx].includes(-1)) return;

    for (let i = lines.indexOf(headerLine) + 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      const cols = lines[i].split(sep).map(c => c.trim().replace(/^"|"$/g, ''));
      if (cols.length < Math.max(mIdx, pIdx, fIdx, medIdx, aIdx)) continue;
      
      const m = safeTrim(cols[mIdx]);
      const p = safeTrim(cols[pIdx]);
      const f = safeTrim(cols[fIdx]);
      const med = safeTrim(cols[medIdx]);
      const a = safeTrim(cols[aIdx]);
      const brand = bIdx !== -1 ? safeTrim(cols[bIdx]) : 'Unknown';
      
      if (!m || !p || !f || !med || !a || m === '' || a === '') continue;

      const combinations = [
        { flag: f, age: a },
        { flag: f, age: '개인전체' } 
      ];
      if (f.toUpperCase() === 'PC' || f.toUpperCase() === 'MO') {
        combinations.push({ flag: 'PC∪MO', age: a });
        combinations.push({ flag: 'PC∪MO', age: '개인전체' });
      }
      combinations.forEach(({ flag: flg, age: ag }) => {
        const key = `${m}|${flg}|${ag}|${med}`;
        if (!agg[key]) agg[key] = { month: m, flag: flg, age: ag, media: med, imp: 0, panels: new Set() };
        agg[key].imp += 1;
        agg[key].panels.add(p);
      });

      if (brand && brand !== '') {
        if (!brandAgg[brand]) brandAgg[brand] = { MO: new Set(), PC: new Set(), ALL: new Set() };
        if (f.toUpperCase() === 'MO') brandAgg[brand].MO.add(p);
        if (f.toUpperCase() === 'PC') brandAgg[brand].PC.add(p);
        brandAgg[brand].ALL.add(p);
      }
    }
  });

  if (Object.keys(agg).length === 0) return null;

  const brandData = Object.entries(brandAgg).map(([brand, counts]) => ({
    brand,
    MO: counts.MO.size,
    PC: counts.PC.size,
    GrandTotal: counts.ALL.size 
  })).sort((a, b) => b.GrandTotal - a.GrandTotal);

  return {
    mediaData: Object.values(agg).map(v => ({
      month: v.month, flag: v.flag, age: v.age, media: v.media,
      reach: v.panels.size,
      grp: 0,
      af: v.imp / v.panels.size,
      imp: v.imp
    })),
    brandData
  };
};

const parseCostData = (texts) => {
  const textArray = Array.isArray(texts) ? texts : [texts];
  const agg = {};
  const monthMap = { 'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04', 'May': '05', 'Jun': '06', 'Jul': '07', 'Aug': '08', 'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12' };

  textArray.forEach(text => {
    const lines = text.split(/\r?\n/);
    const headerLine = lines.find(l => l.toUpperCase().includes('MEDIA') && l.toUpperCase().includes('IMP.PC'));
    if (!headerLine) return;

    const sep = headerLine.includes('\t') ? '\t' : ',';
    
    const getCols = (line) => {
      let inQuote = false, cur = '', cols = [];
      for (let char of line) {
         if (char === '"') inQuote = !inQuote; 
         else if (char === sep && !inQuote) { cols.push(cur.trim()); cur = ''; }
         else cur += char;
      }
      cols.push(cur.trim()); return cols;
    };

    const rawHeaders = getCols(headerLine);
    const headersNorm = rawHeaders.map(h => h.toUpperCase().replace(/[^A-Z0-9가-힣]/g, ''));
    
    const dateIdx = headersNorm.findIndex(h => h.includes('DATE') || h.includes('MONTH') || h === '날짜' || h === '월');
    const mediaIdx = headersNorm.findIndex(h => h.includes('MEDIA') || h === '매체');
    const impPcIdx = headersNorm.findIndex(h => h.includes('IMPPC') || h.includes('IMPRESSIONPC'));
    const impMoIdx = headersNorm.findIndex(h => h.includes('IMPMO') || h.includes('IMPRESSIONMO'));
    
    const costPcIdx = headersNorm.findIndex(h => h.includes('ESTCOSTPC'));
    const costMoIdx = headersNorm.findIndex(h => h.includes('ESTCOSTMO') || h.includes('ESTCOSTM'));
    
    let advIdx = headersNorm.findIndex(h => h.includes('ADVERTISER') || h.includes('광고주'));
    if (advIdx === -1) {
        advIdx = headersNorm.findIndex(h => h.includes('BRAND') || h.includes('브랜드'));
    }

    if (mediaIdx === -1 || impPcIdx === -1) return;

    for (let i = lines.indexOf(headerLine) + 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      const cols = getCols(lines[i]);
      if (cols.length <= Math.max(mediaIdx, impPcIdx)) continue;

      let rawDate = dateIdx !== -1 && cols[dateIdx] ? safeTrim(cols[dateIdx]) : '202512';
      let monthStr = rawDate;
      if (rawDate.includes('-')) {
        const [mon, yy] = rawDate.split('-');
        const yyyy = yy.length === 2 ? '20' + yy : yy;
        monthStr = yyyy + (monthMap[mon] || mon);
      }

      const media = safeTrim(cols[mediaIdx]);
      const adv = advIdx !== -1 && cols[advIdx] ? safeTrim(cols[advIdx]) : 'Unknown';

      const parseNum = (val) => {
          if(!val || val === '-') return 0;
          return parseFloat(String(val).replace(/,/g, '').replace(/[^\d.-]/g, '')) || 0;
      };
      
      const impPc = parseNum(cols[impPcIdx]);
      const impMo = impMoIdx !== -1 && cols[impMoIdx] ? parseNum(cols[impMoIdx]) : 0;
      const costPc = costPcIdx !== -1 && cols[costPcIdx] ? parseNum(cols[costPcIdx]) : 0;
      const costMo = costMoIdx !== -1 && cols[costMoIdx] ? parseNum(cols[costMoIdx]) : 0;

      if (!media) continue;

      const add = (flag, imp, cost, advName) => {
         if (imp === 0 && cost === 0) return;

         const key = `${monthStr}|${flag}|전체|${media}`;
         if (!agg[key]) agg[key] = { month: monthStr, flag, age: '전체', media, imp: 0, estCost: 0, advertisers: new Set() };
         agg[key].imp += imp;
         agg[key].estCost += cost;
         if (advName && advName !== 'Unknown') agg[key].advertisers.add(advName);
      };

      add('PC', impPc, costPc, adv);
      add('MO', impMo, costMo, adv);
      add('PC∪MO', impPc + impMo, costPc + costMo, adv);
    }
  });
  
  return Object.values(agg).sort((a, b) => a.month.localeCompare(b.month));
};

// --- 4. 공통 컴포넌트: COST 전용 혼합 차트 (바 + 라인) ---
const CostMixedChart = ({ data, activeMetric, months, medias, selectedFlags, selectedAge }) => {
    const [tooltip, setTooltip] = useState(null);
    
    const chartData = useMemo(() => {
        if (!months || months.length === 0) return [];
        return months.map(m => {
            let total = 0;
            const mediaVals = {};
            medias.forEach(media => {
                const items = data.filter(d => d.month === m && d.media === media && selectedFlags.includes(d.flag) && d.age === selectedAge);
                const val = items.reduce((a, c) => a + (c[activeMetric] || 0), 0);
                mediaVals[media] = val;
                total += val;
            });
            return { month: m, total, ...mediaVals };
        });
    }, [data, months, medias, selectedFlags, selectedAge, activeMetric]);

    if (!data || data.length === 0 || medias.length === 0 || chartData.length === 0) return <div className="h-[300px] flex items-center justify-center text-gray-300">데이터가 없습니다.</div>;

    const maxTotal = Math.max(...chartData.map(d => d.total), 1) * 1.15;
    const getStep = (range, target) => {
        if (range <= 0) return 1;
        const step = range / target, mag = Math.floor(Math.log10(step)), magPow = Math.pow(10, mag), norm = step / magPow;
        return (norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 5 ? 5 : 10) * magPow;
    };
    const maxValue = Math.max(getStep(maxTotal, 4) * 4, 1);
    
    const w = 800, h = 350, px = 70, py = 50;
    const bandW = (w - px * 2) / Math.max(months.length, 1);
    const barW = Math.min(bandW * 0.4, 60);
    const getX = (i) => px + i * bandW + bandW / 2;
    const getY = (v) => h - py - (v * (h - py * 2) / maxValue);

    const isCost = activeMetric === 'estCost';

    const formatAxisValue = (val) => {
        if (isCost) {
            if (val >= 100000000) return Math.round(val / 100000000).toLocaleString();
            if (val >= 10000) return Math.round(val / 10000).toLocaleString() + '만';
            return Math.round(val).toLocaleString();
        } else {
            return val >= 1000000 ? (val/1000000).toFixed(1) + 'M' : Math.round(val/1000).toLocaleString() + 'k';
        }
    };
    
    const unitLabel = isCost ? (maxValue >= 100000000 ? "단위: 억원" : maxValue >= 10000 ? "단위: 만원" : "단위: 원") : "단위: 노출";

    return (
        <div className="w-full relative">
            <div className="flex flex-wrap justify-end gap-5 mb-4 pr-10">
                <div className="flex items-center gap-1.5">
                    <div className="w-3.5 h-3.5 rounded-sm bg-[#bfdbfe] shadow-sm"></div>
                    <span className="text-[11px] font-bold text-gray-600">총합계</span>
                </div>
                {medias.map(m => (
                    <div key={m} className="flex items-center gap-1.5">
                        <div className="w-4 h-1 rounded-full" style={{backgroundColor: getColor(m)}}></div>
                        <span className="text-[11px] font-bold text-gray-600">{m}</span>
                    </div>
                ))}
            </div>

            <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto overflow-visible">
                {[0, 0.25, 0.5, 0.75, 1].map((v, i) => {
                    const yVal = maxValue * v;
                    return (
                        <g key={i}>
                            <line x1={px} y1={getY(yVal)} x2={w - px} y2={getY(yVal)} stroke="#f3f4f6" />
                            <text x={px - 10} y={getY(yVal) + 4} textAnchor="end" fontSize="10" fill="#9ca3af">
                                {formatAxisValue(yVal)}
                            </text>
                        </g>
                    )
                })}
                <text x={px - 10} y={getY(maxValue) - 15} textAnchor="end" fontSize="10" fill="#9ca3af" fontWeight="bold">
                    {unitLabel}
                </text>
                <line x1={px} y1={h - py} x2={w - px} y2={h - py} stroke="#d1d5db" strokeWidth="2" />

                {chartData.map((d, i) => {
                    const x = getX(i) - barW / 2;
                    const barH = (h - py) - getY(d.total);
                    const monthLabel = d.month.length >= 6 ? parseInt(d.month.slice(4), 10) + '월' : d.month;
                    return (
                        <g key={`bar-${d.month}`}>
                            <rect x={x} y={getY(d.total)} width={barW} height={Math.max(barH, 0)} fill="#bfdbfe" opacity="0.9" rx="2" 
                                  onMouseEnter={() => setTooltip({ x: getX(i), y: getY(d.total), val: d.total, label: '총합계', month: monthLabel })}
                                  onMouseLeave={() => setTooltip(null)} />
                            <text x={getX(i)} y={getY(d.total) - 8} textAnchor="middle" fontSize="11" fontWeight="black" fill="#1e3a8a">
                                {formatAxisValue(d.total)}
                            </text>
                            <text x={getX(i)} y={h - 20} textAnchor="middle" fontSize="12" fill="#4b5563" className="font-bold">{monthLabel}</text>
                        </g>
                    );
                })}

                {medias.map((media) => {
                    const pts = chartData.map((d, i) => `${getX(i)},${getY(d[media] || 0)}`).join(' ');
                    const color = getColor(media);
                    return (
                        <g key={`line-${media}`}>
                            <polyline points={pts} fill="none" stroke={color} strokeWidth="3" strokeLinejoin="round"/>
                            {chartData.map((d, i) => (
                                <circle key={i} cx={getX(i)} cy={getY(d[media] || 0)} r="5" fill="white" stroke={color} strokeWidth="2.5"
                                    className="cursor-pointer hover:scale-150 transition-transform origin-center"
                                    style={{ transformOrigin: `${getX(i)}px ${getY(d[media] || 0)}px` }}
                                    onMouseEnter={() => setTooltip({ x: getX(i), y: getY(d[media] || 0), val: d[media] || 0, label: media, month: d.month.length >= 6 ? parseInt(d.month.slice(4), 10) + '월' : d.month })}
                                    onMouseLeave={() => setTooltip(null)} />
                            ))}
                        </g>
                    )
                })}

                {tooltip && (
                    <g transform={`translate(${tooltip.x}, ${tooltip.y - 12})`} className="pointer-events-none z-50">
                        <rect x="-80" y="-55" width="160" height="50" rx="6" fill="#111827" opacity="0.95" />
                        <text x="0" y="-35" textAnchor="middle" fill="#9ca3af" fontSize="10" fontWeight="bold">{tooltip.month} | {tooltip.label}</text>
                        <text x="0" y="-18" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="bold">
                            {isCost ? '₩ ' : ''}{Math.round(tooltip.val).toLocaleString()}
                        </text>
                    </g>
                )}
            </svg>
        </div>
    );
};

// --- 디바이스 비중(MO vs PC) 스택 바 차트 (COST 전용) ---
const DeviceShareStackedBarChart = ({ data, months, selectedMedias, metricKey, title, selectedFlags }) => {
    const [tooltip, setTooltip] = useState(null);

    const chartData = useMemo(() => {
        if (!months || months.length === 0) return [];
        return months.map(m => {
            let pcTotal = 0, moTotal = 0;
            selectedMedias.forEach(media => {
                if (selectedFlags.includes('PC') || selectedFlags.includes('PC∪MO')) {
                    const pcItem = data.find(d => d.month === m && d.media === media && d.flag === 'PC');
                    if (pcItem) pcTotal += pcItem[metricKey] || 0;
                }
                
                if (selectedFlags.includes('MO') || selectedFlags.includes('PC∪MO')) {
                    const moItem = data.find(d => d.month === m && d.media === media && d.flag === 'MO');
                    if (moItem) moTotal += moItem[metricKey] || 0;
                }
            });
            const total = pcTotal + moTotal;
            return { month: m, pcTotal, moTotal, total };
        });
    }, [data, months, selectedMedias, metricKey, selectedFlags]);

    if (chartData.length === 0 || chartData.every(d => d.total === 0)) {
        return <div className="h-[300px] flex items-center justify-center text-gray-300">데이터가 없습니다.</div>;
    }

    const roughMax = Math.max(...chartData.map(d => d.total), 1) * 1.15;
    const getStep = (range, target) => {
        if (range <= 0) return 1;
        const step = range / target, mag = Math.floor(Math.log10(step)), magPow = Math.pow(10, mag), norm = step / magPow;
        return (norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 5 ? 5 : 10) * magPow;
    };
    const maxValue = Math.max(getStep(roughMax, 4) * 4, 1);
    
    const w = 800, h = 300, px = 70, py = 40;
    const bandW = (w - px * 2) / Math.max(months.length, 1);
    const barW = Math.min(bandW * 0.4, 60);
    const margin = (bandW - barW) / 2;

    const getY = (v) => h - py - (v * (h - py * 2) / maxValue);

    const isCost = metricKey === 'estCost';
    const formatAxisValue = (val) => {
        if (isCost) {
            if (val >= 100000000) return Math.round(val / 100000000).toLocaleString();
            if (val >= 10000) return Math.round(val / 10000).toLocaleString() + '만';
            return Math.round(val).toLocaleString();
        } else {
            return val >= 1000000 ? (val/1000000).toFixed(1) + 'M' : Math.round(val/1000).toLocaleString() + 'k';
        }
    };
    const unitLabel = isCost ? (maxValue >= 100000000 ? "단위: 억원" : maxValue >= 10000 ? "단위: 만원" : "단위: 원") : "단위: 노출";

    const pcColor = '#60a5fa'; // tailwind blue-400
    const moColor = '#f87171'; // tailwind red-400

    return (
        <div className="w-full relative flex flex-col items-center">
            <div className="w-full flex justify-between items-center mb-4 px-6">
                <h3 className="text-lg font-black text-gray-700">{title}</h3>
                <div className="flex gap-4">
                    <div className="flex items-center gap-1.5">
                        <div className="w-4 h-4 rounded-sm" style={{backgroundColor: pcColor}}></div>
                        <span className="text-xs font-bold text-gray-600">PC</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-4 h-4 rounded-sm" style={{backgroundColor: moColor}}></div>
                        <span className="text-xs font-bold text-gray-600">MO</span>
                    </div>
                </div>
            </div>
            
            <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto overflow-visible">
                {[0, 0.25, 0.5, 0.75, 1].map((v, i) => (
                    <g key={i}>
                        <line x1={px} y1={getY(maxValue * v)} x2={w - px} y2={getY(maxValue * v)} stroke="#f3f4f6" />
                        <text x={px - 10} y={getY(maxValue * v) + 4} textAnchor="end" fontSize="10" fill="#9ca3af">{formatAxisValue(maxValue * v)}</text>
                    </g>
                ))}
                <text x={px - 10} y={getY(maxValue) - 15} textAnchor="end" fontSize="10" fill="#9ca3af" fontWeight="bold">
                    {unitLabel}
                </text>
                <line x1={px} y1={h - py} x2={w - px} y2={h - py} stroke="#d1d5db" strokeWidth="2" />

                {chartData.map((d, i) => {
                    let currentY = h - py;
                    const barX = px + i * bandW + margin;
                    const monthLabel = d.month.length >= 6 ? parseInt(d.month.slice(4), 10) + '월' : d.month;

                    const pcH = (d.pcTotal / maxValue) * (h - py * 2);
                    const moH = (d.moTotal / maxValue) * (h - py * 2);

                    const elements = [];

                    let bottomVal, bottomLabel, bottomColor, bottomH, bottomFlag;
                    let topVal, topLabel, topColor, topH, topFlag;

                    if (d.moTotal > d.pcTotal) {
                        bottomVal = d.pcTotal; bottomH = pcH; bottomColor = pcColor; bottomFlag = 'PC';
                        topVal = d.moTotal; topH = moH; topColor = moColor; topFlag = 'MO';
                    } else {
                        bottomVal = d.moTotal; bottomH = moH; bottomColor = moColor; bottomFlag = 'MO';
                        topVal = d.pcTotal; topH = pcH; topColor = pcColor; topFlag = 'PC';
                    }

                    if (bottomVal > 0) {
                        currentY -= bottomH;
                        elements.push(
                            <rect key="bottom" x={barX} y={currentY} width={barW} height={bottomH} fill={bottomColor} rx="2"
                                className="cursor-pointer transition-opacity hover:opacity-80 stroke-white stroke-[2px]"
                                onMouseEnter={() => setTooltip({ x: barX + barW/2, y: currentY + bottomH/2, val: bottomVal, flag: bottomFlag, month: monthLabel, total: d.total })}
                                onMouseLeave={() => setTooltip(null)} />
                        );
                    }

                    if (topVal > 0) {
                        currentY -= topH;
                        elements.push(
                            <rect key="top" x={barX} y={currentY} width={barW} height={topH} fill={topColor} rx="2"
                                className="cursor-pointer transition-opacity hover:opacity-80 stroke-white stroke-[2px]"
                                onMouseEnter={() => setTooltip({ x: barX + barW/2, y: currentY + topH/2, val: topVal, flag: topFlag, month: monthLabel, total: d.total })}
                                onMouseLeave={() => setTooltip(null)} />
                        );
                    }

                    return (
                        <g key={d.month}>
                            {elements}
                            {d.total > 0 && (
                                <text x={barX + barW/2} y={getY(d.total) - 8} textAnchor="middle" fontSize="11" fontWeight="black" fill="#1e3a8a">
                                    {formatAxisValue(d.total)}
                                </text>
                            )}
                            <text x={barX + barW/2} y={h - 15} textAnchor="middle" fontSize="12" fill="#4b5563" className="font-bold">{monthLabel}</text>
                        </g>
                    );
                })}

                {tooltip && (
                    <g transform={`translate(${tooltip.x}, ${tooltip.y - 15})`} className="pointer-events-none z-50">
                        <rect x="-80" y="-55" width="160" height="50" rx="6" fill="#111827" opacity="0.95" />
                        <text x="0" y="-35" textAnchor="middle" fill="#9ca3af" fontSize="10" fontWeight="bold">{tooltip.month} | {tooltip.flag}</text>
                        <text x="0" y="-18" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold">
                            {isCost ? '₩ ' : ''}{Math.round(tooltip.val).toLocaleString()}
                            <tspan fill="#fbbf24"> ({((tooltip.val / tooltip.total) * 100).toFixed(1)}%)</tspan>
                        </text>
                    </g>
                )}
            </svg>
        </div>
    );
};

// --- 디바이스 비중(MO vs PC) 비교 테이블 (COST 전용) ---
const DeviceShareTable = ({ data, months, selectedMedias, activeMetric, selectedFlags }) => {
    if (!data || data.length === 0 || months.length === 0) return null;
  
    const rows = months.map(m => {
      let pcCost = 0, moCost = 0, pcImp = 0, moImp = 0;
      
      selectedMedias.forEach(media => {
        if (selectedFlags.includes('PC') || selectedFlags.includes('PC∪MO')) {
            const pcItem = data.find(d => d.month === m && d.media === media && d.flag === 'PC');
            if (pcItem) {
              pcCost += pcItem.estCost || 0;
              pcImp += pcItem.imp || 0;
            }
        }
        if (selectedFlags.includes('MO') || selectedFlags.includes('PC∪MO')) {
            const moItem = data.find(d => d.month === m && d.media === media && d.flag === 'MO');
            if (moItem) {
              moCost += moItem.estCost || 0;
              moImp += moItem.imp || 0;
            }
        }
      });
  
      const totalCost = pcCost + moCost;
      const totalImp = pcImp + moImp;
  
      return {
        month: m,
        pcCost, moCost, totalCost,
        pcCostPct: totalCost > 0 ? ((pcCost / totalCost) * 100).toFixed(1) : 0,
        moCostPct: totalCost > 0 ? ((moCost / totalCost) * 100).toFixed(1) : 0,
        pcImp, moImp, totalImp,
        pcImpPct: totalImp > 0 ? ((pcImp / totalImp) * 100).toFixed(1) : 0,
        moImpPct: totalImp > 0 ? ((moImp / totalImp) * 100).toFixed(1) : 0,
      };
    });
  
    const isCost = activeMetric === 'estCost';

    return (
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden mb-8 p-8">
        <div className="flex flex-col gap-1 mb-6">
          <h2 className="text-xl font-black text-gray-800 uppercase tracking-tight flex items-center gap-2">
            <Icons.MonitorSmartphone size={22} className="text-pink-500"/> 디바이스별 트렌드 및 비중 (MO vs PC)
          </h2>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
            선택된 미디어 종합 합계 기준
          </p>
        </div>

        <div className="flex justify-center mb-10 pb-10 border-b border-gray-100">
            <div className="w-full max-w-4xl">
                <DeviceShareStackedBarChart 
                    data={data} 
                    months={months} 
                    selectedMedias={selectedMedias} 
                    metricKey={activeMetric} 
                    title={isCost ? "💰 광고비 (Cost) 비중" : "👀 노출수 (Impression) 비중"} 
                    selectedFlags={selectedFlags}
                />
            </div>
        </div>

        {/* 표도 선택된 activeMetric 에 따라 해당 지표만 보여줍니다 */}
        <div className="overflow-x-auto custom-scrollbar border border-gray-200 rounded-xl bg-white shadow-sm max-w-3xl mx-auto">
          <table className="w-full text-xs text-right border-collapse whitespace-nowrap">
            <thead>
              <tr>
                <th className="border-b border-r border-gray-200 bg-gray-50 p-3 font-black text-center text-gray-600" rowSpan={2}>월(Month)</th>
                <th className={`border-b border-gray-200 p-2 font-black text-center ${isCost ? 'bg-green-50/50 text-green-700' : 'bg-yellow-50/50 text-yellow-700'}`} colSpan={5}>
                    {isCost ? '광고비 (Cost)' : '노출 (Impression)'}
                </th>
              </tr>
              <tr>
                <th className="border-b border-r border-gray-200 bg-gray-50 p-2 font-bold text-blue-600 text-center">PC {isCost ? '(₩)' : ''}</th>
                <th className="border-b border-r border-gray-200 bg-gray-50 p-2 font-bold text-red-600 text-center">MO {isCost ? '(₩)' : ''}</th>
                <th className="border-b border-r border-gray-200 bg-gray-100 p-2 font-black text-gray-800 text-center">총합 {isCost ? '(₩)' : ''}</th>
                <th className="border-b border-r border-gray-200 bg-gray-50 p-2 font-black text-blue-600 text-center">PC %</th>
                <th className="border-b border-gray-200 bg-gray-50 p-2 font-black text-red-600 text-center">MO %</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => {
                const pcVal = isCost ? r.pcCost : r.pcImp;
                const moVal = isCost ? r.moCost : r.moImp;
                const totalVal = isCost ? r.totalCost : r.totalImp;
                const pcPct = isCost ? r.pcCostPct : r.pcImpPct;
                const moPct = isCost ? r.moCostPct : r.moImpPct;

                return (
                    <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                    <td className="border-b border-r border-gray-200 p-2 font-bold text-center text-gray-600 bg-white">
                        {r.month.length >= 6 ? r.month.slice(0,4) + '.' + r.month.slice(4) : r.month}
                    </td>
                    <td className="border-b border-r border-gray-200 p-2 font-mono text-gray-600">{pcVal.toLocaleString()}</td>
                    <td className="border-b border-r border-gray-200 p-2 font-mono text-gray-600">{moVal.toLocaleString()}</td>
                    <td className="border-b border-r border-gray-200 p-2 font-mono font-black bg-gray-50/50 text-gray-800">{totalVal.toLocaleString()}</td>
                    <td className="border-b border-r border-gray-200 p-2 font-mono font-black text-blue-600">{pcPct}%</td>
                    <td className="border-b border-gray-200 p-2 font-mono font-black text-red-600">{moPct}%</td>
                    </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
};

// --- 미디어별 광고주 수 그룹형 막대 차트 (COST 전용) ---
const AdvertiserCountBarChart = ({ rows, months, medias }) => {
    const [tooltip, setTooltip] = useState(null);
    if (!rows || rows.length === 0 || medias.length === 0 || months.length === 0) return null;

    const chartData = useMemo(() => {
        let prevVals = {};
        return months.map(m => {
            const entry = { month: m, vals: {}, moms: {} };
            medias.forEach(media => {
                const row = rows.find(r => r.media === media);
                const val = row ? (row.months[m] || 0) : 0;
                entry.vals[media] = val;
                
                let mom = null;
                if (prevVals[media] !== undefined && prevVals[media] > 0) {
                    mom = ((val - prevVals[media]) / prevVals[media]) * 100;
                }
                entry.moms[media] = mom;
                prevVals[media] = val;
            });
            return entry;
        });
    }, [months, medias, rows]);

    const allValues = chartData.flatMap(d => Object.values(d.vals));
    const roughMax = Math.max(...allValues, 1) * 1.15;

    const getStep = (range, target) => {
        if (range <= 0) return 1;
        const step = range / target, mag = Math.floor(Math.log10(step)), magPow = Math.pow(10, mag), norm = step / magPow;
        return (norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 5 ? 5 : 10) * magPow;
    };
    const maxValue = Math.max(getStep(roughMax, 4) * 4, 1);
    const w = 800, h = 300, px = 50, py = 40;

    const bandW = (w - px * 2) / Math.max(months.length, 1);
    const barGroupW = bandW * 0.85; 
    const barW = barGroupW / Math.max(medias.length, 1);
    const margin = (bandW - barGroupW) / 2;

    const getY = (v) => h - py - (v * (h - py * 2) / maxValue);

    return (
        <div className="w-full relative mt-4">
            <div className="flex flex-wrap justify-end gap-5 mb-4 pr-10">
                {medias.map(m => (
                    <div key={m} className="flex items-center gap-1.5">
                        <div className="w-3.5 h-3.5 rounded-sm shadow-sm" style={{backgroundColor: getColor(m)}}></div>
                        <span className="text-[11px] font-bold text-gray-600">{m}</span>
                    </div>
                ))}
            </div>
            <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto overflow-visible">
                {[0, 0.25, 0.5, 0.75, 1].map((v, i) => (
                    <g key={i}>
                        <line x1={px} y1={getY(maxValue * v)} x2={w - px} y2={getY(maxValue * v)} stroke="#f3f4f6" />
                        <text x={px - 10} y={getY(maxValue * v) + 4} textAnchor="end" fontSize="10" fill="#9ca3af">{Math.round(maxValue * v).toLocaleString()}</text>
                    </g>
                ))}
                <line x1={px} y1={h - py} x2={w - px} y2={h - py} stroke="#d1d5db" strokeWidth="2" />

                {chartData.map((d, mIdx) => (
                    <g key={d.month}>
                        {medias.map((media, i) => {
                            const val = d.vals[media] || 0;
                            const mom = d.moms[media];
                            const barX = px + mIdx * bandW + margin + i * barW;
                            const barH = (val / maxValue) * (h - py * 2);
                            const barY = h - py - Math.max(barH, 0);

                            return (
                                <rect
                                    key={media}
                                    x={barX}
                                    y={barY}
                                    width={barW * 0.85} 
                                    height={Math.max(barH, 0)}
                                    fill={getColor(media)}
                                    rx="2"
                                    className="cursor-pointer transition-opacity hover:opacity-80"
                                    onMouseEnter={() => setTooltip({ x: barX + barW/2, y: barY, val, mom, media, month: d.month })}
                                    onMouseLeave={() => setTooltip(null)}
                                />
                            );
                        })}
                        <text x={px + mIdx * bandW + bandW/2} y={h - 15} textAnchor="middle" fontSize="11" fill="#4b5563" className="font-bold">
                            {d.month.length >= 6 ? parseInt(d.month.slice(4), 10) + '월' : d.month}
                        </text>
                    </g>
                ))}

                {tooltip && (
                    <g transform={`translate(${tooltip.x}, ${tooltip.y - 15})`} className="pointer-events-none z-50">
                        <rect x="-90" y="-55" width="180" height="50" rx="6" fill="#111827" opacity="0.95" />
                        <text x="0" y="-35" textAnchor="middle" fill="#9ca3af" fontSize="10" fontWeight="bold">
                            {tooltip.month.length >= 6 ? parseInt(tooltip.month.slice(4), 10) + '월' : tooltip.month} | {tooltip.media}
                        </text>
                        <text x="0" y="-18" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold">
                            {Math.round(tooltip.val).toLocaleString()} 곳
                            {tooltip.mom !== null && ` (${tooltip.mom > 0 ? '▲' : tooltip.mom < 0 ? '▼' : '-'} ${tooltip.mom === 0 ? '0' : Math.abs(tooltip.mom).toFixed(1)}%)`}
                        </text>
                        <polygon points="-6,0 6,0 0,6" fill="#111827" opacity="0.95" />
                    </g>
                )}
            </svg>
        </div>
    );
};

// --- 미디어별 광고주 수 비교 테이블 (COST 전용) ---
const AdvertiserCountTable = ({ data, months, medias, selectedFlags }) => {
    if (!data || data.length === 0 || months.length === 0 || medias.length === 0) return null;
  
    // 전체 기준 (Grand Total unique across all selected medias & months)
    const allUniqueAdvs = new Set();
    
    const rows = medias.map(media => {
        const row = { media, months: {}, totalUnique: new Set() };
        months.forEach(m => {
            const items = data.filter(d => d.month === m && d.media === media && selectedFlags.includes(d.flag));
            const monthAdvs = new Set();
            items.forEach(item => {
                if (item.advertisers) {
                    item.advertisers.forEach(adv => {
                        monthAdvs.add(adv);
                        row.totalUnique.add(adv);
                        allUniqueAdvs.add(adv);
                    });
                }
            });
            row.months[m] = monthAdvs.size;
        });
        row.total = row.totalUnique.size;
        return row;
    });
  
    const grandTotal = allUniqueAdvs.size;
    rows.forEach(r => {
        r.share = grandTotal > 0 ? ((r.total / grandTotal) * 100).toFixed(1) : 0;
    });
  
    // 광고주 수 많은 순으로 정렬
    rows.sort((a, b) => b.total - a.total);
  
    return (
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden mb-8 p-8">
        <div className="flex flex-col gap-1 mb-6">
          <h2 className="text-xl font-black text-gray-800 uppercase tracking-tight flex items-center gap-2">
            <Icons.Building size={22} className="text-teal-600"/> 미디어별 광고주 수 트렌드 (중복 제거)
          </h2>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
            선택된 기간 내 활동한 순수 광고주 집계 (Grand Total 기준 점유율)
          </p>
        </div>

        {/* 차트 영역 추가 */}
        <div className="mb-8 pb-8 border-b border-gray-100">
            <AdvertiserCountBarChart rows={rows} months={months} medias={medias} />
        </div>

        <div className="overflow-x-auto custom-scrollbar border border-gray-200 rounded-xl bg-white shadow-sm">
          <table className="w-full text-xs text-right border-collapse whitespace-nowrap">
            <thead>
              <tr>
                <th className="border-b border-r border-gray-200 bg-gray-50 p-3 font-black text-center text-gray-600">미디어 (Media)</th>
                {months.map(m => (
                  <th key={m} className="border-b border-r border-gray-200 bg-gray-50 p-2 font-bold text-gray-600 text-center">
                    {m.length >= 6 ? m.slice(0,4) + '.' + m.slice(4) : m}
                  </th>
                ))}
                <th className="border-b border-r border-gray-200 bg-gray-100 p-2 font-black text-gray-800 text-center">Total (Unique)</th>
                <th className="border-b border-gray-200 bg-blue-50/50 p-2 font-black text-blue-700 text-center">Share (%)</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                  <td className="border-b border-r border-gray-200 p-2 font-bold text-center text-gray-800 bg-white flex items-center gap-2 justify-start">
                    <span className="w-4 h-4 rounded-full bg-gray-100 flex items-center justify-center text-[9px] text-gray-500">{i + 1}</span>
                    {r.media}
                  </td>
                  {months.map(m => (
                    <td key={`${r.media}-${m}`} className="border-b border-r border-gray-200 p-2 font-mono text-gray-600">
                      {r.months[m] > 0 ? r.months[m].toLocaleString() : '-'}
                    </td>
                  ))}
                  <td className="border-b border-r border-gray-200 p-2 font-mono font-black bg-gray-50/50 text-gray-900">{r.total.toLocaleString()}</td>
                  <td className="border-b border-gray-200 p-2 font-mono font-black text-blue-600">
                    {r.share}%
                    {parseFloat(r.share) > 0 && (
                        <div className="w-full h-1 mt-1 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500" style={{width: `${r.share}%`}}></div>
                        </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
};

// --- 공통 컴포넌트: 라인 차트 ---
const CustomLineChart = ({ data, activeMetric, metricDict, months, chartLines, selectedFlags, isPanel }) => {
  const [tooltip, setTooltip] = useState(null);
  if (!data || data.length === 0 || chartLines.length === 0) return <div className="h-[300px] flex items-center justify-center text-gray-300">데이터가 없습니다.</div>;
  
  const allValues = data.flatMap(d => chartLines.map(line => d[line.key] || 0));
  const roughMax = Math.max(...allValues, 1) * 1.05; 
  
  const getStep = (range, target) => {
    if (range <= 0) return 1;
    const step = range / target, mag = Math.floor(Math.log10(step)), magPow = Math.pow(10, mag), norm = step / magPow;
    return (norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 5 ? 5 : 10) * magPow;
  };
  const maxValue = Math.max(getStep(roughMax, 4) * 4, 1); 
  const w = 800, h = 300, px = 70, py = 40;
  const getX = (i) => px + (i * (w - px * 2) / (Math.max(months.length - 1, 1)));
  const getY = (v) => h - py - (v * (h - py * 2) / maxValue);

  const currentMetricType = metricDict[activeMetric]?.type || 'sum';

  return (
    <div className="w-full relative">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto overflow-visible">
        {[0, 0.25, 0.5, 0.75, 1].map((v, i) => (
          <g key={i}>
            <line x1={px} y1={getY(maxValue * v)} x2={w - px} y2={getY(maxValue * v)} stroke="#f3f4f6" />
            <text x={px - 10} y={getY(maxValue * v) + 4} textAnchor="end" fontSize="10" fill="#9ca3af">{Math.round(maxValue * v).toLocaleString()}</text>
          </g>
        ))}
        {chartLines.map((line) => {
          const pts = data.map((d, i) => `${getX(i)},${getY(d[line.key] || 0)}`).join(' ');
          const color = getColor(line.media), dash = getDashArray(selectedFlags.indexOf(line.flag));
          return (
            <g key={line.key}>
              <polyline points={pts} fill="none" stroke={color} strokeWidth="3" strokeDasharray={dash} />
              {data.map((d, i) => (
                <circle key={i} cx={getX(i)} cy={getY(d[line.key] || 0)} r="4" fill="white" stroke={color} strokeWidth="2"
                  className="cursor-pointer hover:scale-150 transition-transform origin-center"
                  style={{ transformOrigin: `${getX(i)}px ${getY(d[line.key] || 0)}px` }}
                  onMouseEnter={() => setTooltip({ x: getX(i), y: getY(d[line.key] || 0), val: d[line.key], media: line.media, flag: line.flag, month: d.month })}
                  onMouseLeave={() => setTooltip(null)} />
              ))}
            </g>
          );
        })}
        {months.map((m, i) => <text key={i} x={getX(i)} y={h - 10} textAnchor="middle" fontSize="11" fill="#6b7280" className="font-bold">{m.slice(0,4)}.{m.slice(4)}</text>)}
        {tooltip && (
          <g transform={`translate(${tooltip.x}, ${tooltip.y - 12})`} className="pointer-events-none z-50">
            <rect x="-70" y="-55" width="140" height="50" rx="6" fill="#111827" opacity="0.95" />
            <text x="0" y="-35" textAnchor="middle" fill="#9ca3af" fontSize="10" fontWeight="bold">{tooltip.month.slice(0,4)}.{tooltip.month.slice(4)} | [{tooltip.flag}] {tooltip.media}</text>
            <text x="0" y="-18" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold">
                {activeMetric === 'estCost' ? '₩ ' : ''}
                {(activeMetric === 'reach' && !isPanel) || currentMetricType === 'avg' ? tooltip.val.toFixed(2) : Math.round(tooltip.val).toLocaleString()}
                {activeMetric === 'reach' && isPanel ? ' 명' : ''}
            </text>
          </g>
        )}
      </svg>
    </div>
  );
};

// --- 공통 컴포넌트: 미디어별 그룹형 막대 차트 ---
const GroupedBarChart = ({ data, activeMetric, months, medias, isPanel }) => {
  const [tooltip, setTooltip] = useState(null);
  if (!data || data.length === 0 || medias.length === 0 || months.length === 0) return <div className="h-[300px] flex items-center justify-center text-gray-300">데이터가 없습니다.</div>;

  const allValues = data.flatMap(d => months.map(m => d[m]?.val || 0));
  const roughMax = Math.max(...allValues, 1) * 1.1;

  const getStep = (range, target) => {
    if (range <= 0) return 1;
    const step = range / target, mag = Math.floor(Math.log10(step)), magPow = Math.pow(10, mag), norm = step / magPow;
    return (norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 5 ? 5 : 10) * magPow;
  };
  const maxValue = Math.max(getStep(roughMax, 4) * 4, 1);
  const w = 800, h = 300, px = 70, py = 40;

  const bandW = (w - px * 2) / medias.length;
  const barGroupW = bandW * 0.85; 
  const barW = barGroupW / months.length;
  const margin = (bandW - barGroupW) / 2;

  const getY = (v) => h - py - (v * (h - py * 2) / maxValue);
  
  const BAR_COLORS = ['#4f81bd', '#c0504d', '#9bbb59', '#8064a2', '#4bacc6', '#f79646'];

  return (
    <div className="w-full relative">
      <div className="flex justify-end gap-5 mb-4 pr-10">
        {months.map((m, i) => (
          <div key={m} className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded-sm shadow-sm" style={{backgroundColor: BAR_COLORS[i % BAR_COLORS.length]}}></div>
            <span className="text-xs font-bold text-gray-600">{m.slice(0,4)}.{m.slice(4)}</span>
          </div>
        ))}
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto overflow-visible">
        {[0, 0.25, 0.5, 0.75, 1].map((v, i) => (
          <g key={i}>
            <line x1={px} y1={getY(maxValue * v)} x2={w - px} y2={getY(maxValue * v)} stroke="#f3f4f6" />
            <text x={px - 10} y={getY(maxValue * v) + 4} textAnchor="end" fontSize="10" fill="#9ca3af">{Math.round(maxValue * v).toLocaleString()}</text>
          </g>
        ))}
        <line x1={px} y1={h - py} x2={w - px} y2={h - py} stroke="#d1d5db" strokeWidth="2" />

        {data.map((d, mIdx) => (
          <g key={d.media}>
            {months.map((mo, i) => {
              const { val, mom } = d[mo] || { val: 0, mom: null };
              const barX = px + mIdx * bandW + margin + i * barW;
              const barY = getY(val);
              const barH = (h - py) - barY;

              return (
                <rect
                  key={mo}
                  x={barX}
                  y={barY}
                  width={barW * 0.85} 
                  height={Math.max(barH, 0)}
                  fill={BAR_COLORS[i % BAR_COLORS.length]}
                  rx="2"
                  className="cursor-pointer transition-opacity hover:opacity-80"
                  onMouseEnter={() => setTooltip({ x: barX + barW/2, y: barY, val, mom, media: d.media, month: mo })}
                  onMouseLeave={() => setTooltip(null)}
                />
              );
            })}
            <text x={px + mIdx * bandW + bandW/2} y={h - 15} textAnchor="middle" fontSize="11" fill="#4b5563" className="font-bold">{d.media}</text>
          </g>
        ))}

        {tooltip && (
          <g transform={`translate(${tooltip.x}, ${tooltip.y - 15})`} className="pointer-events-none z-50">
            <rect x="-90" y="-55" width="180" height="50" rx="6" fill="#111827" opacity="0.95" />
            <text x="0" y="-35" textAnchor="middle" fill="#9ca3af" fontSize="10" fontWeight="bold">{tooltip.month.slice(0,4)}.{tooltip.month.slice(4)} | {tooltip.media}</text>
            <text x="0" y="-18" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold">
                {activeMetric === 'estCost' ? '₩ ' : ''}
                {Math.round(tooltip.val).toLocaleString()} {activeMetric === 'reach' && isPanel ? '명' : ''}
                {tooltip.mom !== null && ` (${tooltip.mom > 0 ? '▲' : tooltip.mom < 0 ? '▼' : '-'} ${tooltip.mom === 0 ? '0' : Math.abs(tooltip.mom).toFixed(1)}%)`}
            </text>
            <polygon points="-6,0 6,0 0,6" fill="#111827" opacity="0.95" />
          </g>
        )}
      </svg>
    </div>
  );
};

// --- 디바이스별 월간 추이 바 차트 (Complete 전용) ---
const DeviceTrendBarChart = ({ data, activeMetric, months, flags, isPanel }) => {
  const [tooltip, setTooltip] = useState(null);
  if (!data || data.length === 0 || flags.length === 0 || months.length === 0) return <div className="h-[300px] flex items-center justify-center text-gray-300">데이터가 없습니다.</div>;

  const allValues = data.flatMap(d => flags.map(f => d[f]?.val || 0));
  const roughMax = Math.max(...allValues, 1) * 1.1;

  const getStep = (range, target) => {
    if (range <= 0) return 1;
    const step = range / target, mag = Math.floor(Math.log10(step)), magPow = Math.pow(10, mag), norm = step / magPow;
    return (norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 5 ? 5 : 10) * magPow;
  };
  const maxValue = Math.max(getStep(roughMax, 4) * 4, 1);
  const w = 800, h = 300, px = 70, py = 40;

  const bandW = (w - px * 2) / months.length;
  const barGroupW = bandW * 0.7; 
  const barW = barGroupW / flags.length;
  const margin = (bandW - barGroupW) / 2;

  const getY = (v) => h - py - (v * (h - py * 2) / maxValue);
  
  const FLAG_COLORS = { 'MO': '#4f81bd', 'PC': '#c0504d', 'PC∪MO': '#9bbb59' };
  const getFlagColor = (f, i) => FLAG_COLORS[f] || ['#8064a2', '#4bacc6', '#f79646'][i % 3];

  return (
    <div className="w-full relative">
      <div className="flex justify-end gap-5 mb-4 pr-10">
        {flags.map((f, i) => (
          <div key={f} className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded-sm shadow-sm" style={{backgroundColor: getFlagColor(f, i)}}></div>
            <span className="text-xs font-bold text-gray-600">{f}</span>
          </div>
        ))}
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto overflow-visible">
        {[0, 0.25, 0.5, 0.75, 1].map((v, i) => (
          <g key={i}>
            <line x1={px} y1={getY(maxValue * v)} x2={w - px} y2={getY(maxValue * v)} stroke="#f3f4f6" />
            <text x={px - 10} y={getY(maxValue * v) + 4} textAnchor="end" fontSize="10" fill="#9ca3af">{Math.round(maxValue * v).toLocaleString()}</text>
          </g>
        ))}
        <line x1={px} y1={h - py} x2={w - px} y2={h - py} stroke="#d1d5db" strokeWidth="2" />

        {months.map((mo, mIdx) => {
          const d = data.find(item => item.month === mo);
          return (
            <g key={mo}>
              {flags.map((flg, i) => {
                const { val, mom } = d?.[flg] || { val: 0, mom: null };
                const barX = px + mIdx * bandW + margin + i * barW;
                const barY = getY(val);
                const barH = (h - py) - barY;

                return (
                  <rect
                    key={flg}
                    x={barX}
                    y={barY}
                    width={barW * 0.9} 
                    height={Math.max(barH, 0)}
                    fill={getFlagColor(flg, i)}
                    rx="2"
                    className="cursor-pointer transition-opacity hover:opacity-80"
                    onMouseEnter={() => setTooltip({ x: barX + barW/2, y: barY, val, mom, flag: flg, month: mo })}
                    onMouseLeave={() => setTooltip(null)}
                  />
                )
              })}
              <text x={px + mIdx * bandW + bandW/2} y={h - 15} textAnchor="middle" fontSize="11" fill="#4b5563" className="font-bold">{mo.slice(0,4)}.{mo.slice(4)}</text>
            </g>
          )
        })}

        {tooltip && (
          <g transform={`translate(${tooltip.x}, ${tooltip.y - 15})`} className="pointer-events-none z-50">
            <rect x="-90" y="-55" width="180" height="50" rx="6" fill="#111827" opacity="0.95" />
            <text x="0" y="-35" textAnchor="middle" fill="#9ca3af" fontSize="10" fontWeight="bold">{tooltip.month.slice(0,4)}.{tooltip.month.slice(4)} | {tooltip.flag}</text>
            <text x="0" y="-18" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold">
                {activeMetric === 'estCost' ? '₩ ' : ''}
                {activeMetric === 'reach' && !isPanel ? tooltip.val.toFixed(2) : Math.round(tooltip.val).toLocaleString()}
                {activeMetric === 'reach' && !isPanel ? '%' : ''}
                {tooltip.mom !== null && ` (${tooltip.mom > 0 ? '▲' : tooltip.mom < 0 ? '▼' : '-'} ${tooltip.mom === 0 ? '0' : Math.abs(tooltip.mom).toFixed(1)}%)`}
            </text>
            <polygon points="-6,0 6,0 0,6" fill="#111827" opacity="0.95" />
          </g>
        )}
      </svg>
    </div>
  );
};

// --- 미디어 점유율 누적 막대 차트 (Stacked Bar Chart) ---
const StackedMediaBarChart = ({ data, activeMetric, metricDict, months, medias, selectedFlags, selectedAge, isPanel }) => {
  const [tooltip, setTooltip] = useState(null);

  const currentMetricDef = metricDict[activeMetric] || Object.values(metricDict)[0];

  const chartData = useMemo(() => {
    let prevTotal = null;
    return months.map(m => {
      let total = 0;
      const stacks = medias.map(media => {
        const items = data.filter(d => 
          d.month === m && 
          selectedFlags.includes(d.flag) && 
          d.age === selectedAge && 
          d.media === media
        );
        let val = 0;
        if (items.length > 0) {
          val = currentMetricDef.type === 'sum' 
            ? items.reduce((a, c) => a + c[activeMetric], 0) 
            : items.reduce((a, c) => a + c[activeMetric], 0) / items.length;
        }
        total += val;
        return { media, val };
      });
      
      let mom = null;
      if (prevTotal !== null && prevTotal > 0) {
        mom = ((total - prevTotal) / prevTotal) * 100;
      }
      const result = { month: m, total, mom, stacks };
      prevTotal = total;
      return result;
    });
  }, [data, months, medias, selectedFlags, selectedAge, activeMetric, currentMetricDef]);

  if (!data || data.length === 0 || medias.length === 0 || months.length === 0) return <div className="h-[300px] flex items-center justify-center text-gray-300">데이터가 없습니다.</div>;

  const roughMax = Math.max(...chartData.map(d => d.total), 1) * 1.15;

  const getStep = (range, target) => {
    if (range <= 0) return 1;
    const step = range / target, mag = Math.floor(Math.log10(step)), magPow = Math.pow(10, mag), norm = step / magPow;
    return (norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 5 ? 5 : 10) * magPow;
  };
  const maxValue = Math.max(getStep(roughMax, 4) * 4, 1);
  const w = 800, h = 350, px = 70, py = 50;

  const bandW = (w - px * 2) / months.length;
  const barW = bandW * 0.55;
  const margin = (bandW - barW) / 2;

  const getY = (v) => h - py - (v * (h - py * 2) / maxValue);

  return (
    <div className="w-full relative">
      <div className="flex flex-wrap justify-end gap-4 mb-4 pr-10">
        {medias.map(m => (
          <div key={m} className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded-sm shadow-sm" style={{backgroundColor: getColor(m)}}></div>
            <span className="text-[11px] font-bold text-gray-600">{m}</span>
          </div>
        ))}
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto overflow-visible">
        {[0, 0.25, 0.5, 0.75, 1].map((v, i) => (
          <g key={i}>
            <line x1={px} y1={getY(maxValue * v)} x2={w - px} y2={getY(maxValue * v)} stroke="#f3f4f6" />
            <text x={px - 10} y={getY(maxValue * v) + 4} textAnchor="end" fontSize="10" fill="#9ca3af">{Math.round(maxValue * v).toLocaleString()}</text>
          </g>
        ))}
        <line x1={px} y1={h - py} x2={w - px} y2={h - py} stroke="#d1d5db" strokeWidth="2" />

        {chartData.map((d, i) => {
          let currentY = h - py;
          const barX = px + i * bandW + margin;

          return (
            <g key={d.month}>
              {d.stacks.map(s => {
                if (s.val <= 0) return null;
                const barH = (s.val / maxValue) * (h - py * 2);
                currentY -= barH;
                return (
                  <rect 
                    key={s.media}
                    x={barX} y={currentY} width={barW} height={barH} 
                    fill={getColor(s.media)} rx="1"
                    className="cursor-pointer transition-opacity hover:opacity-80 stroke-white stroke-[1px]"
                    onMouseEnter={() => setTooltip({ 
                      x: barX + barW/2, y: currentY + barH/2, 
                      val: s.val, media: s.media, month: d.month, 
                      total: d.total, mom: d.mom 
                    })}
                    onMouseLeave={() => setTooltip(null)}
                  />
                )
              })}
              <text x={barX + barW/2} y={h - 15} textAnchor="middle" fontSize="11" fill="#4b5563" className="font-bold">{d.month.slice(0,4)}.{d.month.slice(4)}</text>
            </g>
          )
        })}

        {tooltip && (
          <g transform={`translate(${tooltip.x}, ${tooltip.y - 15})`} className="pointer-events-none z-50">
            <rect x="-100" y="-70" width="200" height="65" rx="6" fill="#111827" opacity="0.95" />
            <text x="0" y="-50" textAnchor="middle" fill="#9ca3af" fontSize="10" fontWeight="bold">{tooltip.month.slice(0,4)}.{tooltip.month.slice(4)} | {tooltip.media}</text>
            <text x="0" y="-30" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold">
                {activeMetric === 'estCost' ? '₩ ' : ''}
                {Math.round(tooltip.val).toLocaleString()} 
                <tspan fill="#fbbf24"> ({((tooltip.val / tooltip.total) * 100).toFixed(1)}%)</tspan>
            </text>
            <text x="0" y="-12" textAnchor="middle" fill="#9ca3af" fontSize="9" fontWeight="bold">
              월 전체: {Math.round(tooltip.total).toLocaleString()}
              {tooltip.mom !== null && ` (${tooltip.mom > 0 ? '▲' : tooltip.mom < 0 ? '▼' : '-'} ${Math.abs(tooltip.mom).toFixed(1)}%)`}
            </text>
            <polygon points="-6,0 6,0 0,6" fill="#111827" opacity="0.95" />
          </g>
        )}
      </svg>
    </div>
  );
};


// --- 엑셀 스타일 상세 피벗 테이블 ---
const DetailedPivotTable = ({ data, activeMetric, metricDict, months, selectedMedias, isMediaAll }) => {
  const mediasToDisplay = isMediaAll ? [...new Set(data.map(d => d.media).filter(Boolean))].sort() : selectedMedias;
  if (mediasToDisplay.length === 0 || months.length === 0) return null;

  const currentMetricDef = metricDict[activeMetric] || Object.values(metricDict)[0];
  const baseFlags = ['MO', 'PC'];
  const allAges = [...new Set(data.map(d => d.age).filter(Boolean))].sort();
  const specificAges = allAges.filter(a => a !== '개인전체');

  const rows = [];
  baseFlags.forEach(f => {
    if (data.some(d => d.flag === f)) {
      specificAges.forEach((a, idx) => {
        rows.push({ flag: f, age: a, isFirst: idx === 0, rowSpan: specificAges.length, labelFlag: f });
      });
    }
  });
  if (data.some(d => d.flag === 'PC∪MO')) {
    rows.push({ flag: 'PC∪MO', age: '개인전체', isFirst: true, rowSpan: 1, labelFlag: 'ALL' });
  }

  const maxVals = {};
  mediasToDisplay.forEach(med => {
    let max = 0;
    rows.forEach(r => {
      months.forEach(m => {
        const items = data.filter(d => d.flag === r.flag && d.age === r.age && d.media === med && d.month === m);
        let val = 0;
        if (items.length > 0) {
          val = currentMetricDef.type === 'sum' ? items.reduce((a, c) => a + c[activeMetric], 0) : items.reduce((a, c) => a + c[activeMetric], 0) / items.length;
        }
        if (val > max) max = val;
      });
    });
    maxVals[med] = max || 1;
  });

  return (
    <div className="overflow-x-auto custom-scrollbar border border-gray-200 rounded-xl bg-white shadow-sm">
      <table className="w-full text-xs text-right border-collapse whitespace-nowrap">
        <thead>
          <tr>
            <th className="border-b border-r border-gray-200 bg-gray-50 p-2 font-black text-center text-gray-600" rowSpan={2}>FLAG</th>
            <th className="border-b border-r border-gray-200 bg-gray-50 p-2 font-black text-center text-gray-600" rowSpan={2}>AGE</th>
            {mediasToDisplay.map(media => (
              <th key={media} className="border-b border-r border-gray-200 bg-gray-50 p-2 font-black text-center" colSpan={months.length} 
                  style={{ borderBottomWidth: 3, borderBottomColor: getColor(media) }}>
                {media}
              </th>
            ))}
          </tr>
          <tr>
            {mediasToDisplay.map(media => (
              months.map(m => (
                <th key={`${media}-${m}`} className="border-b border-r border-gray-200 bg-gray-50/50 p-1.5 font-bold text-gray-500 text-center">
                  {m.slice(0,4)}.{m.slice(4)}
                </th>
              ))
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={`${r.flag}-${r.age}`} className="hover:bg-blue-50/30 transition-colors">
              {r.isFirst && (
                <td className="border-b border-r border-gray-200 p-2 font-black text-center text-gray-700 bg-white" rowSpan={r.rowSpan}>
                  {r.labelFlag}
                </td>
              )}
              <td className="border-b border-r border-gray-200 p-2 font-bold text-center text-gray-600 bg-white">
                {r.labelFlag === 'ALL' ? '전체' : r.age}
              </td>
              {mediasToDisplay.map(media => {
                return months.map(m => {
                  const items = data.filter(d => d.flag === r.flag && d.age === r.age && d.media === media && d.month === m);
                  let val = 0;
                  if (items.length > 0) {
                    val = currentMetricDef.type === 'sum' ? items.reduce((a, c) => a + c[activeMetric], 0) : items.reduce((a, c) => a + c[activeMetric], 0) / items.length;
                  }
                  
                  const isReachComplete = activeMetric === 'reach' && currentMetricDef.type === 'avg';
                  const displayVal = val > 0 ? (isReachComplete || activeMetric === 'af' ? val.toFixed(2) : Math.round(val).toLocaleString()) : '-';
                  
                  return (
                    <td key={`${media}-${m}`} className="relative border-b border-r border-gray-200 p-2 font-mono text-gray-800 bg-white">
                      {val > 0 && (
                        <div 
                          className="absolute top-1 bottom-1 right-1 opacity-20 rounded-sm pointer-events-none" 
                          style={{ width: `calc(${(val / maxVals[media]) * 100}% - 4px)`, backgroundColor: getColor(media), transition: 'width 0.3s ease' }}
                        />
                      )}
                      <span className="relative z-10">{displayVal}</span>
                    </td>
                  );
                });
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// --- 브랜드별 패널 도달 Top 10 테이블 (Panel 하단 전용) ---
const BrandTop10Table = ({ brandData }) => {
  if (!brandData || brandData.length === 0) return null;
  const top10 = brandData.slice(0, 10);

  return (
    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden mb-8 p-8">
      <div className="flex flex-col gap-1 mb-6">
        <h2 className="text-xl font-black text-gray-800 uppercase tracking-tight flex items-center gap-2">
          <Icons.Trophy size={22} className="text-yellow-500"/> Top 10 브랜드별 패널 도달 (디바이스별)
        </h2>
        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
          전체 업로드 데이터 기준 (Grand Total = MO/PC 중복을 제거한 순수 패널 수)
        </p>
      </div>
      <div className="overflow-x-auto custom-scrollbar border border-gray-200 rounded-xl bg-white shadow-sm">
        <table className="w-full text-sm text-right border-collapse whitespace-nowrap">
          <thead>
            <tr>
              <th className="border-b border-r border-gray-200 bg-gray-50 p-3 font-black text-center text-gray-600">BRAND</th>
              <th className="border-b border-r border-gray-200 bg-gray-50 p-3 font-black text-center text-blue-600">MO</th>
              <th className="border-b border-r border-gray-200 bg-gray-50 p-3 font-black text-center text-red-600">PC</th>
              <th className="border-b border-gray-200 bg-gray-100 p-3 font-black text-center text-gray-800">Grand Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 font-bold text-gray-600">
            {top10.map((row, i) => (
              <tr key={i} className="hover:bg-yellow-50/30 transition-colors">
                <td className="border-b border-r border-gray-200 p-3 text-left text-gray-800 bg-white">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-[10px] text-gray-500">{i + 1}</span>
                    {row.brand}
                  </div>
                </td>
                <td className="border-b border-r border-gray-200 p-3 text-center font-mono">{row.MO > 0 ? row.MO.toLocaleString() : '-'}</td>
                <td className="border-b border-r border-gray-200 p-3 text-center font-mono">{row.PC > 0 ? row.PC.toLocaleString() : '-'}</td>
                <td className="border-b border-gray-200 p-3 text-center text-gray-900 bg-gray-50/50 font-black font-mono">{row.GrandTotal.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- 5. 대시보드 메인 컴포넌트 ---
const DashboardContent = ({ viewType, data, brandData, metricDict, activeMetric, setActiveMetric }) => {
  const [selectedFlags, setSelectedFlags] = useState([]); 
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [selectedAge, setSelectedAge] = useState(''); 
  const [isMediaAll, setIsMediaAll] = useState(false); 

  const sanitizeList = (list) => [...new Set(list.filter(v => v && v.trim() !== ''))].sort();

  const currentMetricDef = metricDict[activeMetric] || Object.values(metricDict)[0];
  const safeActiveMetricLabel = currentMetricDef?.label || '';

  useEffect(() => {
    if (data.length > 0) {
      const flags = sanitizeList(data.map(d => d.flag));
      setSelectedFlags([flags.find(f => f === 'PC∪MO') || flags.find(f => f.includes('MO')) || flags[0] || '']);
      
      const ages = sanitizeList(data.map(d => d.age));
      setSelectedAge(ages.find(a => a.includes('전체')) || ages[0] || '');
      
      setSelectedMedia(sanitizeList(data.map(d => d.media)));
    }
  }, [data, viewType]);

  const dynamicFlags = useMemo(() => sanitizeList(data.map(d => d.flag)), [data]);
  const dynamicAges = useMemo(() => sanitizeList(data.map(d => d.age)), [data]);
  const dynamicMonths = useMemo(() => sanitizeList(data.map(d => d.month)), [data]);

  const dynamicMedias = useMemo(() => {
    // 선택된 플래그에 해당하는 데이터만 추려서 보여줌
    const filtered = data.filter(d => selectedFlags.length === 0 || selectedFlags.includes(d.flag));
    return sanitizeList(filtered.map(d => d.media));
  }, [data, selectedFlags]);

  const chartLines = useMemo(() => {
    const lines = [];
    selectedFlags.forEach(flag => {
      if (isMediaAll) lines.push({ key: `[${flag}] 전체`, media: '전체', flag });
      else selectedMedia.forEach(media => {
        if (dynamicMedias.includes(media) && data.some(d => d.flag === flag && d.media === media && d.age === selectedAge)) {
          lines.push({ key: `[${flag}] ${media}`, media, flag });
        }
      });
    });
    return lines;
  }, [isMediaAll, selectedFlags, selectedMedia, data, selectedAge, dynamicMedias]);

  const processedChartData = useMemo(() => {
    return dynamicMonths.map(m => {
      const entry = { month: m };
      chartLines.forEach(line => {
        const items = data.filter(d => d.month === m && d.flag === line.flag && d.age === selectedAge && (line.media === '전체' ? true : d.media === line.media));
        if (items.length > 0) {
          const val = currentMetricDef.type === 'sum' ? items.reduce((a, c) => a + c[activeMetric], 0) : items.reduce((a, c) => a + c[activeMetric], 0) / items.length;
          entry[line.key] = parseFloat(val.toFixed(2));
        } else entry[line.key] = 0;
      });
      return entry;
    });
  }, [data, chartLines, activeMetric, dynamicMonths, selectedAge, currentMetricDef]);

  const barChartMedias = isMediaAll ? ['전체'] : selectedMedia.filter(m => dynamicMedias.includes(m)); 
  const barChartData = useMemo(() => {
    return barChartMedias.map(media => {
      const entry = { media };
      let prevVal = null;

      dynamicMonths.forEach(m => {
        const items = data.filter(d => 
          d.month === m && 
          selectedFlags.includes(d.flag) && 
          d.age === selectedAge && 
          (media === '전체' ? true : d.media === media)
        );
        
        let val = 0;
        if (items.length > 0) {
          val = currentMetricDef.type === 'sum' ? items.reduce((a, c) => a + c[activeMetric], 0) : items.reduce((a, c) => a + c[activeMetric], 0) / items.length;
        }

        let mom = null;
        if (prevVal !== null && prevVal > 0) mom = ((val - prevVal) / prevVal) * 100;

        entry[m] = { val, mom };
        prevVal = val;
      });
      return entry;
    });
  }, [data, barChartMedias, dynamicMonths, selectedFlags, selectedAge, activeMetric, currentMetricDef]);

  const deviceBarFlags = useMemo(() => {
    return selectedFlags.filter(f => ['MO', 'PC', 'PC∪MO'].includes(f));
  }, [selectedFlags]);

  const deviceBarDataWithMoM = useMemo(() => {
    let prevVals = {};
    return dynamicMonths.map(m => {
        const entry = { month: m };
        deviceBarFlags.forEach(flag => {
            const items = data.filter(d => 
                d.month === m && 
                d.flag === flag && 
                d.age === selectedAge && 
                (isMediaAll || selectedMedia.includes(d.media))
            );
            
            let val = 0;
            if (items.length > 0) {
                val = currentMetricDef.type === 'sum' 
                    ? items.reduce((a, c) => a + c[activeMetric], 0) 
                    : items.reduce((a, c) => a + c[activeMetric], 0) / items.length;
            }
            
            let mom = null;
            if (prevVals[flag] !== undefined && prevVals[flag] > 0) {
                mom = ((val - prevVals[flag]) / prevVals[flag]) * 100;
            }
            entry[flag] = { val, mom };
            prevVals[flag] = val;
        });
        return entry;
    });
  }, [data, deviceBarFlags, dynamicMonths, selectedAge, isMediaAll, selectedMedia, activeMetric, currentMetricDef]);

  const toggle = (list, set, val) => set(list.includes(val) ? list.filter(v => v !== val) : [...list, val]);

  const stats = useMemo(() => {
    if (dynamicMonths.length === 0) return null;
    const latestMonth = dynamicMonths[dynamicMonths.length - 1];
    const prevMonth = dynamicMonths.length > 1 ? dynamicMonths[dynamicMonths.length - 2] : null;

    const getAgg = (month) => {
      if (!month) return null;
      const items = data.filter(d => d.month === month && selectedFlags.includes(d.flag) && dynamicMedias.includes(d.media) && (isMediaAll || selectedMedia.includes(d.media)) && d.age === selectedAge);
      
      const result = {};
      Object.keys(metricDict).forEach(k => {
        if (items.length === 0) { 
            result[k] = 0; 
            return; 
        }
        const type = metricDict[k].type;
        const sum = items.reduce((a, c) => a + (c[k] || 0), 0);
        result[k] = type === 'sum' ? sum : sum / items.length;
      });
      return result;
    };

    const curr = getAgg(latestMonth), prev = getAgg(prevMonth);
    const calcMoM = (c, p) => p ? ((c - p) / p) * 100 : null;

    const statsData = {};
    Object.keys(metricDict).forEach(k => {
        statsData[k] = { val: curr?.[k] || 0, mom: calcMoM(curr?.[k], prev?.[k]) };
    });

    return {
      latestMonth,
      data: statsData
    };
  }, [data, selectedFlags, selectedMedia, isMediaAll, dynamicMedias, selectedAge, dynamicMonths, metricDict]);

  if (data.length === 0) return <div className="flex-1 flex items-center justify-center text-gray-400 font-bold bg-[#f8fafc]">데이터가 없습니다. CSV 파일을 업로드해주세요.</div>;

  return (
    <div className="flex flex-1 overflow-hidden">
      <aside className="w-64 bg-white border-r p-6 overflow-y-auto shrink-0 flex flex-col gap-8 shadow-sm z-10 custom-scrollbar">
        {/* COST 탭에서는 연령 옵션을 숨깁니다 (전체 기준이므로) */}
        {viewType !== 'cost' && (
            <section>
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Target Age</h3>
            <div className="grid grid-cols-2 gap-2">
                {dynamicAges.map(age => (
                <button key={age} onClick={() => setSelectedAge(age)} className={`py-2 rounded-xl text-[11px] font-bold border-2 transition-all ${selectedAge === age ? 'bg-gray-900 border-gray-900 text-white shadow-md' : 'bg-white border-gray-100 text-gray-500 hover:bg-gray-50'}`}>{age}</button>
                ))}
            </div>
            </section>
        )}
        <section>
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Platform Flag</h3>
          <div className="grid grid-cols-2 gap-2">
            {dynamicFlags.map(f => (
              <button key={f} onClick={() => toggle(selectedFlags, setSelectedFlags, f)} className={`py-2 rounded-lg text-[10px] font-bold border-2 transition-colors ${selectedFlags.includes(f) ? 'bg-blue-50 border-blue-500 text-blue-600' : 'bg-white border-gray-100 text-gray-500 hover:bg-gray-50'}`}>{f}</button>
            ))}
          </div>
        </section>
        <section>
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Media Channels</h3>
          <div className="space-y-2">
            <button onClick={() => setIsMediaAll(!isMediaAll)} className={`w-full flex items-center gap-3 p-2.5 rounded-xl border-2 transition-all ${isMediaAll ? 'bg-gray-900 border-gray-900 text-white' : 'bg-blue-50 text-blue-600 border-transparent hover:bg-blue-100'}`}>
              <Icons.Sigma size={14} /> <span className="text-xs font-black uppercase">ALL (전체 합산/평균)</span>
            </button>
            <div className="space-y-1 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
              {dynamicMedias.map(m => (
                <label key={m} className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all ${selectedMedia.includes(m) ? 'bg-gray-50' : 'hover:bg-gray-50/50'}`}>
                  <input type="checkbox" checked={selectedMedia.includes(m)} onChange={() => toggle(selectedMedia, setSelectedMedia, m)} className="w-4 h-4 rounded border-gray-300 text-blue-600" />
                  <div className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: getColor(m)}}></div>
                  <span className="text-xs font-bold text-gray-700">{m}</span>
                </label>
              ))}
            </div>
          </div>
        </section>
      </aside>

      <main className="flex-1 overflow-y-auto p-8 bg-[#f8fafc]">
        {/* 요약 지표 */}
        <div className={`grid gap-6 mb-8 ${Object.keys(metricDict).length === 2 ? 'grid-cols-2' : 'grid-cols-4'}`}>
          {Object.keys(metricDict).map(k => {
            const m = metricDict[k];
            const s = stats?.data[k];
            if (!s) return null;
            const isReachComplete = k === 'reach' && viewType === 'complete';
            const valStr = isReachComplete ? s.val.toFixed(1) + '%' 
              : k === 'af' ? s.val.toFixed(2) + 'x' 
              : k === 'imp' ? (s.val / 1000000).toFixed(1) + 'M' 
              : k === 'estCost' ? '₩ ' + Math.round(s.val).toLocaleString()
              : Math.round(s.val).toLocaleString() + (viewType === 'panel' && k === 'reach' ? '명' : '');

            const iconColorClass = m.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                                   m.color === 'red' ? 'bg-red-50 text-red-600' :
                                   m.color === 'green' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600';

            return (
              <div key={k} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconColorClass}`}>
                    {k === 'reach' ? <Icons.Users size={20}/> : 
                     k === 'grp' ? <Icons.Activity size={20}/> : 
                     k === 'af' ? <Icons.MousePointer2 size={20}/> : 
                     k === 'estCost' ? <Icons.DollarSign size={20}/> : 
                     <Icons.TrendingUp size={20}/>}
                  </div>
                  {s.mom !== null && (
                    <div className={`flex items-center gap-0.5 px-2 py-1 rounded-full text-[10px] font-black border ${s.mom >= 0 ? 'bg-red-50 text-red-600 border-red-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                      {s.mom >= 0 ? <Icons.ArrowUpRight size={12} /> : <Icons.ArrowDownRight size={12} />}{Math.abs(s.mom).toFixed(1)}%
                    </div>
                  )}
                </div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{m.label}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-gray-800 tracking-tight">{valStr}</span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase">({stats?.latestMonth.length >= 6 ? parseInt(stats.latestMonth.slice(4), 10) + '월' : stats?.latestMonth})</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* COST 탭 전용: 혼합 차트 & 비중/광고주수 테이블 */}
        {viewType === 'cost' && (
          <>
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm mb-8">
              <div className="flex justify-between items-center mb-6">
                <div className="flex flex-col gap-1">
                  <h2 className="text-xl font-black text-gray-800 uppercase tracking-tight flex items-center gap-2">
                    <Icons.BarChart3 size={22} className="text-indigo-500"/> 월별 전체 트렌드 ({safeActiveMetricLabel})
                  </h2>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                    Target: <span className="text-indigo-500">전체</span> | 총합계(막대) 및 매체별(곡선) 비교
                  </p>
                </div>
              </div>
              <CostMixedChart 
                data={data} 
                activeMetric={activeMetric} 
                months={dynamicMonths} 
                medias={isMediaAll ? dynamicMedias : selectedMedia.filter(m => dynamicMedias.includes(m))} 
                selectedFlags={selectedFlags} 
                selectedAge={selectedAge}
              />
            </div>
            
            <DeviceShareTable 
                data={data}
                months={dynamicMonths}
                selectedMedias={isMediaAll ? dynamicMedias : selectedMedia.filter(m => dynamicMedias.includes(m))} 
                activeMetric={activeMetric}
                selectedFlags={selectedFlags}
            />

            <AdvertiserCountTable
                data={data}
                months={dynamicMonths}
                medias={isMediaAll ? dynamicMedias : selectedMedia.filter(m => dynamicMedias.includes(m))} 
                selectedFlags={selectedFlags}
            />
          </>
        )}

        {/* 기존 차트들은 viewType !== 'cost' 일 때만 렌더링 (COST 화면에서는 피벗, 스택 차트 등 숨김) */}
        {viewType !== 'cost' && (
            <>
                {/* 라인 차트 */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm mb-8">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex flex-col gap-1">
                    <h2 className="text-xl font-black text-gray-800 uppercase tracking-tight">{safeActiveMetricLabel} Trend</h2>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Target: <span className="text-indigo-500">{selectedAge}</span> | Analysis by Platform & Media</p>
                    </div>
                    {selectedFlags.length > 1 && (
                    <div className="flex flex-wrap gap-2 items-center">
                        {selectedFlags.map((flag, idx) => (
                        <div key={flag} className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                            <svg width="24" height="6"><line x1="0" y1="3" x2="24" y2="3" stroke="#4b5563" strokeWidth="2" strokeDasharray={getDashArray(dynamicFlags.indexOf(flag))} /></svg>
                            <span className="text-[10px] font-bold text-gray-600 uppercase">{flag}</span>
                        </div>
                        ))}
                    </div>
                    )}
                </div>
                <CustomLineChart data={processedChartData} activeMetric={activeMetric} metricDict={metricDict} months={dynamicMonths} chartLines={chartLines} selectedFlags={dynamicFlags} isPanel={viewType === 'panel'} />
                </div>

                {/* Complete 전용 막대/누적 차트 */}
                {viewType === 'complete' && (
                <>
                    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex flex-col gap-1">
                        <h2 className="text-xl font-black text-gray-800 uppercase tracking-tight flex items-center gap-2">
                            <Icons.BarChart size={22} className="text-blue-500"/> 디바이스별 월간 추이 ({safeActiveMetricLabel})
                        </h2>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                            Target: <span className="text-blue-500">{selectedAge}</span> | 필터 선택 항목 연동됨 (툴팁 확인)
                        </p>
                        </div>
                    </div>
                    <DeviceTrendBarChart data={deviceBarDataWithMoM} activeMetric={activeMetric} months={dynamicMonths} flags={deviceBarFlags} isPanel={false} />
                    </div>

                    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex flex-col gap-1">
                        <h2 className="text-xl font-black text-gray-800 uppercase tracking-tight flex items-center gap-2">
                            <Icons.Layers size={22} className="text-purple-500"/> 미디어 점유율 및 누적 추이 ({safeActiveMetricLabel})
                        </h2>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                            Target: <span className="text-purple-500">{selectedAge}</span> | Flag: <span className="text-purple-500">{selectedFlags.join(', ')}</span> (툴팁에서 상세 % 확인)
                        </p>
                        </div>
                    </div>
                    <StackedMediaBarChart 
                        data={data} 
                        activeMetric={activeMetric} 
                        metricDict={metricDict} 
                        months={dynamicMonths} 
                        medias={isMediaAll ? dynamicMedias : selectedMedia.filter(m => dynamicMedias.includes(m))} 
                        selectedFlags={selectedFlags} 
                        selectedAge={selectedAge} 
                        isPanel={false} 
                    />
                    </div>
                </>
                )}

                {/* Panel 전용: 그룹형 막대 차트 */}
                {viewType === 'panel' && (
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm mb-8">
                    <div className="flex justify-between items-center mb-6">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-xl font-black text-gray-800 uppercase tracking-tight flex items-center gap-2">
                        <Icons.BarChart size={22} className="text-indigo-500"/> 미디어별 월간 비교 ({safeActiveMetricLabel})
                        </h2>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                        Target: <span className="text-indigo-500">{selectedAge}</span> | Flag: <span className="text-indigo-500">{selectedFlags.join(', ')}</span> (툴팁 확인)
                        </p>
                    </div>
                    </div>
                    <GroupedBarChart data={barChartData} activeMetric={activeMetric} months={dynamicMonths} medias={barChartMedias} isPanel={true} />
                </div>
                )}

                {/* Panel 전용: 피벗 테이블 */}
                {viewType === 'panel' && (
                <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden mb-8 p-8">
                    <div className="flex flex-col gap-1 mb-6">
                    <h2 className="text-xl font-black text-gray-800 uppercase tracking-tight flex items-center gap-2">
                        <Icons.Table size={22} className="text-blue-600"/> 상세 연령/플랫폼별 월간 트렌드
                    </h2>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                        Viewing: <span className="text-blue-600">{safeActiveMetricLabel}</span>
                    </p>
                    </div>
                    <DetailedPivotTable 
                    data={data} 
                    activeMetric={activeMetric} 
                    metricDict={metricDict} 
                    months={dynamicMonths} 
                    selectedMedias={dynamicMedias.filter(m => isMediaAll || selectedMedia.includes(m))} 
                    isMediaAll={isMediaAll} 
                    />
                </div>
                )}
            </>
        )}

        {/* Panel 전용: 브랜드별 Top 10 도달 테이블 */}
        {viewType === 'panel' && brandData && brandData.length > 0 && (
           <BrandTop10Table brandData={brandData} />
        )}

      </main>
    </div>
  );
};

// --- 6. 메인 앱 (상태 및 라우팅) ---
export default function App() {
  const fileInputRef = useRef(null);
  const [dashboardType, setDashboardType] = useState('2S'); 
  const [activeMenu, setActiveMenu] = useState('cost'); 
  
  const [dataComplete, setDataComplete] = useState([]);
  const [dataPanel, setDataPanel] = useState([]);
  const [dataCost, setDataCost] = useState([]);
  const [dataPanelBrand, setDataPanelBrand] = useState([]); 
  const [errorMsg, setErrorMsg] = useState('');

  const [activeMetricComplete, setActiveMetricComplete] = useState('imp');
  const [activeMetricPanel, setActiveMetricPanel] = useState('reach');
  const [activeMetricCost, setActiveMetricCost] = useState('estCost');

  useEffect(() => {
    setDataComplete(parseCompleteData(rawDataComplete));
    setDataCost(parseCostData(rawDataCost));
    const initialPanel = parsePanelData(rawDataPanel);
    if (initialPanel) {
      setDataPanel(initialPanel.mediaData);
      setDataPanelBrand(initialPanel.brandData);
    }
  }, []);

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    const fileName = files[0].name.toLowerCase();
    if (fileName.includes('3s')) setDashboardType('3S');
    else if (fileName.includes('2s')) setDashboardType('2S');

    try {
      const textPromises = files.map(file => new Promise((res, rej) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const arrayBuffer = e.target.result;
          let text = '';
          try { text = new TextDecoder('utf-8', { fatal: true }).decode(arrayBuffer); } 
          catch (err) { text = new TextDecoder('euc-kr').decode(arrayBuffer); }
          res(text);
        };
        reader.onerror = rej;
        reader.readAsArrayBuffer(file);
      }));

      const texts = await Promise.all(textPromises);
      const panelTexts = [];
      const costTexts = [];
      const completeTexts = [];

      texts.forEach(t => {
        const up = t.toUpperCase();
        if (up.includes('MONTHCODE') && up.includes('PANEL_NO')) {
          panelTexts.push(t);
        } else if (up.includes('MEDIA') && up.includes('IMP.PC') && up.includes('COST')) {
          costTexts.push(t);
        } else {
          completeTexts.push(t);
        }
      });

      if (costTexts.length > 0) {
        const parsed = parseCostData(costTexts);
        if (parsed && parsed.length > 0) {
          setDataCost(parsed);
          setActiveMenu('cost');
          setErrorMsg('');
        } else {
          setErrorMsg("광고비 데이터를 분석할 수 없습니다.");
        }
      } else if (panelTexts.length > 0) {
        const parsed = parsePanelData(panelTexts);
        if (parsed && parsed.mediaData.length > 0) {
          setDataPanel(parsed.mediaData);
          setDataPanelBrand(parsed.brandData);
          setActiveMenu('panel');
          setErrorMsg('');
        } else {
          setErrorMsg("패널 데이터를 분석할 수 없습니다.");
        }
      } else if (completeTexts.length > 0) {
        const parsed = parseCompleteData(completeTexts);
        if (parsed && parsed.length > 0) {
          setDataComplete(parsed);
          setActiveMenu('complete');
          setErrorMsg('');
        } else {
          setErrorMsg("컴플릿 데이터를 분석할 수 없습니다.");
        }
      }

    } catch (err) { setErrorMsg("파일 읽기 중 오류가 발생했습니다."); }
    event.target.value = '';
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] text-gray-900 font-sans overflow-hidden">
      {errorMsg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-2xl shadow-xl max-w-sm w-full">
            <h3 className="text-lg font-black text-red-600 mb-2 flex items-center gap-2"><Icons.AlertCircle /> 오류</h3>
            <p className="text-gray-600 text-sm font-bold">{errorMsg}</p>
            <button onClick={() => setErrorMsg('')} className="mt-6 w-full bg-gray-900 hover:bg-gray-800 transition-colors text-white py-2.5 rounded-xl font-black">확인</button>
          </div>
        </div>
      )}

      <aside className="w-32 bg-gray-900 flex flex-col items-center py-8 shrink-0 shadow-xl z-20 relative">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white mb-10 shadow-lg border border-blue-400/30">
          <Icons.BarChart3 size={24} />
        </div>
        
        <nav className="flex flex-col gap-4 w-full px-3">
          <button 
            onClick={() => setActiveMenu('complete')}
            className={`w-full py-4 rounded-xl flex flex-col items-center justify-center gap-2 transition-all ${activeMenu === 'complete' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'}`}
          >
            <Icons.ListFilter size={24} />
            <span className="text-[10px] font-black uppercase tracking-wide whitespace-nowrap">COMPLETE</span>
          </button>

          <button 
            onClick={() => setActiveMenu('panel')}
            className={`w-full py-4 rounded-xl flex flex-col items-center justify-center gap-2 transition-all ${activeMenu === 'panel' ? 'bg-green-600 text-white shadow-md' : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'}`}
          >
            <Icons.Users size={24} />
            <span className="text-[10px] font-black uppercase tracking-wide whitespace-nowrap">PANEL</span>
          </button>

          <button 
            onClick={() => setActiveMenu('cost')}
            className={`w-full py-4 rounded-xl flex flex-col items-center justify-center gap-2 transition-all ${activeMenu === 'cost' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'}`}
          >
            <Icons.DollarSign size={24} />
            <span className="text-[10px] font-black uppercase tracking-wide whitespace-nowrap">COST</span>
          </button>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-16 bg-white border-b px-6 flex justify-between items-center shrink-0 shadow-sm z-10 relative">
          <div className="flex items-center gap-3">
            {/* COST 탭일 경우 2S/3S 선택 비활성화 (문구만 표기) */}
            {activeMenu !== 'cost' ? (
                <div className="relative flex items-center">
                <select 
                    value={dashboardType} 
                    onChange={(e) => setDashboardType(e.target.value)}
                    className="appearance-none bg-gray-900 text-white font-black text-lg px-4 py-1.5 pr-8 rounded-xl cursor-pointer outline-none hover:bg-gray-800 transition-colors shadow-sm"
                >
                    <option value="2S">2S</option>
                    <option value="3S">3S</option>
                </select>
                <Icons.ChevronDown size={16} className="absolute right-2.5 text-white pointer-events-none" />
                </div>
            ) : (
                <div className="bg-gray-100 text-gray-400 font-black text-lg px-4 py-1.5 rounded-xl cursor-not-allowed shadow-inner border border-gray-200">
                    ALL
                </div>
            )}
            <div className="h-5 w-px bg-gray-200 mx-1"></div>
            <h1 className="text-xl font-black tracking-tight text-gray-800 uppercase flex items-center gap-2">
              {activeMenu === 'complete' ? 'Complete Data 검수' : activeMenu === 'panel' ? 'Panel Data 검수' : 'Ad spend 검수'}
              <span className={`text-[10px] px-2 py-1 rounded-md text-white ${activeMenu === 'complete' ? 'bg-blue-500' : activeMenu === 'panel' ? 'bg-green-500' : 'bg-indigo-500'}`}>
                {activeMenu === 'complete' ? 'complete' : activeMenu === 'panel' ? 'panel' : 'AD SPEND'}
              </span>
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="bg-gray-100 p-1 rounded-lg flex shadow-inner">
              {Object.keys(activeMenu === 'complete' ? METRICS_COMPLETE : activeMenu === 'panel' ? METRICS_PANEL : METRICS_COST).map(m => {
                const dict = activeMenu === 'complete' ? METRICS_COMPLETE : activeMenu === 'panel' ? METRICS_PANEL : METRICS_COST;
                const activeM = activeMenu === 'complete' ? activeMetricComplete : activeMenu === 'panel' ? activeMetricPanel : activeMetricCost;
                const setter = activeMenu === 'complete' ? setActiveMetricComplete : activeMenu === 'panel' ? setActiveMetricPanel : setActiveMetricCost;
                return (
                  <button key={m} onClick={() => setter(m)} className={`px-4 py-1.5 text-[11px] font-bold rounded-md transition-all ${activeM === m ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                    {dict[m].label}
                  </button>
                )
              })}
            </div>
            <input type="file" accept=".csv,.txt,.tsv" multiple ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
            <button onClick={() => fileInputRef.current.click()} className={`flex items-center gap-2 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-md transition-all active:scale-95 ${activeMenu === 'complete' ? 'bg-blue-600 hover:bg-blue-700' : activeMenu === 'panel' ? 'bg-green-600 hover:bg-green-700' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
              <Icons.Upload size={14} /> MULTI CSV UPLOAD
            </button>
          </div>
        </header>

        {/* ✅ 강제 초기화(key 사용)를 통해 탭 전환 시 잔여 상태 충돌 완벽 차단 */}
        {activeMenu === 'complete' && (
          <DashboardContent 
            key="complete"
            viewType="complete" 
            data={dataComplete} 
            metricDict={METRICS_COMPLETE} 
            activeMetric={activeMetricComplete} 
            setActiveMetric={setActiveMetricComplete} 
          />
        )}
        {activeMenu === 'panel' && (
          <DashboardContent 
            key="panel"
            viewType="panel" 
            data={dataPanel} 
            brandData={dataPanelBrand} 
            metricDict={METRICS_PANEL} 
            activeMetric={activeMetricPanel} 
            setActiveMetric={setActiveMetricPanel} 
          />
        )}
        {activeMenu === 'cost' && (
          <DashboardContent 
            key="cost"
            viewType="cost" 
            data={dataCost} 
            metricDict={METRICS_COST} 
            activeMetric={activeMetricCost} 
            setActiveMetric={setActiveMetricCost} 
          />
        )}
      </div>
    </div>
  );
}