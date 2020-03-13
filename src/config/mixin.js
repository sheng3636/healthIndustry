import {
  industryDistributionApi,
  doctorNurseBedMapApi
} from '@/api/api'
export const mapMixin = {
  data() {
    return {
      yearVal: '2019',
      yearOpts: [{
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
      cityVal: {
        cityCode: '330000'
      },
      cityOpts: [],
      scatter: [],
      scatterData: [],
      cityName: '浙江省',
      geoJsonData: '',
      echartsMap: null, // 中间地图echarts实例
      map: null,
      district: null,
      mapData: []
    }
  },
  mounted() {
    this.echartsMap = this.$echarts.init(document.getElementById('mapWrap'))
    // 初始化地图
    this.map = new AMap.Map('mapContainer', {
      resizeEnable: true,
      center: [116.30946, 39.937629],
      zoom: 3
    })
    this.district = new AMap.DistrictSearch({
      subdistrict: 1, // 显示下级行政区级数
      showbiz: false // 是否显示商圈
    }) // 注意：需要使用插件同步下发功能才能这样直接使用
    this.district.search('浙江省', (status, result) => {
      if (status === 'complete') {
        this.getData(result.districtList[0], 'city', 330000)
      }
    })
  },
  methods: {
    /*
      利用 AMapUI.loadUI可以构造一个创建一个 DistrictExplorer 实例，然后利用 DistrictExplorer 的实例，
      可以根据当前需要加载城市的 areaCode获取到该城市的 geo 数据
    */
    loadMapData(areaCode) {
      AMapUI.loadUI(['geo/DistrictExplorer'], DistrictExplorer => {
        let districtExplorer = (window.districtExplorer = new DistrictExplorer({
          eventSupport: true, // 打开事件支持
          map: this.map
        }))
        // 创建一个实例
        districtExplorer.loadAreaNode(areaCode, (error, areaNode) => {
          if (error) {
            console.error(error)
            return
          }
          let mapJson = {}
          // 特别注意这里哦，如果查看过正常的geojson文件，都会发现，文件都是以features 字段开头的，所以这里要记得加上
          mapJson.features = areaNode.getSubFeatures()

          this.loadMapChart(this.cityName, mapJson)
          this.geoJsonData = mapJson
        })
      })
    },
    // 处理获取出来的边界数据
    getData(data, level, adcode) {
      let subList = data.districtList
      if (subList) {
        let curlevel = subList[0].level
        let levelList = curlevel + 'Opts'
        // 街道级以上的数据处理方式
        this.mapData = []
        this[levelList] = []
        for (let i = 0, l = subList.length; i < l; i++) {
          let name = subList[i].name
          let cityCode = subList[i].adcode
          let center = subList[i].center
          // 这个mapData里包含每个区域的code、名称、对应的等级，实现第三步功能时能用上
          this.mapData.push({
            name: name,
            value: Math.random() * 100,
            cityCode: cityCode,
            level: curlevel
          })
          let levelSub = subList[i].level
          this[levelList].push({
            cityName: name,
            value: {
              cityName: name,
              center: center,
              levelSub: levelSub,
              cityCode: cityCode
            }
          })
        }
        this[levelList].unshift({
          cityName: '浙江省',
          value: {
            cityName: '浙江省',
            center: {
              P: 30.287459,
              R: 120.153576,
              lng: 120.153576,
              lat: 30.287459
            },
            levelSub: 'province',
            cityCode: '330000'
          }
        })
        this.scatter = this[levelList]
        this.loadMapData(adcode)
      }
    },
    search(area) {
      let levelList = null
      levelList = this[area + 'Val']

      let adcode = levelList.cityCode
      this.cityName = levelList.cityName

      this.district.setLevel(area) // 行政区级别
      this.district.setExtensions('all')
      // 行政区查询
      // 按照adcode进行查询可以保证数据返回的唯一性
      this.district.search(adcode, (status, result) => {
        if (status === 'complete') {
          this.getData(result.districtList[0], area, adcode)
        }
      })
    },
    // 渲染地图echarts
    loadMapChart(mapName, data) {
      let data1 = []
      let whichApi = null
      let apiParams = {}
      switch (this.$route.matched[0].meta.whichApi){
        case 'features':
          whichApi = doctorNurseBedMapApi
          apiParams = {
            adcode: this.cityVal.cityCode,
            year: this.yearVal,
            type: this.typeVal
          }
          break
        case 'dataOverview':
          whichApi = industryDistributionApi
          apiParams = {
            adcode: this.cityVal.cityCode,
            year: this.yearVal
          }  
      }
      whichApi(apiParams).then(
        res => {
          data1 = res.data.data
          let arr = []
          let aaa = this.scatter
          console.log(data1)
          data1.forEach((item) => {
            let bbb = aaa.filter(function (_self) {
              return _self.cityName === item.name
            })
            arr.push({
              name: item.name,
              value: [
                bbb[0].value.center.lng,
                bbb[0].value.center.lat,
                item.value
              ]
            })
          })
          this.$echarts.registerMap(mapName, data)
          let option = {
            geo: {
              show: true,
              map: mapName,
              label: {
                normal: {
                  show: false
                },
                emphasis: {
                  show: false
                }
              },
              roam: true,
              itemStyle: {
                normal: {
                  areaColor: 'rgba(16,72,133)',
                  borderColor: 'rgba(51, 136, 255)',
                  borderWidth: 2,
                  label: {
                    show: true,
                    textStyle: {
                      color: 'rgb(249, 249, 249)'
                    }
                  }
                },
                emphasis: {
                  areaColor: '#2B91B7'
                }
              }
            },
            series: [{
                name: '散点',
                type: 'scatter',
                coordinateSystem: 'geo',
                data: arr,
                symbolSize: 5,
                label: {
                  normal: {
                    formatter: '{b}',
                    position: 'right',
                    show: true
                  },
                  emphasis: {
                    show: true
                  }
                },
                itemStyle: {
                  normal: {
                    color: '#05C3F9'
                  }
                }
              },
              {
                type: 'map',
                map: mapName,
                geoIndex: 0,
                aspectScale: 0.75, // 长宽比
                showLegendSymbol: false, // 存在legend时显示
                label: {
                  normal: {
                    show: true
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
                data: this.mapData
              },
              {
                name: '点',
                type: 'scatter',
                coordinateSystem: 'geo',
                symbol: 'pin', // 气泡
                symbolSize: function (parmas) { // 显示打点的值，即点的大小根据一个方法除数取整
                  if (0 <= parmas[2] &&  parmas[2] <= 10) {
                    return 25
                  } else if (10 < parmas[2] && parmas[2] < 100) {
                    return 35
                  } else if (100 < parmas[2] && parmas[2] < 1000) {
                    return 55
                  } else {
                    return 80
                  }         
                },
                label: {
                  normal: {
                    show: true,
                    formatter: function (val) {
                      return val.value[2]
                    },
                    textStyle: {
                      color: '#fff',
                      fontSize: 14
                    }
                  }
                },
                itemStyle: {
                  normal: {
                    color: '#F62157' // 标志颜色
                  }
                },
                zlevel: 6,
                data: arr
              }
            ]
          }
          this.echartsMap.clear()
          this.echartsMap.setOption(option)
        }
      )
    }
  }
}
