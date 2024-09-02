import {Root} from '../Components/Root/Root.js';
import {Components} from '../../Global/Frontend/Frontend.js';

Components.Component.init({
    styleSheets_descriptors: {
        dark: new URL('../Theme/Theme.css', import.meta.url),
    },
});
window.addEventListener('error', (event) => {
    alert(event.filename + ' ' + event.message + ' ' + event.lineno);
});
// import {Telegram} from '../Api/Units/Telegram/Telegram.js';
// import 'https://telegram.org/js/telegram-web-app.js';


// window.addEventListener('DOMContentLoaded', () => {
//     Telegram.app__init();
//     // window.Telegram.WebApp.expand();
//     // window.Telegram.WebApp.ready();
// });
