// ==UserScript==
// @name         oscopy
// @namespace    me.ekite57.oscopy
// @version      1.0.0
// @description  a way to quickly share osu! beatmap links
// @author       ekite57
// @match        *://osu.ppy.sh/*
// @icon         https://osu.ppy.sh/favicon.ico
// @grant        window.onurlchange
// @grant        GM_setClipboard
// @run-at       document-idle
// ==/UserScript==

(
    function () {
        'use strict';

        function injectButtons() {
            var eFavButton = document.querySelector('.btn-osu-big--beatmapset-header-square-favourite')

            if (document.getElementsByClassName('btn-osu-big--beatmapset-header-square-copydiff').length === 0) {
                let eCopyDiffButton = document.createElement('div')
                eCopyDiffButton.innerHTML = '<button class="btn-osu-big btn-osu-big--beatmapset-header-square btn-osu-big--beatmapset-header-square-copydiff" type="button" title="copy diff link (shift to include metadata)"><span class="btn-osu-big__content btn-osu-big__content--center"><span class="btn-osu-big__icon"><span class="fa-fw fas fa-link"></span></span></span></button>'
                eFavButton.after(eCopyDiffButton)
            }
            if (document.getElementsByClassName('btn-osu-big--beatmapset-header-square-copyset').length === 0) {
                let eCopySetButton = document.createElement('div')
                eCopySetButton.innerHTML = '<button class="btn-osu-big btn-osu-big--beatmapset-header-square btn-osu-big--beatmapset-header-square-copyset" type="button" title="copy map link (shift to include metadata)"><span class="btn-osu-big__content btn-osu-big__content--center"><span class="btn-osu-big__icon"><span class="fa-fw fas fa-link"></span></span></span></button>'
                eFavButton.after(eCopySetButton)
            }
        }

        function getSetId(link) {
            return link.replace(/^https?:\/\/osu\.ppy\.sh\/beatmapsets\//, "").replace(/#(osu|taiko|catch|mania)\/\d+/, "");
        }

        function getDiffId(link) {
            return link.replace(/^https?:\/\/osu\.ppy\.sh\/beatmapsets\//, "").replace(/\d+#(osu|taiko|catch|mania)\//, "");
        }

        function copyToClipboard(content) {
            return GM_setClipboard(content);
        }

        function getTextContent(element) {
            // holy janky
            return Array.from(element.childNodes).filter(n => n.nodeType === Node.TEXT_NODE && n.textContent.trim())[0].textContent
        }

        function getMetadata() {
            return {
                // doing URL here to avoid desync between metadata and URL
                url: window.location.href,
                title: document.querySelector('.beatmapset-header__details-text--title .beatmapset-header__details-text-link').innerText.trim(),
                artist: document.querySelector('.beatmapset-header__details-text--artist .beatmapset-header__details-text-link').innerText.trim(),
                mapper: document.querySelector('.beatmapset-mapping__user').innerText.trim(),
                diffName: getTextContent(document.querySelector('.beatmapset-header__diff-name'))
            }
        }

        var observer = new MutationObserver(() => {
            if (!window.location.href.includes("beatmapsets")) {
                observer.disconnect();
                return;
            }

            if (document.contains(document.querySelector('.beatmapset-header__buttons'))) {
                injectButtons();
                document.querySelector('.btn-osu-big--beatmapset-header-square-copyset').addEventListener("click", (e) => {
                    let m = getMetadata();
                    if (e.shiftKey) {
                        copyToClipboard(`${m.artist} - ${m.title} (${m.mapper}) https://osu.ppy.sh/s/${getSetId(m.url)}`);
                        return;
                    }
                    copyToClipboard(`https://osu.ppy.sh/s/${getSetId(m.url)}`);
                })
                document.querySelector('.btn-osu-big--beatmapset-header-square-copydiff').addEventListener("click", (e) => {
                    let m = getMetadata();
                    if (e.shiftKey) {
                        copyToClipboard(`${m.artist} - ${m.title} (${m.mapper}) [${m.diffName}] https://osu.ppy.sh/b/${getDiffId(m.url)}`);
                        return;
                    }
                    copyToClipboard(`https://osu.ppy.sh/b/${getDiffId(m.url)}`);

                })
                observer.disconnect();
            }
        })

        window.addEventListener("urlchange", () => {
            observer.observe(document, { childList: true, subtree: true });
        })

        observer.observe(document, { childList: true, subtree: true })
    }
)();
