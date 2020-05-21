<template>
  <div>
    <i :class="icon"></i>
    <span>
      <slot></slot>
    </span>
  </div>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      default: "el-icon-folder-checked"
    }
  }
};
</script>

<style lang="scss" scoped>
div {
  margin: 0 0 15px 10px;
  height: 50px;
  line-height: 50px;
  font-size: 18px;
  font-weight: bold;
  color: #555;
}
span {
  margin-left: 12px;
}
</style>
