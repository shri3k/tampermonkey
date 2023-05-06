// ==UserScript==
// @name         YouTube Save Watch Later
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Save the videos in localStorage
// @author       You
// @match        https://www.youtube.com/playlist?list=WL
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// @grant        none
// ==/UserScript==

(function () {
  'use strict';
  const STORAGE_KEY = 'watch-later';

  function deleteVideos(contextMenus) {
    const alreadySavedVideos = JSON.parse(
      window.localStorage.getItem(STORAGE_KEY) || '{}'
    );
    const mappedVideosInCurrentPage = getMappedVideosInCurrentPage(true);

    Object.entries(mappedVideosInCurrentPage).forEach(([k, v], i) => {
      if (alreadySavedVideos[k]) {
        setTimeout(() => {
          v.dropdown.click();
          document
            .querySelectorAll(
              '.ytd-popup-container #items .ytd-menu-popup-renderer'
            )[2]
            .click();
        }, i * 1000);
      }
    });
  }

  function getVideoContentDOM() {
    return Array.from(
      document.querySelectorAll(
        '#contents.ytd-playlist-video-list-renderer .ytd-playlist-video-list-renderer'
      )
    );
  }

  function getMappedVideosInCurrentPage(addMenu = false) {
    const mappedVideos = getVideoContentDOM().reduce((acc, a) => {
      const link = a.querySelector('#content a#video-title');
      console.log('processing', link?.href);
      if (link) {
        const url = new URL(link.href);
        const vid = url.searchParams.get('v');
        acc[vid] = { url: link.href, title: link.title };
        if (addMenu) {
          const menu = a.querySelector('#menu button#button');
          acc[vid]['dropdown'] = menu;
        }
      }
      return acc;
    }, {});
    return mappedVideos;
  }

  function saveVideos() {
    const existingVideos = JSON.parse(
      window.localStorage.getItem(STORAGE_KEY) || '{}'
    );
    const mappedVideos = {
      ...existingVideos,
      ...getMappedVideosInCurrentPage(),
    };
    console.log('mappedVideos', mappedVideos);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(mappedVideos));
  }

  function addSaveButton() {
    document
      .querySelector('#owner-text a')
      .insertAdjacentHTML(
        'afterend',
        "<button id='save-watch-later'>💾</button>"
      );
    document
      .querySelector('#save-watch-later')
      .addEventListener('click', saveVideos);
  }

  function addDeleteButton() {
    document
      .querySelector('#owner-text a')
      .insertAdjacentHTML(
        'afterend',
        "<button id='delete-watch-later'>❌</button>"
      );
    document
      .querySelector('#delete-watch-later')
      .addEventListener('click', deleteVideos);
  }

  function insertButtons() {
    addSaveButton();
    addDeleteButton();
  }
  waitForKeyElements('#owner-text a', insertButtons);
})();
