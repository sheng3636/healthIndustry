<template>
  <div class="bottomMain">
    <div class="mainLeft">
      <div class="firstDiv">
        <h3 class="divTitle"><i>省历年医疗人员、床位数量</i></h3>
        <div id="PersonBedChart"></div>
      </div>
      <div class="secondDiv">
        <h3 class="divTitle"><i>省历年医疗人员、床位每千人数量</i></h3>
        <div id="personBedThousandChart"></div>
      </div>
      <div class="thirdDiv">
        <h3 class="divTitle"><i>年医疗人员占比、床位分配数量分析</i></h3>
        <div class="chartWrap">
          <div id="personPercentChart"></div>
          <div id="bedAllotChart"></div>
        </div>
      </div>
    </div>
    <div class="mainCenter">
      <div class="centerTop">
        <span class="title">医疗人员、床位</span>
        <el-select class="selectWidth" size="small" v-model="typeVal" value-key="cityName"
          placeholder="请选择类型">
          <el-option v-for="item in typeOpts" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <el-select class="selectWidth" size="small" v-model="cityVal" value-key="cityName" @change="search('city')"
          placeholder="请选择城市">
          <el-option v-for="item in cityOpts" :key="item.value.cityName" :label="item.cityName" :value="item.value">
          </el-option>
        </el-select>
        <el-select class="selectWidth" v-model="yearVal" size="mini" placeholder="请选择年份" @change="otherSearch">
          <el-option v-for="item in yearOpts" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div id="mapWrap"></div>
    </div>
    <div class="mainRight">
      <div class="firstDiv">
        <h3 class="divTitle"><i>省各地市医生人数占比</i></h3>
        <div id="healthOutputChart">
          <span :class="'span' + index" v-for="(item,index) in doctorData.listData" :key="index">{{item.name}}{{(item.value / doctorData.amount).toFixed(1)}}%</span>
          <span class="span11">全省医生{{doctorData.amount}}人</span>
        </div>
      </div>
      <div class="firstDiv">
        <h3 class="divTitle"><i>省各地市护士人数占比</i></h3>
        <div id="healthIncrementChart">
          <span :class="'span' + index" v-for="(item,index) in nurseData.listData" :key="index">{{item.name}}{{(item.value / nurseData.amount).toFixed(1)}}%</span>
          <span class="span11">全省护士{{nurseData.amount}}人</span>
        </div>
      </div>
      <div class="thirdDiv">
        <h3 class="divTitle"><i>省各地市床位占比-</i><span>{{bedTotal}}床</span></h3>
        <div id="locationBedChart"></div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  personBedApi,
  personBedThousandApi,
  doctorNurseBedApi
} from '@/api/api'
import { mapMixin } from '@/config/mixin.js'
import echarts from 'echarts'
import 'echarts-gl'
export default {
  mixins: [mapMixin],
  data() {
    return {
      bedTotal:null,
      doctorData:{},
      nurseData:{},
      typeVal: '1',
      typeOpts: [
        {
          value: '1',
          label: '医生'
        },
        {
          value: '2',
          label: '护士'
        },
        {
          value: '3',
          label: '床位'
        }
      ]
    }
  },
  mounted() {
    personBedApi().then(res => {
      this.personBedChartFn(res.data)
    })
    personBedThousandApi().then(res => {
      this.personBedThousandChartFn(res.data)
      this.bedAllotChartFn(res.data.numAnalysis)
      this.personPercentChartFn(res.data.numAnalysis.personnelData)
    })
    doctorNurseBedApi().then(res => {
      this.bedTotal = res.data.bed.amount
      this.doctorData = res.data.doctor
      this.nurseData = res.data.doctor
      this.locationBedChartFn(res.data.bed.listData)
    })
  },
  methods: {
    otherSearch() {
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
    toFixedTwo(data){
      return data.toFixed(1)
    },
    // 省历年医疗人员、床位数量chart
    personBedChartFn(data) {
      let charts = this.$echarts.init(document.getElementById('PersonBedChart'))
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
          data: ['医生', '护士', '床位']
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
            name: '人数（人）/床位数（床）',
            type: 'value',
            nameTextStyle: {
              padding: [0, 0, 0, 55]
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
            name: '医生',
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
            data: data.doctorData
          },
          {
            name: '护士',
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
            data: data.nurseData
          },
          {
            name: '床位',
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
            data: data.bedData
          }
        ]
      }
      charts.setOption(option)
    },
    // 省历年医疗人员chart
    personBedThousandChartFn(data) {
      let charts = this.$echarts.init(
        document.getElementById('personBedThousandChart')
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
          data: ['医生', '护士', '床位']
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
            name: '人数（人）/床位数（床）',
            type: 'value',
            nameTextStyle: {
              padding: [0, 0, 0, 55]
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
            name: '医生',
            type: 'bar',
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
            data: data.doctorData
          },
          {
            name: '护士',
            type: 'bar',
            barWidth: '10px',
            barGap: '50%',
            itemStyle: {
              normal: {
                barBorderRadius: [5, 5, 0, 0],
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: 'rgba(223, 137, 255, 1)'
                  },
                  {
                    offset: 1,
                    color: 'rgba(223, 137, 255, 0.1)'
                  }
                ])
              }
            },
            data: data.nurseData
          },
          {
            name: '床位',
            type: 'bar',
            barGap: '5%',
            barWidth: '10px',
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
            data: data.bedData
          }
        ]
      }
      charts.setOption(option)
    },
    // 年医疗人员占比chart
    personPercentChartFn(data) {
      let legends = []
      let total = 0
      for (let item of data.values()) {
        legends.push(item.name)
        total += item.value
      }
      let charts = this.$echarts.init(
        document.getElementById('personPercentChart')
      )
      let option = {
        title: {
          text: '每千人医疗人数',
          right: '0%',
          bottom: '2%',
          textStyle: {
            color: '#fff',
            fontSize: 16
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          type: 'scroll',
          orient: 'vertical',
          left: '5%',
          top: '2%',
          bottom: '2%',
          textStyle: {
            fontSize: '14',
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
            target = (percent / total) * 100
            return name + ' ' + target.toFixed(1) + '%'
          },
          data: legends
        },
        series: [
          {
            name: '年医疗人员占比',
            type: 'pie',
            radius: [25, 55],
            center: ['77%', '47%'],
            roseType: 'radius',
            label: {
              show: false
            },
            emphasis: {
              label: {
                show: false,
                formatter: '{b}: {d}%'
              }
            },
            data: data
          }
        ]
      }
      charts.setOption(option)
    },
    // 床位分配数量分析chart
    bedAllotChartFn(data) {
      let charts = this.$echarts.init(document.getElementById('bedAllotChart'))
      let option = {
        tooltip: {
          formatter: '{a} <br/>{b} : {c}'
        },
        series: [
          {
            title: {
              show: true,
              offsetCenter: [0, '92%'], // 相对于仪表盘中心的偏移位置，数组第一项是水平方向的偏移，第二项是垂直方向的偏移。可以是绝对的数值，也可以是相对于仪表盘半径的百分比。
              color: '#fff',
              fontSize: '16',
              fontWeight: '600'
            },

            splitNumber: 5, // 分割段数
            axisLine: {
              // 坐标轴线
              lineStyle: {
                // 属性lineStyle控制线条样式
                // color: [
                //   [0.25, '#ddd'],
                //   [1, '#ddd']
                // ],
                width: 5
              }
            },
            axisTick: {
              // 坐标轴小标记
              splitNumber: 10, // 每份split细分多少段
              length: 12, // 属性length控制线长
              lineStyle: {
                // 属性lineStyle控制线条样式
                // color: 'auto'
              }
            },
            axisLabel: {
              // 坐标轴文本标签，详见axis.axisLabel
              textStyle: {
                // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                // color: 'auto'
              }
            },
            splitLine: {
              // 分隔线
              show: true, // 默认显示，属性show控制显示与否
              length: 22, // 属性length控制线长
              lineStyle: {
                // 属性lineStyle（详见lineStyle）控制线条样式
                // color: 'auto'
              }
            },
            pointer: {
              // 指针粗细
              width: 2
            },

            name: '床位分配数量',
            type: 'gauge',
            radius: '89%',
            min: 0,
            max: 100,
            data: [{ value: data.bed, name: '每千人分配床位数' }]
          }
        ]
      }
      charts.setOption(option)
    },
    // 浙江省地市床位占比
    locationBedChartFn(data) {
      let legends = []
      let total = 0
      for (let item of data.values()) {
        legends.push(item.name)
        total += item.value
      }
      let charts = this.$echarts.init(
        document.getElementById('locationBedChart')
      )
      let option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c}%'
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
            target = (percent / total) * 100
            return name + ' ' + target.toFixed(2) + '%'
          },
          data: legends
        },
        series: [
          {
            name: '浙江省地市床位占比',
            type: 'funnel',
            top: '7%',
            left: '0%',
            width: '72%',
            height: '89%',
            maxSize: '80%',
            label: {
              position: 'inside',
              formatter: '{d}%',
              color: '#fff'
            },
            itemStyle: {
              // opacity: 0.5,
              borderColor: '#fff',
              borderWidth: 2
            },
            emphasis: {
              label: {
                position: 'inside',
                formatter: '{b}: {c}%'
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
@import './features.scss';
</style>