'use strict';

Log.vis = {

  /**
   * Generate chart axis lines
   * @return {Object} Lines
   */
  axisLines () {
    const frag = document.createDocumentFragment();
    const div = document.createElement('div');
    const cl = 'psa wf bt o1';

    div.className = cl;

    const l2 = div.cloneNode();
    const l3 = div.cloneNode();
    const l4 = div.cloneNode();
    const l5 = div.cloneNode();

    l5.className = `${cl} b0`;
    l4.style.top = '75%';
    l3.style.top = '50%';
    l2.style.top = '25%';

    frag.append(div.cloneNode());
    frag.append(l2);
    frag.append(l3);
    frag.append(l4);
    frag.append(l5);

    return frag;
  },

  /**
   * Generate bar chart
   * @param {Object[]} data
   * @return {Object} Chart
   */
  barChart (data) {
    if (data === undefined) return;
    const l = data.length;
    if (l === 0) return;

    const frag = document.createDocumentFragment();
    const column = ø('div', {className: 'dib psr hf'});
    column.style.width = `${100 / l}%`;

    frag.append(Log.vis.axisLines());

    for (let i = 0; i < l; i++) {
      const col = column.cloneNode();
      frag.append(col);

      if (data[i].length === 0) continue;
      for (let o = 0, ol = data[i].length; o < ol; o++) {
        const {b, c, h} = data[i][o];
        const ent = ø('div', {className: 'psa sw1'});
        ø(ent.style, {backgroundColor: c, bottom: b, height: h});
        col.append(ent);
      }
    }

    return frag;
  },

  /**
   * Generate day chart
   * @param {Object[]} ent
   * @param {Object} [ui] - Pref
   * @param {string} [ui.colourMode]
   * @param {string} [ui.colour]
   * @return {Object} Chart
   */
  dayChart (ent, {colourMode, colour} = Log.config.ui) {
    if (ent === undefined) return;
    const l = ent.length;
    if (l === 0) return;

    const frag = document.createDocumentFragment();

    for (let i = 0, lastPosition = 0; i < l; i++) {
      const entry = ø('span', {className: 'hf lf'});
      const {width, margin} = ent[i];

      ø(entry.style, {
        backgroundColor: ent[i][colourMode] || colour,
        marginLeft: `${margin - lastPosition}%`,
        width: `${width}%`
      });

      frag.append(entry);
      lastPosition = width + margin;
    }

    return frag;
  },

  /**
   * Generate focus bar
   * @param {number} mode - Sector (0) or project (1)
   * @param {Object[]} val - Values
   * @param {string} [colour]
   * @return {Object} Focus bar
   */
  focusBar (mode, val, colour = Log.config.ui.colour) {
    if (mode === undefined || val === undefined) return;
    if (mode < 0 || mode > 1) return;
    const l = val.length;
    if (l === 0) return;

    const pal = mode === 0 ? Log.palette : Log.projectPalette;
    const frag = document.createDocumentFragment();

    for (let i = 0; i < l; i++) {
      const seg = ø('div', {className: 'hf lf'});
      ø(seg.style, {
        backgroundColor: pal[val[i].n] || colour,
        width: `${val[i].v}%`
      });
      frag.append(seg);
    }

    return frag;
  },

  /**
   * Generate focus chart
   * @param {Object[]} data
   * @param {string} colour
   * @return {Object} Chart
   */
  focusChart (data, colour = Log.config.ui.colour) {
    const l = data.length;
    if (l === 0) return;

    const frag = document.createDocumentFragment();
    const col = ø('div', {className: 'dib hf'});
    const core = ø('div', {className: 'psa sw1 b0'});

    col.style.width = `${100 / l}%`;
    core.style.backgroundColor = colour;

    for (let i = 0; i < l; i++) {
      const cl = col.cloneNode();
      const cr = core.cloneNode();

      cr.style.height = `${data[i] * 100}%`;

      cl.append(cr);
      frag.append(cl);
    }

    return frag;
  },

  /**
   * Generate legend
   * @param {number} mode - Sector (0) or project (1)
   * @param {Object[]} val
   * @param {string} [colour]
   * @return {Object} Legend
   */
  legend (mode, val, colour = Log.config.ui.colour) {
    if (mode === undefined || val === undefined) return;
    if (mode < 0 || mode > 1) return;
    const l = val.length;
    if (l === 0) return;

    const frag = document.createDocumentFragment();
    const pal = mode === 0 ? Log.palette : Log.projectPalette;

    for (let i = 0; i < l; i++) {
      const item = ø('li', {className: 'c3 mb3 f6 lhc'});

      const icon = ø('div', {
        className: 'dib sh3 sw3 mr2 brf vm c-pt',
        onclick: () => Log.nav.toDetail(mode, val[i].n)
      });

      const info = ø('div', {
        className: 'dib vm sw6 elip tnum',
        innerHTML: `${val[i].v.toFixed(2)}% ${val[i].n}`
      });

      icon.style.backgroundColor = pal[val[i].n] || colour;

      item.append(icon);
      item.append(info);
      frag.append(item);
    }

    return frag;
  },

  /**
   * Generate list
   * @param {number} mode - Sector (0) or project (1)
   * @param {Object[]} sort - Sorted values
   * @param {Set} set
   * @param {Object} [ui] - UI preferences
   * @param {string} [ui.colourMode]
   * @param {string} [ui.colour]
   * @return {Object} Node
   */
  list (mode, sort, set = Log.log, {colourMode, colour} = Log.config.ui) {
    if (sort === undefined) return;
    if (mode < 0 || mode > 1) return;
    const l = sort.length;
    if (l === 0) return;
    if (set.entries.length === 0) return;

    const pal = mode === 0 ? Log.palette : Log.projectPalette;
    const frag = document.createDocumentFragment();
    const lh = set.logHours();

    const ä = (e, className, innerHTML = '') => {
      return ø(e, {className, innerHTML});
    }

    for (let i = 0; i < l; i++) {
      const item = ø('li', {
        className: `${i === l - 1 ? 'mb0' : 'mb4'} c-pt`,
        onclick: () => Log.nav.toDetail(mode, n)
      });

      const {n, v} = sort[i];

      const name = ä('span', 'dib xw6 elip', n);
      const span = ä('span', 'rf tnum', Log.data.stat(v));
      const bar = ä('div', 'sh1');

      ø(bar.style, {
        width: `${(v / lh * 100).toFixed(2)}%`,
        backgroundColor: (colourMode === 'none' ?
          colour : pal[n]) || colour
      });

      item.append(name);
      item.append(span);
      item.append(bar);
      frag.append(item);
    }

    return frag;
  },

  /**
   * Generate meter lines
   * @param {number} [n] - Divisions
   * @return {Object} Lines
   */
  meterLines (n = 24) {
    const f = document.createDocumentFragment();
    const y = 100 / n;

    for (let i = 0, x = 0; i < n; i++) {
      const l = ø('div', {
        className: `psa ${i % 2 === 0 ? 'h5' : 'hf'} br o7`
      });
      l.style.left = `${x += y}%`;
      f.append(l);
    }

    return f;
  },

  /**
   * Generate peak chart
   * @param {number} mode - Hour (0) or day (1)
   * @param {Object[]} peaks
   * @param {Object} [ui] - UI preferences
   * @param {string} [ui.accent]
   * @param {string} [ui.colour]
   * @return {Object} Chart
   */
  peakChart (mode, peaks, {accent, colour} = Log.config.ui) {
    if (peaks === undefined) return;
    const l = peaks.length;
    if (mode < 0 || mode > 1) return;
    if (l === 0) return;

    const frag = document.createDocumentFragment();
    const columnEl = ø('div', {className: 'dib hf psr'});
    const max = Math.max(...peaks);
    const d = new Date;
    let now = 0;
    let label = {};

    if (mode === 1) {
      now = d.getDay();
      label = Log.ui.util.setDayLabel;
    } else {
      now = d.getHours();
      label = Log.ui.util.setTimeLabel;
    }

    columnEl.style.width = `${100 / l}%`;

    for (let i = 0; i < l; i++) {
      const column = columnEl.cloneNode();
      const mantle = ø('div', {className: 'sw1 hf cn'});

      const core = ø('div', {
        className: 'psa b0 sw1 c-pt hoverCol',
        onmouseover: () => label(i),
        onmouseout: () => label()
      });

      ø(core.style, {
        height: `${peaks[i] / max * 100}%`,
        backgroundColor: i === now ? accent : colour
      });

      mantle.append(core);
      column.append(mantle);
      frag.append(column);
    }

    return frag;
  },

  /**
   * Generate visualisation
   * @param {Object[]} data
   * @return {Object} Visualisation
   */
  visualisation (data) {
    if (data === undefined) return;
    const l = data.length;
    if (l === 0) return;

    const frag = document.createDocumentFragment();

    for (let i = 0; i < l; i++) {
      const r = ø('div', {className: 'db wf sh1 mt2 mb2 visRow'});
      frag.append(r);

      if (data[i].length === 0) continue;
      for (let o = 0, ol = data[i].length; o < ol; o++) {
        const e = ø('div', {className: 'psr t0 hf mb1 lf'});
        const {c, m, w} = data[i][o];

        ø(e.style, {
          backgroundColor: c,
          marginLeft: m,
          width: w
        });

        r.append(e);
      }
    }

    return frag;
  }
};
