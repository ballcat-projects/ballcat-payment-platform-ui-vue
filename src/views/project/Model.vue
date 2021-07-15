<template>
  <a-modal
    :title="title"
    :visible="visible"
    :body-style="{paddingBottom: '8px'}"
    :confirm-loading="submitLoading"
    @ok="handleSubmit"
    @cancel="handleClose"
  >
    <a-form :form="form">
      <a-form-item v-if="isUpdateForm" style="display: none">
        <a-input v-decorator="['id']"/>
      </a-form-item>

      <a-form-item label="项目名称">
        <a-input v-decorator="['name', decoratorOptions.name]"/>
      </a-form-item>

      <a-form-item label="禁用">
        <dict-radio-group
          v-decorator="['disabled', decoratorOptions.disabled]"
          placeholder="请选择是否禁用"
          dict-code="tf"
        />
      </a-form-item>

      <a-form-item label="模式">
        <dict-radio-group
          v-decorator="['mode', decoratorOptions.mode]"
          placeholder="请选择项目模式"
          dict-code="project_mode"
        />

        <a-alert type="success">
          <div slot="message" style="font-size: 13px;">
            使用该模式的项目可以拉取满足以下条件的地址
          </div>
          <div slot="description" style="font-size: 9px">
          <span v-if="form.getFieldValue('mode')!=='INCLUDE'">
            <p>1. 如果地址模式为 <a-tag>禁止所选项目使用</a-tag> 且 配置的项目中不包含本项目</p>
            <p>2. 如果地址模式为 <a-tag>仅允许所选项目使用</a-tag> 且 配置的项目中包含本项目</p>
          </span>
            <span v-else>
            <p>1. 地址模式为 <a-tag>仅允许所选项目使用</a-tag> 且 配置的项目中包含本项目</p>
          </span>
          </div>
        </a-alert>
      </a-form-item>

      <a-form-item label="项目标志">
        <a-input v-decorator="['mark', decoratorOptions.mark]" placeholder="请输入项目标志"/>
        <a-alert type="info">
          <div slot="description" style="font-size: 9px">
            部分支付接口会要求传入 <a-tag>商品信息</a-tag> 实际展示给用户的商品信息为 <a-tag>您输入的项目标志 您传入的商品信息</a-tag>
            <br/>
            <span style="font-size: 7px;color: #52c41a">项目标志和商品信息中间会使用空格进行间隔</span>
          </div>
        </a-alert>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import {PopUpFormMixin} from '@/mixins'
import {addObj} from '@/api/platform/project'

export default {
  name: "Model",

  mixins: [PopUpFormMixin],
  data() {
    return {
      decoratorOptions: {
        disabled: {
          initialValue: 0
        },
        mode: {
          initialValue: 'ALLOW'
        },
        mark: {
          rules: [{required: true, message: '请输入项目标志!'}]
        },
      },
      reqFunctions: {
        create: addObj,
      },

    }
  }
}
</script>

<style scoped>

</style>
