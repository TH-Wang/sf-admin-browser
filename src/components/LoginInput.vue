<template>
  <div>
    <div class="container">
      <transition name="tip">
        <span v-show="isError" class="tip"
          ><i class="el-icon-warning-outline"></i> {{ msg }}</span
        >
      </transition>
      <slot name="prepend"></slot>
      <div class="input-box" :style="boxStyle">
        <input
          :type="type"
          :placeholder="placeholder"
          :value="value"
          :maxlength="maxlength"
          @input="handleInput"
          @focus="handleFocus"
          @blur="handleBlur"
        />
        <i
          v-if="clearable"
          v-show="hasContent"
          @click="handleClear"
          class="el-icon-circle-close clear-btn"
        ></i>
      </div>
      <slot name="append" class=""></slot>
    </div>
  </div>
</template>

<script>
export default {
  model: {
    prop: "value",
    event: "model"
  },
  props: {
    value: String,
    icon: {
      type: String,
      default: "el-icon-check"
    },
    type: {
      type: String,
      default: "text"
    },
    placeholder: {
      type: String,
      default: "请输入内容"
    },
    clearable: {
      type: Boolean,
      default: false
    },
    ruleProp: {
      type: String,
      default: null
    },
    maxlength: {
      type: Number,
      default: 100
    }
  },
  data() {
    return {
      boxStyle: "",
      isError: false,
      hasContent: false,
      msg: "",
      strictType: null
    };
  },
  methods: {
    handleInput($event) {
      this.$emit("model", $event.target.value);
      this.hasContent = this.value.length > 1;
    },
    handleFocus() {
      this.boxStyle =
        "box-shadow: 0 14px 14px -14px #465ace;border-bottom: solid 1px #C8CFFF";
    },
    handleBlur() {
      this.boxStyle = "";
      this.validSelf(this.$store.state.formRules[this.ruleProp]);
    },
    handleClear() {
      this.$emit("model", "");
      this.hasContent = false;
    },
    validSelf(rule) {
      if (rule.length == 0) return true;
      let result = rule.every(item => {
        if ("required" in item && this.value == "") {
          this.msg = item.msg;
          return false;
        } else if ("reg" in item && !item.reg.test(this.value)) {
          this.msg = item.msg;
          return item.reg.test(this.value);
        }
        return true;
      });
      this.isError = !result;
      return result;
    }
  }
};
</script>

<style lang="scss" scoped>
$height: 50px;
$label-height: $height * 0.6;
$color: #99a6ff;
.container {
  width: 100%;
  height: $height;
  margin-bottom: 30px;
  position: relative;
  display: flex;
  align-items: center;
}
.tip {
  display: inline-block;
  padding: 3px 5px;
  border-radius: 5px;
  position: absolute;
  bottom: -30px;
  left: 0px;
  color: red;
  background-color: #ffbd13;
  font-size: 12px;
}
.tip-enter-active,
.tip-leave-active {
  transition: all 0.2s;
}
.tip-enter,
.tip-leave-to {
  opacity: 0.3;
  transform: translateX(20px) scale(0.8);
}
.clear-btn {
  color: $color;
  cursor: pointer;
  display: inline-block;
  vertical-align: baseline;
  transition: all 0.2s;
}
.clear-btn:hover {
  color: #eee;
}
.input-box {
  flex: 1;
  height: $height;
  padding: 5px 15px;
  border-bottom: solid 1px $color;
  transition: all 0.3s;
  box-sizing: border-box;
}
input {
  width: calc(100% - 16px);
  height: 100%;
  border: none;
  outline: none;
  font-size: 16px;
  background-color: transparent;
  color: #eee;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
}
input::-webkit-input-placeholder {
  color: $color;
  font-size: 14px;
  letter-spacing: 1px;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, PingFang SC,
    Hiragino Sans GB, Microsoft YaHei, Helvetica Neue, Helvetica, Arial,
    sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol;
}
input::-moz-placeholder {
  color: $color;
  font-size: 14px;
  letter-spacing: 1px;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, PingFang SC,
    Hiragino Sans GB, Microsoft YaHei, Helvetica Neue, Helvetica, Arial,
    sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol;
}
input:-moz-placeholder {
  color: $color;
  font-size: 14px;
  letter-spacing: 1px;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, PingFang SC,
    Hiragino Sans GB, Microsoft YaHei, Helvetica Neue, Helvetica, Arial,
    sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol;
}
input:-ms-input-placeholder {
  color: $color;
  font-size: 14px;
  letter-spacing: 1px;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, PingFang SC,
    Hiragino Sans GB, Microsoft YaHei, Helvetica Neue, Helvetica, Arial,
    sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol;
}
input::selection {
  background-color: white;
  color: #1d72d9;
}
</style>
