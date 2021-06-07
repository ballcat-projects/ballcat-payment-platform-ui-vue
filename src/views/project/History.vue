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
            <template #disabled-slot="text">
              <dict-text dict-code="tf" :value="text"/>
            </template>
          </a-table>
        </div>
      </a-card>

    </div>
  </a-modal>
</template>

<script>
import {history} from '@/api/platform/project'
import {TablePageMixin} from '@/mixins'

export default {
  name: 'ProjectList',
  mixins: [TablePageMixin],
  data() {
    return {
      getPage: history,
      lazyLoad: true,
      visible: false,
      columns: [
        {
          title: 'ID',
          dataIndex: 'id',
          width: 80
        },
        {
          title: '项目名称',
          dataIndex: 'name',
        },
        {
          title: '禁用',
          dataIndex: 'disabled',
          width: 50,
          scopedSlots: {customRender: 'disabled-slot'}
        },
        {
          title: 'API KEY',
          dataIndex: 'apiKey',
          ellipsis: true
        },
        {
          title: 'API SECURITY',
          dataIndex: 'apiSecurity',
          ellipsis: true
        },
        {
          title: '被修改时间',
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
      this.queryParam.projectId = record.id
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
