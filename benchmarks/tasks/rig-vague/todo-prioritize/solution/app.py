import json,sys

def organize(items): return sorted(items,key=lambda x:(-int(x['priority']),int(x['days_due']),x['name'].casefold()))
if __name__=='__main__': print(json.dumps(organize(json.load(sys.stdin))))
