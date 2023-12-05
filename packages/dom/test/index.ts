import 'core-js';

switch (window.location.search.substr(1)) {
  case 'dom-attr':
    import('./modules/dom-attr');
    break;

  case 'dom-base':
    import('./modules/dom-base');
    break;

  case 'dom-class':
    import('./modules/dom-class');
    break;

  case 'dom-data':
    import('./modules/dom-data');
    break;

  case 'dom-event':
    import('./modules/dom-event');
    break;

  case 'dom-insertion':
    import('./modules/dom-insertion');
    break;

  case 'dom-offset':
    import('./modules/dom-offset');
    break;

  case 'dom-scroll':
    import('./modules/dom-scroll');
    break;

  case 'dom-size':
    import('./modules/dom-size');
    break;

  case 'dom-style':
    import('./modules/dom-style');
    break;

  case 'dom-traversal':
    import('./modules/dom-traversal');
    break;

  case 'selector':
    import('./modules/selector');
    break;
}

