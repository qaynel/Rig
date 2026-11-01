import json,sys

def normalize(names): return names
if __name__=='__main__': print(json.dumps(normalize(json.load(sys.stdin))))
