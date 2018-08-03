// Load our script into JSDom
// cf. https://stackoverflow.com/a/19491110
const script = document.createElement("script");
script.type = "text/javascript";
import fs = require("fs");
const requireJSFile = fs.readFileSync("./test/vendor-test.js","utf8");
script.innerHTML = requireJSFile;
const head = window.document.getElementsByTagName('head')[0];
head.appendChild(script);

// Allow us to add properties to 'global'
// cf. https://stackoverflow.com/a/42304473
const globalAny:any = global;

// Load jquery separately since it takes ~30 sec for JSDom to load it as part of the script
import $ = require('jquery');
globalAny.jQuery = globalAny.$ = $;
