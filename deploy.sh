#!/usr/bin/env sh

# admin rights
chmod +x ./deploy.sh

# abort on errors
set -e

# build
npm run build

# navigate into the build output directory
# cd dist

# if you are deploying to a custom domain
# echo 'www.example.com' > CNAME

# git init
# git add -A
# git commit -m 'deploy'

# deploy to gitlab page
git push

cd -