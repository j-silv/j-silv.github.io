# might have to type in 'runas' in powershell command prompt
# to get admin permission to run powershell scripts

# or run a powershell with this command:
# Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
# then npm run deploy

# build
npm run build

# navigate into the build output directory
cd docs

# if you are deploying to a custom domain
echo 'www.justin-silver.com' > CNAME

# go back to source folder
cd ../

# deploy to gitlab page
git add -A
git commit -a -m"deployment" 
git push
