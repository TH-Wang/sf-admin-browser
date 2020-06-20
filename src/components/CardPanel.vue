<template>
  <div class="container">
    <p class="title">{{ title }}</p>
    <div class="main-box">
      <slot name="prefix"></slot>
      <span :style="`color: ${numberColor}`">
        <span class="number-text">{{ splitNumber[0] }}</span>
        <span class="float-text" v-if="fixedPlace > 0"
          >.{{ splitNumber[1] }}</span
        >
      </span>
      <slot name="suffix"></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    // 标题
    title: {
      type: String,
      default: ""
    },
    // 数字
    number: {
      type: Number,
      default: 0
    },
    // 数字的颜色样式
    numberColor: {
      type: String,
      default: "#333333"
    },
    // 保留几位小数
    fixedPlace: {
      type: Number,
      default: 0
    }
  },
  computed: {
    splitNumber() {
      return this.number.toFixed(this.fixedPlace).split(".");
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  width: 28%;
  min-width: 265px;
  height: 220px;
  padding: 20px;
  box-sizing: border-box;
  box-shadow: 0 12px 35px -10px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  flex: none;
}
.title {
  height: 30px;
  color: #555;
  font-weight: bold;
}
.main-box {
  height: 140px;
  line-height: 140px;
  text-align: center;
  font-family: "等线";
  font-weight: bold;
}
.number-text {
  font-size: 66px;
}
.float-text {
  font-size: 42px;
}
.suffix-text {
  font-weight: 12px;
  margin-left: 10px;
}
</style>
