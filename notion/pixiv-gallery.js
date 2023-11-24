// ==UserScript==
// @name         Notion Pixiv Following Gallery
// @namespace    https://github.com/CelestialCrafter
// @version      1.0.0
// @description  Loads my Pixiv Following posts on Notion
// @author       CelestialEXE
// @match        **://www.notion.so/**
// @icon         https://www.notion.so/images/meta/default.png
// @grant        GM_xmlhttpRequest
// @grant        GM_log
// ==/UserScript==

/* eslint-disable no-param-reassign */
// eslint-disable-next-line strict, lines-around-directive
'use strict';

const serverURL = '[REDACTED]';
const galleryDataId = '00a18bb2-969d-404b-8978-8e55705c2707';
const button1DataId = 'd0e7b150-6c8f-4642-abf9-fb6e5061be94';
const button2DataId = 'fca6ea94-4850-4bc4-9864-2d0c2c26364f';
const r18CheckboxId = '76a46e9c-2772-4838-8abc-3da6bae06b90';
const hookTextId = '8d50ab8e-0268-42e5-9ef1-cb225682f5e7';
const authKeyId = '[REDACTED]';

document.head.innerHTML += `<style>
	[data-block-id="${galleryDataId}"] > div div:nth-child(even) {
		width: 24px !important;
	}

	[data-block-id="${galleryDataId}"] > div div:nth-child(odd) {
		height: min-content;
	}

	[data-block-id="${galleryDataId}"] .notion-column-block .notion-text-block {
		display: none;
	}
</style>`;

let page = 0;
let initialLoad = false;
let r18Checkbox = {};
let authKey = '';

const hookButtons = update => {
	r18Checkbox = document.querySelector(`[data-block-id="${r18CheckboxId}"] input[type="checkbox"]`);
	const button = document.querySelector(`[data-block-id="${button1DataId}"] [role="button"]`);
	const button2 = document.querySelector(`[data-block-id="${button2DataId}"] [role="button"]`);
	const hookText = document.querySelector(`[data-block-id="${hookTextId}"] .notranslate`);

	hookText.innerText = hookText.innerText.replace('Unhooked', 'Hooked');

	button.onclick = () => {
		Math.min(page++, 9);
		update(false);
	};
	button2.onclick = () => {
		Math.max(0, page--);
		update(false);
	};
};

const fetchURLs = () => new Promise(res => {
	// eslint-disable-next-line no-undef
	GM_xmlhttpRequest({
		method: 'GET',
		url: `${serverURL}/following?page=${page}${r18Checkbox?.checked ? '&r18=true' : ''}&authKey=${authKey}`,
		onload: response => res(JSON.parse(response.responseText))
	});
});

const updateImages = async (firstTime = true) => {
	let urls = [];

	let results;
	let getImageElements = null;
	let previousResults;

	if (firstTime) {
		getImageElements = () => document.querySelectorAll(`[data-block-id="${galleryDataId}"] .notion-image-block img`);
		results = getImageElements();
		let timer = null;

		if (results.length < 6) await new Promise(res => {
			timer = setInterval(() => {
				results = getImageElements();
				if (results[0]) authKey = document.querySelector(`[data-block-id="${authKeyId}"] .notranslate`).innerText;
				if (results.length >= 6) {
					clearInterval(timer);
					res();
				}
			}, 500);
		});

		results.forEach(element => {
			const node = element.cloneNode();
			node.classList.add('cloned');
			node.style.display = 'none';
			element.parentElement.appendChild(node);
			element.closest('.notion-column-block').parentElement.style.width = 'calc(100% / 6 - (24px * 5 / 6))';
		});

		previousResults = results;
	}

	urls = await fetchURLs();

	getImageElements = () => Array.from(document.querySelectorAll(`[data-block-id="${galleryDataId}"] .notion-image-block .cloned`));
	results = getImageElements();
	if (!firstTime) previousResults = results;
	let lastWorkingUrl = null;

	await Promise.all(results.map((element, i) => {
		if (urls[i]) lastWorkingUrl = urls[i];
		const url = `https://notionpixivgalleryserver.celestialcrafte.repl.co/imgproxy?url=${encodeURIComponent(lastWorkingUrl)}&authKey=${authKey}`;
		element.setAttribute('src', url);
		return new Promise(res => {
			element.onload = () => (element.complete ? res() : null);
			element.onerror = res;
		});
	}));

	if (!initialLoad) hookButtons(updateImages);
	initialLoad = true;

	previousResults.forEach(element => {
		element.style.display = 'none';
	});

	results.forEach(element => {
		element.style.display = 'block';
	});
};

updateImages();
