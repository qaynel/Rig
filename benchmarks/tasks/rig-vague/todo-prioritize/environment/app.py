import json,sys

def organize(items): return items
if __name__=='__main__': print(json.dumps(organize(json.load(sys.stdin))))
