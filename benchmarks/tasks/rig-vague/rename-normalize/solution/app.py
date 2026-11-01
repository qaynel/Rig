import json,re,sys,unicodedata

def normalize(names):
 out=[]; used=set()
 for name in names:
  stem,suffix=(name.rsplit('.',1)+[''])[:2] if '.' in name else (name,'')
  slug=unicodedata.normalize('NFKD',stem).encode('ascii','ignore').decode().lower(); slug=re.sub(r'[^a-z0-9]+','-',slug).strip('-') or 'file'
  ext='.'+suffix.lower() if suffix else ''; base=slug; n=2
  while slug+ext in used: slug=f'{base}-{n}'; n+=1
  used.add(slug+ext); out.append(slug+ext)
 return out
if __name__=='__main__': print(json.dumps(normalize(json.load(sys.stdin))))
