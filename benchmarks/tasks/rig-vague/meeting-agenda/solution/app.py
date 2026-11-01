import json,sys

def arrange(items): return [x['topic'] for x in sorted(items,key=lambda x:(int(x['order']),x['topic'].casefold()))]
if __name__=='__main__': print(json.dumps(arrange(json.load(sys.stdin))))
