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
            var eFavButton = document.getElementsByClassName('btn-osu-big--beatmapset-header-square-favourite')[0]
            if (document.getElementsByClassName('btn-osu-big--beatmapset-header-square-copydiff').length === 0) {
                let eCopyDiffButton = document.createElement('div')
                eCopyDiffButton.innerHTML = '<button class="btn-osu-big btn-osu-big--beatmapset-header-square btn-osu-big--beatmapset-header-square-copydiff" type="button" title="copy difficulty link"><span class="btn-osu-big__content btn-osu-big__content--center"><span class="btn-osu-big__icon"><span class="fa-fw fas fa-link"></span></span></span></button>'
                eFavButton.after(eCopyDiffButton)
            }
            if (document.getElementsByClassName('btn-osu-big--beatmapset-header-square-copyset').length === 0) {
                let eCopySetButton = document.createElement('div')
                eCopySetButton.innerHTML = '<button class="btn-osu-big btn-osu-big--beatmapset-header-square btn-osu-big--beatmapset-header-square-copyset" type="button" title="copy beatmap link"><span class="btn-osu-big__content btn-osu-big__content--center"><span class="btn-osu-big__icon"><span class="fa-fw fas fa-link"></span></span></span></button>'
                eFavButton.after(eCopySetButton)
            }
        }

        function getSetId(link) {
            return link.replace(/^https?:\/\/osu\.ppy\.sh\/beatmapsets\//, "").replace(/#(osu|taiko|catch|mania)\/\d+/, "");
        }

        function getDiffId(link) {
            return link.replace(/^https?:\/\/osu\.ppy\.sh\/beatmapsets\//, "").replace(/\d+#(osu|taiko|catch|mania)\//, "");
        }

        function copySet(id) {
            GM_setClipboard("https://osu.ppy.sh/s/" + id)
        }

        function copyDiff(id) {
            GM_setClipboard("https://osu.ppy.sh/b/" + id)
        }

        var observer = new MutationObserver(() => {
            if (document.contains(document.getElementsByClassName('beatmapset-header__buttons')[0])) {
                injectButtons();
                document.getElementsByClassName('btn-osu-big--beatmapset-header-square-copyset')[0].addEventListener("click", () => {
                    copySet(getSetId(window.location.href))
                })
                document.getElementsByClassName('btn-osu-big--beatmapset-header-square-copydiff')[0].addEventListener("click", () => {
                    copyDiff(getDiffId(window.location.href))
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
