# ag-packer
Compression for flat graphing data. Assumes that data is an array of objects with numeric values.

Scripts
-----
`npm run-script prime` primes the data folder with test data files.

`npm run-script tokens` generates the valid tokens used in packing/unpacking.

`npm run-script test` runs the unit tests.

`npm run-script perf` runs the performance tests.

`npm run-script start` runs the unit tests and perf tests.

Goals
-----
- data starts as json
- keys must be strings
- values must be numbers
- small output
- fast
- valid utf8

Ideas welcome on how to improve the speed and/or compression
