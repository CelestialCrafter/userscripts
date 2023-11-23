// ==UserScript==
// @name         Notion Font Override
// @namespace    https://celestial.sh/
// @version      1.0.0
// @description  Overrides Notions font
// @author       CelestialEXE
// @match        **://www.notion.so/**
// @icon         https://www.notion.so/images/meta/default.png
// @grant        none
// ==/UserScript==

// eslint-disable-next-line strict, lines-around-directive
'use strict';

const fontSearchString = 'Lyon-Text, Georgia, ui-serif, serif';
const fontReplaceString = "'CozetteVector', Lyon-Text, Georgia, ui-serif, serif";
const importUrl = '';

const searchFontFamily = () => {
	const elementsWithMatchingFontFamily = [];

	const traverseDOM = element => {
		if (element.style?.fontFamily === fontSearchString) elementsWithMatchingFontFamily.push(element);

		const children = Array.from(element.childNodes);
		children.forEach(traverseDOM);
	};

	traverseDOM(document.body);

	return elementsWithMatchingFontFamily;
};

let timer = null;

const documentChanged = async () => {
	const matchingElements = () => searchFontFamily();
	let results = matchingElements();

	if (!results[0]) await new Promise(res => {
		timer = setInterval(() => {
			results = matchingElements();
			if (results[0]) {
				clearInterval(timer);
				res();
			}
		}, 500);
	});

	// eslint-disable-next-line no-param-reassign
	const runChange = () => results.forEach(element => { element.style.fontFamily = fontReplaceString; });

	setInterval(() => {
		results = matchingElements();
		if (results[0]) runChange();
	}, 1000);
};

document.head.innerHTML += `<link rel="stylesheet" src="${importUrl}">`;
documentChanged();
