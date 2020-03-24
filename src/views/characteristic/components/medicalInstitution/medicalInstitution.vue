<template>
  <div class="bottomMain">
    <div class="mainLeft">
      <div class="firstDiv">
        <h3 class="divTitle">医疗机构分布</h3>
        <div id="leftChart"></div>
      </div>
      <div class="secondDiv">
        <h3 class="divTitle">
          <i>医疗机构列表</i>
          <el-input placeholder="请输入内容" size="mini" v-model="tableVal" style="width:200px">
            <i slot="suffix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </h3>
        <div class="tableWrap">
          <el-table :data="tableData" border fit>
            <el-table-column type="index" width="65" label="序号" align="center" />
            <el-table-column prop="name" label="园区名称" :show-overflow-tooltip="true" align="center" sortable />
            <el-table-column prop="annualValue" label="年度总产值/万元" width="150" align="center" sortable />
          </el-table>
          <!--分页-->
          <div class="paginationWrap">
            <el-pagination :current-page.sync="currentPage" :pager-count="4" :page-sizes="[10]" :page-size="10"
              layout="total, prev, pager, next, jumper" :total="total" @current-change="handleCurrentChange" />
          </div>
        </div>
      </div>
    </div>
    <div class="mainCenter">
      <div class="centerTop">
        <span class="title">医疗机构分布</span>
        <el-select class="selectWidth" v-model="params.year" size="mini" @change="otherSearch">
          <el-option v-for="item in yearOpts" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div id="mapWrap"></div>
    </div>
    <div class="mainRight">
      <div class="firstDiv">
        <h3 class="divTitle"><i>各地市医院占比</i></h3>
        <div id="healthOutputChart"></div>
      </div>
      <div class="secondDiv">
        <h3 class="divTitle"><i>各地市诊所占比</i></h3>
        <div id="healthIncrementChart"></div>
      </div>
    </div>
  </div>
</template>
<script>
import geoJson from '../../../../../static/js/zheJiang.json'
import { medicalInstitutionMapApi, medicalInstitutionLocationApi, medicalInstitutionListApi,hospitalClinicApi } from '@/api/api'
import { mapMixin } from '@/config/mixin.js'
import echarts from 'echarts'
import 'echarts-gl'
export default {
  mixins: [mapMixin],
  data() {
    return {
      geoJson: geoJson,
      total: null,
      currentPage: 0,
      yearOpts: [
        {
          value: '2017',
          label: '2017'
        },
        {
          value: '2018',
          label: '2018'
        },
        {
          value: '2019',
          label: '2019'
        },
        {
          value: '2020',
          label: '2020'
        }
      ],
      params: {
        name: '',
        year: '2017',
        pageNo: 1,
        type:41
      },
      tableVal: '',
      chartData: {
        xAxis: ['2014', '2015', '2016', '2017', '2018'],
        yAxis: [
          {
            name: '园区数量',
            value: [10, 52, 20, 33, 39]
          },
          {
            name: '园区总产值',
            value: [125, 440, 257, 195, 255]
          }
        ]
      },
      tableData: []
    }
  },
  mounted() {
    this.medicalInstitutionMapApiFn()
    this.medicalInstitutionLocationApiFn()
    this.medicalInstitutionListApi()
    this.hospitalClinicApiFn()
  },
  watch: {
    tableVal(val) {
      this.medicalInstitutionListApi(this.tableVal)
    }
  },
  methods: {
    otherSearch() {
      this.medicalInstitutionMapApiFn()
      this.medicalInstitutionLocationApiFn()
      this.medicalInstitutionListApi()
      this.hospitalClinicApiFn()
    },
    // 查询医疗机构地图数据
    medicalInstitutionMapApiFn() {
      medicalInstitutionMapApi(this.params).then(res => {
        this.zheJiangMap(geoJson, res.data)
      })
    },
    // 查询医疗机构分布及年度产值
    medicalInstitutionLocationApiFn() {
      medicalInstitutionLocationApi(this.params).then(res => {
        this.leftChartFn(res.data)
      })
    },
    // 查询医疗机构列表
    medicalInstitutionListApi() {
      this.params.name = this.tableVal
      medicalInstitutionListApi(this.params).then(res => {
        this.total = res.data.total
        this.tableData = res.data.data
      })
    },
    // 获取各地市医院、诊所占比数据
    hospitalClinicApiFn() {
      hospitalClinicApi(this.params).then(res => {
        this.hospitalCliniChartFn('healthOutputChart',res.data.clinicData)
        this.hospitalCliniChartFn('healthIncrementChart',res.data.hospitalData)
      })
    },
    // 园区分布及年度产值
    leftChartFn(data) {
      let charts = this.$echarts.init(document.getElementById('leftChart'))
      let option = {
        color: ['#3398DB'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        // legend: {
        //   top: '2%',
        //   right: '4%',
        //   textStyle: {
        //     fontSize: '16px',
        //     color: '#fff'
        //   },
        //   data: [data.numName, data.valueName]
        // },
        grid: {
          left: '5%',
          right: '5%',
          bottom: '5%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: data.city,
            axisLabel: {
              interval: 0,
              rotate: 0
            },
            axisTick: {
              alignWithLabel: true
            },
            axisLabel: {
              interval: 0,
              rotate: 40
            },
            axisLine: {
              lineStyle: {
                type: 'solid',
                color: '#B1B1B1' // 左边线的颜色
              }
            }
          }
        ],
        yAxis: [
          {
            name: '园区数量',
            type: 'value',
            min: 0,
            max: 100,
            interval: 20,
            axisLine: {
              lineStyle: {
                type: 'solid',
                color: '#B1B1B1' // 左边线的颜色
              }
            }
          },
          {
            name: '园区总产值',
            type: 'value',
            min: 0,
            max: 2000000,
            interval: 400000,
            axisLine: {
              lineStyle: {
                type: 'solid',
                color: '#B1B1B1' // 左边线的颜色
              }
            }
          }
        ],
        series: [
          {
            // name: data.numName,
            type: 'bar',
            barWidth: '10px',
            barGap: '50%',
            itemStyle: {
              normal: {
                barBorderRadius: [5, 5, 0, 0],
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: 'rgba(244, 132, 121, 1)'
                  },
                  {
                    offset: 1,
                    color: 'rgba(244, 132, 121, 0.1)'
                  }
                ])
              }
            },
            data: data.num
          },
          {
            // name: data.valueName,
            type: 'bar',
            yAxisIndex: 1,
            barWidth: '10px',
            barGap: '50%',
            itemStyle: {
              normal: {
                barBorderRadius: [5, 5, 0, 0],
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: 'rgba(255, 195, 0, 1)'
                  },
                  {
                    offset: 1,
                    color: 'rgba(255, 195, 0, 0.1)'
                  }
                ])
              }
            },
            data: data.outputValue
          }
        ]
      }
      charts.setOption(option)
    },
    handleCurrentChange(val) {
      this.params.pageNo = val
      this.medicalInstitutionListApi(this.params)
    },
    // 各地市医院、诊所占比chart
    hospitalCliniChartFn(id,data) {
      let legends = []
      let total = 0
      for (let item of data.values()) {
        legends.push(item.name)
        total += item.value
      }
      
      console.log(legends)
      let charts = this.$echarts.init(
        document.getElementById(id)
      )
      let option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          type: 'scroll',
          orient: 'vertical',
          right: '5%',
          top: '2%',
          bottom: '2%',
          textStyle: {
            fontSize: '16',
            color: '#fff'
          },
          pageIconColor: '#fff',
          pageIconInactiveColor: '#333',
          pageIconSize: '10',
          pageTextStyle: {
            color: '#fff'
          },
          formatter: function(name) {
            let percent = ''
            let target = null
            for (let i = 0; i < data.length; i++) {
              if (data[i].name === name) {
                percent = data[i].value
              }
            }
            if (total === 0) {
              target = 0
            } else {
              target = (percent / total) * 100
            }
            return name + ' ' + target.toFixed(1) + '%'
          },
          data: legends
        },
        series: [
          {
            name: '省各地市投资占比',
            type: 'pie',
            radius: [125, 20],
            center: ['45%', '50%'],
            roseType: 'radius',
            label: {
              show: false
            },
            emphasis: {
              label: {
                show: false
              }
            },
            data: data
          }
        ]
      }
      charts.setOption(option)
    }    
  }
}
</script>
<style lang="scss" scoped>
@import './medicalInstitution.scss';
</style>
<style lang="scss">
.tableWrap {
  .el-table--border,
  .el-table--group {
    background: transparent !important;
  }
  .el-table th,
  .el-table tr {
    background-color: transparent !important;
  }
  .el-table td,
  .el-table th {
    padding: 8px 0;
  }
  .el-table td,
  .el-table th.is-leaf,
  .el-table--border,
  .el-table--group {
    border-color: #12296c;
  }
  .el-table--border::after,
  .el-table--group::after,
  .el-table::before {
    background-color: #12296c;
  }
}
</style>