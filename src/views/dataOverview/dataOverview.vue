<template>
  <div class="bottomMain">
    <div class="mainLeft">
      <div class="firstDiv">
        <h3 class="divTitle">省健康产业情况</h3>
        <div id="healthDetailChart"></div>
      </div>
      <div class="secondDiv">
        <h3 class="divTitle">省内产业投融资</h3>
        <div id="investChart"></div>
      </div>
      <div class="thirdDiv">
        <h3 class="divTitle">省内投资情况</h3>
        <div id="investDetailChart"></div>
      </div>
    </div>
    <div class="mainRight">
      <div class="firstDiv">
        <h3 class="divTitle">省健康产业总产出</h3>
        <div id="healthOutputChart"></div>
      </div>
      <div class="secondDiv">
        <h3 class="divTitle">省健康产业历年产值增量</h3>
        <div id="healthIncrementChart"></div>
      </div>
      <div class="thirdDiv">
        <h3 class="divTitle">省各地市健康产业总产出</h3>
        <div id="healthLocationOutputChart"></div>
      </div>
    </div>
  </div>
</template>
<script>
import echarts from 'echarts'
export default {
  mounted() {
    this.healthDetailChart()
    this.investChart()
    this.investDetailChart()
    this.healthOutputChart()
    this.healthIncrementChart()
  },
  methods: {
    healthDetailChart() {
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
            data: ['2014', '2015', '2016', '2017', '2018'],
            axisTick: {
              alignWithLabel: true
            },
            axisLine: {
              lineStyle: {
                type: 'solid',
                color: '#B1B1B1' //左边线的颜色
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
                color: '#B1B1B1' //左边线的颜色
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
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: 'rgba(242, 229, 16, 1)'
                  },
                  {
                    offset: 1,
                    color: 'rgba(229, 139, 66, 0.42)'
                  }
                ])
              }
            },
            data: [10, 52, 20, 33, 39]
          },
          {
            name: '新成立企业数量',
            type: 'bar',
            barWidth: '10px',
            barGap: '50%',
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: 'rgba(66, 229, 223, 1)'
                  },
                  {
                    offset: 1,
                    color: 'rgba(8, 65, 81, 0.5)'
                  }
                ])
              }
            },
            data: [15, 40, 25, 15, 55]
          },
          {
            name: '死亡企业数量',
            type: 'bar',
            barGap: '5%',
            barWidth: '10px',
            barGap: '50%',
            itemStyle: {
              normal: {
                color: 'rgba(106, 242, 16, 0.4)'
              }
            },

            data: [15, 40, 25, 15, 55]
          }
        ]
      }
      charts.setOption(option)
    },
    investChart() {
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
          top: '4%',
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
            data: ['2014', '2015', '2016', '2017', '2018'],
            axisTick: {
              alignWithLabel: true
            },
            axisLine: {
              lineStyle: {
                type: 'solid',
                color: '#B1B1B1' //左边线的颜色
              }
            }
          }
        ],
        yAxis: [
          {
            name: '投资笔数',
            type: 'value',
            min: 0,
            max: 25,
            interval: 5,
            axisLine: {
              lineStyle: {
                type: 'solid',
                color: '#B1B1B1' //左边线的颜色
              }
            }
          },
          {
            name: '投资金额/万亿美圆',
            type: 'value',
            min: 0,
            max: 250,
            interval: 50,
            axisLine: {
              lineStyle: {
                type: 'solid',
                color: '#B1B1B1' //左边线的颜色
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
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: 'rgba(242, 229, 16, 1)'
                  },
                  {
                    offset: 1,
                    color: 'rgba(229, 139, 66, 0.42)'
                  }
                ])
              }
            },
            data: [10, 52, 20, 33, 39]
          },
          {
            name: '投资金额',
            type: 'bar',
            yAxisIndex: 1,
            barWidth: '10px',
            barGap: '50%',
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: 'rgba(66, 229, 223, 1)'
                  },
                  {
                    offset: 1,
                    color: 'rgba(8, 65, 81, 0.5)'
                  }
                ])
              }
            },
            data: [125, 440, 257, 195, 255]
          }
        ]
      }
      charts.setOption(option)
    },
    investDetailChart() {
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
          data: [
            '杭州',
            '宁波',
            '嘉兴',
            '绍兴',
            '金华',
            '丽水',
            '温州',
            '台州',
            '衢州',
            '湖州',
            '舟山'
          ]
        },
        series: [
          {
            name: '省各地市投资占比',
            type: 'pie',
            radius: [15, 60],
            center: ['45%', '50%'],
            roseType: 'radius',
            label: {
              show: false
            },
            emphasis: {
              label: {
                show: true
              }
            },
            data: [
              { value: 10, name: '杭州' },
              { value: 5, name: '宁波' },
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
          }
        ]
      }
      charts.setOption(option)
    },
    healthOutputChart() {
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
            data: ['2014', '2015', '2016', '2017', '2018'],
            axisTick: {
              alignWithLabel: true
            },
            axisLine: {
              lineStyle: {
                type: 'solid',
                color: '#B1B1B1' //左边线的颜色
              }
            }
          }
        ],
        yAxis: [
          {
            name: '总产出/万亿人民币',
            type: 'value',
            axisLine: {
              lineStyle: {
                type: 'solid',
                color: '#B1B1B1' //左边线的颜色
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
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: 'rgba(242, 229, 16, 1)'
                  },
                  {
                    offset: 1,
                    color: 'rgba(229, 139, 66, 0.42)'
                  }
                ])
              }
            },
            data: [10, 52, 20, 33, 39]
          }
        ]
      }
      charts.setOption(option)
    },
    healthIncrementChart() {
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
          top: '4%',
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
            data: ['2014', '2015', '2016', '2017', '2018'],
            axisTick: {
              alignWithLabel: true
            },
            axisLine: {
              lineStyle: {
                type: 'solid',
                color: '#B1B1B1' //左边线的颜色
              }
            }
          }
        ],
        yAxis: [
          {
            name: '产业产值时序增长率/百分比',
            type: 'value',
            min: 0,
            max: 250,
            interval: 50,
            axisLine: {
              lineStyle: {
                type: 'solid',
                color: '#B1B1B1' //左边线的颜色
              }
            }
          },
          {
            name: '产业产值时序增值',
            type: 'value',
            min: 0,
            max: 25,
            interval: 5,
            axisLine: {
              lineStyle: {
                type: 'solid',
                color: '#B1B1B1' //左边线的颜色
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
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: 'rgba(242, 229, 16, 1)'
                  },
                  {
                    offset: 1,
                    color: 'rgba(229, 139, 66, 0.42)'
                  }
                ])
              }
            },
            data: [10, 52, 20, 33, 39]
          },
          {
            name: '增长值',
            type: 'bar',
            yAxisIndex: 1,
            barWidth: '10px',
            barGap: '50%',
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: 'rgba(66, 229, 223, 1)'
                  },
                  {
                    offset: 1,
                    color: 'rgba(8, 65, 81, 0.5)'
                  }
                ])
              }
            },
            data: [125, 440, 257, 195, 255]
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