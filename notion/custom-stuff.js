// ==UserScript==
// @name         Notion Custom
// @namespace    https://celestial.sh/
// @version      1.0.0
// @description  Custom CSS and misclenaious scripts for Notion
// @author       CelestialEXE
// @match        **://www.notion.so/**
// @icon         https://www.notion.so/images/meta/default.png
// @grant        none
// ==/UserScript==

/* eslint-disable no-param-reassign */
// eslint-disable-next-line strict, lines-around-directive
'use strict';

document.head.innerHTML += `<style>
	div[style*="width: calc(6.25% - 2.875px)"] {
		width: unset !important;
	}

	*::-webkit-scrollbar {
		display: none;
	}

	* {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}
</style>`;
