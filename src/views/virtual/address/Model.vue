<template>
  <a-modal
    :title="res?'新增结果':title"
    :visible="visible"
    :body-style="{paddingBottom: '8px'}"
    :confirm-loading="loading"
    :width="res? '800px': '800px'"
    @cancel="close"
  >


    <a-form :form="form"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
            layout="vertical"
    >

      <a-row>
        <a-col :xl="4" :md="12" :sm="24">
          <a-input-group compact>
            <a-input style="width: 48px">
              <div slot="addonBefore">
                禁用
              </div>
            </a-input>

            <dict-select dict-code="tf" placeholder="是否禁用" v-model="dto.disabled" style="width: calc(100% - 48px);"
                         :allowClear="false"/>
          </a-input-group>
        </a-col>

        <a-col :xl="4" :md="12" :sm="24">
          <a-input-group compact>
            <a-input style="width: 35px">
              <div slot="addonBefore">
                链
              </div>
            </a-input>

            <dict-select dict-code="chain" placeholder="请选择链" v-model="dto.chain" style="width: calc(100% - 35px);"
                         :allowClear="false"/>
          </a-input-group>
        </a-col>

        <a-col :xl="12" :md="24" :sm="24">
          <a-input-group compact>
            <a-input style="width: 80px">
              <div slot="addonBefore">
                选择项目
              </div>
            </a-input>

            <lov keyword="projects" v-model="dto.ids" placeholder="请选择项目"
                 style="width: calc(100% - 80px);margin-top: -2px"/>
          </a-input-group>

        </a-col>
      </a-row>

      <a-row style="margin-top: 5px">
        <a-col span="24">
          <a-form-item>
            <a-input-group compact>
              <a-input style="width: 70px">
                <div slot="addonBefore">
                  模式
                  <a-tooltip>
                    <template slot="title">
                      <a-alert type="success">
                        <div slot="message" style="font-size: 13px;">
                          使用该模式的地址可以被满足以下条件的项目获取
                        </div>
                        <div slot="description" style="font-size: 9px">
                          <span v-if="dto.mode!=='INCLUDE'">
                            <p>1. 项目未被选中</p>
                          </span>
                          <span v-else>
                            <p>1. 项目被选中</p>
                          </span>
                        </div>
                      </a-alert>
                    </template>
                    <a-icon type="question-circle"/>
                  </a-tooltip>
                </div>
              </a-input>
              <dict-select dict-code="virtual_address_mode" placeholder="选择模式" v-model="dto.mode"
                           style="width: calc(100% - 70px)"/>
            </a-input-group>
          </a-form-item>
        </a-col>
      </a-row>

      <div v-if="!res" style="margin-bottom: 10px;margin-top: -5px">
        <a-button type="primary" style="width: 100px; margin-right: 10px;"
                  @click="createVa">
          <a-icon type="plus"/>
          新增
        </a-button>
        <a-button type="primary" style="width: 100px;" @click="multipleCreateVa">
          <a-icon type="plus-circle"/>
          批量新增
        </a-button>
      </div>

      <div v-for="(va, index) of vaList">
        <a-input-group v-if="!res" compact style="margin-bottom: 5px">
          <a-input placeholder="请输入地址" v-model="va.address" style="width: 100%">
            <div slot="addonAfter">
              <a-icon style="color: red" type="close" @click="vaList.splice(index ,1)"/>
            </div>
            <div slot="addonBefore">
              地址
            </div>
          </a-input>
        </a-input-group>


        <a-input-group v-if="res" compact style="margin-bottom: 5px">
          <a-input read-only :value="va.address" style="width: 500px;margin-top: 1px;">
            <div slot="addonAfter">
              <a-icon v-if="va.success" style="color: blue" type="check"/>
              <a-icon v-if="!va.success" style="color: red" type="close"/>
            </div>
          </a-input>
          <a-input v-if="!va.success" read-only :value="va.desc" style="width: calc(100% - 500px);color: red"/>
        </a-input-group>
      </div>
    </a-form>

    <template slot="footer">
      <div>
        <a-button type="button" class="ant-btn" @click="close"><span>关闭</span></a-button>
        <a-button v-if="!res" type="button" class="ant-btn ant-btn-primary" @click="create" :loading="loading">
          <span>确定</span></a-button>
        <a-button type="button" class="ant-btn ant-btn-danger" @click="vaList = [{}];res=false;">
          <span>重置</span>
        </a-button>
      </div>
    </template>

    <a-modal
      :visible="multipleVisible"
      @cancel="multipleVisible=false"
      @ok="multipleOk"
      title="地址批量新增"
    >
      <a-textarea :autosize="{minRows: 5}" allowClear v-model="multipleData"
                  placeholder="可以同时输入多个地址, 不同的地址用 , 号分割或者换行"/>
    </a-modal>
  </a-modal>
</template>

<script>
import {PopUpFormMixin} from '@/mixins'
import {addObj} from '@/api/platform/virtualAddress'

export default {
  name: "Model",

  mixins: [PopUpFormMixin],
  data() {
    return {
      decoratorOptions: {
        disabled: {
          initialValue: 0
        }
      },
      labelCol: {
        sm: {span: 24},
        md: {span: 6}
      },
      wrapperCol: {
        sm: {span: 24},
        md: {span: 18}
      },
      reqFunctions: {
        create: addObj,
      },
      vaList: [{}],
      res: false,
      loading: false,
      dto: {disabled: 0, chain: null, ids: [], mode: 'INCLUDE'},
      multipleVisible: false,
      multipleData: undefined,
    }
  },
  methods: {
    create(e) {
      this.loading = true
      let dto = this.dto;
      if (dto.disabled === undefined || dto.disabled === null || dto.chain === undefined || dto.chain === null || dto.mode === undefined || dto.mode === null) {
        this.$message.warn("部分信息未填写完整, 请检查!")
        this.loading = false
        return;
      }
      for (let va of this.vaList) {
        if (!va.address) {
          this.$message.warn("部分信息未填写完整, 请检查!")
          this.loading = false
          return
        }
      }

      addObj({...dto, list: this.vaList}).then(res => {
        if (res.code === 200) {
          this.dto = {...res.data}
          this.vaList = [...res.data.list]
          this.res = true
          this.$emit('reload-page-table', false)
        }
      }).finally(() => {
        this.loading = false
      })
    },
    close() {
      this.visible = false
      this.submitLoading = false
      if (this.res) {
        this.vaList = [{}];
        this.res = false;
        this.dto = {disabled: 0, chain: null, ids: [], mode: 'INCLUDE'};
      }
    },
    createVa() {
      if (this.vaList.length > 0) {
        this.vaList.push({})
      } else {
        this.vaList.push({})
      }
    },
    multipleCreateVa() {
      this.multipleVisible = true
    },
    multipleOk() {
      const lines = this.multipleData.split("\n");
      let arr
      for (const line of lines) {
        arr = line.split(",")

        for (const a of arr) {
          if (a) {
            let va = this.vaList[this.vaList.length - 1]
            if (!va || va.address) {
              this.vaList.push({address: a})
            } else {
              this.vaList[this.vaList.length - 1] = {address: a}
            }
          }
        }
      }
      this.multipleData = null
      this.multipleVisible = false
    }
  }
}
</script>

<style scoped>

</style>
