module.exports = {
    title: '学习笔记',
    description: 'xcc的备忘笔记',
    themeConfig: {
        nav: [
            {text: '主页', link: '/'},
            {text: '笔记', link:'/front/'},
            // {text:'总结', link: '/about/'},
            {text:'Github', link: 'https://github.com/2xxxx'}
        ],
        sidebar: [
            {
                title: 'JavaScript基础',
                children: [
                    '/front/',
                    '/front/variable.md',
                    '/front/prototype.md',
                    '/front/scope.md',
                    '/front/ECMA.md',
                    '/front/this.md',
                ]
            },{
                title: '浏览器基础',
                children: [
                    '/browser/',
                    '/browser/event.md',
                    '/browser/crossDomain.md',
                    '/browser/storage.md',
                    '/browser/render.md',
                    '/browser/eventLoop.md'
                ]
            }, {
                title: '网络基础',
                children: [
                    '/network/',
                    '/network/OSI.md',
                    '/network/DNS.md',
                    '/network/TCPandUDP.md',
                    '/network/http.md'
                ]
            }

        ],
        
        sidebarDepth:2,
        lastUpdated: true

    }

}