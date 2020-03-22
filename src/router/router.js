import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
const DataOverview = r => require.ensure([], () => r(require('@/views/dataOverview/dataOverview')))
const BaseData = r => require.ensure([], () => r(require('@/views/baseData/baseData')))
const Characteristic = r => require.ensure([], () => r(require('@/views/characteristic/characteristic')))
const Hospital = r => require.ensure([], () => r(require('@/views/characteristic/components/hospital/hospital')))
const NursingInstitution = r => require.ensure([], () => r(require('@/views/characteristic/components/nursingInstitution/nursingInstitution')))
const MedicalInstitution = r => require.ensure([], () => r(require('@/views/characteristic/components/medicalInstitution/medicalInstitution')))
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
      path: '/characteristic',
      name: 'Characteristic',
      redirect: '/characteristic/hospital',
      component: Characteristic,
      children: [
        {
          path: 'hospital',
          name: 'Hospital',
          component: Hospital
        },
        {
          path: 'nursingInstitution',
          name: 'NursingInstitution',
          component: NursingInstitution
        },
        {
          path: 'medicalInstitution',
          name: 'MedicalInstitution',
          component: MedicalInstitution
        }
      ]
    },
    {
      path: '/solution',
      name: 'Solution',
      component: Solution,
      meta: {
        whichApi: 'solution'
      }
    }
  ]
})
