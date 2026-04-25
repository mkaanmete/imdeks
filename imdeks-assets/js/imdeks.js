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


/* ---- local places geolocation helper: cookie mode, no URL lat/lng ---- */
document.addEventListener("DOMContentLoaded", function(){
    function normalizeImdeksGeoText(text){
        return (text || "")
            .toString()
            .toLowerCase()
            .replace(/ç/g,'c').replace(/ğ/g,'g').replace(/ı/g,'i')
            .replace(/ö/g,'o').replace(/ş/g,'s').replace(/ü/g,'u')
            .replace(/\s+/g,' ')
            .trim();
    }

    function getCookie(name){
        var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        return match ? decodeURIComponent(match[2]) : '';
    }

    function setCookie(name, value, maxAge){
        document.cookie = name + '=' + encodeURIComponent(value) + '; path=/; max-age=' + maxAge + '; SameSite=Lax';
    }

    var params = new URLSearchParams(window.location.search);
    var q = normalizeImdeksGeoText(params.get("q") || "");
    var engine = (params.get("engine") || "1").toString();

    // Eski URL'lerde lat/lng varsa temizle ve cookie'ye al.
    if(params.get("lat") && params.get("lng")){
        setCookie("imdeks_lat", params.get("lat"), 86400);
        setCookie("imdeks_lng", params.get("lng"), 86400);
        params.delete("lat");
        params.delete("lng");
        window.location.replace(window.location.pathname + "?" + params.toString());
        return;
    }

    if(["images","videos","news","social","scholar","calculator","akademik","hesaplama"].indexOf(engine) !== -1) return;

    var localKeywords = [
        "klinik","klinigi","klinikleri","dis","disci","implant","eczane","hastane",
        "doktor","oto servis","tamir","restoran","otel","kuafor","avukat","market",
        "kafe","cafe","veteriner","spor salonu","fitness"
    ];

    var explicitLocationWords = [
        "istanbul","ankara","izmir","bursa","adana","antalya","samsun","esenler",
        "beylikduzu","kadikoy","bakirkoy","sisli","besiktas","uskudar","maltepe",
        "pendik","kartal","avcilar","buyukcekmece","basaksehir","bagcilar"
    ];

    var looksLocal = localKeywords.some(function(k){ return q.indexOf(k) !== -1; });
    var hasExplicitLocation = explicitLocationWords.some(function(k){ return q.indexOf(k) !== -1; });

    if(!looksLocal || hasExplicitLocation) return;
    if(!navigator.geolocation) return;

    // Cookie varsa URL'yi değiştirme. Backend cookie'den okuyacak.
    if(getCookie("imdeks_lat") && getCookie("imdeks_lng")) return;

    function storeCoordsAndReload(pos){
        if(!pos || !pos.coords) return;
        setCookie("imdeks_lat", pos.coords.latitude.toFixed(6), 86400);
        setCookie("imdeks_lng", pos.coords.longitude.toFixed(6), 86400);
        window.location.replace(window.location.pathname + window.location.search);
    }

    if(navigator.permissions && navigator.permissions.query){
        navigator.permissions.query({name:"geolocation"}).then(function(result){
            if(result.state === "granted"){
                navigator.geolocation.getCurrentPosition(storeCoordsAndReload, function(){}, {
                    enableHighAccuracy:false,
                    timeout:2500,
                    maximumAge:600000
                });
            }
        }).catch(function(){});
    }else{
        try{
            navigator.geolocation.getCurrentPosition(storeCoordsAndReload, function(){}, {
                enableHighAccuracy:false,
                timeout:1800,
                maximumAge:600000
            });
        }catch(e){}
    }
});


/* ---- query targeted ads filter stable v47 ---- */
document.addEventListener("DOMContentLoaded", function(){
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

    var query = new URLSearchParams(window.location.search).get("q") || "";
    var q = normalizeImdeksAdText(query);
    var ads = document.querySelectorAll(".ad-item");

    if(!ads.length) return;

    var matchedCount = 0;

    ads.forEach(function(ad){
        var tagsRaw = ad.getAttribute("data-tags") || "";
        var isDefault = ad.getAttribute("data-default") === "1";

        ad.style.display = "none";

        if(isDefault) return;
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
            ad.style.display = "block";
            matchedCount++;
        }
    });

    if(matchedCount === 0){
        ads.forEach(function(ad){
            if(ad.getAttribute("data-default") === "1"){
                ad.style.display = "block";
            }
        });
    }
});

