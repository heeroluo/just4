import 'core-js';

switch (window.location.search.substr(1)) {
  case 'jsonp':
    import('./modules/jsonp');
    break;

  case 'script':
    import('./modules/script');
    break;
}
