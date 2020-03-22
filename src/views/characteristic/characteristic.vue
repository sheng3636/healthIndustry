<template>
  <div>
    <ul class="tomenu">
      <router-link tag="li" :to="{name: 'Hospital'}" exact>医疗人员、床位专题</router-link>
      <router-link tag="li" :to="{name: 'NursingInstitution'}">养老机构专题</router-link>
      <router-link tag="li" :to="{name: 'MedicalInstitution'}">医疗机构专题</router-link>
    </ul>
    <!-- 养老服务专业 -->
    <router-view></router-view>
  </div>
</template>
<style lang="scss" scoped>
.tomenu {
  position: absolute;
  top: 101px;
  left: 560px;
  z-index: 999;
  display: flex;
  li {
    margin-right: 30px;
    cursor: pointer;
  }
}
.router-link-active {
  color: #eddd12;
}
</style>