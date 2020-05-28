<template>
  <div>
    <el-table :data="foodList">
      <el-table-column type="expand">
        <template v-slot="scope">
          <p class="expand-head">下单选项:</p>
          <el-form>
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
      <el-table-column label="名称" prop="fname" width="250"></el-table-column>
      <el-table-column label="价格" prop="price" width="150"></el-table-column>
      <el-table-column label="优惠" align="center" width="150">
        <template v-slot="scope">
          <div v-if="scope.row.isSale">
            <el-tag
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
      <el-table-column label="操作" align="center">
        <template>
          <el-button size="mini">编辑</el-button>
          <el-button type="danger" size="mini">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data: () => ({
    foodList: []
  }),
  methods: {
    saleTag(item) {
      let str = "";
      let price = parseFloat(item.price);
      let salePrice = parseFloat(item.salePrice);
      switch (item.saleType) {
        case 1:
          str = `${parseFloat(((salePrice / price) * 10).toFixed(1))}折`;
          break;
        case 2:
          str = `立减${price - salePrice}元`;
          break;
      }
      return str;
    }
  },
  created() {
    this.axios
      .get("/admin/food/list", {
        params: { storeid: this.$store.state.info.id }
      })
      .then(res => {
        if (!res.data.err) {
          console.log(res.data.list.sort((n1, n2) => n2.price - n1.price));
          this.foodList = res.data.list.map(item => {
            item.price = `${item.price}元`;
            return item;
          });
        } else this.$message({ message: res.data.msg, type: "error" });
      })
      .catch(err => {
        console.log(err);
      });
  }
};
</script>

<style lang="scss" scoped>
.cover-image {
  width: 100px;
  height: 100px;
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
</style>
