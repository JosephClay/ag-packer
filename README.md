# ag-packer
Compression for flat graphing data. Assumes that data is an array of objects with numeric values.

Scripts
-----
`npm run-script prime` primes the data folder with test data files.

`npm run-script tokens` generates the valid tokens used in packing/unpacking.

`npm run-script test` runs the unit tests.

`npm run-script perf` runs the performance tests.

`npm run-script start` runs the unit tests and perf tests.

`npm run-script uniq` generates a file with invalid utf8 character codes. This will take a while.

`npm run-script base32` generates a file with base32 encoded numbers from 0 to 2M.

Goals
-----
Data starts as json. Keys must be strings, values must be numbers. Must maintain sort order.
- small output
- fast
- valid utf8

Ideas welcome on how to improve the speed and/or compression
