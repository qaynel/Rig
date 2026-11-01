import json,sys

def arrange(items): return items
if __name__=='__main__': print(json.dumps(arrange(json.load(sys.stdin))))
