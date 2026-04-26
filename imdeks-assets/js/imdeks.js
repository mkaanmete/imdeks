/*!
 * Imdeks CDN JS v62
 * Reklam kuralı:
 * - data-default="1" reklamlar her sorguda görünür.
 * - data-tags reklamları sadece sorgu/etiket eşleşirse görünür.
 * Places tarafına dokunmaz.
 */
(function(){
    if(window.__IMDEKS_CDN_V62_LOADED__) return;
    window.__IMDEKS_CDN_V62_LOADED__ = true;

    function normalize(text){
        return (text || '')
            .toString()
            .toLowerCase()
            .replace(/ç/g,'c')
            .replace(/ğ/g,'g')
            .replace(/ı/g,'i')
            .replace(/i̇/g,'i')
            .replace(/ö/g,'o')
            .replace(/ş/g,'s')
            .replace(/ü/g,'u')
            .replace(/â/g,'a')
            .replace(/î/g,'i')
            .replace(/û/g,'u')
            .replace(/[^a-z0-9\s,]/g,' ')
            .replace(/\s+/g,' ')
            .trim();
    }

    function getQuery(){
        var params = new URLSearchParams(window.location.search || '');
        var keys = ['q','query','s','search','keyword','keywords'];
        for(var i=0;i<keys.length;i++){
            var v = params.get(keys[i]);
            if(v && v.trim()) return v.trim();
        }

        var input = document.querySelector('input[name="q"], input[name="query"], input[type="search"], .search-input, #search-input');
        if(input && input.value && input.value.trim()) return input.value.trim();

        var holder = document.querySelector('[data-search-query], [data-imdeks-query]');
        if(holder){
            var attr = holder.getAttribute('data-search-query') || holder.getAttribute('data-imdeks-query') || '';
            if(attr.trim()) return attr.trim();
        }
        return '';
    }

    function words(text, minLen){
        return normalize(text).split(' ').filter(function(w){ return w.length >= (minLen || 2); });
    }

    function tagMatches(tag, query){
        var t = normalize(tag);
        var q = normalize(query);
        if(!t || !q) return false;

        if(q.indexOf(t) !== -1 || t.indexOf(q) !== -1) return true;

        var tagWords = words(t, 2);
        var qWords = words(q, 2);
        if(!tagWords.length || !qWords.length) return false;

        // data-tags="dis" sorgu "diş kliniği" ile eşleşsin.
        for(var i=0;i<tagWords.length;i++){
            if(qWords.indexOf(tagWords[i]) !== -1) return true;
        }

        // Çok kelimeli etiketlerde en az yarısı eşleşirse göster.
        if(tagWords.length > 1){
            var hits = 0;
            tagWords.forEach(function(w){ if(qWords.indexOf(w) !== -1) hits++; });
            if(hits >= Math.ceil(tagWords.length / 2)) return true;
        }

        return false;
    }

    function forceUnitVisible(unit){
        unit.style.setProperty('display','block','important');
        unit.style.setProperty('visibility','visible','important');
        unit.style.setProperty('opacity','1','important');
        unit.style.setProperty('height','auto','important');
        unit.style.setProperty('max-height','none','important');
        unit.style.setProperty('overflow','visible','important');
    }

    function setItemVisible(item, visible){
        item.classList.toggle('is-visible', !!visible);
        item.setAttribute('data-imdeks-visible', visible ? '1' : '0');
        item.style.setProperty('display', visible ? 'block' : 'none', 'important');
        item.style.setProperty('visibility', visible ? 'visible' : 'hidden', 'important');
        item.style.setProperty('opacity', visible ? '1' : '0', 'important');
        item.style.setProperty('height', visible ? 'auto' : '0', 'important');
        item.style.setProperty('max-height', visible ? 'none' : '0', 'important');
        item.style.setProperty('overflow', visible ? 'visible' : 'hidden', 'important');
    }

    function itemMatches(item, query){
        var tagsRaw = item.getAttribute('data-tags') || '';
        var tags = tagsRaw.split(',').map(function(t){ return t.trim(); }).filter(Boolean);
        if(!query || !tags.length) return false;
        return tags.some(function(tag){ return tagMatches(tag, query); });
    }

    function filterAds(){
        var query = getQuery();
        var units = document.querySelectorAll('.imdeks-ad-unit, .ad-unit, [data-imdeks-ad-unit]');

        units.forEach(function(unit){
            forceUnitVisible(unit);
            var items = Array.prototype.slice.call(unit.querySelectorAll('.ad-item'));
            if(!items.length) return;

            unit.classList.add('imdeks-ad-processed');
            unit.setAttribute('data-imdeks-ad-query', normalize(query));

            var visibleCount = 0;
            items.forEach(function(item){
                var isDefault = item.getAttribute('data-default') === '1';
                var isTaggedMatch = itemMatches(item, query);
                var shouldShow = isDefault || isTaggedMatch;
                setItemVisible(item, shouldShow);
                if(shouldShow) visibleCount++;
            });

            // Güvenlik: default reklam varsa mutlaka açık kalsın.
            if(!visibleCount){
                var defaultItem = unit.querySelector('.ad-item[data-default="1"]');
                if(defaultItem) setItemVisible(defaultItem, true);
            }
        });
    }

    function run(){
        try { filterAds(); }
        catch(e){ if(window.console) console.warn('Imdeks v62 ad filter error:', e); }
    }

    if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
    else run();

    window.addEventListener('load', run);
    window.addEventListener('pageshow', run);
    window.addEventListener('resize', run);
    [50,150,300,700,1200,2000].forEach(function(t){ setTimeout(run, t); });

    if(window.MutationObserver){
        var timer = null;
        var observer = new MutationObserver(function(mutations){
            var hasAdChange = mutations.some(function(m){
                return Array.prototype.slice.call(m.addedNodes || []).some(function(n){
                    return n.nodeType === 1 && (n.matches && (n.matches('.ad-item,.imdeks-ad-unit,.ad-unit') || n.querySelector && n.querySelector('.ad-item,.imdeks-ad-unit,.ad-unit')));
                });
            });
            if(hasAdChange){
                clearTimeout(timer);
                timer = setTimeout(run, 30);
            }
        });
        observer.observe(document.documentElement, {childList:true, subtree:true});
    }
})();
