<template>
  <div :class="`container ${isFull ? 'full-container' : ''}`">
    <!-- 头像 -->
    <el-dropdown>
      <div class="avatar-box"></div>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>店铺信息</el-dropdown-item>
        <el-dropdown-item>店铺信息</el-dropdown-item>
        <el-dropdown-item>店铺信息</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <!-- 打开消息列表按钮 -->
    <el-tooltip
      class="item"
      effect="dark"
      content="打开消息列表"
      placement="bottom-end"
    >
      <div class="icon-box" @click="openDrawer">
        <i class="el-icon-message-solid"></i>
      </div>
    </el-tooltip>
    <!-- 更多按钮 -->
    <el-dropdown>
      <div class="icon-box">
        <i class="el-icon-more"></i>
      </div>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>
          <span class="more-icon el-icon-full-screen"></span>全屏展示
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
export default {
  props: {
    isFull: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    openDrawer() {
      console.log(true);
      this.$emit("open-drawer");
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  padding: 0 20px;
  box-sizing: border-box;
  width: calc(100% - 200px);
  height: 61px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  border-bottom: solid 1px #eee;
  position: absolute;
  top: 0;
  right: 0;
  background-color: rgb(250, 250, 250);
  transition: all 0.3s;
}
.full-container {
  width: calc(100% - 64px);
}
.avatar-box {
  width: 40px;
  height: 40px;
  border-radius: 100%;
  background-position: center;
  background-size: cover;
  border: solid 1px #eee;
  background-image: url(../assets/easy-work.png);
  cursor: pointer;
}
.icon-box {
  margin-left: 8px;
  width: 40px;
  height: 40px;
  font-size: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s;
  color: #555;
  border-radius: 100%;
}
.icon-box:hover {
  background-color: #eee;
}
.more-icon {
  margin-right: 3px;
}
</style>
