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

