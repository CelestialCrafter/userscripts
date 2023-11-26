// ==UserScript==
// @name         Pixiv Context Menu
// @namespace    https://github.com/CelestialCrafter
// @version      1.0.0
// @description  Adds a context menu for liking privately, and liking privately + r18 tagged
// @author       CelestialEXE
// @match        https://www.pixiv.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pixiv.net
// @grant        none
// ==/UserScript==

'use strict';

const searchParentsForClass = (desiredClass, startNode, depth = 10) => {
	if (startNode.classList.contains(desiredClass)) return startNode;
	if (depth < 1) return;

	const parentNode = startNode.parentElement;
	if (!parentNode) return;
	const searchResults = searchParentsForClass(desiredClass, parentNode, depth - 1);
	if (searchResults) return searchResults;
};

window.addEventListener('click', () => {
	const likeButtonSearch = searchParentsForClass('fgVkZi', event.target);
	console.log(likeButtonSearch);
});
