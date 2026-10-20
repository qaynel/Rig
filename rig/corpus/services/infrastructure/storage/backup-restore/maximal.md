# infrastructure.storage.backup-restore — maximal

Schedule backups and independent restoration tests together. Successful backup creation cannot prove that the stored data can be recovered.

Grade: maximal. Assurance remains Policy grade. Native checks validate declared configuration only; they do not establish repository behavior or a replayable evidence receipt. Binding checks: backup-restore-source-code-boundary, backup-restore-storage-context, backup-restore-evidence-receipt.

The maximal policy predicates evaluate the declared configuration fields. Record the result and any observed repository evidence separately; this service does not issue or verify a replayable receipt.

Acceptance target: policy:infrastructure.storage.backup-restore:maximal:backup-restore-source-code-boundary+backup-restore-storage-context+backup-restore-evidence-receipt.

Declared predicates: backup-restore-source-code-boundary: `backup_schedule` is nonempty (a string or array); backup-restore-storage-context: `restore_test_schedule` is nonempty (a string or array); backup-restore-evidence-receipt: `backup_without_restore_test` equals false.
