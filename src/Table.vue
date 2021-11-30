<script>
/*
  column
    - label {String}
    - prop {String}
    - elProps {Object} ElTableColumn的属性
    - render {Function} 可自定义列的渲染内容
        render(h, {row, col, rowIdx, colIdx})
*/
const DEFAULT_TABLE_PROPS = {
  border: true
};
export default {
  name: 'ZbTable',

  props: {
    // 要展示的列
    columns: {
      type: Array,
      required: true,
      validator: function(columns) {
        // 每列数据必须包含 label 和 prop
        return columns.every(col => col.label && col.prop);
      }
    },

    // 表格数据
    data: {
      type: Array,
      required: true
    },

    // ElTable 的 props
    elTableProps: {
      type: Object,
      default: () => ({})
    },

    columnAlign: {
      type: String,
      default: 'left'
    },

    useSelection: {
      type: Boolean,
      default: false
    }
  },

  methods: {
    getElTable() {
      return this.$refs.elTable;
    }
  },

  render(h) {
    const allSlots = { ...this.$slots, ...this.$scopedSlots };

    const columns = this.columns.map((column, idx) => {
      const columnSlot = allSlots[column.prop];

      return h('el-table-column', {
        key: column.prop,
        props: {
          label: column.label,
          prop: column.prop,
          align: this.columnAlign,
          ...(column.elProps || {})
        },
        scopedSlots: column.render || columnSlot
          ? {
            default: (props) => {
              const scope = {
                row: props.row,
                col: column,
                rowIdx: props.$index, /* 行序号 */
                colIdx: idx /* 列序号 */
              };

              return column.render ? column.render(h, scope) : columnSlot(scope);
            }
          }
          : {}
      });
    });

    // 插入选择框列
    if (this.useSelection) {
      const selectionColumn = h('el-table-column', {
        props: {
          type: 'selection'
        }
      });
      columns.unshift(selectionColumn);
    }

    const table = h(
      'el-table',
      {
        ref: 'elTable',
        props: {
          ...DEFAULT_TABLE_PROPS,
          data: this.data,
          ...this.elTableProps
        },
        on: {
          ...this.$listeners
        }
      },
      columns
    );

    return table;
  }
};
</script>
