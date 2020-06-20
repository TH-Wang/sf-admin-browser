<template>
  <div>
    <div :class="`order-item ${mode}-order`">
      <p class="order-header">
        <span style="display:flex;align-items:center;">
          <span class="order-number ">{{ info.orderNum }}号</span>
          <span v-if="info.ispack" :class="`order-pack-button ${mode}-pack`"
            >打包</span
          >
        </span>
        <span class="order-table">{{ tableNum }}号桌</span>
      </p>
      <div class="order-detail">
        <span
          v-for="item in info.foodList"
          :key="item.id"
          class="order-detail-item"
        >
          {{ `${item.foodname} ${item.count}份` }}
        </span>
      </div>
      <p class="describe">备注: {{ describe }}</p>
      <p class="order-ctime">
        <span class="total-text">总计: {{ info.total.toFixed(2) }}元</span>
        <span>
          <span class="time-text">{{ timeText }}</span>
          <button
            class="change-staten-button"
            v-if="info.state == 1"
            @click="finishOrder()"
          >
            已完成
          </button>
        </span>
      </p>
    </div>
  </div>
</template>

<script>
import { dateTransText } from "@/utils/date.js";

export default {
  props: {
    info: {
      type: Object,
      default: () => ({})
    },
    // 订单状态
    mode: {
      type: String,
      default: "pending"
    }
  },
  methods: {
    finishOrder() {
      let orderid = this.info.orderid;
      this.axios.post("/admin/order/finish", { orderid }).then(res => {
        if (!res.err) this.$store.commit("changeOrder", orderid);
      });
    }
  },
  computed: {
    tableNum() {
      return parseInt(Math.random() * 20) + 1;
    },
    timeText() {
      return dateTransText(this.info.ctime);
    },
    describe() {
      return this.info.notes == "" ? "无" : this.info.notes;
    }
  }
};
</script>

<style lang="scss" scoped>
.el-badge {
  display: block;
  cursor: pointer;
}
.is-dot {
  width: 10px;
  height: 10px;
}
.order-item {
  width: 100%;
  margin: 12px 0;
  padding: 15px;
  box-sizing: border-box;
  background-color: #eee;
  border-radius: 4px;
  cursor: pointer;
}
.pending-order {
  color: white;
  background-color: #1dd1a1;
  box-shadow: 0 2px 15px -2px rgba($color: #000000, $alpha: 0.2);
}
.doing-order {
  color: #999;
  background-color: #dddddd;
  box-shadow: 0 2px 15px -2px rgba($color: #000000, $alpha: 0.1);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.order-pack-button {
  margin-left: 10px;
  display: inline-block;
  width: 70px;
  height: 32px;
  line-height: 32px;
  text-align: center;
  border-radius: 18px;
  font-size: 13px;
}
.pending-pack {
  background-color: #10ac84;
  color: white;
}
.doing-pack {
  background-color: #cccccc;
  color: #999;
}
.order-number {
  font-size: 22px;
  font-weight: bold;
}
.order-table {
  font-weight: bold;
}

.order-detail {
  font-size: 15px;
  padding: 10px 15px;
}
.order-detail-item {
  margin-right: 30px;
}

.describe {
  margin-top: 5px;
  padding-left: 15px;
  box-sizing: border-box;
  font-size: 12px;
}

.order-ctime {
  margin-top: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  padding-left: 15px;
  box-sizing: border-box;
}

.total-text {
  font-size: 15px;
}

.time-text {
  margin-right: 15px;
}

.change-staten-button {
  width: 68px;
  height: 32px;
  border-radius: 4px;
  color: #409eff;
  background-color: #ecf5ff;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}
.change-staten-button:hover {
  background-color: #9cd8e4;
}
</style>
