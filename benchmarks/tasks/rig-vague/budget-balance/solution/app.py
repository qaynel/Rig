import csv,sys
from decimal import Decimal
def run(path):
 with open(path,newline='') as f: rows=list(csv.DictReader(f))
 income=sum((Decimal(r['income']) for r in rows),Decimal(0)); spent=sum((Decimal(r['expense']) for r in rows),Decimal(0))
 return f'{income-spent:.2f}'
if __name__=='__main__': import json; print(json.dumps(run(sys.argv[1])))
