import json,sys

def unique(titles):
 seen=set(); out=[]
 for title in titles:
  key=title.strip().casefold()
  if key and key not in seen: seen.add(key); out.append(title.strip())
 return out
if __name__=='__main__': print(json.dumps(unique(json.load(sys.stdin))))
