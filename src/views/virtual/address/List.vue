<template>
  <div class="ant-pro-page-container-children-content">
    <!-- 查询条件 -->
    <div class="ant-pro-table-search">
      <a-form v-bind="searchFormLayout">
        <a-row :gutter="16">
          <a-col :xl="6" :md="12" :sm="24">
            <a-form-item label="地址">
              <a-input v-model="queryParam.address" placeholder="请输入"/>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :md="12" :sm="24">
            <a-form-item label="链">
              <dict-select dict-code="chain" placeholder="链" v-model="queryParam.chain"/>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :md="12" :sm="24">
            <a-form-item label="禁用">
              <dict-select dict-code="tf" placeholder="是否禁用" v-model="queryParam.disabled"/>
            </a-form-item>
          </a-col>

          <!-- <template v-if="advanced">
           </template>-->
          <a-col
            :xl="6"
            :md="12"
            :sm="24"
            class="table-page-search-wrapper"
          >
            <div class="table-page-search-submitButtons">
              <a-button type="primary" @click="reloadTable">查询</a-button>
              <a-button style="margin-left: 8px" @click="resetSearchForm">重置</a-button>
              <!--<a @click="toggleAdvanced" style="margin-left: 8px">
                {{ advanced ? '收起' : '展开' }}
                <a-icon :type="advanced ? 'up' : 'down'"/>
              </a>-->
            </div>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <a-card :bordered="false" :body-style="{paddingTop: '0'}">
      <!-- 操作按钮区域 -->
      <div class="ant-pro-table-toolbar">
        <div class="ant-pro-table-toolbar-title">项目</div>
        <div class="ant-pro-table-toolbar-option">
          <a-button
            v-has="'virtual:address:add'"
            type="primary"
            icon="plus"
            @click="handleAdd()"
          >新建
          </a-button>
        </div>
      </div>

      <!--数据表格区域-->
      <div class="ant-pro-table-wrapper">
        <a-table
          ref="table"
          size="middle"
          :row-key="rowKey"
          :columns="columns"
          :data-source="dataSource"
          :pagination="pagination"
          :loading="loading"
          @change="handleTableChange"
        >
          <template #chain-slot="text">
            <dict-slot dict-code="chain" :value="text"/>
          </template>
          <template #disabled-slot="text">
            <dict-slot dict-code="tf" :value="text"/>
          </template>
          <template #using-slot="text">
            <dict-slot dict-code="tf" :value="text"/>
          </template>
          <template #action-slot="text, record">
            <a v-has="'virtual:address:edit'" @click="disabledHandler(record)">{{ record.disabled ? '启用' : '禁用' }}</a>
          </template>
        </a-table>
      </div>
    </a-card>

    <!--表单弹窗-->
    <model ref="formModal" @reload-page-table="reloadTable"/>
  </div>
</template>

<script>
import {disabled, list} from '@/api/platform/virtualAddress'
import {TablePageMixin} from '@/mixins'
import Model from './Model'

export default {
  name: 'VirtualAddressList',
  components: {Model},
  mixins: [TablePageMixin],
  data() {
    return {
      getPage: list,
      columns: [
        {
          title: '链',
          dataIndex: 'chain',
          scopedSlots: {customRender: 'chain-slot'}
        },
        {
          title: '地址',
          dataIndex: 'address',
          ellipsis: true
        },
        {
          title: '禁用',
          dataIndex: 'disabled',
          width: 50,
          scopedSlots: {customRender: 'disabled-slot'}
        },
        {
          title: '使用',
          dataIndex: 'using',
          width: 50,
          scopedSlots: {customRender: 'using-slot'}
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          width: 150
        },
        {
          title: '操作',
          align: 'center',
          width: 250,
          fixed: 'right',
          scopedSlots: {customRender: 'action-slot'}
        }
      ],
    }
  },
  created() {
  },
  methods: {
    handleAdd(record) {
      this.$refs.formModal.add({title: '批量新增地址'})
    },
    disabledHandler(record) {
      disabled({
        id: record.id,
        disabled: record.disabled ? '0' : '1'
      }).then(res => {
        if (res.code === 200) {
          this.reloadTable()
        }
      })
    }
  }
}
</script>
<style scoped>
.menu-tree-table >>> td {
  white-space: nowrap !important;
}

.ant-tag.single-tag {
  margin-right: 0
}
</style>
