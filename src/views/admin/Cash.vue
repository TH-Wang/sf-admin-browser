<template>
  <div>
    <div class="card-container">
      <card-panel class="card-panel" title="今日订单量" :number="orderTotalNum">
        <template #suffix>
          <span class="card-suffix">号</span>
        </template>
      </card-panel>
      <card-panel
        class="card-panel"
        title="今日营业额"
        :number="turnover"
        :fixedPlace="2"
      >
        <template #prefix>
          <span class="card-prefix">￥</span>
        </template>
      </card-panel>
      <card-panel
        class="card-panel"
        title="正在点餐顾客"
        :number="customerCount"
        numberColor="#487eb0"
      >
        <template #suffix>
          <span class="card-suffix">名</span>
        </template>
      </card-panel>
    </div>
    <div class="order-container">
      <div class="order-list">
        <div class="order-list-title">
          <span class="order-header-button pending">进行中</span>
        </div>
        <transition-group name="list">
          <order-item
            v-for="item in doingOrderList"
            :key="item.orderid"
            :info="item"
            mode="pending"
          ></order-item>
        </transition-group>
      </div>
      <div class="order-list">
        <div class="order-list-title">
          <span class="order-header-button doing">已完成</span>
        </div>
        <transition-group name="list">
          <order-item
            v-for="item in finishOrderList"
            :key="item.orderid"
            :info="item"
            mode="doing"
          ></order-item>
        </transition-group>
      </div>
    </div>
    <!-- <el-button @click="sendSocketInfo">发送</el-button> -->
  </div>
</template>

<script>
import CardPanel from "@/components/CardPanel";
import OrderItem from "@/components/OrderItem";
import { dateDiff } from "@/utils/date.js";

export default {
  components: {
    "card-panel": CardPanel,
    "order-item": OrderItem
  },
  data: () => ({
    list: [
      {
        id: 1,
        orderNumber: 159,
        tableNumber: 7,
        detail: [
          { name: "酸菜肉丝盖饭", count: 1 },
          { name: "酸菜肉丝盖饭", count: 1 }
        ],
        ctime: "今天13:45"
      },
      {
        id: 2,
        orderNumber: 160,
        tableNumber: 6,
        detail: [{ name: "酸菜肉丝盖饭", count: 1 }],
        ctime: "今天13:45"
      },
      {
        id: 3,
        orderNumber: 161,
        tableNumber: 5,
        detail: [{ name: "酸菜肉丝盖饭", count: 1 }],
        ctime: "今天13:45"
      },
      {
        id: 4,
        orderNumber: 162,
        tableNumber: 4,
        detail: [{ name: "酸菜肉丝盖饭", count: 1 }],
        ctime: "今天13:45"
      }
    ]
  }),
  computed: {
    orderList() {
      return this.$store.state.orderList;
    },
    customerCount() {
      return this.$store.state.customers.length;
    },
    orderTotalNum() {
      return this.$store.state.orderList.length;
    },
    turnover() {
      return this.$store.state.orderList.reduce((prev, item) => {
        return (
          prev +
          item.foodList.reduce((sum, el) => {
            return sum + el.sum;
          }, 0)
        );
      }, 0);
    },
    doingOrderList() {
      return this.$store.state.orderList.filter(
        item => item.state == 1 && dateDiff(item.ctime) < 0
      );
    },
    finishOrderList() {
      return this.$store.state.orderList
        .filter(item => item.state == 0 && dateDiff(item.ctime) < 0)
        .reverse();
    }
  },
  mounted() {
    // var __this__ = this;
    // var ws = new WebSocket("ws://localhost:5000");
    // ws.sendData = function(data) {
    //   ws.send(JSON.stringify(data));
    // };
    // ws.onopen = function() {
    //   console.log("connect socket server");
    //   ws.sendData({
    //     event: "storeAuthorize",
    //     data: {
    //       storeid: __this__.$store.state.info.id
    //     }
    //   });
    // };
    // ws.onmessage = function(msg) {
    //   console.log(msg);
    // };
    // ws.onclose = function(e) {
    //   console.log(e);
    // };
  }
};
</script>

<style lang="scss" scoped>
.card-container {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}
.card-prefix {
  font-size: 36px;
}
.card-suffix {
  font-size: 18px;
  margin-left: 10px;
}

.order-container {
  margin-top: 30px;
  display: flex;
  justify-content: space-around;
}
.order-list-title {
  margin-bottom: 10px;
}
.order-header-button {
  display: inline-block;
  width: 100px;
  height: 36px;
  line-height: 36px;
  font-size: 16px;
  font-weight: bold;
  border-radius: 36px;
  text-align: center;
}

.order-list {
  width: 45%;
  max-height: 800px;
  padding: 20px 20px;
  transition: all 0.2s;
  border: solid 1.5px transparent;
  overflow-y: scroll;
}
.order-list:hover {
  border: solid 1.5px #8395a7;
  box-shadow: inset 0 0 15px 0 rgba($color: #000000, $alpha: 0.1);
}

.list-enter-active,
.list-leave-active {
  transition: all 0.5s;
}
.list-enter,
.list-leave-to {
  opacity: 0;
  transform: scale(0.8) translateY(30px);
}
.list-move {
  transition: all 0.5s;
}
</style>
