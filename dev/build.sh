#!/bin/bash
npm run build
rm -r ../static
mv build/* ..
rmdir build
