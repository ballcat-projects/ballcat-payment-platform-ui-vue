<template>
  <a-modal
    :title="res?'新增结果':title"
    :visible="visible"
    :body-style="{paddingBottom: '8px'}"
    :confirm-loading="submitLoading"
    :width="res? '800px': '800px'"
    @cancel="handleClose"
  >
    <a-form :form="form">
      <div v-for="(va, index) of vaList">
        <a-input-group v-if="!res" compact style="margin-bottom: 5px">
          <a-input style="width: 48px">
            <div slot="addonBefore">
              禁用
            </div>
          </a-input>
          <dict-select dict-code="tf" placeholder="是否禁用" v-model="va.disabled" style="width: 60px;margin-top: -1px;"/>
          <a-input style="width: 38px">
            <div slot="addonBefore">
              链
            </div>
          </a-input>
          <dict-select
            placeholder="请选择链"
            dict-code="chain"
            v-model="va.chain"
            style="width: 100px;margin-top: -1px;"
          />
          <a-input placeholder="请输入地址" v-model="va.address" style="width: calc(100% - 266px)">
            <div slot="addonAfter">
              <a-icon type="copy" @click="copy(va)"/>
              <a-divider type="vertical"/>
              <a-icon style="color: red" type="close" @click="vaList.splice(index ,1)"/>
            </div>
            <div slot="addonBefore">
              地址
            </div>
          </a-input>

        </a-input-group>
        <a-input-group v-if="res" compact style="margin-bottom: 5px">
          <dict-select
            dict-code="chain"
            :value="va.chain"
            style="width: 100px;"
          />
          <a-input read-only :value="va.address" style="width: 400px;margin-top: 1px;">
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
        <button type="button" class="ant-btn" @click="handleClose"><span>关闭</span></button>
        <button v-if="!res" type="button" class="ant-btn ant-btn-primary" @click="create"><span>确定</span></button>
        <button type="button" class="ant-btn ant-btn-danger" @click="vaList = [{disabled:1}];res=false;"><span>重置</span></button>
      </div>
    </template>
  </a-modal>
</template>

<script>
import {PopUpFormMixin} from '@/mixins'
import {addObj} from '@/api/platform/virtualAddress'

export default {
  name: "VirtualAddressModel",

  mixins: [PopUpFormMixin],
  data() {
    return {
      decoratorOptions: {
        disabled: {
          initialValue: 0
        }
      },
      reqFunctions: {
        create: addObj,
      },
      vaList: [{disabled:1}],
      res: false
    }
  },
  methods: {
    create(e) {
      this.submitLoading = true
      for (let va of this.vaList) {
        if (!va.chain || !va.address) {
          this.$message.warn("部分信息未填写完整, 请检查!")
          this.submitLoading = false
          return
        }
      }

      addObj(this.vaList).then(res => {
        if (res.code === 200) {
          this.vaList = [].concat(res.data)
          this.res = true
          this.$emit('reload-page-table', false)
        }
      })

      this.submitLoading = false
    },
    copy(va) {
      this.vaList.push({chain: va.chain, disabled: va.disabled})
    }
  }
}
</script>

<style scoped>

</style>
