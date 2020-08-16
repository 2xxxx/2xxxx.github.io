module.exports = {
    title: '学习笔记',
    description: 'xcc的备忘笔记',
    themeConfig: {
        nav: [
            {text: '主页', link: '/'},
            {text: '笔记', 
                items: [
                    {text:'前端', link:'/front/'},
                    {text:'node', link: '/node/'}
                ]
            },
            // {text:'总结', link: '/about/'},
            {text:'Github', link: 'https://github.com/2xxxx'}
        ],
        sidebar: [
            {
                title: 'JavaScript基础',
                collapsable: false,
                children: [
                    '/front/',
                    '/front/variable.md',
                    '/front/prototype.md',
                    '/front/scope.md',
                    '/front/ECMA.md',
                ]
            }

        ],
        
        sidebarDepth:2,
        lastUpdated: true

    }

}