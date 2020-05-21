<template>
  <div>
    <el-container id="container">
      <el-header>ElementUI</el-header>
      <el-container id="main">
        <el-aside width="200px">
          <el-menu default-active="1" unique-opened @select="getSelectMenu">
            <router-link :to="baseUrl + '/cash'">
              <el-menu-item index="1">
                <i class="el-icon-s-order"></i>
                <span slot="title">收银点单</span>
              </el-menu-item>
            </router-link>
            <el-submenu index="2">
              <template #title>
                <i class="el-icon-s-claim"></i>
                <span>今日推送</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="2-1">推送管理</el-menu-item>
                <el-menu-item index="2-2">往日推送</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-submenu index="3">
              <template #title>
                <i class="el-icon-s-data"></i>
                <span>数据统计</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="3-1">营业额收益</el-menu-item>
                <el-menu-item index="3-2">受欢迎菜品</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-submenu index="4">
              <template #title>
                <i class="el-icon-food"></i>
                <span>菜品管理</span>
              </template>
              <el-menu-item-group>
                <router-link :to="baseUrl + '/foodadd'">
                  <el-menu-item index="4-1">添加菜品</el-menu-item>
                </router-link>
                <router-link :to="baseUrl + '/foodmanage'">
                  <el-menu-item index="4-2">所有菜品</el-menu-item>
                </router-link>
                <router-link :to="baseUrl + '/foodtype'">
                  <el-menu-item index="4-3">类别管理</el-menu-item>
                </router-link>
                <router-link :to="baseUrl + '/foodoption'">
                  <el-menu-item index="4-4">菜品选项</el-menu-item>
                </router-link>
              </el-menu-item-group>
            </el-submenu>
            <el-menu-item index="5">
              <i class="el-icon-document-copy"></i>
              <span slot="title">所有订单</span>
            </el-menu-item>
            <el-menu-item index="6">
              <i class="el-icon-s-shop"></i>
              <span slot="title">店铺管理</span>
            </el-menu-item>
            <el-submenu index="7">
              <template #title>
                <i class="el-icon-s-custom"></i>
                <span slot="title">商家管理</span>
              </template>
              <el-menu-item-group>
                <router-link :to="baseUrl + '/storeadd'">
                  <el-menu-item index="7-1">新增商家</el-menu-item>
                </router-link>
                <router-link :to="baseUrl + '/storelist'">
                  <el-menu-item index="7-2">所有商家</el-menu-item>
                </router-link>
              </el-menu-item-group>
            </el-submenu>
            <router-link :to="baseUrl + '/set'">
              <el-menu-item index="8">
                <i class="el-icon-s-tools"></i>
                <span slot="title">设置</span>
              </el-menu-item>
            </router-link>
          </el-menu>
        </el-aside>
        <el-main>
          <keep-alive>
            <router-view :include="['storeadd']"></router-view>
          </keep-alive>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      baseUrl: "/admin"
    };
  },
  methods: {
    getSelectMenu(index, path) {
      console.log(index, path);
    }
  }
};
</script>

<style lang="scss" scoped>
#container {
  width: 100%;
  height: 100%;
}
.el-header {
  width: 100%;
  line-height: 60px;
  background-color: #424476;
  color: white;
  font-size: 24px;
  font-weight: bold;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
}
.el-aside {
  height: calc(100% - 60px);
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 999;
}
.el-menu {
  width: 100%;
  height: 100%;
  background-color: white;
  box-sizing: border-box;
}
.el-main {
  width: calc(100% - 200px);
  height: calc(100% - 60px);
  position: fixed;
  bottom: 0;
  right: 0;
  z-index: 998;
}
.el-menu-item {
  width: 100%;
  box-sizing: border-box;
  min-width: 0px;
}
</style>

<style>
.el-menu-item i,
.el-submenu i {
  color: #424476;
}
/* 表单label */
.el-form-item__label {
  padding: 0px 16px 0px 0px;
}
/* 侧边栏 > 二级导航标题 */
.el-menu-item-group__title {
  padding: 0;
}
/* 输入框前后缀插槽 */
.el-input-group__append,
.el-input-group__prepend {
  padding: 0px 15px;
}
</style>
