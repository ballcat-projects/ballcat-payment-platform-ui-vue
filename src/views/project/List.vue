<template>
  <div class="ant-pro-page-container-children-content">
    <!-- 查询条件 -->
    <div class="ant-pro-table-search">
      <a-form v-bind="searchFormLayout">
        <a-row :gutter="16">
          <a-col :xl="6" :md="12" :sm="24">
            <a-form-item label="项目名">
              <a-input v-model="queryParam.name" placeholder="请输入"/>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :md="12" :sm="24">
            <a-form-item label="API KEY">
              <a-input v-model="queryParam.apiKey" placeholder="请输入"/>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :md="12" :sm="24">
            <a-form-item label="禁用">
              <dict-select dict-code="tf" placeholder="是否禁用" v-model="queryParam.disabled"/>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :md="12" :sm="24">
            <a-form-item label="模式">
              <dict-select dict-code="project_mode" placeholder="选择模式" v-model="queryParam.mode"/>
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
          项目
          <a-button style="margin-left: 5px;" v-has="'project:edit'" type="primary" :disabled="selectedRowKeys.length<1"
                    @click="visible=true;loading=false;newMode=null">
            设置模式
          </a-button>
          <a-button style="margin-left: 5px;" v-has="'project:edit'" type="primary" :disabled="selectedRowKeys.length<1"
                    @click="visible=true;loading=false;newScope=[];setScopeIds=[...selectedRowKeys]">
            更新权限
          </a-button>
        </div>
        <div class="ant-pro-table-toolbar-option">
          <a-button
            v-has="'project:add'"
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
          :scroll="{x:true}"
          @change="handleTableChange"
          :row-selection="{onChange: onSelectChange, selectedRowKeys: selectedRowKeys}"
        >
          <template #disabled-slot="text">
            <dict-slot dict-code="tf" :value="text"/>
          </template>
          <template #mode-slot="text">
            <dict-slot dict-code="project_mode" :value="text"/>
          </template>
          <template #scope-slot="text">
            <dict-slot style="margin-right: 5px" v-for="item of text" dict-code="project_scope" :value="item"/>
          </template>
          <template #action-slot="text, record">
            <a-dropdown>
              <a class="ant-dropdown-link" @click="e => e.preventDefault()">
                操作
                <a-icon type="down"/>
              </a>
              <a-menu slot="overlay">
                <a-menu-item v-has="'project:edit'">
                  <a @click="reset(record)">重置API</a>
                </a-menu-item>
                <a-menu-item v-has="'project:edit'">
                  <a @click="disabledHandler(record)">{{ record.disabled ? '启用' : '禁用' }}</a>
                </a-menu-item>
                <a-menu-item v-has="'project:edit'">
                  <a @click="setScopeIds=[record.id];newScope=[...record.scope];scopeVisible=true;">更新权限</a>
                </a-menu-item>
                <a-menu-item v-has="'project:read'">
                  <a @click="$refs.history.show(record)">修改记录</a>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </template>
        </a-table>
      </div>
    </a-card>

    <!--表单弹窗-->
    <model ref="formModal" @reload-page-table="reloadTable"/>

    <history ref="history"/>

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
        <dict-select style="width: calc(100% - 50px);margin-bottom: 5px" :allow-clear="false" dict-code="project_mode"
                     v-model="newMode"/>
      </a-input-group>
      <a-alert v-if="newMode===null" type="warning">
        <div slot="message">
          请选择新模式
        </div>
      </a-alert>
      <a-alert v-else type="success">
        <div slot="message" style="font-size: 13px;">
          使用该模式的项目可以拉取满足以下条件的地址
        </div>
        <div slot="description" style="font-size: 9px">
          <span v-if="newMode==='ALLOW'">
            <p>1. 如果地址模式为 <a-tag>禁止所选项目使用</a-tag> 且 配置的项目中不包含本项目</p>
            <p>2. 如果地址模式为 <a-tag>仅允许所选项目使用</a-tag> 且 配置的项目中包含本项目</p>
          </span>
          <span v-else>
            <p>1. 地址模式为 <a-tag>仅允许所选项目使用</a-tag> 且 配置的项目中包含本项目</p>
          </span>
        </div>
      </a-alert>
    </a-modal>

    <a-modal
      :visible="scopeVisible"
      :confirm-loading="loading"
      title="更新权限"
      @ok="setScope"
      @cancel="scopeVisible=false;loading=false;newScope=[];setScopeIds=[]"
    >
      <dict-select mode="multiple" dict-code="project_scope" v-model="newScope"/>
    </a-modal>
  </div>
</template>

<script>
import {disabled, list, mode, resetApi, scope} from '@/api/platform/project'
import {TablePageMixin} from '@/mixins'
import Model from './Model'
import History from './History'

export default {
  name: 'List',
  components: {Model, History},
  mixins: [TablePageMixin],
  data() {
    return {
      getPage: list,
      columns: [
        {
          title: 'ID',
          dataIndex: 'id',
          fixed: 'left',
          width: 80
        },
        {
          title: '项目名称',
          dataIndex: 'name',
          fixed: 'left',
        },
        {
          title: '禁用',
          dataIndex: 'disabled',
          scopedSlots: {customRender: 'disabled-slot'}
        },
        {
          title: '模式',
          dataIndex: 'mode',
          scopedSlots: {customRender: 'mode-slot'}
        },
        {
          title: '权限',
          dataIndex: 'scope',
          scopedSlots: {customRender: 'scope-slot'}
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
          title: '项目标志',
          dataIndex: 'mark',
          ellipsis: true
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          width: 150
        },
        {
          title: '操作',
          align: 'center',
          fixed: 'right',
          scopedSlots: {customRender: 'action-slot'}
        }
      ],
      visible: false,
      newMode: null,
      scopeVisible: false,
      newScope: [],
      setScopeIds: [],
    }
  },
  created() {
  },
  methods: {
    handleAdd(record) {
      this.$refs.formModal.add({title: '新建项目'})
    },
    reset(record) {
      resetApi(record.id).then(res => {
        if (res.code === 200) {
          this.reloadTable(false)
        }
      })
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
    },
    setMode() {
      if (this.newMode === null) {
        this.$message.warn("请选择新的模式!")
        return
      }
      this.loading = true;
      mode({ids: this.selectedRowKeys, mode: this.newMode}).then(res => {
        if (res.code === 200) {
          this.$message.success("操作成功!")
        }
      }).finally(() => {
        this.loading = false
        this.visible = false
        this.reloadTable(false)
      })
    },
    setScope() {
      if (this.setScopeIds.length < 1) {
        this.$message.warn("至少选择一个项目!")
        return
      }

      this.loading = true
      scope({ids: this.setScopeIds, scopes: [...this.newScope]}).then(res => {
        if (res.code === 200) {
          this.$message.success('操作成功')
        }
      }).finally(() => {
        this.loading = false
        this.scopeVisible = false
        this.newScope = []
        this.reloadTable(false)
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
