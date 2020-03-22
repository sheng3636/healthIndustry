<template>
  <div class="bottomMain" v-loading.fullscreen.lock="fullscreenLoading">
    <div class="mainLeft">
      <h3 class="leftTitle">大健康解决方案简报查询</h3>
      <div class="overviewArea" v-if="searchType === 0">
        <p class="backgroundTxt" v-if="localContent === ''"><i class="el-icon-search"></i>您可使用右侧工具栏中在数据库中查找您需要的简报</p>
        <div class="overViewArea" :class="{backgroundWhite:localContent}" v-else v-html="localContent"></div>
      </div>
      <div class="netArea" v-if="searchType === 2">
        <p class="backgroundTxt" v-if="netUrl === ''"><i class="el-icon-eleme"></i>您可使用右侧工具栏中在网络中查找您需要的信息</p>
        <iframe class="overViewArea" :src="netUrl" scrolling="yes" v-if="netUrl !== ''"></iframe>
      </div>
    </div>
    <div class="mainRight">
      <ul class="searchTypeTab">
        <li :class="{active:searchType === 0}" @click="searchTypeFn(0)">本地获取</li>
        <li :class="{active:searchType === 1}" @click="searchTypeFn(1)">简报生成</li>
        <li :class="{active:searchType === 2}" @click="searchTypeFn(2)">网络截取</li>
      </ul>
      <div class="localArea" v-if="searchType === 0">
        <p class="searchCount">数据库中《大健康解决方案简报》文件共<span>{{localAmount}}</span>个<i class="el-icon-refresh-left"
            @click="getAmountFn"></i></p>
        <el-form ref="form" :model="localForm" label-width="80px">
          <el-form-item label="搜索内容">
            <el-input v-model="localForm.name" style="width:340px;">
              <i slot="suffix" class="searchBtn el-input__icon el-icon-search" @click="localSubmit"></i>
            </el-input>
          </el-form-item>
          <el-form-item label="时间范围">
            <el-date-picker v-model="duringDate" type="daterange" :picker-options="pickerOptions" range-separator="至"
              start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" style="width:340px;">
            </el-date-picker>
          </el-form-item>
        </el-form>
        <div class="localFileWrap">
          <div class="fileItem" v-for="(item,index) in localFiles" :key="index">
            <h4 class="fileTitle">{{item.solutionName}}</h4>
            <p class="content" v-html="item.content"></p>
            <div class="fileBottom">
              <span>{{dateFormat(item.solutionTime)}}</span>
              <i class="download el-icon-view" @click="localOverview(item.solutionId)"></i>
              <i class="download el-icon-download" @click="downloadFileFn(item.solutionId)"></i>
            </div>
          </div>
          <!--分页-->
          <div class="paginationWrap">
            <el-pagination :current-page.sync="localCurrentPage" :page-size="localPageSize"
              layout="total, prev, pager, next, jumper" :pager-count="3" :total="localTotal" @size-change="localSizeChange"
              @current-change="localCurrentChange" />
          </div>
        </div>
      </div>
      <div class="netFileWrap" v-if="searchType === 2">
        <el-form ref="netForm" :model="netForm" label-width="80px">
          <el-form-item label="搜索内容">
            <el-input v-model="netForm.keyWord" style="width:340px;">
              <i slot="suffix" class="searchBtn el-input__icon el-icon-search" @click="netSubmit"></i>
            </el-input>
          </el-form-item>
          <el-form-item label="查询范围">
            <el-radio-group v-model="netForm.searchScope" @change="netTypeChange">
              <el-radio label="0">全网查询</el-radio>
              <el-radio label="1">自定义网站查询</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="网址" v-if="netForm.searchScope === '1'">
            <el-input type="textarea" placeholder="网址与网址之间以英文|符号为间隔，例如：https://www.sina.com.cn,https://www.baidu.com"
              rows="5" v-model="netForm.urlList" style="width:340px;" />
          </el-form-item>
        </el-form>
        <div class="nwtFileWrap">
          <div class="fileItem" v-for="(item,index) in netFiles" :key="index">
            <h4 class="fileTitle">{{item.title}}</h4>
            <p class="content" @click="netOverview(item.realUrl)">{{item.realUrl}}</p>
          </div>
          <!--分页-->
          <div class="paginationWrap">
            <el-pagination :current-page.sync="netCurrentPage" :page-size="netPageSize"
              layout="total, prev, pager, next, jumper" :pager-count="3" :total="netTotal" @size-change="netSizeChange"
              @current-change="netCurrentChange" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  getAmount,
  querySolution,
  querySolutionDetail,
  searchKeyWord,
  searchInUrls
} from '@/api/api'
export default {
  data() {
    return {
      fullscreenLoading: false, // 是否进行整页加载
      searchType: 2, // 搜索类型
      localAmount: 0, // 本地解决方案总数
      localCurrentPage: 1, // 本地解决方案当前页码
      localPageSize: 3, // 本地解决方案整页大小
      localTotal: 0, // 本地解决方案列表总数
      // 本地搜索表单
      duringDate: [],
      localForm: {
        // 本地文件搜索表单
        pageNo: 1,
        pageSize: 3,
        name: '',
        startTime: '',
        endTime: ''
      },
      localFiles: [], // 本地搜素文件列表
      localContent: '', // 本地文件预览html
      netCurrentPage: 1, // 网络查询解决方案当前页码
      netPageSize: 5, // 网络查询解决方案整页大小
      netTotal: 0, // 络查询解决方案列表总数
      netForm: {
        // 网络搜索表单
        keyWord: '病毒',
        searchScope: '0',
        urlList: ''
      },
      netFiles: [], // 网络搜素文件列表
      netUrl: '',
      pickerOptions: {
        shortcuts: [
          {
            text: '最近半年',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 180)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一年',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 365)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      }
    }
  },
  mounted() {
    this.getAmountFn()
    this.querySolutionFn(this.localForm)
  },
  methods: {
    // 地获取-解决方案简报总数
    getAmountFn() {
      getAmount().then(res => {
        this.localAmount = res.data.amount
      })
    },
    // 搜索本地解决方案
    querySolutionFn(params) {
      if (this.duringDate) {
        params.startTime = this.duringDate[0]
        params.endTime = this.duringDate[1]
      }
      querySolution(params).then(res => {
        this.localTotal = res.data.total
        this.localFiles = res.data.data
      })
    },
    // 本地解决方案列表pageSize 改变时会触发
    localSizeChange(val) {
      this.localForm.pageSize = val
      this.querySolutionFn(this.localForm)
    },
    // 本地解决方案列表currentPage 改变时会触发
    localCurrentChange(val) {
      this.localForm.pageNo = val
      this.querySolutionFn(this.localForm)
    },
    // 本地文件预览
    localOverview(id) {
      this.fullscreenLoading = true
      let params = {
        solutionId: id
      }
      querySolutionDetail(params).then(res => {
        this.localContent = res.data.html
        this.fullscreenLoading = false
      })
    },
    // 下载本地文件
    downloadFileFn(id) {
      window.open(
        `http://t294k52841.wicp.vip/solution/downloadSolution?solutionId=${id}`
      )
    },
    // 搜索全网解决方案
    searchKeyWordFn(params) {
      searchKeyWord(params).then(res => {
        this.netTotal = res.data.length
        this.netFiles = res.data.slice(
          (this.netCurrentPage - 1) * this.netPageSize,
          this.netCurrentPage * this.netPageSize
        )
      })
    },
    netTypeChange(){
      this.netTotal = 0
      this.netFiles = 0
    },
    // 自定义网址查询
    searchInUrlsFn(params) {
      searchInUrls(params).then(res => {
        this.netTotal = res.data.length
        this.netFiles = res.data.slice(
          (this.netCurrentPage - 1) * this.netPageSize,
          this.netCurrentPage * this.netPageSize
        )
      })
    },
    // 本地解决方案列表pageSize 改变时会触发
    netSizeChange(val) {
      this.netPageSize = val
      if (this.netForm.searchScope === '0') {
        this.searchKeyWordFn(this.netForm)
      } else {
        this.searchInUrlsFn(this.netForm)
      }
    },
    // 本地解决方案列表currentPage 改变时会触发
    netCurrentChange(val) {
      this.netCurrentPage = val
      if (this.netForm.searchScope === '0') {
        this.searchKeyWordFn(this.netForm)
      } else {
        this.searchInUrlsFn(this.netForm)
      }
    },
    netOverview(url) {
      this.netUrl = url
    },
    // 搜索类型切换
    searchTypeFn(data) {
      this.searchType = data
    },
    // 本地文件搜索
    localSubmit() {
      this.querySolutionFn(this.localForm)
    },
    // 网络搜索
    netSubmit() {
      if (this.netForm.searchScope === '0') {
        this.searchKeyWordFn(this.netForm)
      } else {
        this.searchInUrlsFn(this.netForm)
      }
    },
    // 时间格式化
    dateFormat(dateTime) {
      let date = new Date(dateTime) // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
      let year = date.getFullYear(),
        month = ('0' + (date.getMonth() + 1)).slice(-2),
        sdate = ('0' + date.getDate()).slice(-2),
        hour = ('0' + date.getHours()).slice(-2),
        minute = ('0' + date.getMinutes()).slice(-2),
        second = ('0' + date.getSeconds()).slice(-2)
      return (
        year +
        '-' +
        month +
        '-' +
        sdate +
        ' ' +
        hour +
        ':' +
        minute +
        ':' +
        second
      )
    }
  }
}
</script>
<style lang="scss" scoped>
@import './solution.scss';
</style>