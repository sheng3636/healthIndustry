<template>
  <div class="bottomMain">
    <div class="mainLeft">
      <div class="firstDiv">
        <h3 class="divTitle">园区分布及年度产值</h3>
        <div id="leftChart"></div>
      </div>
      <div class="secondDiv">
        <h3 class="divTitle">
          <i>园区列表</i>
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
            <el-pagination :current-page.sync="currentPage" :page-sizes="[10]" :page-size="10"
              layout="total, prev, pager, next, jumper" :total="total" @current-change="handleCurrentChange" />
          </div>
        </div>
      </div>
    </div>
    <div class="mainRight">
      <div class="centerTop">
        <span class="title">园区平台分布</span>
        <el-select class="selectWidth" size="small" v-model="cityVal" value-key="cityName" @change="search('city')"
          placeholder="请选择城市">
          <el-option v-for="item in cityOpts" :key="item.value.cityName" :label="item.cityName" :value="item.value">
          </el-option>
        </el-select>
        <el-select class="selectWidth" v-model="projectVal" size="mini" @change="projectType">
          <el-option v-for="item in projectOpts" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <el-select class="selectWidth" v-model="yearVal" size="mini" placeholder="请选择年份" @change="otherSearch">
          <el-option v-for="item in yearOpts" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div id="mapWrap"></div>
    </div>
  </div>
</template>
<script>
import { parkAreaOutputApi, parkTableApi } from '@/api/api'
import {mapMixin} from '@/config/mixin.js'
import echarts from 'echarts'
import 'echarts-gl'
export default {
  mixins: [mapMixin],
  data() {
    return {
      total: null,
      currentPage: 0,
      locatiionParams: {
        year: '',
        year:''
      },
      params: {
        name: '',
        year:'',
        type:'',
        pageNo: 1
      },
      tableVal: '',

      projectVal: 'YQPT',
      projectOpts: [
        {
          value: 'YQPT',
          label: '园区平台'
        },
        {
          value: 'TSXZ',
          label: '特色小镇'
        },
        {
          value: 'ZDQY',
          label: '重点企业'
        },
        {
          value: 'ZDXM',
          label: '重点项目'
        },
        {
          value: 'QYSMJKGC',
          label: '千亿生命健康工程'
        },
        {
          value: 'SZDCYXM',
          label: '省重点产业项目'
        }
      ],
      investDetailData: {
        totalMoney: 140,
        chartData: [
          { value: 20, name: '杭州' },
          { value: 50, name: '宁波' },
          { value: 15, name: '嘉兴' },
          { value: 25, name: '绍兴' },
          { value: 20, name: '金华' },
          { value: 35, name: '丽水' },
          { value: 30, name: '温州' },
          { value: 40, name: '台州' },
          { value: 35, name: '衢州' },
          { value: 30, name: '湖州' },
          { value: 40, name: '舟山' }
        ]
      },
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
    this.parkAreaOutputApiFn()
    this.getParkTableFn()
  },
  watch: {
    tableVal(val) {
      this.getParkTableFn(this.tableVal)
    }
  },
  methods: {
    projectType(){
      this.getParkTableFn()
    this.parkAreaOutputApiFn()
    },
    otherSearch() {
      this.getParkTableFn()
      this.parkAreaOutputApiFn()
      this.district.setLevel('city') // 行政区级别
      this.district.setExtensions('all')
      // 行政区查询
      // 按照adcode进行查询可以保证数据返回的唯一性
      this.district.search(this.cityVal.cityCode, (status, result) => {
        if (status === 'complete') {
          this.getData(result.districtList[0], 'city', this.cityVal.cityCode)
        }
      })
    },
    // 查询园区分布分布及年度产值数据
    parkAreaOutputApiFn(){
      this.locatiionParams.year = this.yearVal
      this.locatiionParams.type = this.projectVal
      parkAreaOutputApi(this.locatiionParams).then(res => {
        this.leftChartFn(res.data.data)
      })
    },
    // 查询园区列表数据
    getParkTableFn() {
      this.params.year = this.yearVal
      this.params.type = this.projectVal
      this.params.name = this.tableVal
      parkTableApi(this.params).then(res => {
        this.total = res.data.total
        this.tableData = res.data.data
        console.log(this.tableData)
      })
    },
    // 园区分布及年度产值
    leftChartFn(data) {
      console.log(data)
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
        legend: {
          top: '2%',
          right: '4%',
          textStyle: {
            fontSize: '16px',
            color: '#fff'
          },
          data: [data.numName, data.valueName]
        },
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
            name: data.numName,
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
            name: data.valueName,
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
      this.getParkTableFn(this.params)
    }
  }
}
</script>
<style lang="scss" scoped>
@import './baseData.scss';
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