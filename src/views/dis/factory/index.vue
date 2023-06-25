<template>
  <div class="app-container">
    <el-form
      v-show="showSearch"
      ref="queryForm"
      :inline="true"
      :model="queryParams"
      label-width="68px"
      size="small"
    >
      <el-form-item
        label="厂家名称"
        prop="factoryName"
      >
        <el-input
          v-model="queryParams.factoryName"
          clearable
          placeholder="请输入厂家名称"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item
        label="电话"
        prop="phone"
      >
        <el-input
          v-model="queryParams.phone"
          clearable
          placeholder="请输入电话"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item
        label="关键字"
        prop="keyword"
      >
        <el-input
          v-model="queryParams.keyword"
          clearable
          placeholder="请输入关键字"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item
        label="厂家状态"
        prop="status"
      >
        <el-select
          v-model="queryParams.status"
          clearable
          placeholder="厂家状态"
        >
          <el-option
            v-for="dict in dict.type.sys_normal_disable"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          icon="el-icon-search"
          size="mini"
          type="primary"
          @click="handleQuery"
        >搜索
        </el-button>
        <el-button
          icon="el-icon-refresh"
          size="mini"
          @click="resetQuery"
        >重置
        </el-button>
      </el-form-item>
    </el-form>

    <el-row
      :gutter="10"
      class="mb8"
    >
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['pill:factory:add']"
          icon="el-icon-plus"
          plain
          size="mini"
          type="primary"
          @click="handleAdd"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['pill:factory:edit']"
          :disabled="single"
          icon="el-icon-edit"
          plain
          size="mini"
          type="success"
          @click="handleUpdate"
        >修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['pill:factory:remove']"
          :disabled="multiple"
          icon="el-icon-delete"
          plain
          size="mini"
          type="danger"
          @click="handleDelete"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['pill:factory:export']"
          icon="el-icon-download"
          plain
          size="mini"
          type="warning"
          @click="handleExport"
        >导出
        </el-button>
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="factoryList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        align="center"
        type="selection"
        width="55"
      />
      <el-table-column
        align="center"
        label="厂家ID"
        prop="factoryId"
        width="80"
      />
      <el-table-column
        align="center"
        label="厂家名称"
        min-width="200"
        prop="factoryName"
      />
      <el-table-column
        align="center"
        label="厂家编码"
        prop="factoryCode"
      />
      <el-table-column
        align="center"
        label="联系人"
        prop="contact"
      />
      <el-table-column
        align="center"
        label="电话"
        prop="phone"
      />
      <el-table-column
        align="center"
        label="关键字"
        prop="keyword"
      />
      <el-table-column
        align="center"
        label="状态"
        prop="status"
      >
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.sys_normal_disable"
            :value="scope.row.status"
          />
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="创建时间"
        min-width="150"
        prop="createTime"
      />
      <el-table-column
        align="center"
        class-name="small-padding fixed-width"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button
            v-hasPermi="['pill:factory:edit']"
            icon="el-icon-edit"
            size="mini"
            type="text"
            @click="handleUpdate(scope.row)"
          >修改
          </el-button>
          <el-button
            v-hasPermi="['pill:factory:remove']"
            icon="el-icon-delete"
            size="mini"
            type="text"
            @click="handleDelete(scope.row)"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :limit.sync="queryParams.pageSize"
      :page.sync="queryParams.pageNum"
      :total="total"
      @pagination="getList"
    />

    <!-- 添加或修改生产厂家信息对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      append-to-body
      width="500px"
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item
          label="厂家名称"
          prop="factoryName"
        >
          <el-input
            v-model="form.factoryName"
            placeholder="请输入厂家名称"
          />
        </el-form-item>
        <el-form-item
          label="厂家编码"
          prop="factoryCode"
        >
          <el-input
            v-model="form.factoryCode"
            placeholder="请输入厂家编码"
          />
        </el-form-item>
        <el-form-item
          label="联系人"
          prop="contact"
        >
          <el-input
            v-model="form.contact"
            placeholder="请输入联系人"
          />
        </el-form-item>
        <el-form-item
          label="电话"
          prop="phone"
        >
          <el-input
            v-model="form.phone"
            placeholder="请输入电话"
          />
        </el-form-item>
        <el-form-item
          label="关键字"
          prop="keyword"
        >
          <el-input
            v-model="form.keyword"
            placeholder="请输入关键字"
          />
        </el-form-item>
        <el-form-item
          label="岗位状态"
          prop="status"
        >
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in dict.type.sys_normal_disable"
              :key="dict.value"
              :label="dict.value"
            >{{ dict.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="备注"
          prop="remark"
        >
          <el-input
            v-model="form.remark"
            placeholder="请输入内容"
            type="textarea"
          />
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="submitForm"
        >确 定
        </el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {addFactory, delFactory, getFactory, listFactory, updateFactory} from "@/api/dis/factory"

export default {
  name: "Factory",
  dicts: ['sys_normal_disable'],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 生产厂家信息表格数据
      factoryList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        factoryName: null,
        factoryCode: null,
        contact: null,
        phone: null,
        keyword: null,
        status: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        factoryName: [
          {required: true, message: "厂家名称不能为空", trigger: "blur"}
        ],
        factoryCode: [
          {required: true, message: "厂家编码不能为空", trigger: "blur"}
        ],
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询生产厂家信息列表 */
    getList() {
      this.loading = true
      listFactory(this.queryParams).then(response => {
        this.factoryList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        factoryId: null,
        factoryName: null,
        factoryCode: null,
        contact: null,
        phone: null,
        keyword: null,
        status: "0",
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null
      }
      this.resetForm("form")
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm")
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.factoryId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = "添加生产厂家信息"
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const factoryId = row.factoryId || this.ids
      getFactory(factoryId).then(response => {
        this.form = response.data
        this.open = true
        this.title = "修改生产厂家信息"
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.factoryId != null) {
            updateFactory(this.form).then(response => {
              this.$modal.msgSuccess("修改成功")
              this.open = false
              this.getList()
            })
          } else {
            addFactory(this.form).then(response => {
              this.$modal.msgSuccess("新增成功")
              this.open = false
              this.getList()
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const factoryIds = row.factoryId || this.ids
      this.$modal.confirm('是否确认删除生产厂家信息编号为"' + factoryIds + '"的数据项？').then(function () {
        return delFactory(factoryIds)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess("删除成功")
      }).catch(() => {
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('pill/factory/export', {
        ...this.queryParams
      }, `factory_${new Date().getTime()}.xlsx`)
    }
  }
}
</script>
