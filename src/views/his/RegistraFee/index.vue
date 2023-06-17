<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryForm" :inline="true" :model="queryParams" label-width="68px">
      <el-form-item label="挂号名称" prop="registraName">
        <el-input
          v-model="queryParams.registraName"
          clearable
          placeholder="请输入挂号费名称"
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!--      <el-form-item label="挂号费" prop="registraUnitprice">-->
      <!--        <el-input-->
      <!--          v-model="queryParams.registraUnitprice"-->
      <!--          placeholder="请输入挂号费"-->
      <!--          clearable-->
      <!--          size="small"-->
      <!--          @keyup.enter.native="handleQuery"-->
      <!--        />-->
      <!--      </el-form-item>-->
      <el-form-item label="执行状态" prop="status">
        <el-select v-model="queryParams.status" clearable placeholder="挂号费状态" size="small">
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <!--      <el-form-item label="扩展字段1" prop="ext01">-->
      <!--        <el-input-->
      <!--          v-model="queryParams.ext01"-->
      <!--          placeholder="请输入扩展字段1"-->
      <!--          clearable-->
      <!--          size="small"-->
      <!--          @keyup.enter.native="handleQuery"-->
      <!--        />-->
      <!--      </el-form-item>-->
      <!--      <el-form-item label="扩展字段2" prop="ext02">-->
      <!--        <el-input-->
      <!--          v-model="queryParams.ext02"-->
      <!--          placeholder="请输入扩展字段2"-->
      <!--          clearable-->
      <!--          size="small"-->
      <!--          @keyup.enter.native="handleQuery"-->
      <!--        />-->
      <!--      </el-form-item>-->
      <el-form-item>
        <el-button icon="el-icon-search" size="mini" type="primary" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['his:RegistraFee:add']"
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
          v-hasPermi="['his:RegistraFee:edit']"
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
          v-hasPermi="['his:RegistraFee:remove']"
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
          v-hasPermi="['his:RegistraFee:export']"
          icon="el-icon-download"
          plain
          size="mini"
          type="warning"
          @click="handleExport"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="RegistraFeeList" @selection-change="handleSelectionChange">
      <el-table-column align="center" type="selection" width="55"/>
      <el-table-column align="center" label="挂号费ID" prop="registraId"/>
      <el-table-column align="center" label="挂号费名称" prop="registraName"/>
      <el-table-column align="center" label="挂号费" prop="registraUnitprice"/>
      <el-table-column :formatter="statusFormat" align="center" label="状态" prop="status">
        <template slot-scope="scope">
          <span>{{ scope.row.status == 1 ? "停用" : "正常" }}</span>
        </template>
      </el-table-column>
      <!--      <el-table-column label="扩展字段1" align="center" prop="ext01" />-->
      <!--      <el-table-column label="扩展字段2" align="center" prop="ext02" />-->
      <el-table-column align="center" label="备注" prop="remark"/>
      <el-table-column align="center" class-name="small-padding fixed-width" label="操作">
        <template slot-scope="scope">
          <el-button
            v-hasPermi="['his:RegistraFee:edit']"
            icon="el-icon-edit"
            size="mini"
            type="text"
            @click="handleUpdate(scope.row)"
          >修改
          </el-button>
          <el-button
            v-hasPermi="['his:RegistraFee:remove']"
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
      v-show="total>0"
      :limit.sync="queryParams.pageSize"
      :page.sync="queryParams.pageNum"
      :total="total"
      @pagination="getList"
    />

    <!-- 添加或修改RegistraFee对话框 -->
    <el-dialog :title="title" :visible.sync="open" append-to-body width="500px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="挂号名称" prop="registraName">
          <el-input v-model="form.registraName" placeholder="请输入挂号费名称"/>
        </el-form-item>
        <el-form-item label="挂号费" prop="registraUnitprice">
          <el-input v-model="form.registraUnitprice" placeholder="请输入挂号费"/>
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in statusOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >{{ dict.dictLabel }}
            </el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入内容" type="textarea"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  addRegistraFee,
  delRegistraFee,
  exportRegistraFee,
  getRegistraFee,
  listRegistraFee,
  updateRegistraFee
} from "@/api/his/RegistraFee";

export default {
  name: "RegistraFee",
  components: {},
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
      // RegistraFee表格数据
      RegistraFeeList: [],
      statusOptions: [],
      statusOptions1: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        registraName: null,
        registraUnitprice: null,
        status: null,
        ext01: null,
        ext02: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        registraName: [
          {required: true, message: "挂号费名称不能为空", trigger: "blur"}
        ],
        registraUnitprice: [
          {required: true, message: "挂号费不能为空", trigger: "blur"}
        ],
      }
    };
  },
  created() { //created是vue中生命周期中的一个函数，进入页面后会自动执行
    this.getList();
    this.getDicts("sys_normal_disable").then(response => {
      this.statusOptions = response.data;
    });
  },
  methods: {
    /** 查询RegistraFee列表 */
    getList() {
      this.loading = true;
      listRegistraFee(this.queryParams).then(response => {
        this.RegistraFeeList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
      // return this.selectDictLabel(this.statusOptions, row.projectType);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        registraId: null,
        registraName: null,
        registraUnitprice: null,
        status: "0", // 默认启用 0-正常 1-停用 注意：这里是字符串，不是数字，数字会出现问题
        ext01: null,
        ext02: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.registraId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加挂号费用";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const registraId = row.registraId || this.ids
      getRegistraFee(registraId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改挂号费用";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.registraId != null) {
            updateRegistraFee(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addRegistraFee(this.form).then(response => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const registraIds = row.registraId || this.ids;
      this.$confirm('是否确认删除编号为"' + registraIds + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return delRegistraFee(registraIds);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return exportRegistraFee(queryParams);
      }).then(response => {
        this.download(response.msg);
      })
    }
  }
};
</script>
