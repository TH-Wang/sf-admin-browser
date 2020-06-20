<template>
  <div>
    <el-container id="container">
      <el-header>
        <div
          class="header-menu-button"
          @click="handleCollapse"
          :style="`width: ${isCollapse ? '64' : '200'}px`"
        >
          <i class="el-icon-menu"></i>
          <span :style="`opacity: ${isCollapse ? '0' : '1'}`">收起</span>
        </div>
        <top-work-space
          :isFull="isCollapse"
          @open-drawer="handleOpenDrawer"
        ></top-work-space>
      </el-header>
      <el-container id="main">
        <el-aside :style="`width: ${isCollapse ? '64' : '200'}px`">
          <el-menu
            :style="`width: ${isCollapse ? '64' : '200'}px`"
            :collapse="isCollapse"
            background-color="#182C61"
            text-color="#CAD3C8"
            active-text-color="#ffffff"
            default-active="1"
            unique-opened
          >
            <router-link :to="baseUrl + '/cash'">
              <el-menu-item index="1">
                <i class="el-icon-s-order"></i>
                <span slot="title">收银点单</span>
              </el-menu-item>
            </router-link>
            <el-submenu index="2">
              <template #title>
                <i class="el-icon-s-data"></i>
                <span>数据统计</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="2-1">营业额收益</el-menu-item>
                <el-menu-item index="2-2">受欢迎菜品</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-submenu index="3">
              <template #title>
                <i class="el-icon-food"></i>
                <span>菜品管理</span>
              </template>
              <el-menu-item-group>
                <router-link :to="baseUrl + '/foodadd'">
                  <el-menu-item index="3-1">添加菜品</el-menu-item>
                </router-link>
                <router-link :to="baseUrl + '/foodmanage'">
                  <el-menu-item index="3-2">所有菜品</el-menu-item>
                </router-link>
                <router-link :to="baseUrl + '/foodtype'">
                  <el-menu-item index="3-3">类别管理</el-menu-item>
                </router-link>
                <router-link :to="baseUrl + '/foodoption'">
                  <el-menu-item index="3-4">选项管理</el-menu-item>
                </router-link>
              </el-menu-item-group>
            </el-submenu>
            <router-link :to="baseUrl + '/orderlist'">
              <el-menu-item index="4">
                <i class="el-icon-document-copy"></i>
                <span slot="title">所有订单</span>
              </el-menu-item>
            </router-link>
            <el-menu-item index="5">
              <i class="el-icon-s-shop"></i>
              <span slot="title">店铺管理</span>
            </el-menu-item>
            <el-submenu index="6">
              <template #title>
                <i class="el-icon-s-custom"></i>
                <span slot="title">商家管理</span>
              </template>
              <el-menu-item-group>
                <router-link :to="baseUrl + '/storeadd'">
                  <el-menu-item index="8-1">新增商家</el-menu-item>
                </router-link>
                <router-link :to="baseUrl + '/storelist'">
                  <el-menu-item index="8-2">所有商家</el-menu-item>
                </router-link>
              </el-menu-item-group>
            </el-submenu>
            <router-link :to="baseUrl + '/set'">
              <el-menu-item index="7">
                <i class="el-icon-s-tools"></i>
                <span slot="title">设置</span>
              </el-menu-item>
            </router-link>
          </el-menu>
        </el-aside>
        <el-main :style="`width: calc(100% - ${isCollapse ? 64 : 200}px)`">
          <!-- <keep-alive> -->
          <router-view></router-view>
          <!-- </keep-alive> -->
        </el-main>
      </el-container>
      <el-drawer :visible.sync="drawer" :with-header="false">
        <span>我来啦!</span>
      </el-drawer>
    </el-container>
  </div>
</template>

<script>
import TopWorkSpace from "@/components/TopWorkSpace";

export default {
  components: {
    "top-work-space": TopWorkSpace
  },
  data() {
    return {
      baseUrl: "/admin",
      isCollapse: false,
      drawer: false
    };
  },
  methods: {
    handleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
    handleOpenDrawer() {
      this.drawer = true;
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
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  padding: 0;
}
.header-menu-button {
  width: 200px;
  height: 60px;
  line-height: 60px;
  box-sizing: border-box;
  padding: 0 20px;
  background-color: #55e6c1;
  color: white;
  cursor: pointer;
  transition: all 0.3s;
}
.header-menu-button i {
  width: 24px;
  text-align: center;
  font-size: 20px;
  margin-right: 5px;
}
.header-menu-button span {
  font-family: "黑体";
  transition: all 0.3s;
}
.top-work-space {
  width: calc(100% - 200px);
  border-bottom: solid 1px #eee;
  position: absolute;
  top: 0;
  right: 0;
}

.el-aside {
  width: 200px;
  height: calc(100% - 60px);
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 999;
  transition: all 0.3s;
  background-color: #182c61;
}
.open-collapse {
  width: 60px;
}

.el-menu {
  width: 100%;
  height: 100%;
  // background-color: $mainColor;
  box-sizing: border-box;
  border: none;
  transition: all 0.3s;
}
.el-menu-item {
  width: 100%;
  box-sizing: border-box;
  min-width: 0px;
}
.el-main {
  height: calc(100% - 60px);
  position: fixed;
  bottom: 0;
  right: 0;
  z-index: 998;
  transition: all 0.3s;
}
</style>

<style>
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
