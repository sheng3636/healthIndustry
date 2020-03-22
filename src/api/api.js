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
// 查询地图分布
export const mapDataApi = (json) => fetch('business/oneHealth/statisticsDistribution', json)


// 分地区查询医疗人员、床位数量 地图数据
export const doctorNurseBedMapApi = (json) => fetch('themeInfo/medicalDistribution', json)
// 查询省历年医疗人员、床位数量
export const personBedApi = (json) => fetch('themeInfo/queryMedicalNum',json)
// 查询省历年医疗人员,床位每千人数 
export const personBedThousandApi = (json) => fetch('themeInfo/queryNumPerThousand', json)
// 查询省各地市医生人数占比、省各地市护士人数占比、省各地市床位占比
export const doctorNurseBedApi = (json) => fetch('themeInfo/queryNumByCity', json)


// 医疗机构、养老机构分布及年度产值
export const medicalInstitutionLocationApi = (json) => fetch('institution/getInstAnnualValue', json)
// 医疗机构、养老机构列表
export const medicalInstitutionListApi = (json) => fetch('institution/getList', json)
// 医疗机构、养老机构地图数据
export const medicalInstitutionMapApi = (json) => fetch('institution/distribution', json)
// 各地市医院、诊所占比
export const hospitalClinicApi = (json) => fetch('institution/instProportion', json)


// 解决方案模块
// 本地获取-解决方案简报总数
export const getAmount = () => fetch('solution/getAmount')
// 本地获取-解决方案简报分页查询
export const querySolution = (json) => fetch('solution/querySolution', json)
// 本地获取-查询单个解决方案简报详情
export const querySolutionDetail = (json) => fetch('solution/querySolutionDetail', json)
// 全网获取-解决方案
export const searchKeyWord = (json) => fetch('solution/searchKeyWord', json)
// 自定义网址查询-解决方案
export const searchInUrls = (json) => fetch('solution/searchInUrls', json)