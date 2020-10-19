# git使用  
登录git，拉取代码  
* git config --global user.name "用户名"  
* git config --global user.email "邮箱"  
* 创建本地仓库，新建文件夹，右键git bash here  
* git init初始化  
* git remote add origin (远程仓库地址)  
提交代码  
`git add .`  
`git commit -m "注释"`  
`git pull`  
`git push`  

分支处理  
* 查看所有分支： `git branch -a`  
* 创建分支： `git branch 分支名`  
* 切换分支： `git checkout 分支名`  
* 合并分支： `git merge`/`git rebase`  
* 删除分支： `git push origin --delete 分支名`  
* 覆盖分支：  
例如：分支aaa覆盖master分支  
首先切换到master分支，执行`git reset --hard origin/aaa`;  
此时master(本地)分支的代码已被覆盖，再执行`git push -f`推送到远程分支  

