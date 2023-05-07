// ==UserScript==
// @name         HumbleBundle Library Check
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Checks if an item has been recently been purchased. Dependent on HumbleBundle Library Update
// @author       You
// @match        https://www.humblebundle.com/bundle/*
// @match        https://www.humblebundle.com/books/*
// @match        https://www.humblebundle.com/games/*
// @match        https://www.humblebundle.com/software/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=humblebundle.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    const localStorageKey = "humblebundle:library";
    const updateTitle = title();
    updateTitle("⌛");

    function getPurchasedFromLocalStorage() {
        return JSON.parse(localStorage.getItem(localStorageKey));
    }
    function title() {
        const title = document.querySelector('h1.heading-large').textContent;
        return (icon) => {
            document.querySelector('h1.heading-large').textContent = `${title}: ${icon}`;
        };
    }

    function init() {
        const purchasedItems = getPurchasedFromLocalStorage().map(i => i.toLowerCase());

        if (purchasedItems.length < 1) {
            updateTitle("🤷‍♂️");
            return null;
        }

        const currentItems = Array.from(document.querySelectorAll('.main-area span.item-title'));
        const itemsPurchased = [];
        for (const [_, item] of Object.entries(currentItems)) {
            if (purchasedItems.includes(item.innerText?.toLowerCase())) {
                item.innerText = `${item.innerText}: ✅`
                itemsPurchased.push(item);
            }
        }
        return itemsPurchased;
    }

    window.addEventListener('load', () => {
        const itemsPurchased = init();
        let notifyTable = itemsPurchased.reduce((acc, i) => `${acc}<tr><td>${i.innerText}</td></tr>`, '');
        notifyTable = `<table>${notifyTable}</table>`;
        updateTitle(`🛍️ ${itemsPurchased.length}`);
        document.querySelector('.bundle-title').insertAdjacentHTML('afterend', notifyTable);
    });
})();
