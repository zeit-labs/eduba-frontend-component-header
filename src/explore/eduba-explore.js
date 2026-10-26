/*
 * Eduba Explore menu — a self-contained web component.
 *
 * Mirrors the marketing site's ExploreMenu (desktop dropdown + mobile accordion) and reads the
 * categories from the LMS API. Everything lives in a shadow root so the LMS theme, Bootstrap and
 * any platform override cannot restyle it; the values below are the marketing component's
 * Tailwind tokens copied over one by one.
 *
 * The element degrades to the <a> it wraps when this script is not loaded.
 *
 * This file ships in both eduba-theme and eduba-frontend-component-header (the LMS header and the
 * MFE header) — keep the two copies identical.
 */
/* eslint-disable no-underscore-dangle, no-var, prefer-template, vars-on-top, func-names,
   prefer-arrow-callback, prefer-destructuring */
/* The component is written in plain ES5-style JavaScript so the same file runs unbundled in the
 * LMS theme and bundled in the MFE header. */
(function () {
  'use strict';

  if (customElements.get('eduba-explore')) {
    return;
  }

  // Marketing design tokens (app/styles/globals.css + Tailwind defaults).
  var BLUE = '#212e54'; // --color-blue-400
  var RED = '#c1413b'; // --color-red-200
  var RED_HOVER = 'rgba(193, 65, 59, 0.1)'; // bg-red-200/10
  var NEUTRAL_50 = '#fafafa';
  var NEUTRAL_100 = '#f5f5f5';
  var NEUTRAL_200 = '#e5e5e5';
  var FONT = "'Almarai', sans-serif";

  // One request per API URL, shared by every instance (desktop + mobile) on the page.
  var categoriesCache = {};

  var CHEVRON_DOWN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"/></svg>';
  var CHEVRON_RIGHT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"/></svg>';
  var CHEVRON_LEFT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5"/></svg>';

  var DESKTOP_CSS = [
    ':host{display:inline-block;position:relative;font-family:' + FONT + ';color:' + BLUE + '}',
    '*,*::before,*::after{box-sizing:border-box}',
    // Trigger: marketing "font-almarai inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-bold"
    '.trigger{font-family:' + FONT + ';display:inline-flex;align-items:center;gap:4px;margin:0;',
    'padding:8px 12px;border:0;border-radius:6px;background:transparent;cursor:pointer;',
    'font-size:14px;line-height:20px;font-weight:700;color:' + BLUE + ';',
    'transition:color .15s,background-color .15s;outline:none}',
    '.trigger:hover{background:' + RED_HOVER + '}',
    '.trigger[aria-expanded="true"]{color:' + RED + '}',
    '.trigger svg{width:16px;height:16px;transition:transform .2s}',
    '.trigger[aria-expanded="true"] svg{transform:rotate(180deg)}',
    // Panel wrapper: "absolute start-0 z-50 mt-3 origin-top transition-all duration-150"
    '.panel-wrap{position:absolute;inset-inline-start:0;top:100%;z-index:1050;margin-top:12px;',
    'transform-origin:top;transform:scale(.95);opacity:0;pointer-events:none;',
    'transition:transform .15s,opacity .15s}',
    '.panel-wrap.open{transform:scale(1);opacity:1;pointer-events:auto}',
    // Panel: "flex rounded-xl border border-neutral-200 bg-white shadow-lg"
    '.panel{display:flex;border:1px solid ' + NEUTRAL_200 + ';border-radius:12px;background:#fff;',
    'box-shadow:0 10px 15px -3px rgba(0,0,0,.1),0 4px 6px -4px rgba(0,0,0,.1)}',
    // Left column: "w-56 border-neutral-100 py-2" (+ border-e when active)
    '.cats{width:224px;padding:8px 0}',
    '.cats.has-active{border-inline-end:1px solid ' + NEUTRAL_100 + '}',
    // Category row: "flex w-full items-center justify-between px-4 py-2.5 text-sm font-medium"
    '.cat{font-family:' + FONT + ';display:flex;width:100%;align-items:center;justify-content:space-between;',
    'gap:8px;padding:10px 16px;font-size:14px;line-height:20px;font-weight:500;color:' + BLUE + ';',
    'text-decoration:none;transition:background-color .15s,color .15s;cursor:pointer}',
    '.cat:hover{background:' + NEUTRAL_50 + '}',
    '.cat.active,.cat.active:hover{background:' + RED_HOVER + ';color:' + RED + '}',
    '.cat svg{width:16px;height:16px;flex:0 0 auto}',
    // Right column: "overflow-hidden transition-all duration-150" + w-48 / w-1
    '.subs-wrap{overflow:hidden;transition:width .15s,opacity .15s;width:4px;opacity:0}',
    '.subs-wrap.open{width:192px;opacity:1}',
    '.subs{width:192px;padding:8px 0}',
    // Subcategory row: "px-4 py-2.5 text-sm font-medium text-blue-400 hover:bg-red-200/10 hover:text-red-200"
    '.sub{font-family:' + FONT + ';display:flex;width:100%;align-items:center;padding:10px 16px;',
    'font-size:14px;line-height:20px;font-weight:500;color:' + BLUE + ';text-decoration:none;',
    'transition:background-color .15s,color .15s}',
    '.sub:hover{background:' + RED_HOVER + ';color:' + RED + '}',
    '.empty{padding:10px 16px;font-size:14px;color:' + BLUE + ';opacity:.6}',
    '@media (prefers-reduced-motion:reduce){*{transition:none!important;animation:none!important}}',
  ].join('');

  var MOBILE_CSS = [
    ':host{display:block;font-family:' + FONT + ';color:' + BLUE + '}',
    '*,*::before,*::after{box-sizing:border-box}',
    // Trigger: "flex w-full items-center justify-between rounded-md px-3 py-2 text-base font-bold"
    '.trigger{font-family:' + FONT + ';display:flex;width:100%;align-items:center;justify-content:space-between;',
    'gap:8px;margin:0;padding:8px 12px;border:0;border-radius:6px;background:transparent;cursor:pointer;',
    'font-size:16px;line-height:24px;font-weight:700;color:' + BLUE + ';text-align:start;',
    'transition:color .15s,background-color .15s;outline:none}',
    '.trigger:hover{background:' + RED_HOVER + '}',
    '.trigger[aria-expanded="true"]{color:' + RED + '}',
    '.trigger svg{width:20px;height:20px;flex:0 0 auto;transition:transform .2s}',
    '.trigger[aria-expanded="true"] svg{transform:rotate(180deg)}',
    '.panel{display:flex;flex-direction:column;gap:4px;padding-inline-start:16px}',
    '.panel[hidden]{display:none}',
    // Category row: "flex items-center rounded-md" + link "font-almarai flex-1 px-3 py-2 text-sm font-bold"
    '.cat-row{display:flex;align-items:center;border-radius:6px}',
    '.cat-row:hover,.cat-row.open{color:' + RED + '}',
    '.cat-row:hover{background:' + RED_HOVER + '}',
    '.cat-link{font-family:' + FONT + ';flex:1 1 auto;padding:8px 12px;font-size:14px;line-height:20px;',
    'font-weight:700;color:inherit;text-decoration:none;text-align:start}',
    '.cat-toggle{margin:0;padding:8px;border:0;background:transparent;cursor:pointer;color:inherit;line-height:0}',
    '.cat-toggle svg{width:16px;height:16px;transition:transform .2s}',
    '.cat-row.open .cat-toggle svg{transform:rotate(180deg)}',
    '.subs{display:flex;flex-direction:column;gap:4px;padding-bottom:4px}',
    '.subs[hidden]{display:none}',
    // Subcategory row: "block w-full rounded-md px-3 py-1.5 text-sm font-medium"
    '.sub{font-family:' + FONT + ';display:block;padding:6px 12px;border-radius:6px;font-size:14px;',
    'line-height:20px;font-weight:500;color:' + BLUE + ';text-decoration:none;text-align:start;',
    'transition:background-color .15s,color .15s}',
    '.sub:hover{background:' + RED_HOVER + ';color:' + RED + '}',
    '.empty{padding:8px 12px;font-size:14px;color:' + BLUE + ';opacity:.6}',
    '@media (prefers-reduced-motion:reduce){*{transition:none!important;animation:none!important}}',
  ].join('');

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) {
      node.className = className;
    }
    if (text !== undefined && text !== null) {
      node.textContent = text;
    }
    return node;
  }

  function isRtl(lang) {
    return (lang || document.documentElement.lang || '').toLowerCase().indexOf('ar') === 0;
  }

  class EdubaExplore extends HTMLElement {
    connectedCallback() {
      if (this._mounted) {
        return;
      }
      this._mounted = true;
      this._lang = (this.getAttribute('lang') || document.documentElement.lang || 'ar').split('-')[0];
      this._base = (this.getAttribute('base') || '').replace(/\/+$/, '');
      this._api = this.getAttribute('api') || '/api/eduba/categories/v1/categories/';
      this._label = this.getAttribute('label') || 'Explore';
      this._variant = this.getAttribute('variant') === 'mobile' ? 'mobile' : 'desktop';
      this._categories = null;
      this.attachShadow({ mode: 'open' });
      var style = document.createElement('style');
      style.textContent = this._variant === 'mobile' ? MOBILE_CSS : DESKTOP_CSS;
      this.shadowRoot.appendChild(style);
      if (this._variant === 'mobile') {
        this._renderMobile();
      } else {
        this._renderDesktop();
      }
    }

    /* ------------------------------- data ------------------------------- */

    _title(item) {
      return (this._lang === 'ar' ? item.title_ar : item.title_en) || item.title_en || item.title_ar || '';
    }

    _href(id, subId) {
      var base = this._base || '';
      return base + '/explore/' + id + (subId ? '/' + subId : '');
    }

    _load() {
      var self = this;
      if (this._categories !== null) {
        return Promise.resolve(this._categories);
      }
      if (!categoriesCache[this._api]) {
        categoriesCache[this._api] = fetch(this._api, {
          credentials: 'include',
          headers: { Accept: 'application/json' },
        })
          .then(function (response) {
            if (!response.ok) {
              throw new Error('categories request failed: ' + response.status);
            }
            return response.json();
          })
          .then(function (data) {
            return (data && data.results) || [];
          })
          .catch(function () {
            // Drop the failed request so a later open retries it.
            delete categoriesCache[self._api];
            return [];
          });
      }
      return categoriesCache[this._api].then(function (categories) {
        self._categories = categories;
        return categories;
      });
    }

    /* ------------------------------ desktop ----------------------------- */

    _renderDesktop() {
      var self = this;
      var root = el('div', 'explore');
      var trigger = el('button', 'trigger');
      trigger.type = 'button';
      trigger.setAttribute('aria-expanded', 'false');
      trigger.setAttribute('aria-haspopup', 'true');
      trigger.appendChild(el('span', null, this._label));
      var chevron = el('span', null);
      chevron.innerHTML = CHEVRON_DOWN;
      trigger.appendChild(chevron.firstChild);

      var wrap = el('div', 'panel-wrap');
      var panel = el('div', 'panel');
      var cats = el('div', 'cats');
      var subsWrap = el('div', 'subs-wrap');
      var subs = el('div', 'subs');
      panel.appendChild(cats);
      panel.appendChild(subsWrap);
      subsWrap.appendChild(subs);
      wrap.appendChild(panel);
      root.appendChild(trigger);
      root.appendChild(wrap);
      this.shadowRoot.appendChild(root);

      this._trigger = trigger;
      this._wrap = wrap;
      this._cats = cats;
      this._subsWrap = subsWrap;
      this._subs = subs;

      trigger.addEventListener('click', function () {
        if (self._wrap.classList.contains('open')) {
          self._close();
        } else {
          self._open();
        }
      });

      wrap.addEventListener('mouseleave', function () {
        self._setActive(null);
      });

      this._onDocDown = function (event) {
        if (!event.composedPath().includes(self)) {
          self._close();
        }
      };
      this._onKey = function (event) {
        if (event.key === 'Escape' && self._wrap.classList.contains('open')) {
          self._close();
          self._trigger.focus();
        }
      };
      document.addEventListener('mousedown', this._onDocDown);
      document.addEventListener('keydown', this._onKey);
    }

    _open() {
      var self = this;
      this._trigger.setAttribute('aria-expanded', 'true');
      this._load().then(function (categories) {
        // The learner may have closed the menu while the request was in flight.
        if (self._trigger.getAttribute('aria-expanded') !== 'true') {
          return;
        }
        self._renderCategories(categories);
        self._wrap.classList.add('open');
      });
    }

    _close() {
      this._setActive(null);
      this._wrap.classList.remove('open');
      this._trigger.setAttribute('aria-expanded', 'false');
    }

    _renderCategories(categories) {
      var self = this;
      this._cats.textContent = '';
      if (!categories.length) {
        this._cats.appendChild(el('div', 'empty', this._lang === 'ar' ? 'لا توجد تصنيفات' : 'No categories yet'));
        return;
      }
      categories.forEach(function (category) {
        var hasSubs = (category.subcategories || []).length > 0;
        var link = el('a', 'cat');
        link.href = self._href(category.id);
        link.setAttribute('data-id', String(category.id));
        link.appendChild(el('span', null, self._title(category)));
        if (hasSubs) {
          var icon = el('span', null);
          icon.innerHTML = isRtl(self._lang) ? CHEVRON_LEFT : CHEVRON_RIGHT;
          link.appendChild(icon.firstChild);
        }
        link.addEventListener('mouseenter', function () {
          self._setActive(hasSubs ? category : null);
        });
        link.addEventListener('focus', function () {
          self._setActive(hasSubs ? category : null);
        });
        self._cats.appendChild(link);
      });
    }

    _setActive(category) {
      var hasActive = !!(category && (category.subcategories || []).length);
      this._cats.classList.toggle('has-active', hasActive);
      Array.prototype.forEach.call(this._cats.children, function (node) {
        node.classList.toggle('active', hasActive && node.getAttribute('data-id') === String(category.id));
      });
      this._subsWrap.classList.toggle('open', hasActive);
      this._subs.textContent = '';
      if (!hasActive) {
        return;
      }
      var self = this;
      (category.subcategories || []).forEach(function (sub) {
        var link = el('a', 'sub', self._title(sub));
        link.href = self._href(category.id, sub.id);
        self._subs.appendChild(link);
      });
    }

    /* ------------------------------ mobile ------------------------------ */

    _renderMobile() {
      var self = this;
      var root = el('div', 'explore-mobile');
      var trigger = el('button', 'trigger');
      trigger.type = 'button';
      trigger.setAttribute('aria-expanded', 'false');
      trigger.appendChild(el('span', null, this._label));
      var chevron = el('span', null);
      chevron.innerHTML = CHEVRON_DOWN;
      trigger.appendChild(chevron.firstChild);

      var panel = el('div', 'panel');
      panel.hidden = true;
      root.appendChild(trigger);
      root.appendChild(panel);
      this.shadowRoot.appendChild(root);

      trigger.addEventListener('click', function () {
        var open = panel.hidden;
        panel.hidden = !open;
        trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
        if (open) {
          self._load().then(function (categories) {
            self._renderMobileCategories(categories);
          });
        }
      });
    }

    _renderMobileCategories(categories) {
      var self = this;
      var panel = this.shadowRoot.querySelector('.panel');
      panel.textContent = '';
      if (!categories.length) {
        panel.appendChild(el('div', 'empty', this._lang === 'ar' ? 'لا توجد تصنيفات' : 'No categories yet'));
        return;
      }
      categories.forEach(function (category) {
        var subs = category.subcategories || [];
        var row = el('div', 'cat-row');
        var link = el('a', 'cat-link', self._title(category));
        link.href = self._href(category.id);
        row.appendChild(link);

        var subsBox = null;
        if (subs.length) {
          var toggle = el('button', 'cat-toggle');
          toggle.type = 'button';
          toggle.setAttribute('aria-expanded', 'false');
          toggle.innerHTML = CHEVRON_DOWN;
          subsBox = el('div', 'subs');
          subsBox.hidden = true;
          toggle.addEventListener('click', function () {
            var open = subsBox.hidden;
            subsBox.hidden = !open;
            row.classList.toggle('open', open);
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
          });
          row.appendChild(toggle);
        }
        panel.appendChild(row);

        if (subsBox) {
          subs.forEach(function (sub) {
            var subLink = el('a', 'sub', self._title(sub));
            subLink.href = self._href(category.id, sub.id);
            subsBox.appendChild(subLink);
          });
          panel.appendChild(subsBox);
        }
      });
    }

    disconnectedCallback() {
      if (this._onDocDown) {
        document.removeEventListener('mousedown', this._onDocDown);
      }
      if (this._onKey) {
        document.removeEventListener('keydown', this._onKey);
      }
    }
  }

  customElements.define('eduba-explore', EdubaExplore);
}());
