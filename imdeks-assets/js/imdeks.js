/*!
 * Imdeks CDN JS v43
 * Static frontend interactions only.
 */
(function(){
    if(window.__IMDEKS_CDN_V43_LOADED__) return;
    window.__IMDEKS_CDN_V43_LOADED__ = true;
})();


/* ---- extracted inline script ---- */



/* ---- extracted inline script ---- */

/* ---- query targeted ads filter stable v49 ---- */


/* ---- query targeted ads filter stable v50 ---- */


/* ---- query targeted ads filter stable v54 no-flash ---- */
(function(){
    function normalizeImdeksAdText(text){
        return (text || "")
            .toString()
            .toLowerCase()
            .replace(/ç/g,'c')
            .replace(/ğ/g,'g')
            .replace(/ı/g,'i')
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

    function filterImdeksAds(){
        var query = new URLSearchParams(window.location.search).get("q") || "";
        var q = normalizeImdeksAdText(query);
        var adUnits = document.querySelectorAll(".imdeks-ad-unit");

        adUnits.forEach(function(unit){
            var items = unit.querySelectorAll(".ad-item");

            // .ad-item yoksa klasik reklamdır; asla gizleme
            if(!items.length){
                if(unit.innerHTML.trim()){
                    unit.style.display = "";
                    unit.style.visibility = "visible";
                    unit.style.opacity = "1";
                }
                return;
            }

            unit.classList.add("imdeks-ad-processed");

            var matchedCount = 0;
            var defaultItems = [];

            items.forEach(function(item){
                var tagsRaw = item.getAttribute("data-tags") || "";
                var isDefault = item.getAttribute("data-default") === "1";

                item.classList.remove("is-visible");
                item.style.display = "none";

                if(isDefault){
                    defaultItems.push(item);
                    return;
                }

                if(!tagsRaw) return;

                var tags = tagsRaw.split(",")
                    .map(function(tag){ return normalizeImdeksAdText(tag); })
                    .filter(Boolean);

                var matched = tags.some(function(tag){
                    if(q.indexOf(tag) !== -1) return true;
                    var words = tag.split(" ").filter(function(word){ return word.length > 1; });
                    return words.length > 1 && words.every(function(word){ return q.indexOf(word) !== -1; });
                });

                if(matched){
                    item.classList.add("is-visible");
                    item.style.display = "";
                    matchedCount++;
                }
            });

            if(matchedCount === 0){
                defaultItems.forEach(function(item){
                    item.classList.add("is-visible");
                    item.style.display = "";
                });
            }

            var visibleItem = Array.prototype.some.call(items, function(item){
                return item.classList.contains("is-visible");
            });

            if(visibleItem || unit.innerHTML.trim()){
                unit.style.display = "";
                unit.style.visibility = "visible";
                unit.style.opacity = "1";
            }else{
                unit.style.display = "none";
            }
        });
    }

    if(document.readyState === "loading"){
        document.addEventListener("DOMContentLoaded", filterImdeksAds);
    }else{
        filterImdeksAds();
    }

    window.addEventListener("load", filterImdeksAds);
    setTimeout(filterImdeksAds, 150);
    setTimeout(filterImdeksAds, 700);

    if(window.MutationObserver){
        var observer = new MutationObserver(function(mutations){
            var shouldRun = false;
            mutations.forEach(function(m){
                if(m.addedNodes && m.addedNodes.length){
                    shouldRun = true;
                }
            });
            if(shouldRun) filterImdeksAds();
        });
        observer.observe(document.documentElement, {childList:true, subtree:true});
    }
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

