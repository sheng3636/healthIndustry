import {
  fetch
}
from '@/config/axios'
// 查询省健康产业分布
export const industryDistributionApi = (json) => fetch('dCompanyInfo/industryDistribution', json)
// 查询省健康企业产业情况
export const healthDetailApi = (json) => fetch('dCompanyInfo/companySituation', json)
// 查询省内产业投融资
export const investApi = (json) => fetch('dCompanyInfo/queryInvestment', json)
// 查询省内投资情况
export const investDetailApi = (json) => fetch('dCompanyInfo/queryInvestmentByCity', json)
// 查询省健康产业总产出
export const healthOutputApi = (json) => fetch('dCompanyInfo/queryProduction', json)
// 查询省健康产业历年产值增量
export const healthIncrementApi = (json) => fetch('dCompanyInfo/queryProdIncrement', json)
// 查询省各地市健康产业总产出
export const healthLocationOutputApi = (json) => fetch('dCompanyInfo/queryProductionByCity', json)

// 查询园区分布及年度产值
export const parkAreaOutputApi = (json) => fetch('business/oneHealth/statistics1', json)
// 查询园区列表
export const parkTableApi = (json) => fetch('business/oneHealth/statistics2', json)


// 分地区查询医疗人员、床位数量 地图数据
export const doctorNurseBedMapApi = (json) => fetch('themeInfo/medicalDistribution', json)
// 查询省历年医疗人员、床位数量
export const personBedApi = () => fetch('themeInfo/queryMedicalNum')
// 查询省历年医疗人员、床位数量
export const personBedThousandApi = () => fetch('themeInfo/queryNumPerThousand')
// 查询分地区医疗人员、床位数量
export const doctorNurseBedApi = () => fetch('themeInfo/queryNumByCity')
