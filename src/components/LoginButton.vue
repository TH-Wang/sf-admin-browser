<template>
  <div :class="'button ' + type" @click="emitClick">
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: "general"
    }
  },
  methods: {
    emitClick() {
      this.$emit("click");
    }
  }
};
</script>

<style lang="scss" scoped>
$color: #293a9a;
$active-color: #5a6cd3;
$box-shadow-color: #1a2462;
.button {
  width: 100%;
  height: 50px;
  line-height: 48px;
  margin-bottom: 28px;
  text-align: center;
  cursor: pointer;
  letter-spacing: 1px;
  transition: all 0.2s;
  border-radius: 25px;
  background-color: $color;
  color: #a6b1ff;
  font-size: 16px;
  transition: all 0.3s;
  box-shadow: 0 12px 25px 0px $box-shadow-color;
}
.button:hover {
  transform: translateY(-3px);
  box-shadow: 0 18px 25px -4px #151e51;
}
.general {
  background-color: $color;
}
.contrast {
  background-color: #00aba2;
  color: #eee;
  box-shadow: 0 12px 25px 0px #1b2665;
}
</style>
