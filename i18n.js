/* =========================================================================
   Language switching — English / Spanish
   =========================================================================

   English is not stored here. It is read out of the markup on first load,
   so the page you see in the HTML is always the English source of truth and
   the two can never drift apart. Only the Spanish strings live in this file.

   Markup contract:
     data-i18n="key"       replaces textContent
     data-i18n-html="key"  replaces innerHTML (use when the string has markup)
     data-i18n-aria="key"  replaces the aria-label attribute

   The choice is remembered in localStorage and re-applied on the next visit.
   Spanish here is written for Venezuela and the wider region — "procura",
   "cabillas" — not for Spain.
   ------------------------------------------------------------------------ */
(function () {
  'use strict';

  var STORE_KEY = 'vesper-lang';
  var SUPPORTED = ['en', 'es'];

  var ES = {
    /* ---- document head ------------------------------------------------ */
    'meta.title': 'Vesper Supply — Procura y suministro de equipos industriales',
    'meta.description': 'Procura y suministro con sede en Texas. Vesper Supply suministra instrumentación, tubería de perforación, válvulas, actuadores, cable y otros equipos industriales críticos para operadores energéticos e industriales, con especial énfasis en los principales fabricantes estadounidenses y en atender a Venezuela y la región.',
    'meta.ogTitle': 'Vesper Supply — Procura y suministro de equipos industriales',
    'meta.ogDescription': 'Conectando la manufactura estadounidense con los mercados energéticos de las Américas.',

    /* ---- header / nav -------------------------------------------------- */
    'a11y.skip': 'Ir al contenido',
    'nav.primary': 'Principal',
    'nav.about': 'Nosotros',
    'nav.solutions': 'Soluciones',
    'nav.mission': 'Misión y Visión',
    'nav.contact': 'Contacto',
    'nav.cta': 'Solicitar cotización',
    'nav.toggle': 'Abrir menú',
    'lang.group': 'Idioma',
    'lang.en': 'Ver en inglés',
    'lang.es': 'Ver en español',

    /* ---- hero ---------------------------------------------------------- */
    'hero.eyebrow': 'Houston, Texas &nbsp;→&nbsp; Mercados internacionales',
    'hero.title': 'Equipos industriales<br>\n        <strong>Entregados con confianza</strong>',
    'hero.lede': 'Vesper Supply es un socio de procura industrial con sede en Texas que atiende a operadores energéticos e industriales. Suministramos equipos críticos de fabricantes confiables y gestionamos la documentación, exportación, logística y entrega desde el proveedor hasta el sitio.',
    'hero.solutions': 'Ver soluciones',
    'hero.spec1v': 'Houston, TX',
    'hero.spec1l': 'Sede principal',
    'hero.spec2v': 'OEM de EE. UU.',
    'hero.spec2l': 'Base principal de suministro',
    'hero.spec3v': 'Venezuela',
    'hero.spec3l': 'Mercado principal',
    'hero.globe': 'Globo terráqueo centrado en el Golfo de México y el Caribe, mostrando la ruta de suministro desde Houston, Texas hasta la costa norte de Venezuela.',

    /* ---- about --------------------------------------------------------- */
    'about.eyebrow': 'Nosotros',
    'about.title': 'Donde la industria se encuentra con la ejecución.',
    'about.lede': 'Vesper Supply es una empresa estadounidense de procura y suministro industrial con sede en Houston, Texas. Atendemos a operadores energéticos e industriales brindando acceso confiable a equipos críticos de fabricantes de confianza.',
    'about.p1': 'Nuestras capacidades abarcan una amplia gama de equipos para campos petroleros, eléctricos, de instrumentación, automatización, control de flujo y otros equipos industriales críticos. Desde la búsqueda y coordinación de proveedores hasta la documentación, exportación, logística y entrega final, Vesper gestiona el proceso desde el origen hasta el sitio con confiabilidad, transparencia y responsabilidad.',
    'about.p2': 'Con capacidad operativa en campo en Venezuela, Vesper combina una sólida red de suministro en Estados Unidos con capacidades de procura global, logística transfronteriza y ejecución local para respaldar proyectos energéticos e industriales en toda la región.',
    'about.slider': 'Operaciones de Vesper Supply',
    'about.serve': 'A quiénes atendemos',
    'ind.region': 'Industrias que atendemos',
    'ind.prev': 'Ver industrias anteriores',
    'ind.next': 'Ver más industrias',
    'ind.1t': 'Producción upstream y operaciones de pozo',
    'ind.1b': 'Equipos para perforación, producción, intervención de pozos, levantamiento artificial, operaciones de cabezal de pozo, control de presión, instrumentación y automatización de campo.',
    'ind.2t': 'Procesamiento, refinación y petroquímica',
    'ind.2b': 'Control de flujo, instrumentación, automatización, equipos eléctricos y críticos para plantas de procesamiento, mejoramiento de crudo, refinación y operaciones petroquímicas.',
    'ind.3t': 'Oleoductos, almacenamiento e infraestructura de campo',
    'ind.3b': 'Válvulas, equipos de tubería, instrumentación, sistemas eléctricos, cableado y equipos de control para transporte, almacenamiento e infraestructura de campo.',
    'ind.4t': 'Generación eléctrica e instalaciones industriales',
    'ind.4b': 'Equipos eléctricos, de instrumentación, automatización, control e industriales para generación eléctrica y otras operaciones industriales críticas.',

    /* ---- solutions ----------------------------------------------------- */
    'sol.eyebrow': 'Soluciones',
    'sol.title': 'Equipos industriales que suministramos.',
    'sol.lede': 'Algunos de los materiales que Vesper Supply suministra para operaciones energéticas e industriales, con especial énfasis en los principales fabricantes estadounidenses:',
    'kit.1': 'Tubería de perforación',
    'kit.2': 'Enrolladores',
    'kit.3': 'Preventores de reventones (BOP)',
    'kit.4': 'Actuadores',
    'kit.5': 'Salas de control',
    'kit.6': 'Manómetros de control de presión',
    'kit.7': 'Alambre y cable',
    'kit.8': 'Instrumentación',
    'kit.9': 'Uniones tipo martillo',
    'kit.10': 'Válvulas reguladoras (choke)',
    'kit.11': 'Válvulas de árbol de navidad',
    'kit.12': 'Cabillas de bombeo',

    /* ---- mission & vision ---------------------------------------------- */
    'mis.eyebrow': 'Misión y visión',
    'mis.title': 'Lo que vinimos a hacer — y hacia dónde vamos.',
    'mis.lede': 'Una empresa, una ruta y un estándar que mantenemos en ambos extremos.',
    'mis.mTag': 'Misión',
    'mis.mManifesto': 'Brindar a los operadores energéticos acceso confiable a equipos industriales críticos mediante suministro de confianza, ejecución disciplinada y entrega puntual.',
    'mis.mBody': 'Con especial énfasis en Venezuela y la región, Vesper reúne fabricantes consolidados, procura disciplinada y entrega transfronteriza confiable para ayudar a los operadores energéticos a avanzar en sus proyectos críticos con confianza.',
    'mis.vTag': 'Visión',
    'mis.vManifesto': 'Conectando a los principales fabricantes con los mercados energéticos de las Américas.',
    'mis.vBody': 'Ser un socio internacional de procura de confianza que conecte a los principales fabricantes con operaciones energéticas e industriales críticas en Venezuela, América Latina y más allá. Reconocidos por la confiabilidad, la transparencia y la ejecución disciplinada en cada etapa de la cadena de suministro.',
    'mis.practice': 'Lo que eso significa en la práctica',
    'pr.1tag': 'Confiables',
    'pr.1title': 'Tiempos de entrega reales. Comunicación clara.',
    'pr.1text': 'Cotizamos con base en plazos verificados de los proveedores y comunicamos con claridad durante todo el ciclo del pedido.',
    'pr.2tag': 'Trazables',
    'pr.2title': 'Calidad que usted puede verificar.',
    'pr.2text': 'Suministramos a través de fabricantes confiables y canales establecidos, respaldados por la documentación, certificaciones y trazabilidad que exigen los equipos industriales críticos.',
    'pr.3tag': 'Responsables',
    'pr.3title': 'Un solo equipo desde el origen hasta la entrega.',
    'pr.3text': 'Vesper coordina la procura, la comunicación con proveedores, la documentación, exportación, logística y entrega, ofreciendo un único socio responsable durante todo el proceso.',
    'val.label': 'Valores de marca',
    'val.1': 'Confiables',
    'val.2': 'Trazables',
    'val.3': 'Responsables',
    'val.4': 'Receptivos',
    'val.5': 'Conectados',

    /* ---- integrity ----------------------------------------------------- */
    'int.eyebrow': 'Integridad y cumplimiento',
    'int.body': 'Vesper Supply se compromete a realizar sus negocios con integridad, transparencia y responsabilidad. Operamos conforme a las leyes y regulaciones aplicables a nuestras actividades. Esperamos los mismos altos estándares de los proveedores, socios y representantes con quienes trabajamos.',

    /* ---- contact ------------------------------------------------------- */
    'con.eyebrow': 'Contacto',
    'con.title': '¿Tiene una especificación o lista de materiales? Cotícela con nosotros.',
    'con.lede': 'Envíe la especificación, ficha técnica o lista de partidas. Le respondemos con opciones de suministro, tiempos reales de fábrica y costo puesto en destino.',
    'con.email': 'Correo',
    'con.phone': 'Teléfono',
    'con.office': 'Oficina',
    'con.hours': 'Horario',
    'con.hoursValue': 'Lun–Vie, 8:00–17:00 CT',

    /* ---- RFQ form ------------------------------------------------------ */
    'form.title': 'Solicitar cotización',
    'form.name': 'Nombre completo',
    'form.nameErr': 'Ingrese su nombre.',
    'form.company': 'Empresa',
    'form.companyErr': 'Ingrese el nombre de su empresa.',
    'form.email': 'Correo corporativo',
    'form.emailHint': 'Le respondemos a esta dirección con precios y tiempos de entrega.',
    'form.emailErr': 'Ingrese un correo electrónico válido.',
    'form.category': 'Categoría',
    'form.other': 'Otro',
    'form.details': '¿Qué necesita?',
    'form.detailsHint': 'Números de tag, modelos, cantidades o una breve descripción.',
    'form.detailsErr': 'Indíquenos qué necesita cotizar.',
    'form.submit': 'Enviar solicitud',
    'form.statusInvalid': 'Revise los campos resaltados.',
    'form.statusSending': 'Enviando…',
    'form.statusOk': 'Gracias — recibimos su solicitud y le responderemos en breve.',
    'form.statusFail': 'No pudimos enviar la solicitud. Intente de nuevo o escríbanos directamente.',

    /* ---- footer -------------------------------------------------------- */
    'foot.blurb': 'Procura y suministro con sede en Texas, conectando a los principales fabricantes con operaciones energéticas e industriales en las Américas.',
    'foot.site': 'Sitio',
    'foot.contact': 'Contacto',
    'foot.rights': 'Todos los derechos reservados.',
    'foot.tagline': 'Donde la industria se encuentra con la ejecución'
  };

  /* Captured from the markup on first run — the English side of the pair. */
  var EN = {};
  var captured = false;

  function nodes(attr) {
    return Array.prototype.slice.call(document.querySelectorAll('[' + attr + ']'));
  }

  function captureEnglish() {
    nodes('data-i18n').forEach(function (el) {
      EN[el.getAttribute('data-i18n')] = el.textContent;
    });
    nodes('data-i18n-html').forEach(function (el) {
      EN[el.getAttribute('data-i18n-html')] = el.innerHTML;
    });
    nodes('data-i18n-aria').forEach(function (el) {
      EN[el.getAttribute('data-i18n-aria')] = el.getAttribute('aria-label') || '';
    });

    EN['meta.title'] = document.title;
    var d = document.querySelector('meta[name="description"]');
    var ot = document.querySelector('meta[property="og:title"]');
    var od = document.querySelector('meta[property="og:description"]');
    if (d) EN['meta.description'] = d.getAttribute('content');
    if (ot) EN['meta.ogTitle'] = ot.getAttribute('content');
    if (od) EN['meta.ogDescription'] = od.getAttribute('content');

    captured = true;
  }

  function apply(lang) {
    if (!captured) captureEnglish();
    var dict = lang === 'es' ? ES : EN;
    var fallback = EN;

    function pick(key) {
      return Object.prototype.hasOwnProperty.call(dict, key) ? dict[key] : fallback[key];
    }

    nodes('data-i18n').forEach(function (el) {
      var v = pick(el.getAttribute('data-i18n'));
      if (v != null) el.textContent = v;
    });
    nodes('data-i18n-html').forEach(function (el) {
      var v = pick(el.getAttribute('data-i18n-html'));
      if (v != null) el.innerHTML = v;
    });
    nodes('data-i18n-aria').forEach(function (el) {
      var v = pick(el.getAttribute('data-i18n-aria'));
      if (v != null) el.setAttribute('aria-label', v);
    });

    document.title = pick('meta.title') || document.title;
    var d = document.querySelector('meta[name="description"]');
    var ot = document.querySelector('meta[property="og:title"]');
    var od = document.querySelector('meta[property="og:description"]');
    if (d && pick('meta.description')) d.setAttribute('content', pick('meta.description'));
    if (ot && pick('meta.ogTitle')) ot.setAttribute('content', pick('meta.ogTitle'));
    if (od && pick('meta.ogDescription')) od.setAttribute('content', pick('meta.ogDescription'));

    document.documentElement.setAttribute('lang', lang);

    Array.prototype.forEach.call(document.querySelectorAll('[data-lang-btn]'), function (btn) {
      var on = btn.getAttribute('data-lang-btn') === lang;
      btn.classList.toggle('is-current', on);
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    });

    try { localStorage.setItem(STORE_KEY, lang); } catch (e) {}

    document.dispatchEvent(new CustomEvent('vesper:langchange', { detail: { lang: lang } }));
  }

  function stored() {
    var v;
    try { v = localStorage.getItem(STORE_KEY); } catch (e) {}
    if (SUPPORTED.indexOf(v) !== -1) return v;
    // No stored choice: follow the browser, but only for Spanish speakers.
    var nav = (navigator.language || 'en').toLowerCase();
    return nav.indexOf('es') === 0 ? 'es' : 'en';
  }

  /* Exposed so main.js can translate the strings it generates itself. */
  window.VesperI18n = {
    current: function () { return document.documentElement.getAttribute('lang') || 'en'; },
    t: function (key) {
      if (!captured) captureEnglish();
      var dict = this.current() === 'es' ? ES : EN;
      return Object.prototype.hasOwnProperty.call(dict, key) ? dict[key] : EN[key];
    },
    set: apply
  };

  function init() {
    captureEnglish();
    apply(stored());

    document.addEventListener('click', function (e) {
      var btn = e.target.closest ? e.target.closest('[data-lang-btn]') : null;
      if (!btn) return;
      e.preventDefault();
      apply(btn.getAttribute('data-lang-btn'));
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
