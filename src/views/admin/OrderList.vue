<template>
  <div>
    <el-table :data="tableList" border stripe>
      <el-table-column type="expand">
        <template v-slot="scope">
          <h4>菜品列表：</h4>
          <p
            v-for="item in scope.row.foodList"
            :key="item.id"
            class="food-list-item"
          >
            <span
              class="food-img"
              :style="
                `background-image: url(http://localhost:3000/public/images/${item.imgurl})`
              "
            ></span>
            <span>{{ item.foodname }}</span>
            <span> ×{{ item.count }}</span>
            <span class="food-sum">{{ item.sum }}</span>
          </p>
        </template>
      </el-table-column>
      <el-table-column
        label="订单ID"
        width="250"
        prop="orderid"
        align="center"
      ></el-table-column>
      <el-table-column label="实付金额" width="150" align="center">
        <template v-slot="scope">
          <span style="color:#ffa801"> ￥{{ scope.row.payprice }} </span>
        </template>
      </el-table-column>
      <el-table-column label="下单日期" width="150" align="center">
        <template v-slot="scope">{{ dateTransText(scope.row.ctime) }}</template>
      </el-table-column>
      <el-table-column label="就餐方式" width="150" align="center">
        <template v-slot="scope">
          <span :style="`color: ${scope.row.ispack ? '#67C23A' : '#409EFF'}`">
            {{ packText(scope.row.ispack) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center">
        <template v-slot="scope">{{ describe(scope.row.notes) }}</template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200">
        <template v-slot="scope">
          <el-button
            type="danger"
            size="mini"
            @click="handleRomove(scope.row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pager"
      background
      layout="total, sizes, prev, pager, next, jumper"
      :total="orderTotal"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="pageSize"
      :current-page.sync="curPage"
      @current-change="handlePagerChange"
      @size-change="handleSizeChange"
    >
    </el-pagination>
  </div>
</template>

<script>
import { dateTransText } from "@/utils/date.js";

export default {
  data: () => ({
    tableList: [],
    orderList: [],
    pageSize: 10,
    curPage: 1,
    orderTotal: 0
  }),
  methods: {
    dateTransText,
    packText(ispack) {
      return ispack ? "打包" : "店内";
    },
    describe(notes) {
      return notes == "" ? "无" : notes;
    },
    handlePagerChange(val) {
      this.reactiveTable(val, this.pageSize);
    },
    handleSizeChange(size) {
      this.pageSize = size;
      this.reactiveTable(this.curPage, this.pageSize);
    },
    reactiveTable(cur, size) {
      // var reactList = null;
      // let key = this.searchVal;
      // if (key == "") {
      //   reactList = this.orderList;
      // } else {
      //   reactList = this.orderList.filter(
      //     item =>
      //       item.fname.indexOf(key) != -1 || item.typename.indexOf(key) != -1
      //   );
      // }

      var reactList = this.orderList;
      this.tableList = reactList.filter(
        (item, index) => index >= (cur - 1) * size && index < cur * size
      );
      this.orderTotal = reactList.length;
    }
  },
  created() {
    var __this__ = this;
    this.axios
      .get("/admin/order/list", {
        params: { storeid: __this__.$store.state.info.id }
      })
      .then(res => {
        let size = this.pageSize;
        this.orderList = res.data.orderlist.reverse();
        this.orderTotal = this.orderList.length;
        this.tableList = this.orderList.filter((item, index) => index < size);
      })
      .catch(err => {
        console.log(err);
      });
  }
};
</script>

<style lang="scss" scoped>
.food-list-item {
  margin-top: 15px;
  display: flex;
  align-items: center;
}
.food-list-item span {
  margin-right: 20px;
}
.food-img {
  display: inline-block;
  width: 50px;
  height: 50px;
  border-radius: 4px;
  background-position: center;
  background-size: cover;
}
.food-sum::before {
  content: "￥";
  font-size: 12px;
}
.pager {
  margin: 30px 0 30px 0;
  text-align: center;
}
</style>
