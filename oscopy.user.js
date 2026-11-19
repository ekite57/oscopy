// ==UserScript==
// @name         oscopy
// @namespace    me.ekite57.oscopy
// @version      1.0.0
// @description  a way to quickly share osu! beatmap links
// @author       ekite57
// @match        *://osu.ppy.sh/*
// @icon         https://osu.ppy.sh/favicon.ico
// @grant        window.onurlchange
// @run-at       document-idle
// ==/UserScript==

(
    function () {
        'use strict';

        const copyDiffTooltip = 'copy diff link (shift to include metadata)';
        const copySetTooltip = 'copy map link (shift to include metadata)';
        const buttonClassPrefix = 'btn-osu-big--beatmapset-header-square-';

        function injectButtons() {
            const eFavButton = document.getElementsByClassName('beatmapset-header__buttons')[0].firstElementChild;

            let buttonTemplate = eFavButton.cloneNode(true);
            buttonTemplate.querySelector('.far.fa-heart')?.setAttribute('class', 'fas fa-link');

            let copyDiffButton = buttonTemplate.cloneNode(true);
            copyDiffButton.classList.replace(`${buttonClassPrefix}favourite`, `${buttonClassPrefix}copydiff`);
            copyDiffButton.setAttribute('title', copyDiffTooltip);
            
            let copySetButton = buttonTemplate.cloneNode(true);
            copySetButton.classList.replace(`${buttonClassPrefix}favourite`, `${buttonClassPrefix}copyset`);
            copySetButton.setAttribute('title', copySetTooltip);

            if (!document.querySelector(`.${buttonClassPrefix}copydiff`)) {
                eFavButton.after(copyDiffButton);
            }

            if (!document.querySelector(`.${buttonClassPrefix}copyset`)) {
                eFavButton.after(copySetButton);
            }
        }

        function getSetId(link) {
            return link.replace(/^https?:\/\/osu\.ppy\.sh\/beatmapsets\//, "").replace(/#(osu|taiko|catch|mania)\/\d+/, "");
        }

        function getDiffId(link) {
            return link.replace(/^https?:\/\/osu\.ppy\.sh\/beatmapsets\//, "").replace(/\d+#(osu|taiko|catch|mania)\//, "");
        }

        function getTextContent(element) {
            // holy janky
            return Array.from(element.childNodes).filter(n => n.nodeType === Node.TEXT_NODE && n.textContent.trim())[0].textContent;
        }

        function getMetadata() {
            return {
                // doing URL here to avoid desync between metadata and URL
                url: window.location.href,
                title: document.querySelector('.beatmapset-header__details-text--title .beatmapset-header__details-text-link').innerText.trim(),
                artist: document.querySelector('.beatmapset-header__details-text--artist .beatmapset-header__details-text-link').innerText.trim(),
                mapper: document.querySelector('.beatmapset-mapping__user').innerText.trim(),
                diffName: getTextContent(document.querySelector('.beatmapset-header__diff-name'))
            };
        }

        var observer = new MutationObserver(() => {
            if (!window.location.href.includes("beatmapsets")) {
                observer.disconnect();
                return;
            }

            if (document.querySelector('.beatmapset-header__buttons')) {
                observer.disconnect();
                injectButtons();
                document.querySelector(`.${buttonClassPrefix}copyset`).addEventListener("click", (e) => {
                    let m = getMetadata();
                    if (e.shiftKey) {
                        navigator.clipboard.writeText(`${m.artist} - ${m.title} (${m.mapper}) https://osu.ppy.sh/s/${getSetId(m.url)}`);
                        return;
                    }
                    navigator.clipboard.writeText(`https://osu.ppy.sh/s/${getSetId(m.url)}`);
                })
                document.querySelector(`.${buttonClassPrefix}copydiff`).addEventListener("click", (e) => {
                    let m = getMetadata();
                    if (e.shiftKey) {
                        navigator.clipboard.writeText(`${m.artist} - ${m.title} (${m.mapper}) [${m.diffName}] https://osu.ppy.sh/b/${getDiffId(m.url)}`);
                        return;
                    }
                    navigator.clipboard.writeText(`https://osu.ppy.sh/b/${getDiffId(m.url)}`);
                })
            }

            observer.disconnect();
        })

        window.addEventListener("urlchange", () => {
            observer.observe(document, { childList: true, subtree: true });
        })

        observer.observe(document, { childList: true, subtree: true });
    }
)();
