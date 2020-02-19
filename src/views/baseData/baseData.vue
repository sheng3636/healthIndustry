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
          <el-table :data="projectData" border fit>
            <el-table-column type="index" width="65" label="序号" align="center" />
            <el-table-column prop="parkName" label="园区名称" align="center" sortable />
            <el-table-column prop="parkTotalMoney" label="年度总产值/万元" width="220" align="center" sortable />
          </el-table>
          <!--分页-->
          <div class="paginationWrap">
            <el-pagination :current-page.sync="currentPage" :page-sizes="[10]" :page-size="10"
              layout="total, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
              @current-change="handleCurrentChange" />
          </div>
        </div>
      </div>
    </div>
    <div class="mainRight">
      <div class="centerTop">
        <span class="title">园区平台分布</span>
        <el-select class="selectWidth" v-model="projectVal" size="mini" placeholder="请选择区域">
          <el-option v-for="item in projectOpts" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <el-select class="selectWidth" v-model="yearVal" size="mini" placeholder="请选择年份">
          <el-option v-for="item in yearOpts" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div id="mapWrap"></div>
    </div>
  </div>
</template>
<script>
import geoJson from '../../../static/js/zheJiang.json'
import echarts from 'echarts'
import 'echarts-gl'
export default {
  data() {
    return {
      projectVal: '0',
      yearVal: '0',
      projectOpts: [
        {
          value: '0',
          label: '园区平台'
        },
        {
          value: '1',
          label: '特色小镇'
        },
        {
          value: '2',
          label: '重点企业'
        },
        {
          value: '3',
          label: '重点项目'
        },
        {
          value: '4',
          label: '千亿生命健康工程'
        },
        {
          value: '5',
          label: '省重点产业项目'
        }
      ],
      yearOpts: [
        {
          value: '0',
          label: '2019'
        },
        {
          value: '1',
          label: '2020'
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
      total: 8,
      currentPage: 0,
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
      projectData: [
        {
          parkName: '新昌高新技术产业园区 ',
          parkTotalMoney: '130'
        },
        {
          parkName: '新昌高新技术产业园区 ',
          parkTotalMoney: '130'
        },
        {
          parkName: '新昌高新技术产业园区 ',
          parkTotalMoney: '130'
        },
        {
          parkName: '新昌高新技术产业园区 ',
          parkTotalMoney: '130'
        },
        {
          parkName: '新昌高新技术产业园区 ',
          parkTotalMoney: '130'
        },
        {
          parkName: '新昌高新技术产业园区 ',
          parkTotalMoney: '130'
        },
        {
          parkName: '新昌高新技术产业园区 ',
          parkTotalMoney: '130'
        },
        {
          parkName: '新昌高新技术产业园区 ',
          parkTotalMoney: '130'
        },
        {
          parkName: '新昌高新技术产业园区 ',
          parkTotalMoney: '130'
        },
        {
          parkName: '新昌高新技术产业园区 ',
          parkTotalMoney: '130'
        }
      ]
    }
  },
  mounted() {
    this.leftChart(this.chartData)
    this.zheJiangMap(geoJson, this.investDetailData.chartData)
  },
  methods: {
    // 浙江省份地图
    zheJiangMap(dataJson, data) {
      let myChart = this.$echarts.init(document.getElementById('mapWrap'))
      myChart.showLoading()
      echarts.registerMap('zhejiang', dataJson)
      myChart.hideLoading()
      let geoCoordMap = {
        杭州: [120.209947, 30.245853],
        宁波: [121.6216, 29.859515],
        嘉兴: [120.750865, 30.762653],
        绍兴: [120.582112, 29.997117],
        金华: [119.649506, 29.089524],
        丽水: [119.921786, 28.451993],
        温州: [120.672111, 28.000575],
        台州: [121.428599, 28.661378],
        衢州: [118.87263, 28.941708],
        湖州: [120.102398, 30.867198],
        舟山: [122.106863, 30.016028]
      }

      let convertData = function(sourse) {
        let res = []
        for (let i = 0; i < sourse.length; i++) {
          let geoCoord = geoCoordMap[sourse[i].name]
          if (geoCoord) {
            res.push({
              name: sourse[i].name,
              value: geoCoord.concat(sourse[i].value)
            })
          }
        }
        return res
      }

      let option = {
        tooltip: {
          show: false
        },
        geo: {
          show: true,
          map: 'zhejiang',
          zoom: 1.2,
          roam: true,
          label: {
            normal: {
              show: false
            },
            emphasis: {
              show: false,
              textStyle: {
                color: '#fff'
              }
            }
          },
          itemStyle: {
            normal: {
              areaColor: '#0d3145', // 地图背景颜色
              borderColor: '#0ff' // 地图边界颜色
            },
            emphasis: {
              show: false,
              areaColor: '#0d3145', // 鼠标经过地图背景颜色
              color: '#ddd'
            }
          }
        },
        series: [
          {
            name: 'credit_pm2.5',
            type: 'scatter',
            coordinateSystem: 'geo',
            data: convertData(data),
            symbolSize: 5,
            label: {
              normal: {
                formatter: '{b}',
                position: 'right',
                show: true
              }
            },
            itemStyle: {
              normal: {
                color: '#fff'
              }
            }
          },
          {
            type: 'map',
            map: 'zhejiang',
            geoIndex: 0,
            aspectScale: 3, // 长宽比
            showLegendSymbol: false, // 存在legend时显示
            label: {
              normal: {
                show: false
              },
              emphasis: {
                show: false,
                textStyle: {
                  color: '#fff'
                }
              }
            },
            roam: true,
            itemStyle: {
              normal: {
                areaColor: '#031525',
                borderColor: '#3B5077'
              },
              emphasis: {
                areaColor: '#2B91B7'
              }
            },
            animation: false,
            data: data
          },
          {
            // 水滴
            name: '点',
            type: 'scatter',
            coordinateSystem: 'geo',
            symbol: 'pin',
            symbolSize: [50, 50],
            label: {
              normal: {
                show: true,
                textStyle: {
                  color: '#fff',
                  fontSize: 9
                },
                formatter(value) {
                  return value.data.value[2]
                }
              }
            },
            itemStyle: {
              normal: {
                color: '#D8BC37' // 标志颜色
              }
            },
            zlevel: 6,
            data: convertData(data)
          }
        ]
      }
      myChart.setOption(option)
    },
    // 园区分布及年度产值
    leftChart(data) {
      let legends = []
      for (let item of data.yAxis.values()) {
        legends.push(item.name)
      }
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
          data: legends
        },
        grid: {
          left: '5%',
          right: '5%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: data.xAxis,
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
            max: 25,
            interval: 5,
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
            max: 250,
            interval: 50,
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
            name: '园区数量',
            type: 'bar',
            barWidth: '10px',
            barGap: '50%',
            itemStyle: {
              normal: {
                barBorderRadius: [5,5,0,0],
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
            data: data.yAxis[0].value
          },
          {
            name: '园区总产值',
            type: 'bar',
            yAxisIndex: 1,
            barWidth: '10px',
            barGap: '50%',
            itemStyle: {
              normal: {
                barBorderRadius: [5,5,0,0],
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
            data: data.yAxis[1].value
          }
        ]
      }
      charts.setOption(option)
    },
    handleSizeChange(val) {
      // this.params.pageSize = val
      // this.getAreaList(this.params)
    },
    handleCurrentChange(val) {
      // this.params.page = val
      // this.getAreaList(this.params)
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