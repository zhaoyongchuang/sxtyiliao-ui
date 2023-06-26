<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryForm" :inline="true" :model="queryParams" label-width="68px">
      <el-form-item label="厂家名称" prop="proName">
        <el-input
          v-model="queryParams.proName"
          clearable
          placeholder="请输入厂家名称"
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="厂家编码" prop="proCode">
        <el-input
          v-model="queryParams.proCode"
          clearable
          placeholder="请输入厂家编码"
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="联系人" prop="proBoss">
        <el-input
          v-model="queryParams.proBoss"
          clearable
          placeholder="请输入联系人"
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="手机号" prop="proPhone">
        <el-input
          v-model="queryParams.proPhone"
          clearable
          placeholder="请输入手机号"
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="关键字" prop="proKeywords">
        <el-input
          v-model="queryParams.proKeywords"
          clearable
          placeholder="请输入关键字"
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="proStatus">
        <el-select v-model="queryParams.proStatus" placeholder="请选择状态" size="small" @change="handleQuery">
          <el-option label="启用" value="1"/>
          <el-option label="停用" value="0"/>
        </el-select>
      </el-form-item>
      <el-form-item label="厂家地址" prop="proAddress">
        <el-input
          v-model="queryParams.proAddress"
          clearable
          placeholder="请输入厂家地址"
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" size="mini" type="primary" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['dis:DrugsProducer:add']"
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
          v-hasPermi="['dis:DrugsProducer:edit']"
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
          v-hasPermi="['dis:DrugsProducer:remove']"
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
          v-hasPermi="['dis:DrugsProducer:export']"
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

    <el-table v-loading="loading" :data="DrugsProducerList" @selection-change="handleSelectionChange">
      <el-table-column align="center" type="selection" width="55"/>
      <el-table-column align="center" label="厂家id" prop="proId"/>
      <el-table-column align="center" label="厂家名称" prop="proName"/>
      <el-table-column align="center" label="厂家编码" prop="proCode"/>
      <el-table-column align="center" label="联系人" prop="proBoss"/>
      <el-table-column align="center" label="手机号" prop="proPhone"/>
      <el-table-column align="center" label="关键字" prop="proKeywords"/>
      <el-table-column align="center" label="状态" prop="proStatus">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.proStatus === '1'" size="mini" type="success">正常</el-tag>
          <el-tag v-if="scope.row.proStatus === '0'" size="mini" type="danger">停用</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="备注" prop="remark"/>
      <el-table-column align="center" label="厂家地址" prop="proAddress"/>
      <el-table-column align="center" class-name="small-padding fixed-width" label="操作">
        <template slot-scope="scope">
          <el-button
            v-hasPermi="['dis:DrugsProducer:edit']"
            icon="el-icon-edit"
            size="mini"
            type="text"
            @click="handleUpdate(scope.row)"
          >修改
          </el-button>
          <el-button
            v-hasPermi="['dis:DrugsProducer:remove']"
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

    <!-- 添加或修改DrugsProducer对话框 -->
    <el-dialog :title="title" :visible.sync="open" append-to-body width="500px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="厂家名称" prop="proName">
          <el-input v-model="form.proName" placeholder="请输入厂家名称"/>
        </el-form-item>
        <el-form-item label="厂家编码" prop="proCode">
          <el-input v-model="form.proCode" placeholder="请输入厂家编码"/>
        </el-form-item>
        <el-form-item label="联系人" prop="proBoss">
          <el-input v-model="form.proBoss" placeholder="请输入联系人"/>
        </el-form-item>
        <el-form-item label="手机号" prop="proPhone">
          <el-input v-model="form.proPhone" placeholder="请输入手机号"/>
        </el-form-item>
        <el-form-item label="关键字" prop="proKeywords">
          <el-input v-model="form.proKeywords" placeholder="请输入关键字"/>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.proStatus">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注"/>
        </el-form-item>
        <el-form-item label="厂家地址" prop="proAddress">
          <el-input v-model="form.proAddress" placeholder="请输入厂家地址"/>
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
  addDrugsProducer,
  delDrugsProducer,
  exportDrugsProducer,
  getDrugsProducer,
  listDrugsProducer,
  updateDrugsProducer
} from "@/api/dis/DrugsProducer";

export default {
  name: "DrugsProducer",
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
      // DrugsProducer表格数据
      DrugsProducerList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        proName: null,
        proCode: null,
        proBoss: null,
        proPhone: null,
        proKeywords: null,
        proStatus: null,
        proAddress: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {}
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询DrugsProducer列表 */
    getList() {
      this.loading = true;
      listDrugsProducer(this.queryParams).then(response => {
        this.DrugsProducerList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        proId: null,
        proName: null,
        proCode: null,
        proBoss: null,
        proPhone: null,
        proKeywords: null,
        proStatus: "0",
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null,
        proAddress: null
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
      this.ids = selection.map(item => item.proId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加DrugsProducer";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const proId = row.proId || this.ids
      getDrugsProducer(proId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改DrugsProducer";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.proId != null) {
            updateDrugsProducer(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addDrugsProducer(this.form).then(response => {
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
      const proIds = row.proId || this.ids;
      this.$confirm('是否确认删除DrugsProducer编号为"' + proIds + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return delDrugsProducer(proIds);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有DrugsProducer数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return exportDrugsProducer(queryParams);
      }).then(response => {
        this.download(response.msg);
      })
    }
  }
};
</script>

