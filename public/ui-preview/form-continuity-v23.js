/* V23 — contextual navigation from a role-owned demo form back to its worklist.
 * Only decorates authorized role-first form views; no patient data mutations or APIs.
 */
(function(){
"use strict";
var shell=window.__SIMRS_PREVIEW__,roleDemo=window.SIMRSRoleDemo;
if(!shell||!roleDemo||typeof shell.render!=="function")return;
var original=shell.render;
function make(tag,className,value){
 var el=document.createElement(tag);
 if(className)el.className=className;
 if(value!=null)el.textContent=String(value);
 return el;
}
function decorate(){
 var root=document.getElementById("main-content");
 if(!root||!roleDemo.isAuthenticated()||roleDemo.isReviewer()||shell.state.active!=="forms")return;
 var operational=root.querySelector(".p0-operational[data-module]");
 if(!operational||root.querySelector(".v23-returnbar"))return;
 var account=roleDemo.getAccount(),form=operational.querySelector("#p0-editor");
 if(!account||!form)return;
 var code=operational.getAttribute("data-module")||"";
 var item=form.getAttribute("data-work-item")||"";
 var section=roleDemo.getCurrentSection();
 var feature=window.SIMRSRoleUXV4&&window.SIMRSRoleUXV4.getFeature(account.role,section);
 var bar=make("nav","v23-returnbar");
 bar.setAttribute("aria-label","Navigasi pekerjaan dan formulir demo");
 bar.setAttribute("data-v23-role",account.role);
 bar.setAttribute("data-v23-module",code);
 if(item)bar.setAttribute("data-v23-workitem",item);
 var info=make("div","v23-returnbar-info");
 info.appendChild(make("span","v23-overline","FORM PEKERJAAN · DATA DEMO"));
 info.appendChild(make("strong","v23-context-title",(feature&&feature.label||"Pekerjaan saya")+" · "+code));
 info.appendChild(make("span","v23-context-meta",item?"Pekerjaan "+item+" · "+account.role:"Pekerjaan "+account.role));
 var actions=make("div","v23-returnbar-actions");
 var back=make("button","v23-back-button","← Kembali ke daftar kerja");
 back.type="button";
 back.setAttribute("data-demo-action","backToWorklist");
 var focus=make("button","v23-form-button","Ke isian form");
 focus.type="button";
 focus.setAttribute("data-v23-focus-form","");
 actions.appendChild(back);actions.appendChild(focus);
 bar.appendChild(info);bar.appendChild(actions);
 operational.parentNode.insertBefore(bar,operational);
}
shell.render=function(){
 var result=original.apply(this,arguments);
 decorate();
 return result;
};
document.addEventListener("click",function(event){
 var button=event.target.closest("[data-v23-focus-form]");
 if(!button)return;
 event.preventDefault();
 var root=document.querySelector(".p0-operational #p0-editor");
 if(!root)return;
 var targets=root.querySelectorAll("input:not(:disabled),select:not(:disabled),textarea:not(:disabled),button:not(:disabled)");
 var first=Array.prototype.find.call(targets,function(el){return el.getClientRects().length>0;});
 if(first){first.focus();first.scrollIntoView({block:"nearest"});}
});
decorate(); // Restored session may have rendered before this script was installed.
window.SIMRSFormContinuityV23={version:"23",decorate:decorate};
})();
