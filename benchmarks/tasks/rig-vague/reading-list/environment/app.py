import json,sys

def unique(titles): return titles
if __name__=='__main__': print(json.dumps(unique(json.load(sys.stdin))))
