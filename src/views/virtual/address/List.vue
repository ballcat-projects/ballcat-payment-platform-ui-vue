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
          <a-col :xl="6" :md="12" :sm="24">
            <a-form-item label="模式">
              <dict-select dict-code="virtual_address_mode" placeholder="选择模式" v-model="queryParam.mode"/>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :md="12" :sm="24">
            <a-form-item label="选中项目id">
              <a-input-number v-model="queryParam.projectIds" placeholder="请输入" style="width: 100%"/>
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
        <div class="ant-pro-table-toolbar-title">
          虚拟地址
          <a-button style="margin-left: 5px;margin-right: 5px" type="default" :disabled="selectedRowKeys.length<1"
                    @click="visible=true;loading=false;newMode=null">
            设置模式
          </a-button>

          <a-button style="margin-right: 5px" type="dashed" :disabled="selectedRowKeys.length<1"
                    @click="openProjectModal(selectedRowKeys, [])">
            更新选中项目
          </a-button>

          <a-button style="margin-right: 5px" type="primary" :disabled="selectedRowKeys.length<1"
                    @click="disabledHandler(selectedRowKeys, 0)">
            启用
          </a-button>

          <a-button style="margin-right: 5px" type="danger" :disabled="selectedRowKeys.length<1"
                    @click="disabledHandler(selectedRowKeys, 1)">
            禁用
          </a-button>
        </div>
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
          :row-selection="{onChange: onSelectChange, selectedRowKeys: selectedRowKeys}"
          @change="handleTableChange"
        >
          <template #mode-slot="text">
            <dict-slot dict-code="virtual_address_mode" :value="text"/>
          </template>
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
            <a v-has="'virtual:address:edit'"
               @click="disabledHandler([record.id], !record.disabled)">{{ record.disabled ? '启用' : '禁用' }}</a>

            <a-divider type="vertical" v-has="'virtual:address:edit'"/>
            <a v-has="'virtual:address:edit'" style="margin-right: 5px" type="dashed"
               @click="openProjectModal([record.id], record.projectIds)">
              更新选中项目
            </a>
          </template>
        </a-table>
      </div>
    </a-card>

    <!--表单弹窗-->
    <model ref="formModal" @reload-page-table="reloadTable"/>

    <a-modal
      :visible="visible"
      :confirm-loading="loading"
      title="选择新模式"
      @ok="setMode"
      @cancel="visible=false;loading=false"
    >
      <a-input-group compact>
        <a-input
          addon-before="模式"
          style="width: 50px"
        />
        <dict-select style="width: calc(100% - 50px);margin-bottom: 5px" :allow-clear="false"
                     dict-code="virtual_address_mode"
                     v-model="newMode"/>
      </a-input-group>
      <a-alert v-if="newMode===null" type="warning">
        <div slot="message">
          请选择新模式
        </div>
      </a-alert>
      <a-alert v-else type="success">
        <div slot="message" style="font-size: 13px;">
          使用该模式的地址可以被满足以下条件的项目获取
        </div>
        <div slot="description" style="font-size: 9px">
          <span v-if="newMode!=='INCLUDE'">
            <p>1. 项目未被选中</p>
          </span>
          <span v-else>
            <p>1. 项目被选中</p>
          </span>
        </div>
      </a-alert>
    </a-modal>

    <a-modal
      :visible="projectVisible"
      :confirm-loading="loading"
      title="选择项目"
      @ok="setProject"
      @cancel="projectVisible=false;loading=false"
    >
      <a-input-group compact>
        <a-input style="width: 80px">
          <div slot="addonBefore">
            选择项目
          </div>
        </a-input>

        <lov ref="projectLov" keyword="projects" v-model="newProject" placeholder="请选择项目"
             style="width: calc(100% - 80px);margin-top: 0"/>
      </a-input-group>
    </a-modal>
  </div>
</template>

<script>
import {disabled, list, mode, project} from '@/api/platform/virtualAddress'
import {TablePageMixin} from '@/mixins'
import Model from './Model'

export default {
  name: 'List',
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
          title: '模式',
          dataIndex: 'mode',
          width: 200,
          scopedSlots: {customRender: 'mode-slot'}
        },
        {
          title: '选中项目',
          dataIndex: 'projectIds',
          customRender: (text) => {
            return text.join(",")
          }
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
      visible: false,
      newMode: null,
      projectVisible: false,
      newProject: [],
      projectUpdateId: []
    }
  },
  created() {
  },
  methods: {
    handleAdd(record) {
      this.$refs.formModal.add({title: '批量新增地址'})
    },
    disabledHandler(ids, isDis) {
      disabled({
        ids: [...ids],
        disabled: isDis ? '1' : '0'
      }).then(res => {
        if (res.code === 200) {
          this.$message.success("操作成功!")
          this.reloadTable(false)
        }
      })
    },
    setMode() {
      this.loading = true
      mode({ids: [...this.selectedRowKeys], mode: this.newMode}).then(res => {
        if (res.code === 200) {
          this.$message.success("操作成功!")
          this.reloadTable(false)
          this.visible = false
        }
      }).finally(() => {
        this.loading = false
      })
    },
    openProjectModal(updateIds, oldProjectIds) {
      this.projectVisible = true;
      this.loading = false;
      this.newProject = [];
      this.projectUpdateId = [...updateIds];
      this.newProject = [...oldProjectIds];
      setTimeout(()=>{
        this.$refs.projectLov.reloadTable();
      })
    },
    setProject() {
      this.loading = true
      project({ids: [...this.projectUpdateId], projectIds: this.newProject}).then(res => {
        if (res.code === 200) {
          this.$message.success("操作成功!")
          this.reloadTable(false)
          this.projectVisible = false
        }else {
          this.$message.success("操作失败!")
        }
      }).finally(() => {
        this.loading = false
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
