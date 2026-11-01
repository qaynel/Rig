import csv,sys
from datetime import date
def run(path):
 counts={}
 with open(path,newline='') as f:
  for row in csv.DictReader(f):
   month=date.fromisoformat(row['date']).strftime('%Y-%m'); counts[month]=counts.get(month,0)+1
 return dict(sorted(counts.items()))
if __name__=='__main__': import json; print(json.dumps(run(sys.argv[1])))
