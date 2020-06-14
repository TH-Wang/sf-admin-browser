<template>
  <div>
    <div :class="`order-item ${mode}-order`">
      <p class="order-header">
        <span class="order-number">{{ info.orderNumber }}号</span>
        <span class="order-table">{{ info.tableNumber }}号桌</span>
      </p>
      <div class="order-detail">
        <span
          v-for="(item, index) in info.detail"
          :key="index"
          class="order-detail-item"
        >
          {{ `${item.name} ${item.count}份` }}
        </span>
      </div>
      <p class="order-ctime">{{ info.ctime }}</p>
    </div>
  </div>
</template>

<script>
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
  background-color: #ff6b6b;
  box-shadow: 0 2px 15px -2px rgba($color: #000000, $alpha: 0.2);
}
.doing-order {
  color: white;
  background-color: #1dd1a1;
  box-shadow: 0 2px 15px -2px rgba($color: #000000, $alpha: 0.1);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
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

.order-ctime {
  text-align: right;
  font-size: 12px;
}
</style>
