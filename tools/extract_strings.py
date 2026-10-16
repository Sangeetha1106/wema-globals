#!/usr/bin/env python3
"""Collect every English string the visitor can see (text, placeholder, alt, aria-label, title, meta description)
by rendering each built page in a headless browser. Output: tools/strings.json (ordered, de-duplicated)."""
import asyncio, glob, os, json, re
from playwright.async_api import async_playwright
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
JS="""() => {
 const out=[]; const norm=s=>s.replace(/\\s+/g,' ').trim();
 const tw=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
 while(tw.nextNode()){const n=tw.currentNode; const p=n.parentNode.nodeName; if(['SCRIPT','STYLE','NOSCRIPT','TEXTAREA'].includes(p))continue; const t=norm(n.nodeValue); if(t)out.push(t);}
 document.querySelectorAll('[placeholder],[alt],[aria-label],[title]').forEach(e=>['placeholder','alt','aria-label','title'].forEach(a=>{if(e.hasAttribute(a)){const t=norm(e.getAttribute(a)); if(t)out.push(t);}}));
 const t=document.title.split(' | ')[0]; out.push(norm(t));
 const m=document.querySelector('meta[name=description]'); if(m) out.push(norm(m.content));
 return out;}"""
async def main():
    seen={}; order=[]
    async with async_playwright() as p:
        b=await p.chromium.launch()
        for f in sorted(glob.glob(os.path.join(ROOT,'*.html'))):
            ctx=await b.new_context(viewport={'width':1440,'height':900}); pg=await ctx.new_page()
            await pg.goto('file://'+f+('?type=conference&amount=50&for=x' if 'thank-you' in f else '')); await pg.wait_for_timeout(700)
            for s in await pg.evaluate(JS):
                if re.search(r'[A-Za-z]{2}',s) and s not in seen: seen[s]=1; order.append(s)
            await ctx.close()
        await b.close()
    json.dump(order,open(os.path.join(ROOT,'tools','strings.json'),'w'),ensure_ascii=False,indent=0)
    print(len(order),'strings')
asyncio.run(main())
