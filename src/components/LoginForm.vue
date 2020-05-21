<template>
  <div ref="formList">
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    formRules: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    validate(fn) {
      let formList = this.$children;
      let resultArr = [];
      formList.forEach(item => {
        if ("validSelf" in item) {
          let rulesName = item.$props.ruleProp;
          let rules = rulesName ? this.$store.state.formRules[rulesName] : [];
          resultArr.push(item.validSelf(rules));
        }
      });
      fn(resultArr.filter(item => item == false).length == 0);
    },
    validField(prop) {
      let formList = this.$children;
      let rules = this.formRules[prop];
      if (!rules) {
        throw new Error(`未找到ruleProp: "${prop}"`);
      } else {
        let result = false;
        formList.forEach(item => {
          if ("validSelf" in item && item.$props.ruleProp == prop) {
            if (item.validSelf(rules)) result = true;
          }
        });
        console.log(result);
        return result;
      }
    }
  }
};
</script>

<style></style>
