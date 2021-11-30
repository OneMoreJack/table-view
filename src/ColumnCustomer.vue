<template>
  <div class="columns-customer">
    <el-popover
      v-model="visible"
      trigger="click"
      :width="popoverWidth"
      placement="bottom-start"
      popper-class="popper--columns-customize"
    >
      <div v-if="!hideTip">请选择列表需要显示的项目</div>
      <el-checkbox-group
        v-model="checkedColumns"
        class="columns-checkbox-group"
        :min="columnMinCount"
      >
        <el-checkbox
          v-for="item in columns"
          :key="item.prop"
          :label="item.prop"
        >{{ item.label }}</el-checkbox>
      </el-checkbox-group>

      <div class="btn-wrapper">
        <el-button @click="closePopover">关闭</el-button>
        <el-button
          class="button--confirm"
          type="primary"
          @click="handleConfirm"
        >确定</el-button>
      </div>

      <div
        slot="reference"
        class="columns-customer__trigger"
      >
        <slot name="reference">
          <div>
            <i class="el-icon-menu"></i>
            <span
              class="btn"
              :class="{ isActive: visible }"
            >
              表格自定义
              <i class="el-icon-arrow-down" />
            </span>
          </div>
        </slot>
      </div>
    </el-popover>
  </div>
</template>

<script>
export default {
  name: 'ColumnsCustomize',

  props: {
    // 所有可以选择的列
    columns: {
      type: Array,
      required: true
    },

    columnMinCount: {
      type: Number,
      default: 3
    },

    // 列表自定义处理方法
    columnCustomMethod: {
      type: Function,
      required: true
    },

    popoverWidth: {
      type: [Number, String],
      default: 840
    },

    hideTip: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      visible: false,
      checkedColumns: []
    };
  },

  watch: {
    'columns': {
      handler() {
        this.init();
      },
      immediate: true
    },

    // visible为false时重置数据
    visible(val) {
      if (!val) this.resetCheckedColumns();
    }
  },

  methods: {
    async init() {
      this.resetCheckedColumns();
    },

    handleConfirm() {
      this.visible = false;
      this.columnCustomMethod(this.checkedColumns);
    },

    /**
     * 关闭popover
     */
    closePopover() {
      this.visible = false;
    },

    resetCheckedColumns() {
      this.checkedColumns = this.columns
        .filter(item => item.show)
        .map(item => item.prop);
    }
  }
};
</script>

<style lang="scss">
.columns-customer {
  display: inline-block;

  .columns-customer__trigger {
    font-size: 14px;
    color: #646464;

    img {
      width: 16px;
      height: 16px;
      transform: translate(0, 3px);
      margin-right: 4px;
    }

    .btn {
      $active-color: #1890ff;
      cursor: pointer;
      &:hover {
        color: $active-color;
      }
      i {
        transition: .3s;
      }

      &.isActive {
        color: $active-color;
        i {
          transform: rotateZ(180deg);
        }
      }
    }
  }
}
.columns-checkbox-group {
  display: grid;
  grid-template-columns: repeat(auto-fit, 120px);
  gap: 16px;
  margin: 24px 0;
}
.popper--columns-customize {
  padding: 16px;

  .btn-wrapper {
    text-align: right;
  }
}
</style>
