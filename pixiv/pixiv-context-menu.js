// ==UserScript==
// @name         Pixiv Context Menu
// @namespace    https://github.com/CelestialCrafter
// @version      1.0.0
// @description  Adds a context menu for liking privately, and liking privately + r18 tagged
// @author       CelestialEXE
// @match        https://www.pixiv.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pixiv.net
// @grant        GM_xmlhttpRequest
// ==/UserScript==

'use strict';

const style = document.createElement('style');
style.innerHTML = `.context-menu {
		position: absolute;
		background-color: var(--charcoal-background1);
		border-radius: 5px;
		display: flex;
		flex-direction: column;
		z-index: 20;
	}

	.context-menu button {
		border-radius: 4px;
		background-color: var(--charcoal-r18);
		height: 40px;
		padding: auto 24px;
		border: none;
		margin: 4px;
	}

	.bXjFLc {
		color: rgb(255, 70, 101);
		fill: currentcolor;
	}

	.hNaghI {
		fill: rgb(226, 223, 219);
	}

	.ceCKbw {
		fill: rgba(232, 230, 227, 0.88);
	}
`;

document.head.appendChild(style);

const searchParentsForClass = (desiredClass, startNode, depth = 10) => {
	if (startNode.classList.contains(desiredClass)) return startNode;
	if (depth < 1) return;

	const parentNode = startNode.parentElement;
	if (!parentNode) return;
	const searchResults = searchParentsForClass(desiredClass, parentNode, depth - 1);
	if (searchResults) return searchResults;
};

const contextMenu = document.createElement('section');
contextMenu.classList.add('context-menu');

const destroyAllContextMenus = () =>
	Array.from(document.getElementsByClassName('context-menu')).forEach(el => el.remove());

window.addEventListener('contextmenu', event => {
	destroyAllContextMenus();

	const post = searchParentsForClass('iUsZyY', event.target);
	const id =
		post?.dataset.gtmValue ||
		document.querySelector('link[rel="canonical"]')?.attributes.href.value.split('artworks/')[1];

	if (event.altKey || event.ctrlKey) event.preventDefault();
	else return;
	if (!id) return;

	const clone = contextMenu.cloneNode(true);
	clone.style.left = `${event.pageX}px`;
	clone.style.top = `${event.pageY}px`;
	if (event.ctrlKey) {
		const imgUrl =
			'https://i.pximg.net/img-master/' +
			post
				.querySelector('img')
				.src.match(/img\/\d{4}.+jpg/)[0]
				.replace('square', 'master');
		clone.innerHTML = `
        <object data="${imgUrl
					.replace('master', 'original')
					.replace('_custom1200', '')}" type="image/png" style="width: 20vw;">
	    	<img src="${imgUrl}" style="width: 20vw; border: 1px solid red;"/>
        </object>
	    `;
	} else {
		clone.innerHTML = `
		    <button onClick="likePrivate(${id}, false)">Like Private</button>
		    <button onClick="likePrivate(${id}, true)">Like Private R18</button>
	    `;
	}
	document.body.appendChild(clone);
});

window.addEventListener('click', destroyAllContextMenus);

unsafeWindow.likePrivate = async (id, r18) => {
	const response = await (
		await fetch('https://www.pixiv.net/ajax/illusts/bookmarks/add', {
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
				'x-csrf-token': '8296a51253f3084ce28c74294e1c9a5c'
			},
			body: JSON.stringify({
				illust_id: id.toString(),
				restrict: 1,
				comment: '',
				tags: [...(r18 ? ['R-18'] : [])]
			}),
			method: 'POST'
		})
	).json();

	const handleLikeButton = imageElement => {
		let likeButton = imageElement.parentElement.querySelector('.fgVkZi');
		const likeButtonClone = likeButton.cloneNode(true);
		likeButton.parentElement.replaceChild(likeButtonClone, likeButton);

		// re-query just to be safe
		likeButton = imageElement.parentElement.querySelector('.fgVkZi');
		likeButton.addEventListener('click', () => {
			likeButton.remove();
			fetch('https://www.pixiv.net/ajax/illusts/bookmarks/delete', {
				credentials: 'include',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					'x-csrf-token': '8296a51253f3084ce28c74294e1c9a5c'
				},
				body: `bookmark_id=${response.body.last_bookmark_id}`,
				method: 'POST'
			});
		});
	};

	const handleSVG = imageElement => {
		const svg = imageElement.parentElement.querySelector('.fYcrPo');
		if (!svg) return;

		svg.classList.remove('fYcrPo');
		svg.classList.add('bXjFLc');
		svg.innerHTML += `<path d="M29.9796 20.5234C31.1865 21.2121 32 22.511 32 24V28
C32 30.2091 30.2091 32 28 32H21C18.7909 32 17 30.2091 17 28V24C17 22.511 17.8135 21.2121 19.0204 20.5234
C19.2619 17.709 21.623 15.5 24.5 15.5C27.377 15.5 29.7381 17.709 29.9796 20.5234Z" class="sc-j89e3c-2 hNaghI"></path>
<path d="M28 22C29.1046 22 30 22.8954 30 24V28C30 29.1046 29.1046 30 28 30H21
C19.8954 30 19 29.1046 19 28V24C19 22.8954 19.8954 22 21 22V21C21 19.067 22.567 17.5 24.5 17.5
C26.433 17.5 28 19.067 28 21V22ZM23 21C23 20.1716 23.6716 19.5 24.5 19.5C25.3284 19.5 26 20.1716 26 21V22H23
V21Z" class="sc-j89e3c-3 ceCKbw"></path>`;
	};

	Array.from(document.querySelectorAll(`a.iUsZyY[data-gtm-value="${id}"]`)).forEach(
		imageElement => {
			handleLikeButton(imageElement);
			handleSVG(imageElement);
		}
	);
};
