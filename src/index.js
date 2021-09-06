import 'bootstrap-vue/dist/bootstrap-vue.css';
import './assets/css/vendor/bootstrap.min.css';
import './assets/css/vendor/bootstrap.rtl.only.min.css';

let render = () => {
  import('./assets/css/sass/themes/piaf.light.bluenavy.scss').then(() =>
    require('./main')
  );
};

render();
