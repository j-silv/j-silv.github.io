(function(t){function e(e){for(var r,a,i=e[0],s=e[1],u=e[2],l=0,d=[];l<i.length;l++)a=i[l],Object.prototype.hasOwnProperty.call(o,a)&&o[a]&&d.push(o[a][0]),o[a]=0;for(r in s)Object.prototype.hasOwnProperty.call(s,r)&&(t[r]=s[r]);f&&f(e);while(d.length)d.shift()();return c.push.apply(c,u||[]),n()}function n(){for(var t,e=0;e<c.length;e++){for(var n=c[e],r=!0,a=1;a<n.length;a++){var i=n[a];0!==o[i]&&(r=!1)}r&&(c.splice(e--,1),t=s(s.s=n[0]))}return t}var r={},a={app:0},o={app:0},c=[];function i(t){return s.p+"js/"+({}[t]||t)+"."+{"chunk-0ee5681c":"75c84d6f","chunk-58a25b7d":"9f2196c3","chunk-27f0294d":"4f592d0b","chunk-2d0a4d7f":"c1e9b98d","chunk-3035c2b0":"04a97adf"}[t]+".js"}function s(e){if(r[e])return r[e].exports;var n=r[e]={i:e,l:!1,exports:{}};return t[e].call(n.exports,n,n.exports,s),n.l=!0,n.exports}s.e=function(t){var e=[],n={"chunk-0ee5681c":1,"chunk-58a25b7d":1,"chunk-27f0294d":1,"chunk-3035c2b0":1};a[t]?e.push(a[t]):0!==a[t]&&n[t]&&e.push(a[t]=new Promise((function(e,n){for(var r="css/"+({}[t]||t)+"."+{"chunk-0ee5681c":"fa4575c0","chunk-58a25b7d":"8ad0bb85","chunk-27f0294d":"81e01dc6","chunk-2d0a4d7f":"31d6cfe0","chunk-3035c2b0":"83e6e026"}[t]+".css",o=s.p+r,c=document.getElementsByTagName("link"),i=0;i<c.length;i++){var u=c[i],l=u.getAttribute("data-href")||u.getAttribute("href");if("stylesheet"===u.rel&&(l===r||l===o))return e()}var d=document.getElementsByTagName("style");for(i=0;i<d.length;i++){u=d[i],l=u.getAttribute("data-href");if(l===r||l===o)return e()}var f=document.createElement("link");f.rel="stylesheet",f.type="text/css",f.onload=e,f.onerror=function(e){var r=e&&e.target&&e.target.src||o,c=new Error("Loading CSS chunk "+t+" failed.\n("+r+")");c.code="CSS_CHUNK_LOAD_FAILED",c.request=r,delete a[t],f.parentNode.removeChild(f),n(c)},f.href=o;var p=document.getElementsByTagName("head")[0];p.appendChild(f)})).then((function(){a[t]=0})));var r=o[t];if(0!==r)if(r)e.push(r[2]);else{var c=new Promise((function(e,n){r=o[t]=[e,n]}));e.push(r[2]=c);var u,l=document.createElement("script");l.charset="utf-8",l.timeout=120,s.nc&&l.setAttribute("nonce",s.nc),l.src=i(t);var d=new Error;u=function(e){l.onerror=l.onload=null,clearTimeout(f);var n=o[t];if(0!==n){if(n){var r=e&&("load"===e.type?"missing":e.type),a=e&&e.target&&e.target.src;d.message="Loading chunk "+t+" failed.\n("+r+": "+a+")",d.name="ChunkLoadError",d.type=r,d.request=a,n[1](d)}o[t]=void 0}};var f=setTimeout((function(){u({type:"timeout",target:l})}),12e4);l.onerror=l.onload=u,document.head.appendChild(l)}return Promise.all(e)},s.m=t,s.c=r,s.d=function(t,e,n){s.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},s.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},s.t=function(t,e){if(1&e&&(t=s(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(s.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)s.d(n,r,function(e){return t[e]}.bind(null,r));return n},s.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return s.d(e,"a",e),e},s.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},s.p="/",s.oe=function(t){throw console.error(t),t};var u=window["webpackJsonp"]=window["webpackJsonp"]||[],l=u.push.bind(u);u.push=e,u=u.slice();for(var d=0;d<u.length;d++)e(u[d]);var f=l;c.push([0,"chunk-vendors"]),n()})({0:function(t,e,n){t.exports=n("56d7")},2272:function(t,e,n){t.exports=n.p+"img/buttercms_logo_white.c01e3ea9.png"},"56d7":function(t,e,n){"use strict";n.r(e);n("e260"),n("e6cf"),n("cca6"),n("a79d");var r=n("2b0e"),a=function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("v-app",[r("v-app-bar",{attrs:{app:"",dark:"",dense:""},scopedSlots:t._u([t.$vuetify.breakpoint.xs?{key:"extension",fn:function(){return[r("v-tabs",{attrs:{centered:""}},t._l(t.links,(function(e){return r("v-tab",{key:e.name,attrs:{to:e.link}},[t._v(" "+t._s(e.name)+" ")])})),1)]},proxy:!0}:null],null,!0)},[r("v-toolbar-title",{staticStyle:{overflow:"visible"}},[r("router-link",{staticClass:"text-decoration-none white--text",attrs:{to:"/"}},[r("span",{staticClass:"text-h5"},[t._v(" JUSTIN "),r("span",{staticClass:"font-weight-bold"},[t._v("SILVER")])])])],1),t.$vuetify.breakpoint.xs?t._e():r("v-tabs",{staticClass:"pr-5",attrs:{right:""}},t._l(t.links,(function(e){return r("v-tab",{key:e.name,attrs:{to:e.link}},[t._v(" "+t._s(e.name)+" ")])})),1)],1),r("v-main",[r("router-view")],1),r("v-footer",{attrs:{dark:""}},[r("v-container",{staticClass:"pa-0",attrs:{fluid:""}},[r("v-row",{attrs:{"no-gutters":"",justify:"space-between"}},[r("v-col",{staticClass:"d-flex",attrs:{cols:"auto"}},[r("strong",{staticClass:"heading-1 ma-auto"},[t._v("2021 Justin Silver")])]),r("v-spacer"),r("v-col",{attrs:{cols:"auto"}},[t._l(t.icons,(function(e){return r("v-btn",{key:e.name,staticClass:"mx-sm-1",attrs:{target:"_blank",href:e.link,icon:"",dark:""}},[r("v-icon",{attrs:{size:"1.5rem",dark:""}},[t._v(" "+t._s(e.name)+" ")])],1)})),r("v-btn",{staticClass:"px-sm-1 px-0",staticStyle:{"max-height":"1.5rem"},attrs:{text:"",target:"_blank",href:"https://buttercms.com/"}},[r("v-img",{attrs:{alt:"Butter CMS logo",src:n("2272"),transition:"scale-transition","max-width":"7.3rem"}})],1)],2)],1)],1)],1)],1)},o=[],c={name:"App",data:function(){return{links:[{name:"Home",link:"/"},{name:"Projects",link:"/project"},{name:"Contact",link:"/contact"}],icons:[{name:"mdi-github",link:"https://www.github.com/sir-drako"},{name:"mdi-linkedin",link:"https://www.linkedin.com/in/justin-silver/"}]}}},i=c,s=n("2877"),u=n("6544"),l=n.n(u),d=n("7496"),f=n("40dc"),p=n("8336"),h=n("62ad"),m=n("a523"),b=n("553a"),v=n("132d"),k=n("adda"),g=n("f6c4"),y=n("0fd9"),w=n("2fa4"),_=n("71a3"),x=n("fe57"),j=n("2a7f"),C=Object(s["a"])(i,a,o,!1,null,null,null),S=C.exports;l()(C,{VApp:d["a"],VAppBar:f["a"],VBtn:p["a"],VCol:h["a"],VContainer:m["a"],VFooter:b["a"],VIcon:v["a"],VImg:k["a"],VMain:g["a"],VRow:y["a"],VSpacer:w["a"],VTab:_["a"],VTabs:x["a"],VToolbarTitle:j["a"]});n("d3b7"),n("3ca3"),n("ddb0");var V=n("8c4f");r["a"].use(V["a"]);var P=[{path:"/",name:"home",component:function(){return Promise.all([n.e("chunk-58a25b7d"),n.e("chunk-3035c2b0")]).then(n.bind(null,"bb51"))}},{path:"/project",name:"project",component:function(){return Promise.all([n.e("chunk-58a25b7d"),n.e("chunk-27f0294d")]).then(n.bind(null,"029f"))}},{path:"/project/:project",name:"project_slug",component:function(){return Promise.all([n.e("chunk-58a25b7d"),n.e("chunk-2d0a4d7f")]).then(n.bind(null,"07bd"))}},{path:"/contact",name:"contact",component:function(){return n.e("chunk-0ee5681c").then(n.bind(null,"b8fa"))}}],O=new V["a"]({mode:"history",base:"/",routes:P}),T=O,E=n("f309");r["a"].use(E["a"]);var A=new E["a"]({});n("a41b");r["a"].config.productionTip=!1,new r["a"]({router:T,vuetify:A,render:function(t){return t(S)}}).$mount("#app")},a41b:function(t,e,n){}});
//# sourceMappingURL=app.1073d3b8.js.map