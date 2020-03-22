<template>
  <div class="header">
    <nav class="navLeft">
      <router-link to="/dataOverview">数据导览</router-link>
      <router-link to="/baseData">基础数据展示</router-link>
      <router-link to="/characteristic">专题展示</router-link>
    </nav>
    <nav class="navRight">
      <router-link to="/solution">解决方案</router-link>
      <router-link to="/EHS">数据制图</router-link>
      <div class="dateTime">{{CurrentDateTime}}</div>
    </nav>
  </div>
</template>
<script>
export default {
  data () {
    return {
      CurrentDateTime: ''
    }
  },
  mounted () {
    setInterval(() => {
      this.CurrentTime()
    }, 1000)
  },
  methods: {
    CurrentTime() {
      let date = new Date()
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      let day = date.getDate()
      let hour = date.getHours()
      let minute = date.getMinutes()
      let second = date.getSeconds()
      month = month < 10 ? '0' + month : month
      day = day < 10 ? '0' + day : day
      hour = hour < 10 ? '0' + hour : hour
      minute = minute < 10 ? '0' + minute : minute
      second = second < 10 ? '0' + second : second
      let Timer =
        year +
        '-' +
        month +
        '-' +
        day +
        ' ' +
        hour +
        ':' +
        minute +
        ':' +
        second
      this.CurrentDateTime = Timer
    }
  }
}
</script>

<style lang="scss" scoped>
@import './header.scss';
</style>
