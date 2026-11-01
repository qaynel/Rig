import json,sys
from decimal import Decimal,ROUND_DOWN

def split(data):
 cents=int((Decimal(str(data['total']))*100).quantize(Decimal('1'))); n=int(data['people'])
 if n<1: raise ValueError('people must be positive')
 q,r=divmod(cents,n); return [f'{(q+(i<r))/100:.2f}' for i in range(n)]
if __name__=='__main__': print(json.dumps(split(json.load(sys.stdin))))
