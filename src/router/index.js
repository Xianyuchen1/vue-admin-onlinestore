import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: 'Dashboard', icon: 'dashboard' }
    }]
  },

  {
    path: '/product-management',
    component: Layout,
    redirect: '/product-management/product',
    name: 'user-management',
    meta: {
      title: '商品管理',
      icon: 'shopping'
    },
    children: [
      {
        path: 'product',
        component: () => import('@/views/product-management/product/index'),
        name: 'product',
        meta: { title: '商品列表', icon: 'product-list' }
      },
      {
        path: 'category',
        component: () => import('@/views/product-management/category/index'),
        name: 'category',
        meta: { title: '分类管理', icon: 'product-cate' }
      },
      {
        path: 'proberty',
        component: () => import('@/views/product-management/category/components/categoryProperty'),
        name: 'proberty',
        meta: { title: '属性管理', icon: 'product-cate' },
        hidden: true
      },
      {
        path: 'categoryProduct',
        component: () => import('@/views/product-management/category/components/categoryProduct'),
        name: 'categoryProduct',
        meta: { title: '产品管理', icon: 'product-cate' },
        hidden: true
      }
    ]
  },

  {
    path: '/order-management',
    component: Layout,
    redirect: '/order-management/order',
    name: 'order-management',
    alwaysShow: true, // 一直显示根路由
    meta: {
      title: '订单管理',
      icon: 'order'
    },
    children: [
      {
        path: 'order',
        component: () => import('@/views/order-management/order/index'),
        name: 'order',
        meta: { title: '订单列表', icon: 'product-list' }
      },
      {
        path: 'orderInfo',
        component: () => import('@/views/order-management/order/components/orderInfo'),
        name: 'orderInfo',
        meta: { title: '订单详情', icon: '' },
        hidden: true
      }
    ]
  },

  {
    path: '/user-management',
    component: Layout,
    redirect: '/user-management/admin',
    name: 'user-management',
    meta: {
      title: '权限管理',
      icon: 'ums'
    },
    children: [
      {
        path: 'admin',
        component: () => import('@/views/user-management/admin/index'),
        name: 'admin',
        meta: { title: '管理员列表', icon: 'ums-admin' }
      },
      {
        path: 'user',
        component: () => import('@/views/user-management/user/index'),
        name: 'user',
        meta: { title: '用户列表', icon: 'user' }
      }
    ]
  },

  {
    path: 'external-link',
    component: Layout,
    children: [
      {
        path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
        meta: { title: 'External Link', icon: 'link' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
