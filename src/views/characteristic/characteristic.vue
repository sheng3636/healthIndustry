<template>
  <div style="position: relative;">
    <!-- <ul class="tomenu">
      <router-link tag="li" :to="{name: 'Hospital'}" exact>医疗人员、床位专题</router-link>
      <router-link tag="li" :to="{name: 'NursingInstitution'}">养老机构专题</router-link>
      <router-link tag="li" :to="{name: 'MedicalInstitution'}">医疗机构专题</router-link>
    </ul> -->
    <div class="tomenu" :class="{leftLocation:$route.meta.title === '养老机构专题'}">
      <el-dropdown>
      <el-button size="mini">
        {{$route.meta.title}}<i class="el-icon-arrow-down el-icon--right"></i>
      </el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>
          <router-link tag="li" :to="{name: 'Hospital'}" exact>医疗人员、床位专题</router-link>
        </el-dropdown-item>
        <el-dropdown-item>
          <router-link tag="li" :to="{name: 'NursingInstitution'}">养老机构专题</router-link>
        </el-dropdown-item>
        <el-dropdown-item>
          <router-link tag="li" :to="{name: 'MedicalInstitution'}">医疗机构专题</router-link>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    </div>
    <!-- 养老服务专业 -->
    <router-view></router-view>
  </div>
</template>
<style lang="scss" scoped>
.tomenu {
  position: absolute;
  top: 6px;
  right: 705px;
  z-index: 999;
  display: flex;
  li {
    margin-right: 30px;
    cursor: pointer;
  }
}
.leftLocation{
  right: 175px;
}
.router-link-active {
  color: #eddd12;
}
</style>