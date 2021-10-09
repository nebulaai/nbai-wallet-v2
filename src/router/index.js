import Vue from 'vue'
import Router from 'vue-router'

//路由懒加载
const home = () => import("@/components/Home");
const dashboard = () => import("@/views/dashboard/index"); 
const main = () => import("@/views/dashboard/main/index");
const transfer = () => import("@/views/dashboard/transfer/index");
const details = () => import("@/views/dashboard/details/index");


Vue.use(Router)

export default new Router({
  // mode: 'history', // 后端支持可开
  mode: 'hash',
  routes: [
    {
        path: '/',
        redirect: '/dashboard'
    },
    {
        path: '/',
        component: home,
        children: [
            {
                path: '/dashboard',
                component: dashboard,
                children: [
                    {
                        path: '/',
                        redirect: '/dashboard/main'
                    },
                    {
                        path: '/dashboard/main',
                        name: 'main',
                        component: main
                    },
                    {
                        path: '/dashboard/transfer',
                        name: 'transfer',
                        component: transfer
                    },
                    {
                        path: '/dashboard/details/:address',
                        name: 'details',
                        component: details
                    }
                ]
            },
        ]
    },
    {
        path: '*',
        redirect: '/'
    }
  ]
})
const originalPush = Router.prototype.push
	Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}
