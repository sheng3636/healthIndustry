import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
const DataOverview = r => require.ensure([], () => r(require('@/views/dataOverview/dataOverview')))

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/dataOverview'
    },
    {
      path: '/dataOverview',
      name: 'DataOverview',
      component: DataOverview
    }
  ]
})
