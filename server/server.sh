#!/bin/sh

echo "$NODE_ENV"
npm i
if [ -z "$NODE_ENV" -o "$NODE_ENV" = "dev"  ]
then
    npm run start:dev
elif [ "$NODE_ENV" = "prod" ]
then
    npm run build
    cd dist
    node main.js
elif [ "$NODE_ENV" = "test" ]
then
    npm run test
fi
# npm run build
# cd dist
# node main.js