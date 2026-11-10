/* SIMRS Baru V15 — progressive, task-focused forms.
 * Only rearranges presentation in the synthetic mockup; all inputs remain in the DOM
 * for the existing validation, draft and audit flow. No backend actions.
 */
(function(){
"use strict";
var activeSteps=Object.create(null);
function esc(value){return String(value==null?"":value).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];});}
function keyOf(form){
 var role=(document.body.getAttribute("data-demo-role")||document.querySelector("#role")?.value||"demo");
 return [role,form.dataset.formModule||"",form.dataset.workItem||""].join("::");
}
function stepsOf(form){return Array.from(form.querySelectorAll(".p0-fields > .v13-form-section, .p0-fields > .v15-generated-section"));}
function buildFallback(form,fields){
 if(fields.classList.contains("v13-form-fields"))return;
 var parts=Array.from(fields.children).filter(function(node){return node.classList&&node.classList.contains("p0-field");});
 if(parts.length<=7)return;
 fields.classList.add("v15-chunked");
 var count=Math.ceil(parts.length/6);
 for(var i=0;i<count;i++){
  var start=i*6, end=Math.min(start+6,parts.length);
  var section=document.createElement("section");
  section.className="v15-generated-section";
  section.setAttribute("data-v15-step",String(i));
  var title="Bagian "+String(i+1);
  section.innerHTML='<header class="v15-generated-head"><span class="v15-index">'+String(i+1).padStart(2,"0")+'</span><div><h3>'+title+'</h3><p>Isian '+String(start+1)+'–'+String(end)+' dari '+String(parts.length)+'</p></div></header><div class="v15-grid"></div>';
  parts.slice(start,end).forEach(function(node){section.querySelector(".v15-grid").appendChild(node);});
  fields.appendChild(section);
 }
}
function setStep(form,index,scroll){
 var steps=stepsOf(form),total=steps.length;if(!total)return;
 var current=Math.max(0,Math.min(index,total-1));
 activeSteps[keyOf(form)]=current;
 steps.forEach(function(section,i){section.hidden=i!==current;section.setAttribute("aria-hidden",i===current?"false":"true");});
 form.querySelectorAll(".v15-tab").forEach(function(tab,i){var on=i===current;tab.classList.toggle("active",on);tab.setAttribute("aria-current",on?"step":"false");tab.setAttribute("aria-pressed",on?"true":"false");});
 var back=form.querySelector("[data-v15-move='back']"),next=form.querySelector("[data-v15-move='next']"),label=form.querySelector(".v15-step-label");
 if(back)back.disabled=current===0;
 if(next){next.hidden=current===total-1;next.textContent="Lanjut ke bagian "+String(current+2)+" →";}
 if(label)label.textContent="Bagian "+String(current+1)+" dari "+String(total)+" · "+(steps[current].querySelector("h3")?.textContent||"Isian");
 if(scroll){var intro=form.querySelector(".v15-section-tabs");if(intro&&typeof intro.scrollIntoView==="function")intro.scrollIntoView({block:"nearest",behavior:"smooth"});}
}
function decorate(){
 var form=document.getElementById("p0-editor");
 if(!form||form.dataset.v15Ready==="true")return;
 var fields=form.querySelector(".p0-fields");if(!fields)return;
 buildFallback(form,fields);
 var steps=stepsOf(form);
 if(steps.length<2)return;
 form.dataset.v15Ready="true";
 var tabs=document.createElement("nav");tabs.className="v15-section-tabs";tabs.setAttribute("aria-label","Navigasi bagian formulir");
 tabs.innerHTML=steps.map(function(section,i){
  var name=section.querySelector("h3")?.textContent||"Bagian "+String(i+1);
  return '<button class="v15-tab" type="button" data-v15-go="'+i+'" aria-pressed="false"><span class="v15-tab-number">'+String(i+1)+'</span><span>'+esc(name)+'</span></button>';
 }).join("");
 fields.parentNode.insertBefore(tabs,fields);
 var controls=document.createElement("div");controls.className="v15-step-controls";
 controls.innerHTML='<button type="button" class="v15-step-back" data-v15-move="back">← Sebelumnya</button><span class="v15-step-label" role="status" aria-live="polite"></span><button type="button" class="v15-step-next" data-v15-move="next">Lanjut →</button>';
 fields.insertAdjacentElement("afterend",controls);
 var help=document.createElement("p");help.className="v15-draft-note";help.textContent="Simpan draft dapat dilakukan kapan saja. Seluruh isian tetap disimpan dan divalidasi oleh formulir demo yang sama.";
 controls.insertAdjacentElement("afterend",help);
 setStep(form,activeSteps[keyOf(form)]||0,false);
}
document.addEventListener("click",function(event){
 var btn=event.target.closest("[data-v15-go], [data-v15-move]");
 if(!btn)return;var form=btn.closest("#p0-editor");if(!form)return;
 event.preventDefault();
 var step=activeSteps[keyOf(form)]||0;
 if(btn.hasAttribute("data-v15-go"))step=Number(btn.getAttribute("data-v15-go"));
 else step+=btn.getAttribute("data-v15-move")==="next"?1:-1;
 setStep(form,step,true);
});
/* Review remains implemented by the original engine. Surface an invalid
 * section after it reports errors, including when that section was hidden. */
document.addEventListener("click",function(event){
 var btn=event.target.closest('[data-p0-action="review"]');if(!btn)return;
 window.setTimeout(function(){
  var form=document.getElementById("p0-editor");if(!form||!form.dataset.v15Ready)return;
  var invalid=Array.from(form.querySelectorAll(".p0-error")).find(function(el){return el.textContent.trim().length>0;});
  if(!invalid)return;var section=invalid.closest(".v13-form-section, .v15-generated-section");if(!section)return;
  var n=stepsOf(form).indexOf(section);if(n>=0)setStep(form,n,false);
 },0);
});
var root=document.getElementById("main-content");
if(root){new MutationObserver(decorate).observe(root,{childList:true,subtree:true});}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",decorate);else decorate();
window.SIMRSProgressiveFormsV15={decorate:decorate,setStep:setStep,stepsOf:stepsOf};
})();