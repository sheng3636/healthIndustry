import echarts from 'echarts'
import 'echarts-gl'
export const mapMixin = {
  data() {
    return {
    }
  },
  methods: {
    // 浙江省份地图
    zheJiangMap(dataJson, echartData) {
      let myChart = this.$echarts.init(document.getElementById('mapWrap'))
      echarts.registerMap('zhejiang', dataJson)
      let option = {
        tooltip: {
          show: true,
          formatter: '{b}:{c}'
        },
        visualMap: {
          min: 0,
          max: 100000,
          left: 'left',
          top: 'bottom',
          text: ['多', '少'], // 文本，默认为数值文本
          calculable: true,
          inRange: {
            color: ['rgba(0, 196, 254, 1)', 'lightskyblue', 'orangered']
          },
          textStyle: {
            color: '#ffffff'
          }
        },
        geo: {
          show: true,
          map: 'zhejiang',
          zoom: 1,
          roam: false,
          label: {
            normal: {
              show: true,
              textStyle: {
                color: '#fff'
              }
            },
            emphasis: {
              show: true,
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
        series: [{
          type: 'map',
          map: 'zhejiang',
          geoIndex: 0,
          showLegendSymbol: false, // 存在legend时显示
          label: {
            normal: {
              show: false
            },
            emphasis: {
              show: true,
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
          data: echartData
        }]
      }
      myChart.setOption(option)
    }
  }
}
