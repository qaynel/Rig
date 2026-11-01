import csv,sys
from decimal import Decimal
def run(path):
 totals={}
 with open(path,newline='') as f:
  for r in csv.DictReader(f): totals[r['day']]=totals.get(r['day'],Decimal(0))+Decimal(r['amount'])
 return {k:float(v) for k,v in sorted(totals.items())}
if __name__=='__main__': import json; print(json.dumps(run(sys.argv[1])))
