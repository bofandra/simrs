/* Real Chromium responsive smoke test for SIMRS Baru static prototype. */
"use strict";
const assert=require("node:assert/strict");
const http=require("node:http");
const fs=require("node:fs");
const path=require("node:path");
const {chromium}=require("playwright");
const root=path.join(__dirname,"..","docs","simrs-baru");
const dest=path.join(__dirname,"..","artifacts","browser");
fs.mkdirSync(dest,{recursive:true});
const mime={".html":"text/html; charset=utf-8",".js":"application/javascript; charset=utf-8",".css":"text/css; charset=utf-8",".svg":"image/svg+xml"};
const server=http.createServer((req,res)=>{
 const url=decodeURIComponent((req.url||"/").split("?")[0]);
 let p=path.normalize(path.join(root,url==="/"?"/index.html":url));
 if(!p.startsWith(root+path.sep)&&p!==path.join(root,"index.html")){res.writeHead(403);res.end("Forbidden");return;}
 fs.readFile(p,(err,data)=>{
  if(err){res.writeHead(404);res.end("Not found");return;}
  res.writeHead(200,{"content-type":mime[path.extname(p)]||"text/plain; charset=utf-8","cache-control":"no-store"});res.end(data);
 });
});
(async()=>{
 await new Promise(resolve=>server.listen(0,"127.0.0.1",resolve));
 const origin="http://127.0.0.1:"+server.address().port;
 let browser;
 try{
  browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
  const sizes=[{name:"desktop",width:1440,height:900},{name:"tablet",width:768,height:1024},{name:"mobile",width:390,height:844}];
  for(const size of sizes){
   const context=await browser.newContext({viewport:{width:size.width,height:size.height},deviceScaleFactor:1});
   const page=await context.newPage(),errors=[];
   page.on("pageerror",error=>errors.push(error.message));
   await page.goto(origin+"/#role-worklists",{waitUntil:"networkidle"});
   await page.locator("#workspace .rwl-layout").waitFor();
   assert.match(await page.locator("#workspace h1").innerText(),/Worklist Berdasarkan Peran/);
   assert.equal(await page.locator(".rwl-role").count(),6);
   await page.locator('[data-action="rwl-role"][data-id="nurse"]').click();
   await page.locator('[data-action="rwl-nursing"]').first().click();
   await page.locator("#modal-root textarea[name=intervention]").waitFor();
   await page.locator("#modal-root button[type=submit]").click();
   assert.ok((await page.locator("#workspace").innerText()).includes("Asuhan sudah dicatat"));
   await page.locator('[data-action="rwl-role"][data-id="lab"]').click();
   assert.ok((await page.locator("#workspace").innerText()).includes("LAB-02"));
   await page.locator('[data-action="rwl-role"][data-id="pharmacy"]').click();
   assert.ok((await page.locator("#workspace").innerText()).includes("RX-01"));
   await page.locator('[data-action="rwl-role"][data-id="cashier"]').click();
   assert.ok((await page.locator("#workspace").innerText()).includes("INV-01"));
   await page.screenshot({path:path.join(dest,"role-worklist-"+size.name+".png"),fullPage:true});
   const overflow=await page.evaluate(()=>({page:document.documentElement.scrollWidth,viewport:window.innerWidth}));
   assert.ok(overflow.page<=overflow.viewport+2,size.name+": unwanted horizontal overflow "+JSON.stringify(overflow));
   assert.deepEqual(errors,[],size.name+" browser JS exceptions");
   await page.goto(origin+"/#care-journey",{waitUntil:"networkidle"});
   await page.locator("#workspace .e2e-grid").waitFor();
   await page.screenshot({path:path.join(dest,"patient-journey-"+size.name+".png"),fullPage:true});
   const journeyOverflow=await page.evaluate(()=>({page:document.documentElement.scrollWidth,viewport:window.innerWidth}));
   assert.ok(journeyOverflow.page<=journeyOverflow.viewport+2,size.name+": journey overflow "+JSON.stringify(journeyOverflow));
   assert.deepEqual(errors,[],size.name+" JS exceptions after journey");
   await context.close();
   process.stdout.write("PASS Chromium "+size.name+" ("+size.width+"x"+size.height+"), six roles, nursing, LIS, pharmacy, cashier, screenshots\n");
  }
  console.log("All browser responsive smoke tests passed.");
 }finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve));}
})().catch(err=>{console.error(err);process.exitCode=1;});
