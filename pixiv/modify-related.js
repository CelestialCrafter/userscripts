// ==UserScript==
// @name         Pixiv Relative Sidebar
// @namespace    https://github.com/CelestialCrafter
// @version      1.0.0
// @description  Removes the Relative images row from the main section to sidebar to be less intrusive
// @author       CelestialEXE
// @match        https://www.pixiv.net/discovery
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pixiv.net
// @grant        none
// ==/UserScript==

'use strict';

const style = document.createElement('style');
style.innerHTML = `.kSViUo {
		padding: 1rem !important;
		border-right: 1px solid dimgray;
	}

	.dSVJt {
		position: fixed !important;
		z-index: 1 !important;
		top: 0 !important;
		padding-top: 0 !important;
		margin-top: 0 !important;
		background-color: var(--charcoal-surface1);
	}

	.hLhHDu {
		grid-auto-flow: row !important;
		gap: 2rem;
		height: 100vh;
		overflow-y: scroll;
		scrollbar-width: none;
	}

	.hkzusx {
		min-width: unset !important;
	}

	.wJpxo, .hYTIUt {
		width: min-content !important;
	}

	.dSVJt .JYkwH, .dSVJt .ioeugW, .dSVJt .FIoEP, .dSVJt:first-child, .kqssbN {
		display: none !important;
	}
`;

document.head.appendChild(style);
