<template>
  <div class="zb-table-view">
    <main class="zb-table-view__main">
      <section v-if="allSlots.filter" class="table-view__filter">
        <slot name="filter" :search="search" />
      </section>

      <section class="table-view__table">
        <div
          v-if="useColumnCustomer || allSlots.toolBar"
          class="table__toolbar-wrapper"
        >
          <div v-if="useColumnCustomer" class="table__cumtomer">
            <ColumnCustomer
              v-bind="$attrs"
              :columns="columns"
              :column-custom-method="columnCustomMethod"
            />
          </div>
          <div v-if="allSlots.toolBar" class="table__toolbar">
            <slot name="toolBar" />
          </div>
        </div>

        <ZbTable
          ref="table"
          :columns="useColumnCustomer ? filteredColumns : columns"
          :data="listData"
          v-bind="$attrs"
          v-on="$listeners"
        >
          <!-- 处理列的动态插槽 -->
          <template
            v-for="slotName in columnSlots"
            #[slotName]="{ row, col, rowIdx, colIdx }"
          >
            <slot
              :name="slotName"
              :row="row"
              :col="col"
              :rowIdx="rowIdx"
              :colIdx="colIdx"
            />
          </template>
        </ZbTable>
      </section>
    </main>

    <footer class="zb-table-view__footer">
      <el-pagination
        @size-change="handlePageChange('size', $event)"
        @current-change="handlePageChange('page', $event)"
        :current-page="pageNum"
        :page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      />
    </footer>
  </div>
</template>

<script>
import { cloneDeep } from "lodash";
import ZbTable from "./Table.vue";
import ColumnCustomer from "./ColumnCustomer.vue";

export default {
  name: "TableView",

  components: {
    ZbTable,
    ColumnCustomer,
  },

  props: {
    columns: {
      type: Array,
      required: true,
    },

    // 请求数据的方法
    // getListMethod(params, callback)
    //  - params 请求参数
    //  - callback 设置列表数据的回调（可选）
    //    callback({ listData, total, page })
    //
    // 有两种写法
    // 1. 返回一个 Promise 包裹的列表数据
    // 2. 调用callback， 参数是列表数据
    getListMethod: {
      type: Function,
      required: true,
    },

    autoFetch: {
      type: Boolean,
      default: true,
    },

    useColumnCustomer: {
      type: Boolean,
      default: false,
    },

    columnCustomMethod: {
      type: Function,
      validate(value) {
        if (this.useColumnCustomer) {
          return typeof value === "function";
        }
        return true;
      },
      default: () => {},
    },

    // 默认搜索参数
    defaultSearchParams: {
      type: Object,
      default: undefined,
    },
  },

  data() {
    return {
      listData: [],

      searchParams: {},

      // 分页相关数据
      pageNum: 1,
      pageSize: 10,
      total: 0,
    };
  },

  computed: {
    filteredColumns() {
      return this.columns.filter((col) => col.show);
    },

    requestParams() {
      return {
        ...this.searchParams,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      };
    },

    allSlots() {
      return {
        ...this.$slots,
        ...this.$scopedSlots,
      };
    },

    // 所有列的插槽，插槽名为列的 prop
    columnSlots() {
      const columnsProps = this.columns.map((col) => col.prop);
      return Object.keys(this.allSlots).filter((slotName) =>
        columnsProps.includes(slotName)
      );
    },
  },

  created() {
    if (this.defaultSearchParams) {
      this.setSearchParams(this.defaultSearchParams);
    }
  },

  mounted() {
    if (this.autoFetch) {
      this.fetchListData();
    }
  },

  methods: {
    getParams() {
      return this.requestParams;
    },

    /**
     * 返回ElTable实例
     */
    getElTable() {
      return this.$refs.table.getElTable();
    },

    async search(params = {}) {
      // 更新搜索参数，重置页码
      this.searchParams = cloneDeep(params);
      this.pageNum = 1;

      this.fetchListData();
    },

    setSearchParams(params) {
      this.searchParams = cloneDeep(params);
    },

    async fetchListData() {
      const params = this.requestParams;

      const res = this.getListMethod(params, this.setListData);
      if (res instanceof Promise) {
        this.setListData(await res);
      }
    },

    handlePageChange(type, value) {
      if (type === "size") {
        this.pageSize = value;
        this.pageNum = 1;
      } else this.pageNum = value;

      this.fetchListData();
    },

    /**
     * 设置列表数据
     * @param {Object} obj
     * @param {Array} obj.listData - 表格数据
     * @param {Number} obj.total - 总数
     * @param {Number} obj.page - 当前页数
     */
    setListData({ listData, total, page } = {}) {
      this.listData = listData || [];
      this.total = total || 0;
      this.pageNum = page || this.pageNum;
    },
  },
};
</script>

<style lang="scss" scoped>
.zb-table-view {
  height: calc(100vh - 84px);
  display: flex;
  flex-direction: column;
  background: #f5f5f5;

  .zb-table-view__main {
    flex: 1;
    overflow: auto;
    display: flex;
    flex-direction: column;

    @mixin sectionMixin() {
      margin-top: 16px;
      padding: 16px 24px;
      background: #fff;
    }
    .table-view__filter {
      @include sectionMixin();
    }

    .table-view__table {
      @include sectionMixin();
      flex: 1;

      .table__toolbar-wrapper {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;

        .table__toolbar {
          flex: 1;
          display: flex;
          justify-content: flex-end;
        }
      }
    }
  }

  .zb-table-view__footer {
    background: #fff;
    display: flex;
    justify-content: right;
    align-items: center;
    width: 100%;
    height: 48px;
    padding-right: 32px;
    text-align: right;
    border-top: 1px solid #eaeef5;
  }
}
</style>
