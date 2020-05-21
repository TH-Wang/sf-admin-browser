<template>
  <div>
    <el-checkbox-group
      v-for="item in optionsData"
      :key="item.id"
      class="check-box"
      v-model="checkedList"
      @change="handleModel"
    >
      <el-checkbox
        class="check-title"
        :label="item"
        @change="checked => handleChange(checked, item)"
      >
        {{ item.title }}
      </el-checkbox>
      <el-checkbox-group
        size="small"
        v-model="item.check"
        @change="checked => handleCheckBtnChange(checked, item)"
      >
        <el-checkbox-button v-for="el in item.opts" :key="el" :label="el">
        </el-checkbox-button>
      </el-checkbox-group>
    </el-checkbox-group>
  </div>
</template>

<script>
export default {
  model: {
    prop: "checkedList",
    event: "change"
  },
  props: {
    optionsData: {
      type: Array,
      default: () => []
    }
  },
  data: () => ({
    dataList: [],
    checkedList: [],
    list: ["微辣", "中辣"],
    getter: []
  }),
  methods: {
    handleChange(checked, data) {
      checked
        ? (this.checkedList = this.checkedList.map(item => {
            if (item.id == data.id) item.check = item.opts;
            return item;
          }))
        : (this.dataList = this.dataList.map(item => {
            if (item.id == data.id) item.check = [];
            return item;
          }));
    },
    handleCheckBtnChange(value, data) {
      if (value.length == 0)
        this.checkedList = this.checkedList.filter(item => item.id != data.id);
      else {
        data.check = value;
        this.checkedList.push(data);
      }
    },
    handleModel(model) {
      this.$emit("change", model);
    }
  },
  watch: {
    optionsData: function(newValue) {
      this.dataList = newValue;
    }
  }
};
</script>

<style lang="scss" scoped>
.check-box {
  display: flex;
  align-items: center;
}
.check-box + .check-box {
  margin-top: 12px;
}
.el-checkbox-group {
  margin-left: 15px;
}
</style>
