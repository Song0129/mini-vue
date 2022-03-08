b="main"
br=`git branch | grep "*"`
branch=${br/* /}
if [ "$b" != "$branch" ]
then
echo "当前分支不正确！！！"
else
git pull origin main
git add .
git commit -m 'update'
git push origin main
fi
