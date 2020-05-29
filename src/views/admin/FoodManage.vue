<template>
  <div>
    <el-form>
      <el-form-item label="排序方式">
        <el-select
          v-model="sortType"
          placeholder="请选择"
          size="small"
          @change="handleSortChange"
        >
          <el-option
            v-for="item in sortOpts"
            :key="item.id"
            :label="item.label"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <el-table :data="tableList" border>
      <el-table-column type="expand">
        <template v-slot="scope">
          <el-form>
            <p class="expand-head">介绍:</p>
            <span>{{ scope.row.descs }}</span>
            <p class="expand-head" style="margin-top:40px;">下单选项:</p>
            <el-form-item
              v-for="item in JSON.parse(scope.row.opts)"
              :key="item.id"
              :label="item.title"
            >
              <el-tag
                v-for="(opt, index) in item.opts"
                :key="index"
                class="opts-tag"
              >
                {{ opt }}
              </el-tag>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        label="类别"
        prop="typename"
        width="100"
        align="center"
      ></el-table-column>
      <el-table-column label="图片" width="150" align="center">
        <template v-slot="scope">
          <div
            class="cover-image"
            :style="`background-image: url(${scope.row.cover})`"
          ></div>
        </template>
      </el-table-column>
      <el-table-column label="名称" prop="fname"></el-table-column>
      <el-table-column label="价格" width="150" align="center">
        <template v-slot="scope">{{ scope.row.price }}元</template>
      </el-table-column>
      <el-table-column label="优惠" align="center" width="150">
        <template v-slot="scope">
          <div v-if="scope.row.isSale">
            <el-tag
              v-if="scope.row.saleType != 3"
              :type="scope.row.saleType == 1 ? 'warning' : ''"
              size="medium"
              >{{ saleTag(scope.row) }}</el-tag
            >
            <p class="salePrice">优惠价：{{ scope.row.salePrice }}元</p>
          </div>
          <p v-else>无</p>
        </template>
      </el-table-column>
      <el-table-column label="推送" align="center" width="150">
        <template v-slot="scope">
          <el-tag type="danger" v-if="scope.row.isHot" class="push-tag"
            >热销</el-tag
          >
          <el-tag type="success" v-if="scope.row.isNew" class="push-tag"
            >新品</el-tag
          >
          <p v-if="!scope.row.isHot && !scope.row.isNew">无</p>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200">
        <template v-slot="scope">
          <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
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
      :total="foodList.length"
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
export default {
  data: () => ({
    tableList: [],
    foodList: [],
    sortType: null,
    sortOpts: [
      { id: 0, label: "按类别" },
      { id: 1, label: "添加时间" },
      { id: 2, label: "价格从小到大" },
      { id: 3, label: "价格从大到小" }
    ],
    pageSize: 10,
    curPage: 1
  }),
  methods: {
    handleSortChange(value) {
      switch (value) {
        case 0:
          this.foodList.sort((n1, n2) => n1.typeid - n2.typeid);
          break;
        case 1:
          this.foodList.sort((n1, n2) => n2.id - n1.id);
          break;
        case 2:
          this.foodList.sort(
            (n1, n2) => parseInt(n1.price) - parseInt(n2.price)
          );
          break;
        case 3:
          this.foodList.sort(
            (n1, n2) => parseInt(n2.price) - parseInt(n1.price)
          );
          break;
      }
      this.pagerTable(this.curPage, this.pageSize);
    },
    saleTag(item) {
      let str = "";
      let price = parseFloat(item.price);
      let salePrice = parseFloat(item.salePrice);
      switch (item.saleType) {
        case 1:
          str = `${parseFloat(((salePrice / price) * 10).toFixed(1))}折`;
          break;
        case 2:
          str = `立减${parseFloat((price - salePrice).toFixed(2))}元`;
          break;
      }
      return str;
    },
    handlePagerChange(val) {
      this.pagerTable(val, this.pageSize);
    },
    handleSizeChange(size) {
      this.pageSize = size;
      this.pagerTable(this.curPage, this.pageSize);
    },
    pagerTable(val, size) {
      this.tableList = this.foodList.filter(
        (item, index) => index >= (val - 1) * size && index < val * size
      );
    },
    handleEdit(data) {
      this.$router.push({ name: "FoodAdd", params: { data } });
    },
    async handleRomove(id) {
      try {
        await this.$confirm("是否删除该菜品？", "删除", {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "error"
        });
        let res = await this.axios.post("/admin/food/remove", { id });
        if (!res.data.err) {
          this.foodList = this.foodList.filter(item => item.id != id);
          this.pagerTable(this.curPage, this.pageSize);
          this.$message({ message: res.data.msg, type: "success" });
        } else this.$alert(res.data.msg, "错误", { type: "error" });
      } catch (error) {
        Promise.reject(error);
      }
    }
  },
  created() {
    this.axios
      .get("/admin/food/list", {
        params: { storeid: this.$store.state.info.id }
      })
      .then(res => {
        if (!res.data.err) {
          this.foodList = res.data.list;
          let size = this.pageSize;
          this.tableList = this.foodList.filter((item, index) => index < size);
        } else this.$message({ message: res.data.msg, type: "error" });
      })
      .catch(err => {
        console.log(err);
      });
  }
};
</script>

<style lang="scss" scoped>
.el-select {
  width: 150px;
  line-height: 32px;
}
.cover-image {
  width: 100px;
  height: 100px;
  margin: 0 auto;
  background-size: cover;
  background-position: center;
  border-radius: 5px;
}
.salePrice {
  font-weight: bold;
  color: #e6a23c;
  margin-top: 12px;
}
.push-tag + .push-tag {
  margin-left: 8px;
}
.expand-head {
  margin-bottom: 15px;
  font-weight: bold;
}
.el-form-item {
  margin-bottom: 10px;
}
.opts-tag + .opts-tag {
  margin-left: 8px;
}
.pager {
  margin: 30px 0 30px 0;
  text-align: center;
}
</style>
