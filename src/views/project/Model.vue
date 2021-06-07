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

    </a-form>
  </a-modal>
</template>

<script>
import {PopUpFormMixin} from '@/mixins'
import {addObj} from '@/api/platform/project'

export default {
  name: "ProjectModel",

  mixins: [PopUpFormMixin],
  data() {
    return {
      decoratorOptions:{
        disabled:{
          initialValue: 0
        }
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
