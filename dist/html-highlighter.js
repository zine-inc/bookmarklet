javascript: (function(e){var t={log:{enabled:!1,welcome:!1},eval:'"!function(){[{color:\\"#F44336\\",selector:\\"h1\\"},{color:\\"#E91E63\\",selector:\\"h2\\"},{color:\\"#9C27B0\\",selector:\\"h3\\"},{color:\\"#673AB7\\",selector:\\"h4\\"},{color:\\"#3F51B5\\",selector:\\"h5\\"},{color:\\"#2196F3\\",selector:\\"h6\\"}].map(function(o){for(var e=document.querySelectorAll(o.selector),r=0,l=e.length;l>r;++r){var c=e[r];c.style.backgroundColor=o.color;var t=document.createElement(\\"span\\");t.innerHTML=\\" | \\"+o.selector,c.appendChild(t)}})}();"'},o=!0;if("object"==typeof this.artoo&&(artoo.settings.reload||(artoo.log.verbose("artoo already exists within this page. No need to inject him again."),artoo.loadSettings(t),artoo.exec(),o=!1)),o){var r=document.getElementsByTagName("body")[0];r||(r=document.createElement("body"),document.documentElement.appendChild(r));var c=document.createElement("script");c.src="//medialab.github.io/artoo/public/dist/artoo-latest.min.js",c.type="text/javascript",c.id="artoo_injected_script",c.setAttribute("settings",JSON.stringify(t)),r.appendChild(c)}}).call(this);