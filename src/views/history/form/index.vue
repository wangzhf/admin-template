<!-- eslint-disable -->
<template>
  <div class="content-container">
    <el-collapse
      v-model="activeNames"
      :accordion="false"
      @change="handleChange"
    >
      <el-collapse-item title="用户信息" name="userInfo">
        <el-form ref="userInfoForm" :inline="true" label-width="80px">
          <el-col key="dealerCode" :span="12">
            <el-form-item label="经销商">
              <im-select
                url=""
                @select-change="(val) => $set(userInfoForm, 'dealerCode', val)"
              />
            </el-form-item>
          </el-col>
          <el-col key="insuredType" :span="8">
            <el-form-item label="业务类型">
              <im-select
                :source="insuredTypeSource"
                url=""
                @select-change="(val) => $set(userInfoForm, 'insuredType', val)"
              />
            </el-form-item>
          </el-col>
          <el-col key="companyCode" :span="8">
            <el-form-item label="保险公司">
              <im-select
                url=""
                @select-change="(val) => $set(userInfoForm, 'companyCode', val)"
              />
            </el-form-item>
          </el-col>
          <el-col key="insuranceType" :span="8">
            <el-form-item label="险种类型">
              <im-select
                :source="insuranceTypeSource"
                url=""
                @select-change="(val) => $set(userInfoForm, 'insuranceType', val)"
              />
            </el-form-item>
          </el-col>
          <!--
          <el-col :span="8">
            <el-button :loading="searchLoading" type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
          </el-col>
          -->
        </el-form>
      </el-collapse-item>
      <el-collapse-item title="其他信息" name="otherInfo">
        <el-form ref="otherInfoForm" :inline="true" label-width="80px">
          <el-col key="isAvailable" :span="8">
            <el-form-item label="状态">
              <im-select
                :source="isAvailableSource"
                url=""
                @select-change="(val) => $set(otherInfoForm, 'isAvailable', val)"
              />
            </el-form-item>
          </el-col>
          <el-col key="sex" :span="8">
            <el-form-item label="性别">
              <el-radio-group v-model="otherInfoForm['sex']">
                <el-radio
                  key="1"
                  label="1"
                  class="radio"
                >
                  男
                </el-radio>
                <el-radio
                  key="0"
                  label="0"
                  class="radio"
                >
                  女
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col key="type" :span="24">
            <el-form-item label="活动性质">
              <el-checkbox-group v-model="otherInfoForm['type']">
                <el-checkbox label="ms" name="type">美食/餐厅线上活动</el-checkbox>
                <el-checkbox label="dt" name="type">地推活动</el-checkbox>
                <el-checkbox label="xx" name="type">线下主题活动</el-checkbox>
                <el-checkbox label="dc" name="type">单纯品牌曝光</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
          <el-col key="age" :span="8">
            <el-form-item label="年龄">
              <el-input-number v-model="otherInfoForm['age']"
                :min="1"
                :max="10"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col key="isMarry" :span="8">
            <el-form-item label="是否已婚">
              <el-switch
                v-model="otherInfoForm['isMarry']"
                active-color="#13ce66"
                inactive-color="#ff4949">
              </el-switch>
            </el-form-item>
          </el-col>
          <el-col key="spendToday" :span="24">
            <el-form-item label="今日消费">
              <el-slider
                v-model="otherInfoForm['spendToday']"
                style="width: 500px"
              />
            </el-form-item>
          </el-col>
          <!--
          <el-col :span="8">
            <el-button :loading="searchLoading" type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
          </el-col>
          -->
        </el-form>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script>
/* eslint-disable */
import elDragDialog from '@/directive/el-dragDialog' // base on element-ui
import ImSelect from '@/components/Im/Select'
import commonAPI from '@/api/common'
import selectTree from '@/components/Im/SelectTree'
import ImTree from '@/components/Im/Tree'
import ImTable from '@/components/Im/Table'
export default {
  directives: { elDragDialog },
  components: {
    ImSelect,
    'im-el-select-tree': selectTree,
    ImTree,
    ImTable
  },
  data() {
    return {
      // 处理各表单数据
      userInfoForm: {
        dealerCode: null,
        insuredType: null,
        companyCode: null,
        insuranceType: null
      },
      otherInfoForm: {
        isAvailable: null,
        sex: [],
        type: [],
        age: null,
        isMarry: null,
        spendToday: null
      },
      insuredTypeSource: [{"label":"全部","value":""},{"label":"新保","value":"INS_NEW"},{"label":"续保","value":"INS_RENEWAL"}],
      insuranceTypeSource: [{"label":"请选择","value":""},{"label":"交强险","value":"compulsory"},{"label":"商业险","value":"commercial"}],
      isAvailableSource: [{"label":"启用","value":"1"},{"label":"停用","value":"0"}],
      activeNames: [
        'userInfo',
        'otherInfo'
      ]
    }
  },
  methods: {
    handleChange(val) {
      console.log(val)
    }
  }
}
</script>
