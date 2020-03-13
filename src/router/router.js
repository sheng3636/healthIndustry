import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
const DataOverview = r => require.ensure([], () => r(require('@/views/dataOverview/dataOverview')))
const BaseData = r => require.ensure([], () => r(require('@/views/baseData/baseData')))
const Features = r => require.ensure([], () => r(require('@/views/features/features')))
const Solution = r => require.ensure([], () => r(require('@/views/solution/solution')))

export default new Router({
  routes: [{
      path: '/',
      redirect: '/dataOverview'
    },
    {
      path: '/dataOverview',
      name: 'DataOverview',
      component: DataOverview,
      meta: {
        whichApi: 'dataOverview'
      }
    },
    {
      path: '/baseData',
      name: 'BaseData',
      component: BaseData,
      meta: {
        whichApi: 'dataOverview'
      }
    },
    {
      path: '/features',
      name: 'Features',
      component: Features,
      meta: {
        whichApi: 'features'
      }
    }, {
      path: '/solution',
      name: 'Solution',
      component: Solution,
      meta: {
        whichApi: 'solution'
      }
    }
  ]
})
