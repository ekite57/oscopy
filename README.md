# oscopy  
a way to quickly share osu! beatmap links  

## installation  
install Tampermonkey in your browser's extension store ([google chrome](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo), [mozilla firefox](https://addons.mozilla.org/firefox/addon/tampermonkey)), then click [here](https://raw.githubusercontent.com/ekite57/oscopy/refs/heads/master/oscopy.user.js) to install the script.  

> note: on chrome, you'll need to allow user scripts from the "manage extension" menu.

## usage  
open a beatmap info page on the website ([example](https://osu.ppy.sh/s/972932)), then you should see two additional buttons:  
![image of the osu! website, showing the "copy beatmap link" and the "copy difficulty link" button](demo.png)  
the first button copies the link to this beatmap, like this `https://osu.ppy.sh/s/972932`  
the second button copies the link to the difficulty you're on, like this `https://osu.ppy.sh/b/2036903`  
  
holding `Shift` while clicking the button will copy the link with metadata attached to it,  
for example  
`James Landino - Hide And Seek (Mirash) https://osu.ppy.sh/s/972932`  
`James Landino - Hide And Seek (Mirash) [Expert] https://osu.ppy.sh/b/2036903`