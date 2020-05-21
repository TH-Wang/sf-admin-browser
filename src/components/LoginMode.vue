<template>
  <div>
    <div class="container">
      <span
        :class="'mode-title ' + (isPass ? 'active' : '')"
        @click="handleSwitch($event, true)"
        >密码登录</span
      >
      <span class="mode-or">OR</span>
      <span
        :class="'mode-title ' + (isPass ? '' : 'active')"
        @click="handleSwitch($event, false)"
        >短信登录</span
      >
      <span
        class="active-baseline"
        :style="`transform: translateX(${lineTranslate + 9}px)`"
      ></span>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    isPass: true,
    lineTranslate: 0
  }),
  methods: {
    handleSwitch($event, pass) {
      this.isPass = pass;
      this.lineTranslate = $event.target.offsetLeft;
      this.$emit("mode", pass);
    }
  }
};
</script>

<style lang="scss" scoped>
$color: #929de2;
$active-color: #bcc4ed;
$line-width: 26 * 3em;
.container {
  margin-bottom: 30px;
  display: inline-block;
  font-size: 1px;
  position: relative;
}
.mode-title {
  color: $color;
  font-size: 24em;
  cursor: pointer;
}
.mode-or {
  color: $color;
  margin: 0px 10px;
  font-size: 15em;
}
.active {
  color: $active-color;
}
.active-baseline {
  width: $line-width;
  height: 1.5em;
  background-color: $active-color;
  position: absolute;
  left: 0px;
  bottom: -5px;
  transition: all 0.3s;
}
</style>
