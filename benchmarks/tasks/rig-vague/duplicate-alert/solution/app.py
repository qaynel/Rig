import csv,sys
def duplicates(path):
 counts={}; display={}
 with open(path,newline='') as f:
  for row in csv.DictReader(f):
   value=row['email'].strip(); key=value.casefold()
   if key: counts[key]=counts.get(key,0)+1; display.setdefault(key,value)
 return sorted((display[k] for k,n in counts.items() if n>1),key=str.casefold)
if __name__=='__main__': import json; print(json.dumps(duplicates(sys.argv[1])))
