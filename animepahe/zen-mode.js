// ==UserScript==
// @name         Animepahe Zen Mode
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://animepahe.ru/play/**
// @icon         https://www.google.com/s2/favicons?sz=64&domain=animepahe.ru
// @grant        none
// ==/UserScript==

'use strict';

document.addEventListener('keydown', event => {
	if (event.key === '.')
		document.head.innerHTML += `
			<style class="zenmode">
			.main-header, .theatre-settings, .theatre-info, .open-info-popup {
				display: none !important;
			}

			.theatre {
				margin: 0 !important;
				height: 100vh !important;
			}

			.content-wrapper {
				padding-bottom: 0 !important;
			}

			.player {
				max-width: unset !important;
			}

			.player iframe {
				eight: 100vh !important;
			}
			</style>
		`;
	else if (event.key === ',')
		Array.from(document.getElementsByClassName('zenmode')).forEach(el => el.remove());
});
