<template>
  <a-modal :visible="visible" width="80%" @cancel="visible=false" :footer="null">
    <div class="ant-pro-page-container-children-content">

      <a-card :bordered="false" :body-style="{paddingTop: '0'}">
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
            <template #notify-status-slot="text">
              <dict-slot dict-code="notify_status" :value="text"/>
            </template>
          </a-table>
        </div>
      </a-card>
    </div>
  </a-modal>
</template>

<script>
import {logs} from '@/api/platform/pay'
import {TablePageMixin} from '@/mixins'

export default {
  name: 'ProjectList',
  mixins: [TablePageMixin],
  data() {
    return {
      getPage: logs,
      lazyLoad: true,
      visible: false,
      columns: [
        {
          title: '通知Id',
          dataIndex: 'notifyId',
          width: 100
        },
        {
          title: '所属项目',
          dataIndex: 'projectId',
          width: 50
        },
        {
          title: '交易号',
          dataIndex: 'tradeNo',
        },
        {
          title: 'URL',
          dataIndex: 'notifyUrl',
          ellipsis: true
        },
        {
          title: '请求参数',
          dataIndex: 'params',
          ellipsis: true
        },
        {
          title: '请求状态',
          dataIndex: 'httpStatus',
          width: 80,
        },
        {
          title: '请求返回值',
          dataIndex: 'res',
          ellipsis: true
        },
        {
          title: '通知状态',
          dataIndex: 'status',
          width: 100,
          scopedSlots: {customRender: 'notify-status-slot'}
        },
        {
          title: '通知时间',
          dataIndex: 'createTime',
          width: 150
        }
      ],
    }
  },
  created() {
  },
  methods: {
    show(record) {
      this.queryParam.tradeNo = record.tradeNo
      this.reloadTable(true)
      this.visible = true
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
