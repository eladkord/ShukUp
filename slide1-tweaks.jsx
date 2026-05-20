/* global React, ReactDOM, TweaksPanel, useTweaks, TweakSection, TweakRadio, TweakSelect, TweakToggle, TweakSlider, TweakColor */

const DEFAULTS = (window.__SLIDE1_DEFAULTS__) || {
  "wordmarkLayout": "horizontal",
  "wordmarkFont": "Archivo Black",
  "accent": "orange-up",
  "wordmarkSize": 240,
  "showCredit": true,
  "showSubtitle": true,
  "showTags": true,
  "bgTone": "warm",
  "sepColor": "orange",
  "tagsSize": 22
};

const FONT_FAMILIES = {
  "Archivo Black": "'Archivo Black', 'Anton', system-ui, sans-serif",
  "Anton": "'Anton', 'Archivo Black', system-ui, sans-serif",
  "Big Shoulders": "'Big Shoulders Display', 'Archivo Black', sans-serif",
  "Frank Ruhl Libre": "'Frank Ruhl Libre', serif",
  "Archivo Heavy": "'Archivo', sans-serif"
};

const FONT_WEIGHTS = {
  "Archivo Black": 900,
  "Anton": 400,
  "Big Shoulders": 900,
  "Frank Ruhl Libre": 900,
  "Archivo Heavy": 900
};

const BG_TONES = {
  warm: {
    base: "linear-gradient(180deg, #2a1a10 0%, #1a1109 50%, #0e0a06 100%)",
    glow: "rgba(232,98,42,0.16)"
  },
  neutral: {
    base: "linear-gradient(180deg, #1b1814 0%, #131110 50%, #0a0908 100%)",
    glow: "rgba(245,240,232,0.06)"
  },
  cool: {
    base: "linear-gradient(180deg, #0e1726 0%, #0a121d 50%, #060a12 100%)",
    glow: "rgba(91,141,217,0.16)"
  },
  market: {
    base: "linear-gradient(180deg, #321810 0%, #2a1a10 40%, #1a0e08 100%)",
    glow: "rgba(244,200,67,0.14)"
  }
};

const ACCENT_OPTIONS = {
  "none":      { shuk: "var(--cream)", up: "var(--cream)" },
  "orange-up": { shuk: "var(--cream)", up: "var(--orange)" },
  "orange-shuk": { shuk: "var(--orange)", up: "var(--cream)" },
  "yellow-up": { shuk: "var(--cream)", up: "var(--yellow)" },
  "red-up":    { shuk: "var(--cream)", up: "var(--red)" }
};

const SEP_COLORS = {
  orange: "var(--orange)",
  yellow: "var(--yellow)",
  cream:  "rgba(245,240,232,0.6)",
  red:    "var(--red)"
};

function applyTweaks(t) {
  const s1 = document.querySelector('.s1');
  if (!s1) return;

  const wm = s1.querySelector('.wordmark');
  const sub = s1.querySelector('.subtitle');
  const tags = s1.querySelector('.tags');
  const credit = s1.querySelector('.bottom .by');
  const shuk = s1.querySelector('.wordmark .line:not(.up)');
  const up = s1.querySelector('.wordmark .line.up');

  // Layout
  if (wm) {
    if (t.wordmarkLayout === 'horizontal') {
      wm.style.display = 'inline-flex';
      wm.style.gap = '0.18em';
      wm.style.alignItems = 'baseline';
      [shuk, up].forEach(el => el && (el.style.display = 'inline'));
    } else {
      wm.style.display = '';
      wm.style.gap = '';
      [shuk, up].forEach(el => el && (el.style.display = 'block'));
    }
    wm.style.fontFamily = FONT_FAMILIES[t.wordmarkFont] || FONT_FAMILIES['Archivo Black'];
    wm.style.fontWeight = String(FONT_WEIGHTS[t.wordmarkFont] || 900);
    // Do NOT overwrite font-size if user has set it inline on the children.
    if (shuk && !shuk.style.fontSize) shuk.style.fontSize = (t.wordmarkSize || 240) + 'px';
    if (up   && !up.style.fontSize)   up.style.fontSize   = (t.wordmarkSize || 240) + 'px';
  }

  // Accent
  const acc = ACCENT_OPTIONS[t.accent] || ACCENT_OPTIONS['orange-up'];
  if (shuk) shuk.style.color = acc.shuk;
  if (up)   up.style.color   = acc.up;

  // Visibility
  if (sub)    sub.style.display    = t.showSubtitle ? '' : 'none';
  if (tags)   tags.style.display   = t.showTags ? '' : 'none';
  if (credit) credit.style.display = t.showCredit ? '' : 'none';
  if (tags && t.tagsSize && !tags.style.fontSize) tags.style.fontSize = t.tagsSize + 'px';

  // Background tone — applied to vignette overlay (does not touch stripes)
  const tone = BG_TONES[t.bgTone] || BG_TONES.warm;
  const vig = s1.querySelector('.vignette');
  if (vig) {
    vig.style.background =
      `radial-gradient(ellipse 60% 80% at 50% 50%, ${tone.glow} 0%, rgba(10,7,4,0.0) 40%, rgba(10,7,4,0.55) 100%)`;
  }

  // Separator color
  s1.querySelectorAll('.tags .sep').forEach(sep => {
    sep.style.background = SEP_COLORS[t.sepColor] || SEP_COLORS.orange;
    sep.style.opacity = 1;
  });
}

function Slide1Tweaks() {
  const [t, setT] = useTweaks(DEFAULTS);

  React.useEffect(() => { applyTweaks(t); }, [t]);

  return (
    <TweaksPanel title="Tweaks · שקף 1">
      <TweakSection title="לוגו">
        <TweakRadio label="פריסה" value={t.wordmarkLayout}
          options={[{value:'stacked', label:'שורות'}, {value:'horizontal', label:'שורה אחת'}]}
          onChange={v => setT('wordmarkLayout', v)} />
        <TweakSelect label="פונט" value={t.wordmarkFont}
          options={Object.keys(FONT_FAMILIES).map(k => ({value:k, label:k}))}
          onChange={v => setT('wordmarkFont', v)} />
        <TweakSlider label="גודל" value={t.wordmarkSize} min={140} max={360} step={4}
          onChange={v => setT('wordmarkSize', v)} />
        <TweakSelect label="צבע הדגשה" value={t.accent}
          options={[
            {value:'none', label:'בלי הדגשה'},
            {value:'orange-up', label:'Up בכתום'},
            {value:'orange-shuk', label:'Shuk בכתום'},
            {value:'yellow-up', label:'Up בצהוב'},
            {value:'red-up', label:'Up באדום'}
          ]}
          onChange={v => setT('accent', v)} />
      </TweakSection>

      <TweakSection title="טקסט">
        <TweakToggle label="הצג תגיות (אנשים · אוכל · תרבות)" value={t.showTags}
          onChange={v => setT('showTags', v)} />
        <TweakSlider label="גודל תגיות" value={t.tagsSize} min={14} max={40} step={1} unit="px"
          onChange={v => setT('tagsSize', v)} />
        <TweakToggle label="הצג סאבטייטל" value={t.showSubtitle}
          onChange={v => setT('showSubtitle', v)} />
        <TweakToggle label="הצג ‘A toMix Production’" value={t.showCredit}
          onChange={v => setT('showCredit', v)} />
        <TweakSelect label="צבע מפריד תגיות" value={t.sepColor}
          options={[
            {value:'orange', label:'כתום'},
            {value:'yellow', label:'צהוב'},
            {value:'red', label:'אדום'},
            {value:'cream', label:'שמנת'}
          ]}
          onChange={v => setT('sepColor', v)} />
      </TweakSection>

      <TweakSection title="רקע">
        <TweakRadio label="גוון" value={t.bgTone}
          options={[
            {value:'warm', label:'חם'},
            {value:'market', label:'שוק'},
            {value:'neutral', label:'נייטרלי'},
            {value:'cool', label:'קר'}
          ]}
          onChange={v => setT('bgTone', v)} />
      </TweakSection>
    </TweaksPanel>
  );
}

// Mount
const mountEl = document.createElement('div');
mountEl.id = 'tweaks-root';
document.body.appendChild(mountEl);
ReactDOM.createRoot(mountEl).render(<Slide1Tweaks />);
