/*!
 * Imdeks CDN JS v59
 * Static frontend interactions only.
 */
(function(){
    if(window.__IMDEKS_CDN_V59_LOADED__) return;
    window.__IMDEKS_CDN_V59_LOADED__ = true;
})();


/* ---- extracted inline script ---- */



/* ---- extracted inline script ---- */

/* ---- query targeted ads filter stable v49 ---- */


/* ---- query targeted ads filter stable v50 ---- */


/* ---- query targeted ads filter stable v59 desktop fallback ---- */
(function(){
    function normalizeImdeksAdText(text){
        return (text || '').toString().toLowerCase()
            .replace(/ç/g,'c').replace(/ğ/g,'g').replace(/ı/g,'i')
            .replace(/ö/g,'o').replace(/ş/g,'s').replace(/ü/g,'u')
            .replace(/[^a-z0-9\s,]/g,' ').replace(/\s+/g,' ').trim();
    }
    function getTags(item){
        return [item.getAttribute('data-tags'), item.getAttribute('data-keywords'), item.getAttribute('data-keyword'), item.getAttribute('data-query'), item.getAttribute('data-queries'), item.getAttribute('data-category'), item.getAttribute('data-title')].filter(Boolean).join(',');
    }
    function showItem(item){
        item.classList.add('is-visible');
        item.classList.add('imdeks-force-visible');
        item.style.setProperty('display','block','important');
        item.style.setProperty('visibility','visible','important');
        item.style.setProperty('opacity','1','important');
    }
    function hideItem(item){
        item.classList.remove('is-visible');
        item.classList.remove('imdeks-force-visible');
        item.style.setProperty('display','none','important');
    }
    function filterImdeksAds(){
        var query = new URLSearchParams(window.location.search).get('q') || '';
        var q = normalizeImdeksAdText(query);
        document.querySelectorAll('.imdeks-ad-unit').forEach(function(unit){
            var items = Array.prototype.slice.call(unit.querySelectorAll('.ad-item'));
            unit.style.setProperty('display','block','important');
            unit.style.setProperty('visibility','visible','important');
            unit.style.setProperty('opacity','1','important');
            if(!items.length){ return; }
            unit.classList.add('imdeks-ad-processed');
            var matched = [];
            var defaults = [];
            items.forEach(function(item){
                hideItem(item);
                var isDefault = item.getAttribute('data-default') === '1' || item.classList.contains('default') || item.classList.contains('is-default');
                if(isDefault) defaults.push(item);
                var tagsRaw = getTags(item);
                var searchable = normalizeImdeksAdText(tagsRaw || item.textContent || '');
                if(!q || !searchable) return;
                var tags = tagsRaw ? tagsRaw.split(',').map(normalizeImdeksAdText).filter(Boolean) : [searchable];
                var ok = tags.some(function(tag){
                    if(!tag) return false;
                    if(q.indexOf(tag) !== -1 || tag.indexOf(q) !== -1) return true;
                    var words = tag.split(' ').filter(function(w){ return w.length > 1; });
                    return words.length > 1 && words.every(function(w){ return q.indexOf(w) !== -1; });
                });
                if(ok) matched.push(item);
            });
            if(matched.length){ matched.forEach(showItem); }
            else if(defaults.length){ defaults.forEach(showItem); }
            else { showItem(items[0]); }
        });
    }
    if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', filterImdeksAds); else filterImdeksAds();
    window.addEventListener('load', filterImdeksAds);
    setTimeout(filterImdeksAds, 100);
    setTimeout(filterImdeksAds, 500);
    setTimeout(filterImdeksAds, 1500);
})();

/* ---- v55 desktop ads visibility safety pass ---- */
document.addEventListener("DOMContentLoaded", function(){
    function forceDesktopAdVisibility(){
        if(window.matchMedia && window.matchMedia("(min-width: 992px)").matches){
            document.querySelectorAll(".imdeks-ad-unit").forEach(function(unit){
                if(unit.innerHTML.trim()){
                    unit.style.display = "";
                    unit.style.visibility = "visible";
                    unit.style.opacity = "1";
                }
            });
        }
    }
    forceDesktopAdVisibility();
    window.addEventListener("load", forceDesktopAdVisibility);
    setTimeout(forceDesktopAdVisibility, 300);
    setTimeout(forceDesktopAdVisibility, 1200);
});


/* ---- v60 ads only final: robust query matching + desktop/mobile visibility ---- */
(function(){
    if(window.__IMDEKS_ADS_V60_FINAL__) return;
    window.__IMDEKS_ADS_V60_FINAL__ = true;

    function norm(text){
        return (text || '').toString().toLowerCase()
            .replace(/ç/g,'c').replace(/ğ/g,'g').replace(/[ıiİ]/g,'i')
            .replace(/ö/g,'o').replace(/ş/g,'s').replace(/ü/g,'u')
            .replace(/â/g,'a').replace(/î/g,'i').replace(/û/g,'u')
            .replace(/[^a-z0-9\s,|;:_\-]/g,' ')
            .replace(/[|;:_\-]+/g,' ')
            .replace(/\s+/g,' ')
            .trim();
    }
    function getQuery(){
        var params = new URLSearchParams(window.location.search || '');
        var q = params.get('q') || params.get('query') || params.get('s') || '';
        if(!q){
            var input = document.querySelector('input[name="q"], input[type="search"], .search-input');
            if(input && input.value) q = input.value;
        }
        return norm(q);
    }
    function expandQuery(q){
        var extra = [];
        var hasDental = /(\bdis\b|dental|agiz|implant|ortodont|gulus|zirkonyum|lamine|kanal|dolgu|hekim|hekimligi|klinik|klinigi)/.test(q);
        if(hasDental){ extra = extra.concat(['dis','dental','agiz','klinik','klinigi','dis klinigi','dis hekimi','implant','estetik','gulus tasarimi']); }
        return norm((q + ' ' + extra.join(' '))).split(' ').filter(function(w){ return w.length > 1; });
    }
    function itemText(item){
        var parts = [];
        ['data-tags','data-keywords','data-keyword','data-query','data-queries','data-category','data-title','data-name','data-service','data-location'].forEach(function(a){ var v=item.getAttribute(a); if(v) parts.push(v); });
        Array.prototype.slice.call(item.attributes || []).forEach(function(attr){ if(attr && attr.name && attr.name.indexOf('data-') === 0 && attr.value) parts.push(attr.value); });
        parts.push(item.getAttribute('title') || ''); parts.push(item.getAttribute('alt') || ''); parts.push(item.textContent || '');
        return norm(parts.join(' '));
    }
    function isDefault(item){ var v=(item.getAttribute('data-default') || '').toString().toLowerCase(); return v === '1' || v === 'true' || item.classList.contains('default') || item.classList.contains('is-default'); }
    function show(item){ item.classList.add('is-visible','imdeks-force-visible'); item.style.setProperty('display','block','important'); item.style.setProperty('visibility','visible','important'); item.style.setProperty('opacity','1','important'); item.style.setProperty('height','auto','important'); item.style.setProperty('max-height','none','important'); }
    function hide(item){ item.classList.remove('is-visible','imdeks-force-visible'); item.style.setProperty('display','none','important'); item.style.setProperty('visibility','hidden','important'); }
    function scoreItem(item, qWords){
        var txt = itemText(item); if(!txt) return 0; var score = 0;
        qWords.forEach(function(w){ if(txt.indexOf(w) !== -1) score += (w.length >= 5 ? 3 : 1); });
        if(qWords.indexOf('dis') !== -1 || qWords.indexOf('dental') !== -1 || qWords.indexOf('klinik') !== -1 || qWords.indexOf('klinigi') !== -1){
            if(/(\bdis\b|dental|agiz|implant|ortodont|gulus|zirkonyum|lamine|kanal|dolgu|hekim|klinik|klinigi)/.test(txt)) score += 10;
        }
        return score;
    }
    function processUnit(unit){
        if(!unit) return;
        unit.classList.add('imdeks-ad-processed','imdeks-ad-v60');
        unit.style.setProperty('display','block','important'); unit.style.setProperty('visibility','visible','important'); unit.style.setProperty('opacity','1','important'); unit.style.setProperty('height','auto','important'); unit.style.setProperty('max-height','none','important'); unit.style.setProperty('overflow','visible','important');
        var items = Array.prototype.slice.call(unit.querySelectorAll('.ad-item'));
        if(!items.length){ if((unit.innerHTML || '').trim()) unit.style.setProperty('min-height','1px','important'); return; }
        var words = expandQuery(getQuery()); var defaults = []; var scored = [];
        items.forEach(function(item){ hide(item); if(isDefault(item)) defaults.push(item); var score=scoreItem(item, words); if(score > 0 && !isDefault(item)) scored.push({item:item,score:score}); });
        scored.sort(function(a,b){ return b.score - a.score; });
        if(scored.length) scored.forEach(function(x){ show(x.item); }); else if(defaults.length) defaults.forEach(show); else if(items.length) show(items[0]);
    }
    function run(){ var units = Array.prototype.slice.call(document.querySelectorAll('.imdeks-ad-unit')); units.forEach(processUnit); }
    if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
    window.addEventListener('load', run); setTimeout(run,50); setTimeout(run,250); setTimeout(run,800); setTimeout(run,1800);
    if(window.MutationObserver){ new MutationObserver(function(){ run(); }).observe(document.documentElement, {childList:true, subtree:true}); }
})();
