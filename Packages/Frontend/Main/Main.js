import {Root} from '../Components/Root/Root.js';
import {Components} from '../../Global/Frontend/Frontend.js';
// import {Units} from '../../Global/Frontend/Frontend.js';


alert(import.meta.url)
Components.Component.init({
    styleSheets_descriptors: {
        dark: new URL('../Theme/Theme.css', import.meta.url),
    },
});
window.addEventListener('DOMContentLoaded', () => {
    Units.Telegram.app__init();
//     // window.Telegram.WebApp.expand();
//     // window.Telegram.WebApp.ready();
});
