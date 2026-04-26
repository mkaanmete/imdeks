/* Imdeks search page assets - v71
   Extracted from working search.php. Uses window.imdeksSearchConfig for dynamic endpoints. */

(function () {
    var lightbox = document.getElementById('imdeksLightbox'), lbBody = document.getElementById('imdeksLightboxBody'), lbTitle = document.getElementById('imdeksLightboxTitle'), lbSource = document.getElementById('imdeksLightboxSource'), lbClose = document.getElementById('imdeksLightboxClose');
    var savedScrollY = 0;
    function lockScroll(){ savedScrollY = window.pageYOffset || document.documentElement.scrollTop || 0; document.body.style.position='fixed'; document.body.style.top='-' + savedScrollY + 'px'; document.body.style.left='0'; document.body.style.right='0'; document.body.style.width='100%'; }
    function unlockScroll(){ document.body.style.position=''; document.body.style.top=''; document.body.style.left=''; document.body.style.right=''; document.body.style.width=''; window.scrollTo(0, savedScrollY); }
    function openLightbox(trigger){ if(!lightbox) return; var type=trigger.getAttribute('data-lightbox-type'), itemTitle=trigger.getAttribute('data-title')||'', sourceUrl=trigger.getAttribute('data-source')||trigger.getAttribute('href')||'#'; lbBody.innerHTML=''; lbTitle.textContent=itemTitle; lbSource.setAttribute('href',sourceUrl); if(type==='image'){ var img=document.createElement('img'); img.src=trigger.getAttribute('data-full')||trigger.getAttribute('href'); img.alt=itemTitle; lbBody.appendChild(img); } else if(type==='video'){ var iframe=document.createElement('iframe'); var embed=trigger.getAttribute('data-embed')||trigger.getAttribute('href'); iframe.src=embed+(embed.indexOf('?')===-1?'?autoplay=1':'&autoplay=1'); iframe.setAttribute('allow','accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'); iframe.setAttribute('allowfullscreen','allowfullscreen'); lbBody.appendChild(iframe); } lockScroll(); lightbox.classList.add('is-open'); lightbox.setAttribute('aria-hidden','false'); }
    function closeLightbox(){ if(!lightbox || !lightbox.classList.contains('is-open')) return; lightbox.classList.remove('is-open'); lightbox.setAttribute('aria-hidden','true'); lbBody.innerHTML=''; unlockScroll(); }
    document.addEventListener('click', function(event){ var trigger=event.target.closest ? event.target.closest('.imdeks-lightbox-trigger') : null; if(trigger){ event.preventDefault(); openLightbox(trigger); return; } if(event.target===lightbox){ closeLightbox(); } }, true);
    if(lbClose) lbClose.addEventListener('click', function(e){ e.preventDefault(); closeLightbox(); });
    document.addEventListener('keydown', function(event){ if(event.key==='Escape') closeLightbox(); });

    // Footer linklerinin tema AJAX'i tarafindan yukariya ziplatilmasini engeller.
    document.addEventListener('click', function(event){ var a = event.target.closest ? event.target.closest('footer a, .footer a, #footer a') : null; if(!a) return; if(a.getAttribute('href') === '#'){ event.preventDefault(); event.stopImmediatePropagation(); return; } a.setAttribute('data-scrolltop','false'); }, true);

    // Aynı sorguda aşağı indikçe otomatik yeni sonuç yükleme.
    var loadBtn = document.getElementById('imdeksLoadMore'), results = document.getElementById('imdeksResults'), pagination = document.getElementById('imdeksPagination');
    var loading = false, autoLoads = 0;
    function appendFromUrl(url){ if(!url || loading || !results) return; loading=true; if(loadBtn){ loadBtn.disabled=true; loadBtn.textContent='Yükleniyor...'; } fetch(url, {headers:{'X-Requested-With':'fetch'}}).then(function(r){ return r.text(); }).then(function(html){ var doc=new DOMParser().parseFromString(html,'text/html'); var incoming=doc.querySelectorAll('#imdeksResults .imdeks-result-item'); incoming.forEach(function(item){ var container = results.querySelector('.serper-results, .serper-image-results, .serper-video-results') || results; container.appendChild(document.importNode(item, true)); }); var nextBtn=doc.querySelector('#imdeksLoadMore'); var nextUrl=nextBtn ? nextBtn.getAttribute('data-next-url') : ''; if(loadBtn) loadBtn.setAttribute('data-next-url', nextUrl || ''); var nextPagination=doc.querySelector('#imdeksPagination'); if(nextPagination && pagination) pagination.innerHTML=nextPagination.innerHTML; if(!incoming.length && loadBtn){ loadBtn.style.display='none'; } }).catch(function(){ if(loadBtn) loadBtn.textContent='Tekrar dene'; }).finally(function(){ loading=false; if(loadBtn){ loadBtn.disabled=false; loadBtn.textContent='Daha fazla sonuç yükle'; } }); }
    if(loadBtn){ loadBtn.addEventListener('click', function(e){ e.preventDefault(); appendFromUrl(loadBtn.getAttribute('data-next-url')); }); window.addEventListener('scroll', function(){ if(autoLoads >= 2 || loading || !loadBtn || !loadBtn.getAttribute('data-next-url')) return; if((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight - 900){ autoLoads++; appendFromUrl(loadBtn.getAttribute('data-next-url')); } }, {passive:true}); }

    // Arama kutusu otomatik öneri.
    var acBox = document.getElementById('imdeksAutocompleteBox');
    var input = document.querySelector('input[name="q"], input[type="search"], .search-input');
    var acTimer = null, acItems = [], acIndex = -1;
    function positionBox(){ if(!input || !acBox) return; var r=input.getBoundingClientRect(); acBox.style.left=(r.left+window.pageXOffset)+'px'; acBox.style.top=(r.bottom+window.pageYOffset+6)+'px'; acBox.style.width=r.width+'px'; }
    function renderSuggestions(items){ acItems=items||[]; acIndex=-1; if(!acBox || !acItems.length){ if(acBox) acBox.style.display='none'; return; } acBox.innerHTML=acItems.map(function(s,i){ return '<div class="imdeks-autocomplete-item" data-index="'+i+'">'+String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];})+'</div>'; }).join(''); positionBox(); acBox.style.display='block'; }
    if(input && acBox){ input.setAttribute('autocomplete','off'); input.addEventListener('input', function(){ clearTimeout(acTimer); var q=input.value.trim(); if(q.length<2){ acBox.style.display='none'; return; } acTimer=setTimeout(function(){ fetch((window.imdeksSearchConfig && window.imdeksSearchConfig.autocompleteUrl ? window.imdeksSearchConfig.autocompleteUrl : '/search?autocomplete=1') + '&q=' + encodeURIComponent(q), {headers:{'X-Requested-With':'fetch'}}).then(function(r){ return r.json(); }).then(function(data){ renderSuggestions(data.suggestions || []); }).catch(function(){ acBox.style.display='none'; }); }, 220); }); acBox.addEventListener('mousedown', function(e){ var item=e.target.closest('.imdeks-autocomplete-item'); if(!item) return; e.preventDefault(); input.value=acItems[parseInt(item.getAttribute('data-index'),10)] || input.value; var form=input.closest('form'); if(form) form.submit(); }); input.addEventListener('keydown', function(e){ if(acBox.style.display!=='block') return; if(e.key==='ArrowDown'){ e.preventDefault(); acIndex=Math.min(acItems.length-1, acIndex+1); } else if(e.key==='ArrowUp'){ e.preventDefault(); acIndex=Math.max(0, acIndex-1); } else if(e.key==='Enter' && acIndex>=0){ e.preventDefault(); input.value=acItems[acIndex]; var form=input.closest('form'); if(form) form.submit(); } else if(e.key==='Escape'){ acBox.style.display='none'; } Array.prototype.forEach.call(acBox.children,function(el,i){ el.classList.toggle('is-active', i===acIndex); }); }); window.addEventListener('resize', positionBox); window.addEventListener('scroll', positionBox, {passive:true}); document.addEventListener('click', function(e){ if(e.target!==input && !acBox.contains(e.target)) acBox.style.display='none'; }); }
    // Hesaplama tabı: yüzde, oran, KDV ve bilimsel hesap makinesi.
    function n(id){ var el=document.getElementById(id); return el ? parseFloat(String(el.value).replace(',', '.')) || 0 : 0; }
    function setText(id, value){ var el=document.getElementById(id); if(el) el.textContent = value; }
    function fmt(num){ if(!isFinite(num)) return '0'; return new Intl.NumberFormat('tr-TR', {maximumFractionDigits: 8}).format(num); }
    document.addEventListener('click', function(e){
        var btn = e.target.closest ? e.target.closest('[data-calc]') : null;
        if(!btn) return;
        var type = btn.getAttribute('data-calc');
        if(type === 'pct-of') setText('pctResult', fmt(n('pctBase') * n('pctRate') / 100));
        if(type === 'pct-add') setText('pctResult', fmt(n('pctBase') + (n('pctBase') * n('pctRate') / 100)));
        if(type === 'pct-sub') setText('pctResult', fmt(n('pctBase') - (n('pctBase') * n('pctRate') / 100)));
        if(type === 'ratio') setText('ratioResult', '%' + fmt(n('ratioB') === 0 ? 0 : (n('ratioA') / n('ratioB') * 100)));
        if(type === 'change') setText('ratioResult', '%' + fmt(n('ratioA') === 0 ? 0 : ((n('ratioB') - n('ratioA')) / n('ratioA') * 100)));
        var rateEl = document.getElementById('vatRate'), rate = rateEl ? (rateEl.value === 'custom' ? n('vatCustom') : parseFloat(rateEl.value)) : 20;
        if(type === 'vat-add') setText('vatResult', fmt(n('vatAmount') * (1 + rate / 100)));
        if(type === 'vat-extract') setText('vatResult', fmt(n('vatAmount') / (1 + rate / 100)));
    });
    var vatRateEl = document.getElementById('vatRate'), vatCustomWrap = document.getElementById('vatCustomWrap');
    if(vatRateEl && vatCustomWrap){ vatRateEl.addEventListener('change', function(){ vatCustomWrap.style.display = this.value === 'custom' ? 'block' : 'none'; }); }
    var sci = document.getElementById('sciDisplay');
    function safeCalc(expr){
        expr = String(expr || '').replace(/,/g,'.').replace(/÷/g,'/').replace(/×/g,'*').replace(/π/g,'pi');
        if(!/^[0-9+\-*/().,%\sA-Za-z]+$/.test(expr)) return 'Hata';
        expr = expr.replace(/%/g, '/100').replace(/\bpi\b/g, 'Math.PI').replace(/\bsqrt\(/g, 'Math.sqrt(').replace(/\bsin\(/g, 'Math.sin(').replace(/\bcos\(/g, 'Math.cos(').replace(/\btan\(/g, 'Math.tan(').replace(/\bpow\(/g, 'Math.pow(');
        try { return fmt(Function('"use strict";return (' + expr + ')')()); } catch(err) { return 'Hata'; }
    }
    document.querySelectorAll('.scientific-keys button').forEach(function(btn){ btn.addEventListener('click', function(){ if(!sci) return; var key=this.getAttribute('data-key'); if(key==='C') sci.value=''; else if(key==='=') sci.value=safeCalc(sci.value); else sci.value += key; sci.focus(); }); });
    if(sci){ sci.addEventListener('keydown', function(e){ if(e.key === 'Enter'){ e.preventDefault(); sci.value = safeCalc(sci.value); } }); }

    // Anasayfadan Hesaplama tabı ile gelen doğal dil veya matematik sorgusunu otomatik hesaplar.
    function imdeksCalcTokenToNumber(token){
        token = String(token || '').toLocaleLowerCase('tr-TR').replace(/[^a-zçğıöşü0-9.,-]/g, '');
        if(!token) return null;
        if(/^-?\d+(?:[.,]\d+)?$/.test(token)) return parseFloat(token.replace(',', '.'));
        var direct = {'sıfır':0,'sifir':0,'bir':1,'iki':2,'üç':3,'uc':3,'dört':4,'dort':4,'beş':5,'bes':5,'altı':6,'alti':6,'yedi':7,'sekiz':8,'dokuz':9,'on':10,'yirmi':20,'otuz':30,'kırk':40,'kirk':40,'elli':50,'altmış':60,'altmis':60,'yetmiş':70,'yetmis':70,'seksen':80,'doksan':90,'yüz':100,'yuz':100,'bin':1000};
        if(Object.prototype.hasOwnProperty.call(direct, token)) return direct[token];
        var stripped = token;
        ['yle','yla','ile','le','la','yi','yı','yu','yü','nin','nın','nun','nün','in','ın','un','ün','si','sı','su','sü','i','ı','u','ü'].some(function(suf){
            if(stripped.length > suf.length + 1 && stripped.slice(-suf.length) === suf){ stripped = stripped.slice(0, -suf.length); return true; }
            return false;
        });
        if(Object.prototype.hasOwnProperty.call(direct, stripped)) return direct[stripped];
        return null;
    }
    function imdeksExtractNaturalExpression(text){
        var raw = String(text || '').trim();
        if(!raw) return '';
        var t = raw.toLocaleLowerCase('tr-TR')
            .replace(/×/g,'*').replace(/÷/g,'/').replace(/−/g,'-')
            .replace(/kaç eder|kac eder|kaçtır|kactir|nedir|sonucu|sonuç|hesapla|eder mi/g,' ');
        var directExpr = t.match(/-?\d+(?:[.,]\d+)?\s*[+\-*\/]\s*-?\d+(?:[.,]\d+)?(?:\s*[+\-*\/]\s*-?\d+(?:[.,]\d+)?)*\s*/);
        if(directExpr) return directExpr[0].replace(/,/g,'.').trim();
        var words = t.split(/\s+/).filter(Boolean);
        var nums = [];
        words.forEach(function(w){ var val = imdeksCalcTokenToNumber(w); if(val !== null) nums.push(val); });
        var op = '';
        if(/artı|arti|topla|toplam|ekle|ilave/.test(t)) op = '+';
        else if(/eksi|çıkar|cikar|çıkart|cikart|azalt/.test(t)) op = '-';
        else if(/çarp|carp|kere|x/.test(t)) op = '*';
        else if(/böl|bol|bölü|bolu|paylaştır|paylastir/.test(t)) op = '/';
        var pct = t.match(/(?:yüzde|%)[^0-9a-zçğıöşü]*([0-9]+(?:[.,][0-9]+)?)/i);
        if(pct && nums.length >= 1) return '(' + nums[0] + '*' + parseFloat(pct[1].replace(',', '.')) + '/100)';
        if(op && nums.length >= 2) return nums.slice(0, 6).join(op);
        return '';
    }
    function imdeksAutoRunQueryCalc(){
        var params = new URLSearchParams(window.location.search || '');
        var q = params.get('q') || '';
        if(!q || !document.getElementById('calcQueryAnswer')) return;
        var expr = imdeksExtractNaturalExpression(q);
        if(!expr) return;
        var result = safeCalc(expr);
        if(result === 'Hata') return;
        var box = document.getElementById('calcQueryAnswer');
        setText('calcQueryExpression', q + '  →  ' + expr);
        setText('calcQueryResult', result);
        box.classList.add('is-visible');
        if(sci) sci.value = expr;
    }
    imdeksAutoRunQueryCalc();



    // Yerel işletme mini sayfa modalı
    var placeModal = document.getElementById('imdeksPlaceModal');
    var placeClose = document.getElementById('imdeksPlaceModalClose');
    function placeEsc(s){ return String(s || '').replace(/[&<>"]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
    function placeBtn(label, url, cls){
        if(!url) return '';
        return '<a class="place-btn '+cls+'" href="'+placeEsc(url)+'" target="_blank" rel="noopener noreferrer">'+label+'</a>';
    }
    document.querySelectorAll('.imdeks-place-detail-trigger').forEach(function(btn){
        btn.addEventListener('click', function(){
            if(!placeModal) return;
            var d = this.dataset || {};
            document.getElementById('imdeksPlaceModalTitle').innerHTML = placeEsc(d.title || 'İşletme');
            document.getElementById('imdeksPlaceModalCategory').innerHTML = placeEsc(d.category || '');
            document.getElementById('imdeksPlaceModalRating').innerHTML = d.rating ? ('★ ' + placeEsc(d.rating) + (d.ratingCount ? ' (' + placeEsc(d.ratingCount) + ')' : '')) : '';
            document.getElementById('imdeksPlaceModalAddress').innerHTML = d.address ? ('<strong>Adres:</strong> ' + placeEsc(d.address)) : '';
            document.getElementById('imdeksPlaceModalPhone').innerHTML = d.phone ? ('<strong>Telefon:</strong> ' + placeEsc(d.phone)) : '';
            document.getElementById('imdeksPlaceModalWebsite').innerHTML = d.website ? ('<strong>Web:</strong> ' + placeEsc(d.website)) : '';
            var imgWrap = document.getElementById('imdeksPlaceModalImageWrap');
            var imgEl = document.getElementById('imdeksPlaceModalImage');
            if(imgWrap && imgEl){
                if(d.image){
                    imgEl.src = d.image;
                    imgEl.alt = d.title || 'İşletme Profili';
                    imgWrap.style.display = 'block';
                } else {
                    imgEl.src = '';
                    imgWrap.style.display = 'none';
                }
            }
            document.getElementById('imdeksPlaceModalActions').innerHTML =
                placeBtn('📞 Ara', d.tel, 'call') +
                placeBtn('WhatsApp', d.whatsapp, 'whatsapp') +
                placeBtn('🧭 Yol Tarifi', d.map, 'map') +
                placeBtn('Randevu Al', d.appointment, 'appointment');
            placeModal.classList.add('is-open');
            placeModal.setAttribute('aria-hidden', 'false');
        });
    });
    if(placeClose){
        placeClose.addEventListener('click', function(){
            placeModal.classList.remove('is-open');
            placeModal.setAttribute('aria-hidden', 'true');
        });
    }
    if(placeModal){
        placeModal.addEventListener('click', function(e){
            if(e.target === placeModal){
                placeModal.classList.remove('is-open');
                placeModal.setAttribute('aria-hidden', 'true');
            }
        });
    }


})();
