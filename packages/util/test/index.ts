import 'core-js';

switch (window.location.search.substr(1)) {
  case 'array':
    import('./modules/array');
    break;

  case 'date':
    import('./modules/date');
    break;

  case 'object':
    import('./modules/object');
    break;

  case 'type':
    import('./modules/type');
    break;
}
