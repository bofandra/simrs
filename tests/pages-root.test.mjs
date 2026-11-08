import assert from "node:assert/strict";
import { test } from "node:test";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root=new URL("../",import.meta.url);
const file=p=>join(root.pathname,p);
const deploy=readFileSync(file(".github/workflows/publish-mindmap-pages.yml"),"utf8");
const html=readFileSync(file("public/ui-preview/index.html"),"utf8");

test("only the newest SIMRS preview is packaged as GitHub Pages root",()=>{
  assert.match(deploy,/cp -a public\/ui-preview\/\. _site\//);
  assert.doesNotMatch(deploy,/cp -a docs\/simrs-baru/);
  assert.doesNotMatch(deploy,/_site\/ui-preview/);
  assert.match(deploy,/node --test tests\/\*\.test\.mjs/);
  assert.match(deploy,/npx playwright test --config=tests\/playwright\.config\.mjs/);
});

test("no obsolete HTML pages or old deployment-only scripts remain",()=>{
  const old=["docs/simrs-baru/index.html","docs/mindmap-simrs-kliniksatu/index.html",
    "docs/gap-simrs-sensi-nuha/index.html","scripts/simrs-mockup-smoke.cjs",
    "scripts/simrs-mockup-browser.cjs",".github/workflows/simrs-mockup-validate.yml"];
  for(const path of old)assert.equal(existsSync(file(path)),false,path);
  for(const path of ["docs/simrs-baru/DATA_STATE_CONTRACTS.md",
    "docs/simrs-baru/OPENAPI_CARE_SPECIALTY_DRAFT.yaml",
    "public/ui-preview/index.html"])
    assert.ok(existsSync(file(path)),path);
});

test("mockup root keeps local relative JS and CSS references",()=>{
  for(const asset of ["p0-forms.js","p0-form-catalog.js","master-lookups.js",
    "p0-forms.css","satusehat-theme.css","synthetic-journey.js"])
    assert.ok(html.includes("./"+asset),asset);
  assert.match(html,/data-nav="forms"/);
});
