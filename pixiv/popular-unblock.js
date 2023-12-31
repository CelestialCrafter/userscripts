// ==UserScript==
// @name         Unblock Shown Popular Works
// @namespace    https://github.com/CelestialCrafter
// @version      1.0.0
// @description  Unblocks the shown popular works on pixiv
// @author       CelestialEXE
// @match        https://www.pixiv.net/en/tags/**/artworks
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pixiv.net
// @grant        none
// ==/UserScript==

'use strict';

const style = document.createElement('style');
style.innerHTML = `.eGQovZ {
		width: 184px !important;
		height: 184px !important;
	}

	.hFdYHr {
		mask: unset !important;
		width: 100% !important;
	}

	.chUwBg {
		flex: 1 !important;
	}
`;

document.head.appendChild(style);

let be = null;
let be2 = null;
let be3 = null;

const debounce = (fn, timeout = 300) => {
	let timer;
	return (...args) => {
		if (!timer) fn.apply(this, args);
		clearTimeout(timer);
		timer = setTimeout(() => (timer = null), timeout);
	};
};

document.onmousemove = debounce(() => {
	be = document.querySelector('.HGFVR');
	be2 = document.querySelector('.itdJmJ');
	be3 = document.querySelector('.jfrPmG');

	be?.remove();
	be2?.remove();
	be3?.remove();
});
