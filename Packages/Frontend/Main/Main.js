import {Root} from '../Components/Root/Root.js';
import {Components} from '../../Global/Frontend/Frontend.js';
import {Units} from '../../Global/Frontend/Frontend.js';

Components.Component.init({
    styleSheets_descriptors: {
        dark: new URL('../Theme/Theme.css', import.meta.url),
    },
});

// window.addEventListener('error', (event) => {
//     alert(event.filename + ' ' + event.message + ' ' + event.lineno);
// });

window.addEventListener('DOMContentLoaded', () => {
    Units.Telegram.app__init();
});
