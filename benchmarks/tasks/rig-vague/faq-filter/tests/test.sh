#!/bin/sh
set -u
mkdir -p /logs/verifier
if TASK_APP=/app/app.py TASK_ENV=/app PYTHONPATH=/tests python3 -c "import test_outputs; [getattr(test_outputs,n)() for n in dir(test_outputs) if n.startswith('test_')]"; then echo 1 > /logs/verifier/reward.txt; else echo 0 > /logs/verifier/reward.txt; exit 1; fi
