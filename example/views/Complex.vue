<template>
  <TableView 
    use-column-customer
    :column-custom-method="columnCustomMethod"
    :column-min-count="1"
    :columns="columns"
    :get-list-method="getDataList">
    <template #filter="{ search }">
      <ListFilter 
        @search="search($event)"
        @reset="search($event)"
      ></ListFilter>
    </template>

    <template #age="{ row }">
      自定义渲染内容：{{row.age}}
    </template>

    <template #toolBar>
      <el-button type="primary">tool 1</el-button>
      <el-button type="primary">tool 2</el-button>
    </template>
  </TableView>
</template>

<script>
import TableView from "src/index";
import ListFilter from '@/components/Filter'
import { searchData } from '@/utils/source'

export default {
  name: "Complex",

  components: {
    TableView,
    ListFilter
  },

  data() {
    return {
      columns: [
        {
          label: "Name",
          prop: "name",
          show: true,
        },
        {
          label: "Age",
          prop: "age",
          show: true
        },
        {
          label: "Address",
          prop: "address",
          show: true
        },
      ],
    };
  },

  methods: {
    async getDataList(params) {
      const list = searchData(params)
      return {
        listData: list, // 表格数据
        total: list.length,   // 总数
        page: 1      // 当前页数
      }
    },

    /**
     * 处理列表自定义
     */
    columnCustomMethod(columnProps) {
      this.columns = this.columns.map(col => ({
        ...col,
        show: columnProps.includes(col.prop)
      }))
      // 可以更近一步，保存用户自定义的数据
    }
  }
};
</script>
