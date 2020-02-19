import {
  fetch
}
from '@/config/axios'
// 查询省健康产业分布
export const industryDistributionApi = (json) => fetch('/api/dCompanyInfo/industryDistribution', json)
// 查询省健康企业产业情况
export const healthDetailApi = () => fetch('/api/dCompanyInfo/companySituation')
// 查询省内产业投融资
export const investApi = () => fetch('/api/dCompanyInfo/queryInvestment')
// 查询省内投资情况
export const investDetailApi = () => fetch('/api/dCompanyInfo/queryInvestmentByCity')
// 查询省健康产业总产出
export const healthOutputApi = () => fetch('/api/dCompanyInfo/queryProduction')
// 查询省健康产业历年产值增量
export const healthIncrementApi = () => fetch('/api/dCompanyInfo/queryProdIncrement')
// 查询省各地市健康产业总产出
export const healthLocationOutputApi = () => fetch('/api/dCompanyInfo/queryProductionByCity')


// 分地区查询医疗人员、床位数量 地图数据
export const doctorNurseBedMapApi = (json) => fetch('/api/themeInfo/medicalDistribution', json)
// 查询省历年医疗人员、床位数量
export const personBedApi = () => fetch('/api/themeInfo/queryMedicalNum')
// 查询省历年医疗人员、床位数量
export const personBedThousandApi = () => fetch('/api/themeInfo/queryNumPerThousand')
// 查询分地区医疗人员、床位数量
export const doctorNurseBedApi = () => fetch('/api/themeInfo/queryNumByCity')
