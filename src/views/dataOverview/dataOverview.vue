<template>
  <div class="bottomMain">
    <div class="mainLeft">
      <div class="firstDiv">
        <h3 class="divTitle"><i>省健康产业情况</i></h3>
        <div id="healthDetailChart"></div>
      </div>
      <div class="secondDiv">
        <h3 class="divTitle"><i>省内产业投融资</i></h3>
        <div id="investChart"></div>
      </div>
      <div class="thirdDiv">
        <h3 class="divTitle"><i>省内投资情况-</i><span>{{investTotal}}万亿人民币</span></h3>
        <div id="investDetailChart"></div>
      </div>
    </div>
    <div class="mainCenter">
      <div class="centerTop">
        <span class="title">省健康产业分布</span>
        <el-select class="selectWidth" v-model="params.year" size="mini" @change="otherSearch">
          <el-option v-for="item in yearOpts" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div id="mapWrap"></div>
    </div>
    <div class="mainRight">
      <div class="firstDiv">
        <h3 class="divTitle"><i>省健康产业总产出</i></h3>
        <div id="healthOutputChart"></div>
      </div>
      <div class="secondDiv">
        <h3 class="divTitle"><i>省健康产业历年产值增量</i></h3>
        <div id="healthIncrementChart"></div>
      </div>
      <div class="thirdDiv">
        <h3 class="divTitle"><i>省各地市健康产业总产出-</i>{{outputTotal}}万亿人民币</h3>
        <div id="healthLocationOutputChart"></div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  industryDistributionApi,
  healthDetailApi,
  investApi,
  investDetailApi,
  healthOutputApi,
  healthIncrementApi,
  healthLocationOutputApi
} from '@/api/api'
import echarts from 'echarts'
import 'echarts-gl'
import geoJson from '../../../static/js/zheJiang.json'
import { mapMixin } from '@/config/mixin.js'
export default {
  mixins: [mapMixin],
  data() {
    return {
      geoJson: geoJson,
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
        year: '2019',
        adcode: 330000
      },
      investTotal: null,
      outputTotal: null
    }
  },
  mounted() {
    this.industryDistributionApiFn()
    this.healthDetailApiFn()
    this.investApiFn()
    this.investDetailApiFn()
    this.healthOutputApiFn()
    this.healthIncrementApiFn()
    this.healthLocationOutputApiFn()
  },
  methods: {
    otherSearch() {
      this.industryDistributionApiFn()
      this.healthDetailApiFn()
      this.investApiFn()
      this.investDetailApiFn()
      this.healthOutputApiFn()
      this.healthIncrementApiFn()
      this.healthLocationOutputApiFn()
    },
    // 查询省健康产业分布
    industryDistributionApiFn() {
      industryDistributionApi(this.params).then(res => {
        this.zheJiangMap(geoJson, res.data.data)
      })
    },
    // 获取省健康产业情况数据
    healthDetailApiFn() {
      healthDetailApi(this.params).then(res => {
        this.healthDetailChartFn(res.data)
      })
    },
    // 获取省内产业投融资数据
    investApiFn() {
      investApi(this.params).then(res => {
        this.investChartFn(res.data)
      })
    },
    // 获取省内投资情况数据
    investDetailApiFn() {
      investDetailApi(this.params).then(res => {
        this.investTotal = res.data.amount
        this.investDetailChartFn(res.data)
      })
    },
    // 获取省健康产业总产出数据
    healthOutputApiFn() {
      healthOutputApi(this.params).then(res => {
        this.healthOutputChartFn(res.data)
      })
    },
    // 获取省健康产业历年产值增量数据
    healthIncrementApiFn() {
      healthIncrementApi(this.params).then(res => {
        this.healthIncrementChartFn(res.data)
      })
    },
    // 获取省各地市健康产业总产出数据
    healthLocationOutputApiFn() {
      healthLocationOutputApi(this.params).then(res => {
        this.outputTotal = res.data.amount
        this.healthLocationOutputChartFn(res.data)
      })
    },

    // 省健康产业情况chart
    healthDetailChartFn(data) {
      let charts = this.$echarts.init(
        document.getElementById('healthDetailChart')
      )
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
          top: '4%',
          right: '4%',
          textStyle: {
            fontSize: '16px',
            color: '#fff'
          },
          data: ['企业数量', '新成立企业数量', '死亡企业数量']
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
            data: data.year,
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
            name: '企业数量/家',
            type: 'value',
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
            name: '企业数量',
            type: 'bar',
            barWidth: '10px',
            barGap: '50%',
            itemStyle: {
              normal: {
                barBorderRadius: [5, 5, 0, 0],
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: 'rgba(0, 196, 254, 1)'
                  },
                  {
                    offset: 1,
                    color: 'rgba(0, 196, 254, 0.1)'
                  }
                ])
              }
            },
            data: data.companyData
          },
          {
            name: '新成立企业数量',
            type: 'bar',
            barWidth: '10px',
            barGap: '50%',
            itemStyle: {
              normal: {
                barBorderRadius: [5, 5, 0, 0],
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: 'rgba(0, 254, 184, 1)'
                  },
                  {
                    offset: 1,
                    color: 'rgba(0, 254, 184, 0.1)'
                  }
                ])
              }
            },
            data: data.newCompanyData
          },
          {
            name: '死亡企业数量',
            type: 'bar',
            barGap: '5%',
            barWidth: '10px',
            itemStyle: {
              normal: {
                barBorderRadius: [5, 5, 0, 0],
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: 'rgba(64, 122, 255, 1)'
                  },
                  {
                    offset: 1,
                    color: 'rgba(64, 122, 255, 0.1)'
                  }
                ])
              }
            },
            data: data.deadCompanyData
          }
        ]
      }
      charts.setOption(option)
    },
    // 省内产业投融资chart
    investChartFn(data) {
      let charts = this.$echarts.init(document.getElementById('investChart'))
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
          data: ['投资笔数', '投资金额']
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
            data: data.year,
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
            name: '投资笔数',
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
            name: '投资金额/万亿美圆',
            type: 'value',
            min: 0,
            max: 1000,
            interval: 200,
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
            name: '投资笔数',
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
            data: data.investNum
          },
          {
            name: '投资金额',
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
            data: data.investMoney
          }
        ]
      }
      charts.setOption(option)
    },
    // 省内投资情况chart
    investDetailChartFn(data) {
      let legends = []
      let total = 0
      for (let item of data.data.values()) {
        legends.push(item.name)
        total += item.value
      }
      let charts = this.$echarts.init(
        document.getElementById('investDetailChart')
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
            for (let i = 0; i < data.data.length; i++) {
              if (data.data[i].name === name) {
                percent = data.data[i].value
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
            radius: [20, 65],
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
            data: data.data
          }
        ]
      }
      charts.setOption(option)
    },
    // 省健康产业总产出chart
    healthOutputChartFn(data) {
      let charts = this.$echarts.init(
        document.getElementById('healthOutputChart')
      )
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
          top: '4%',
          right: '4%',
          textStyle: {
            fontSize: '16px',
            color: '#fff'
          },
          data: ['总产出']
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
            data: data.year,
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
            name: '总产出/万亿人民币',
            type: 'value',
            nameTextStyle: {
              padding: [0, 0, 0, 25]
            },
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
            name: '总产出',
            type: 'bar',
            barWidth: '10px',
            barGap: '50%',
            itemStyle: {
              normal: {
                barBorderRadius: [5, 5, 0, 0],
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: 'rgba(0, 254, 184, 1)'
                  },
                  {
                    offset: 1,
                    color: 'rgba(0, 254, 184, 0.1)'
                  }
                ])
              }
            },
            data: data.productionData
          }
        ]
      }
      charts.setOption(option)
    },
    // 省健康产业历年产值增量chart
    healthIncrementChartFn(data) {
      let charts = this.$echarts.init(
        document.getElementById('healthIncrementChart')
      )
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
          data: ['增长率', '增长值']
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
            data: data.year,
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
            name: '产业产值时序增长率/百分比',
            type: 'value',
            nameTextStyle: {
              padding: [0, 0, 0, 65]
            },
            min: 0,
            max: 250,
            interval: 50,
            axisLine: {
              lineStyle: {
                type: 'solid',
                color: '#B1B1B1' // 左边线的颜色
              }
            }
          },
          {
            name: '产业产值时序增值',
            type: 'value',
            nameTextStyle: {
              padding: [0, 25, 0, 0]
            },
            min: 0,
            max: 25,
            interval: 5,
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
            name: '增长率',
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
            data: data.increRate
          },
          {
            name: '增长值',
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
            data: data.increNum
          }
        ]
      }
      charts.setOption(option)
    },
    // 省各地市健康产业总产出chart
    healthLocationOutputChartFn(data) {
      let legends = []
      let total = 0
      for (let item of data.data.values()) {
        legends.push(item.name)
        total += item.value
      }
      let charts = this.$echarts.init(
        document.getElementById('healthLocationOutputChart')
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
            for (let i = 0; i < data.data.length; i++) {
              if (data.data[i].name === name) {
                percent = data.data[i].value
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
            radius: [55, 110],
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
            data: data.data
          }
        ]
      }
      charts.setOption(option)
    }
  }
}
</script>
<style lang="scss" scoped>
@import './dataOverview.scss';
</style>