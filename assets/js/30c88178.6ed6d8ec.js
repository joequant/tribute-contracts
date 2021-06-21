(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[5060],{3905:function(e,t,r){"use strict";r.d(t,{Zo:function(){return u},kt:function(){return h}});var n=r(7294);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function o(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function c(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?o(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function i(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},o=Object.keys(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var s=n.createContext({}),l=function(e){var t=n.useContext(s),r=t;return e&&(r="function"==typeof e?e(t):c(c({},t),e)),r},u=function(e){var t=l(e.components);return n.createElement(s.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},p=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,o=e.originalType,s=e.parentName,u=i(e,["components","mdxType","originalType","parentName"]),p=l(r),h=a,f=p["".concat(s,".").concat(h)]||p[h]||d[h]||o;return r?n.createElement(f,c(c({ref:t},u),{},{components:r})):n.createElement(f,c({ref:t},u))}));function h(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=r.length,c=new Array(o);c[0]=p;var i={};for(var s in t)hasOwnProperty.call(t,s)&&(i[s]=t[s]);i.originalType=e,i.mdxType="string"==typeof e?e:a,c[1]=i;for(var l=2;l<o;l++)c[l]=r[l];return n.createElement.apply(null,c)}return n.createElement.apply(null,r)}p.displayName="MDXCreateElement"},1433:function(e,t,r){"use strict";r.r(t),r.d(t,{frontMatter:function(){return i},metadata:function(){return s},toc:function(){return l},default:function(){return d}});var n=r(2122),a=r(9756),o=(r(7294),r(3905)),c=["components"],i={id:"architecture",title:"Architecture"},s={unversionedId:"intro/design/architecture",id:"intro/design/architecture",isDocsHomePage:!1,title:"Architecture",description:"Inspired by the hexagonal architecture design pattern we believe that we can have additional layers of security, and break the main contract into smaller contracts. With that, we created loosely coupled modules/contracts, easier to audit, and can be easily connected to the DAO.",source:"@site/docs/intro/design/Architecture.md",sourceDirName:"intro/design",slug:"/intro/design/architecture",permalink:"/tribute-contracts/docs/intro/design/architecture",editUrl:"https://github.com/openlawteam/tribute-contracts/edit/docs/website/docs/intro/design/Architecture.md",version:"current",frontMatter:{id:"architecture",title:"Architecture"},sidebar:"docs",previous:{title:"Moloch",permalink:"/tribute-contracts/docs/intro/comparison/moloch"},next:{title:"Core",permalink:"/tribute-contracts/docs/intro/design/core/introduction"}},l=[],u={toc:l};function d(e){var t=e.components,r=(0,a.Z)(e,c);return(0,o.kt)("wrapper",(0,n.Z)({},u,r,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"Inspired by the ",(0,o.kt)("strong",{parentName:"p"},(0,o.kt)("a",{parentName:"strong",href:"https://en.wikipedia.org/wiki/Hexagonal_architecture_(software)"},"hexagonal architecture design pattern"))," we believe that we can have additional layers of security, and break the main contract into smaller contracts. With that, we created loosely coupled modules/contracts, easier to audit, and can be easily connected to the DAO."),(0,o.kt)("p",null,"The main design goal is to limit access to the smart contracts according at layer boundaries. The External World (e.g. RPC clients) can access the core contracts only via ",(0,o.kt)("strong",{parentName:"p"},(0,o.kt)("a",{parentName:"strong",href:"/docs/intro/design/adapters/introduction"},"Adapters")),", never directly. Every adapter contains all the necessary logic and data to update/change the state of the DAO in the ",(0,o.kt)("strong",{parentName:"p"},(0,o.kt)("a",{parentName:"strong",href:"/docs/contracts/core/dao-registry"},"DAO Registry Contract")),". The ",(0,o.kt)("strong",{parentName:"p"},(0,o.kt)("a",{parentName:"strong",href:"/docs/contracts/core/dao-registry"},"DAO Registry Contract"))," tracks all the state changes of the DAO, and an Adapter tracks only the state changes in its own context. ",(0,o.kt)("strong",{parentName:"p"},(0,o.kt)("a",{parentName:"strong",href:"/docs/intro/design/extensions/introduction"},"Extensions"))," enhance the DAO capabilities and simplify the core contract code."),(0,o.kt)("p",null,"A key concept here is to ensure the information always flows from the External World to the Core Contracts, never the other way around. If a Core Contract needs external info, it must be provided by an Adapter and/or an Extension instead of calling External World directly. In addition to that, only Adapters and/or Extensions that have access rights can push/pull information to/from the ",(0,o.kt)("strong",{parentName:"p"},(0,o.kt)("a",{parentName:"strong",href:"/docs/contracts/core/dao-registry"},"DAO Registry Contract")),"."),(0,o.kt)("p",null,(0,o.kt)("img",{parentName:"p",src:"https://user-images.githubusercontent.com/708579/107689684-e7300200-6c87-11eb-89c0-7bfe7eddaaaf.png",alt:"tributedao_hexagon_architecture"})))}d.isMDXComponent=!0}}]);