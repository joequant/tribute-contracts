(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[7250],{3905:function(t,e,n){"use strict";n.d(e,{Zo:function(){return p},kt:function(){return f}});var a=n(7294);function r(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function o(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(t);e&&(a=a.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,a)}return n}function i(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?o(Object(n),!0).forEach((function(e){r(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}function s(t,e){if(null==t)return{};var n,a,r=function(t,e){if(null==t)return{};var n,a,r={},o=Object.keys(t);for(a=0;a<o.length;a++)n=o[a],e.indexOf(n)>=0||(r[n]=t[n]);return r}(t,e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(t);for(a=0;a<o.length;a++)n=o[a],e.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(t,n)&&(r[n]=t[n])}return r}var c=a.createContext({}),l=function(t){var e=a.useContext(c),n=e;return t&&(n="function"==typeof t?t(e):i(i({},e),t)),n},p=function(t){var e=l(t.components);return a.createElement(c.Provider,{value:e},t.children)},u={inlineCode:"code",wrapper:function(t){var e=t.children;return a.createElement(a.Fragment,{},e)}},d=a.forwardRef((function(t,e){var n=t.components,r=t.mdxType,o=t.originalType,c=t.parentName,p=s(t,["components","mdxType","originalType","parentName"]),d=l(n),f=r,g=d["".concat(c,".").concat(f)]||d[f]||u[f]||o;return n?a.createElement(g,i(i({ref:e},p),{},{components:n})):a.createElement(g,i({ref:e},p))}));function f(t,e){var n=arguments,r=e&&e.mdxType;if("string"==typeof t||r){var o=n.length,i=new Array(o);i[0]=d;var s={};for(var c in e)hasOwnProperty.call(e,c)&&(s[c]=e[c]);s.originalType=t,s.mdxType="string"==typeof t?t:r,i[1]=s;for(var l=2;l<o;l++)i[l]=n[l];return a.createElement.apply(null,i)}return a.createElement.apply(null,n)}d.displayName="MDXCreateElement"},7760:function(t,e,n){"use strict";n.r(e),n.d(e,{frontMatter:function(){return s},metadata:function(){return c},toc:function(){return l},default:function(){return u}});var a=n(2122),r=n(9756),o=(n(7294),n(3905)),i=["components"],s={id:"configuration-adapter",title:"Configuration"},c={unversionedId:"contracts/adapters/configuration/configuration-adapter",id:"contracts/adapters/configuration/configuration-adapter",isDocsHomePage:!1,title:"Configuration",description:"The Configuration adapter manages storing and retrieving per-DAO settings required by shared adapters.",source:"@site/docs/contracts/adapters/configuration/Configuration.md",sourceDirName:"contracts/adapters/configuration",slug:"/contracts/adapters/configuration/configuration-adapter",permalink:"/tribute-contracts/docs/contracts/adapters/configuration/configuration-adapter",editUrl:"https://github.com/openlawteam/tribute-contracts/edit/docs/website/docs/contracts/adapters/configuration/Configuration.md",version:"current",frontMatter:{id:"configuration-adapter",title:"Configuration"},sidebar:"docs",previous:{title:"Executor",permalink:"/tribute-contracts/docs/contracts/extensions/executor-extension"},next:{title:"Managing",permalink:"/tribute-contracts/docs/contracts/adapters/configuration/managing-adapter"}},l=[{value:"Workflows",id:"workflows",children:[]},{value:"Adapter state",id:"adapter-state",children:[{value:"Configuration",id:"configuration",children:[]}]},{value:"Dependencies and interactions (internal / external)",id:"dependencies-and-interactions-internal--external",children:[]},{value:"Functions description and assumptions / checks",id:"functions-description-and-assumptions--checks",children:[{value:"function submitProposal(DaoRegistry dao, bytes32 proposalId, bytes32[] calldata keys, uint256[] calldata values, bytes calldata data)",id:"function-submitproposaldaoregistry-dao-bytes32-proposalid-bytes32-calldata-keys-uint256-calldata-values-bytes-calldata-data",children:[]},{value:"function processProposal(DaoRegistry dao, bytes32 proposalId)",id:"function-processproposaldaoregistry-dao-bytes32-proposalid",children:[]}]}],p={toc:l};function u(t){var e=t.components,n=(0,r.Z)(t,i);return(0,o.kt)("wrapper",(0,a.Z)({},p,n,{components:e,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"The Configuration adapter manages storing and retrieving per-DAO settings required by shared adapters."),(0,o.kt)("p",null,"Some adapters have configurable settings which must be stored for each DAO instance that uses the shared adapter."),(0,o.kt)("h2",{id:"workflows"},"Workflows"),(0,o.kt)("p",null,"Submit proposal"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"check that caller is valid member"),(0,o.kt)("li",{parentName:"ul"},"check that keys/values are same length"),(0,o.kt)("li",{parentName:"ul"},"check that proposalId is unique"),(0,o.kt)("li",{parentName:"ul"},"submit proposal to DAO"),(0,o.kt)("li",{parentName:"ul"},"create and store configuration structure")),(0,o.kt)("p",null,"Sponsor module change request"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"check that caller is valid member"),(0,o.kt)("li",{parentName:"ul"},"initiate vote")),(0,o.kt)("p",null,"Process proposal"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"check that caller is valid member"),(0,o.kt)("li",{parentName:"ul"},"check that proposalId exists"),(0,o.kt)("li",{parentName:"ul"},"check that proposal passed"),(0,o.kt)("li",{parentName:"ul"},"for each key and value, set it in the configuration for this DAO"),(0,o.kt)("li",{parentName:"ul"},"process proposal")),(0,o.kt)("h2",{id:"adapter-state"},"Adapter state"),(0,o.kt)("p",null,"The adapter stores the proposed configuration changes."),(0,o.kt)("h3",{id:"configuration"},"Configuration"),(0,o.kt)("p",null,"DAORegistry Access Flags: ",(0,o.kt)("inlineCode",{parentName:"p"},"SUBMIT_PROPOSAL"),", ",(0,o.kt)("inlineCode",{parentName:"p"},"SET_CONFIGURATION"),"."),(0,o.kt)("h4",{id:"keys"},"keys"),(0,o.kt)("p",null,"The array of keys to set in the configuration."),(0,o.kt)("h4",{id:"values"},"values"),(0,o.kt)("p",null,"The array of values to set in the configuration."),(0,o.kt)("h2",{id:"dependencies-and-interactions-internal--external"},"Dependencies and interactions (internal / external)"),(0,o.kt)("h2",{id:"functions-description-and-assumptions--checks"},"Functions description and assumptions / checks"),(0,o.kt)("h3",{id:"function-submitproposaldaoregistry-dao-bytes32-proposalid-bytes32-calldata-keys-uint256-calldata-values-bytes-calldata-data"},"function submitProposal(DaoRegistry dao, bytes32 proposalId, bytes32[] calldata keys, uint256[] calldata values, bytes calldata data)"),(0,o.kt)("p",null,"Creates and sponsors a new configuration proposal on behalf of the member calling the function."),(0,o.kt)("p",null,(0,o.kt)("strong",{parentName:"p"},"dao")," is the DAO instance to be configured\n",(0,o.kt)("strong",{parentName:"p"},"proposalId")," is the ID chosen for this configuration proposal, must be unique\n",(0,o.kt)("strong",{parentName:"p"},"keys")," the configuration keys to set\n",(0,o.kt)("strong",{parentName:"p"},"values")," the configuration values to set, must be same length as keys\n",(0,o.kt)("strong",{parentName:"p"},"data")),(0,o.kt)("h3",{id:"function-processproposaldaoregistry-dao-bytes32-proposalid"},"function processProposal(DaoRegistry dao, bytes32 proposalId)"),(0,o.kt)("p",null,"Processes a previously created configuration proposal by applying the configuration to the DAO."),(0,o.kt)("p",null,(0,o.kt)("strong",{parentName:"p"},"dao")," is the DAO instance to be configured\n",(0,o.kt)("strong",{parentName:"p"},"proposalId")," is the ID of a previously created and sponsored configuration proposal which has passed the vote"))}u.isMDXComponent=!0}}]);