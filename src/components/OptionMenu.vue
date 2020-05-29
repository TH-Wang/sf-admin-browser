<template>
  <div>
    <el-checkbox-group v-model="checkedList">
      <div v-for="item in dataList" :key="item.id" class="check-box">
        <el-checkbox
          class="check-title"
          :label="item"
          :checked="confirmChecked(item)"
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
      </div>
    </el-checkbox-group>
  </div>
</template>

<script>
export default {
  model: {
    prop: "optionsCheck",
    event: "change"
  },
  props: {
    optionsData: {
      type: Array,
      default: () => []
    },
    optionsCheck: {
      type: Array,
      default: () => []
    }
  },
  data: () => ({
    dataList: [],
    checkedList: []
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
      this.$emit("change", this.checkedList);
    },
    handleCheckBtnChange(value, data) {
      if (!this.checkedList.some(item => item.id == data.id))
        this.checkedList.push(data);
      if (value.length == 0)
        this.checkedList = this.checkedList.filter(item => item.id != data.id);
      this.$emit("change", this.checkedList);
    },
    clearOptions() {
      this.checkedList = [];
      this.dataList = this.dataList.map(item => {
        item.check = [];
        return item;
      });
    },
    confirmChecked(data) {
      return this.optionsCheck.some(item => item.id == data.id);
    }
  },
  watch: {
    optionsData: function(val) {
      var __this__ = this;
      this.dataList = val.map(item => {
        let checkItem = __this__.optionsCheck.find(el => el.id == item.id);
        item.check = checkItem ? checkItem.opts : [];
        return item;
      });
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
