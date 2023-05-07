// ==UserScript==
// @name         HumbleBundle Library Update
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Mark books that you have already purchased
// @author       You
// @match        https://www.humblebundle.com/home/library*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=humblebundle.com
// @grant        none
// ==/UserScript==

(function(send) {
    const title = updateTitle();
    title("⌛");

    function updateTitle() {
        const title = document.querySelector('.inner-main-wrapper h1').textContent;
        return (icon) => {
            document.querySelector('.inner-main-wrapper h1').textContent = `${title}: ${icon}`;
        };
    }
    function init() {
        const localStorageKey = "humblebundle:library";
        function getExistingSavedLibrary() {
            return JSON.parse(localStorage.getItem(localStorageKey));
        }

        function getPurchasedBooks() {
            const purchasedBooks = document.querySelectorAll(".download-list .subproducts-holder h2");
            return Array.from(purchasedBooks).map(x => x.innerText);
        }

        function storeToLocalStorage(books) {
            const existingLibrary = new Set(getExistingSavedLibrary());
            for (const [_, x] of Object.entries(books)){
                existingLibrary.add(x);
            }
            localStorage.setItem(localStorageKey, JSON.stringify(Array.from(existingLibrary)));
        }


        const purchasedBooks = getPurchasedBooks();
        storeToLocalStorage(purchasedBooks);

    }
    XMLHttpRequest.prototype.send = function (...data) {
        send.apply(this, ...data);
        setTimeout(()=>{
            init();
            console.info("Loaded in localStorage");
            title("💾");
        }, 1000);
    };
}(XMLHttpRequest.prototype.send));
