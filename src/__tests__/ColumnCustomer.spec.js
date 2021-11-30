import ColumnCustomer from '../ColumnCustomer.vue';
import {
  Popover as ElPopover,
  CheckboxGroup as ElCheckboxGroup,
  Checkbox as ElCheckbox,
  Button as ElButton
} from 'element-ui';
import { mount, enableAutoDestroy } from '@vue/test-utils';

// 默认展示的列
const defaultProps = ['name', 'age', 'address'];
const data = [
  { label: 'Name', prop: 'name' },
  { label: 'Age', prop: 'age' },
  { label: 'Address', prop: 'address' },
  { label: 'Tags', prop: 'tags' },
  { label: 'Phone', prop: 'phone' }
];
const columns = data.map(item => {
  return {
    ...item,
    show: defaultProps.includes(item.prop)
  };
});

const columnCustomMethod = jest.fn(() => {});

function factory() {
  return mount(ColumnCustomer, {
    stubs: {
      ElPopover,
      ElCheckboxGroup,
      ElCheckbox,
      ElButton
    },
    propsData: {
      columns,
      columnCustomMethod
    },
    slots: {
      reference: `<div class="slot-reference">列表自定义</div>`
    }
  });
}

enableAutoDestroy(afterEach);

describe('ColumnCustomer', () => {
  test('init: only check those columns whose `show` is true', async() => {
    const wrapper = factory();
    await wrapper.vm.$nextTick();
    const reference = wrapper.find('.slot-reference');
    const elPopover = wrapper.findComponent(ElPopover);
    expect(reference.exists()).toBe(true);

    await reference.trigger('click');
    expect(elPopover.props().value).toBe(true);

    const checkboxs = wrapper.findAllComponents(ElCheckbox);
    const checkboxGroup = wrapper.findComponent(ElCheckboxGroup);

    expect(checkboxs).toHaveLength(5);
    expect(checkboxGroup.props().value).toEqual(defaultProps);
  });

  test('should work with `column-custom-method` prop', async() => {
    const wrapper = factory();
    await wrapper.vm.$nextTick();
    const confirmButton = wrapper.find('.button--confirm');
    expect(confirmButton.exists()).toBe(true);
    await confirmButton.trigger('click');

    expect(columnCustomMethod).toHaveBeenCalledTimes(1);
    const calls = columnCustomMethod.mock.calls;
    expect(calls[0][0]).toEqual(defaultProps);
  });
});
