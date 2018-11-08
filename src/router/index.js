import Vue from 'vue'
import Router from 'vue-router'
import Category from '@/pages/Category'
import Article from '@/pages/Article'
import User from '@/pages/User'
import Homepage from '@/pages/Homepage'



Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/Category',
      component: Category
    },{
      path: '/Article',
      component: Article
    },{
      path: '/User',
      component: User
    },{
      path: '/Homepage',
      component: Homepage,
      
    },
  ]
})
