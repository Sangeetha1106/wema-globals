#!/usr/bin/env python3
"""Compile tools/translations/<code>.txt (lines 'index|translation', index into strings.frozen.json)
into assets/lang/<code>.js, a dictionary of English text -> translation."""
import json, os, re, sys
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0,os.path.join(ROOT,'tools'))
from skip import SKIP
S=json.load(open(os.path.join(ROOT,'tools','strings.frozen.json')))
os.makedirs(os.path.join(ROOT,'assets','lang'),exist_ok=True)
need=[i for i in range(len(S)) if i not in SKIP]
for code in 'es fr de pt it nl pl ru uk sv el ro'.split():
    d={}
    for line in open(os.path.join(ROOT,'tools','translations',code+'.txt'),encoding='utf-8'):
        line=line.rstrip('\n')
        if not line: continue
        i,t=line.split('|',1); i=int(i)
        assert i not in SKIP and i<len(S), (code,i)
        d[re.sub(r'\s+',' ',S[i]).strip()]=t.strip()
    miss=[i for i in need if re.sub(r'\s+',' ',S[i]).strip() not in d]
    if miss: print(code,'MISSING',miss)
    js='/* WEMA Global — '+code+' translations (English text -> translation). Review with a native speaker before launch. */\nwindow.WEMA_I18N=window.WEMA_I18N||{};window.WEMA_I18N["'+code+'"]='+json.dumps(d,ensure_ascii=False,indent=0)+';\n'
    open(os.path.join(ROOT,'assets','lang',code+'.js'),'w',encoding='utf-8').write(js)
    print(code,len(d))
