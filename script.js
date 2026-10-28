(function(){
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var btn=document.querySelector('.menu-btn'), menu=document.getElementById('menu');
  function set(o){btn.setAttribute('aria-expanded',String(o));btn.setAttribute('aria-label',o?'Close menu':'Open menu');menu.classList.toggle('open',o);}
  btn.addEventListener('click',function(){set(btn.getAttribute('aria-expanded')!=='true');});
  menu.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){set(false);});});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')set(false);});

  // In-page links open the matching panel (and any panel around it).
  function openTo(id){var el=document.getElementById(id);if(!el)return;var p=el;while(p){if(p.tagName==='DETAILS')p.open=true;p=p.parentElement;}
    setTimeout(function(){el.scrollIntoView({behavior:reduce?'auto':'smooth',block:'start'});},30);}
  function fromHash(){var h=decodeURIComponent(location.hash.slice(1));if(h)openTo(h);}
  window.addEventListener('hashchange',fromHash);fromHash();
  document.addEventListener('click',function(e){var a=e.target.closest('a[href^="#"]');if(a&&a.getAttribute('href')===location.hash){openTo(location.hash.slice(1));}});

  // Forms. A static page can't send mail itself, so each form opens the visitor's email app
  // with every field filled in, addressed to the inbox in data-to. Swap in a form service later if wanted.
  document.querySelectorAll('form[data-to]').forEach(function(form){
    form.addEventListener('submit',function(ev){
      ev.preventDefault();
      if(!form.reportValidity())return;
      var lines=[], name='';
      Array.prototype.forEach.call(form.elements,function(el){
        if(!el.name)return;
        var v=el.type==='checkbox'?(el.checked?'Yes':'No'):el.value.trim();
        if(el.name==='Name')name=v;
        if(v)lines.push(el.name+': '+v);
      });
      var subj=form.getAttribute('data-subject')+(name?' from '+name:'');
      window.location.href='mailto:'+form.getAttribute('data-to')+'?subject='+encodeURIComponent(subj)+'&body='+encodeURIComponent(lines.join('\n'));
      form.querySelector('.form-note').textContent='Opening your email app to send this to '+form.getAttribute('data-to')+'.';
    });
  });

  if(!reduce && 'IntersectionObserver' in window){
    var els=document.querySelectorAll('.hero-head, .collage, .sec-head, .band-head, .fc, .mc, .oc, .story-grid > *, .proof h2, .loc');
    document.documentElement.classList.add('js-reveal');
    var io=new IntersectionObserver(function(en){en.forEach(function(x){if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target);}});},{rootMargin:'0px 0px -8% 0px',threshold:0.05});
    els.forEach(function(el,i){el.classList.add('reveal');el.style.transitionDelay=((i%3)*80)+'ms';io.observe(el);});
  }
})();
