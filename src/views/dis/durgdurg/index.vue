<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryForm" :inline="true" :model="queryParams" label-width="68px">
      <el-form-item label="药品名称" prop="durgName">
        <el-input
          v-model="queryParams.durgName"
          clearable
          placeholder="请输入药品名称"
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="处方类型" prop="durgOtcType">
        <el-select v-model="queryParams.durgOtcType" placeholder="处方类型">
          <el-option
            v-for="dict in durgOtcTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
            @keyup.enter.native="handleQuery"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="状态" prop="durgStatus">
        <el-select v-model="queryParams.durgStatus" clearable placeholder="药品状态" size="small">
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
            @keyup.enter.native="handleQuery"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" size="mini" type="primary" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          v-hasPermi="['dis:durgdurg:add']"
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
          v-hasPermi="['dis:durgdurg:edit']"
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
          v-hasPermi="['dis:durgdurg:remove']"
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
          v-hasPermi="['dis:durgdurg:export']"
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

    <el-table v-loading="loading" :data="durgdurgList" @selection-change="handleSelectionChange">
      <el-table-column align="center" type="selection" width="55"/>

      <el-table-column align="center" label="药品名称" prop="durgName"/>
      <el-table-column align="center" label="药品编码" prop="durgCode"/>
      <el-table-column align="center" label="生产厂家" prop="drugProducer.proName" width="100"></el-table-column>
      <el-table-column :formatter="TypeFormat" align="center" label="药品类型" prop="durgType"/>
      <el-table-column :formatter="durgOtcTypeFormat" align="center" label="处方类型" prop="durgOtcType"/>
      <el-table-column align="center" label="单位g" prop="durgUnit"/>
      <el-table-column align="center" label="处方价格" prop="durgOtcPrice"/>
      <el-table-column align="center" label="创建时间" prop="createTime">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>


      <el-table-column :formatter="statusFormat" align="center" label="状态" prop="durgStatus"/>
      <!--        <template slot-scope="scope">-->
      <!--          <span>{{ scope.row.status==1?"停用":"正常"}}</span>-->
      <!--        </template>-->
      <!--      </el-table-column>-->


      <el-table-column align="center" class-name="small-padding fixed-width" label="操作">

        <template slot-scope="scope">
          <el-button
            v-hasPermi="['dis:durgdurg:edit']"
            icon="el-icon-edit"
            size="mini"
            type="text"
            @click="handleUpdate(scope.row)"
          >修改
          </el-button>
          <el-button
            v-hasPermi="['dis:durgdurg:remove']"
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

    <!-- 添加或修改durgdurg对话框 -->
    <el-dialog :title="title" :visible.sync="open" append-to-body width="500px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="药品名称" prop="durgName">
          <el-input v-model="form.durgName" placeholder="请输入药品名称"/>
        </el-form-item>
        <el-form-item label="药品编码" prop="durgCode">
          <el-input v-model="form.durgCode" placeholder="请输入药品编码"/>
        </el-form-item>

        <!--                <el-form-item label="生产厂家编码" prop="drugsProducer.proCode">-->
        <!--                    <el-input v-model="form.drugProducer.proCode" placeholder="请输入生产厂家编码"/>-->
        <!--                </el-form-item>-->

        <!--                <el-form-item label="生产厂家" prop="drugProducer.proName">-->
        <!--                          <el-select v-model="queryParams.proId" placeholder="请输入生产厂家" clearable size="small">-->
        <!--                            <el-option-->
        <!--                              v-for="dict in listproname"-->
        <!--                              :key="dict.drugProducer.proId"-->
        <!--                              :label="dict.drugProducer.proName"-->
        <!--                              :value="dict.drugProducer.proName"-->
        <!--                            />-->
        <!--                          </el-select>-->
        <!--                </el-form-item>-->

        <el-form-item label="药品类型" prop="durgType">
          <el-select v-model="form.durgType" placeholder="请选择药品类型">
            <el-option
              v-for="dict in durgTypeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="处方类型" prop="durgOtcType">
          <el-select v-model="form.durgOtcType" placeholder="请选择处方类型">
            <el-option
              v-for="dict in durgOtcTypeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="单位g" prop="durgUnit">
          <el-input v-model="form.durgUnit" placeholder="请输入单位g"/>
        </el-form-item>
        <el-form-item label="处方价格" prop="durgOtcPrice">
          <el-input v-model="form.durgOtcPrice" placeholder="请输入处方价格"/>
        </el-form-item>


        <el-form-item label="状态">
          <el-radio-group v-model="form.durgStatus">
            <el-radio label="0">正常</el-radio>
            <el-radio label="1">停用</el-radio>
          </el-radio-group>
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
import {addDurgdurg, delDurgdurg, exportDurgdurg, getDurgdurg, listDurgdurg} from "@/api/dis/durgdurg";
import {parseTime} from "../../../utils/ruoyi";

export default {
  name: "Durgdurg",
  components: {},
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 子表选中数据
      checkedDrugsProducer: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // durgdurg表格数据
      durgdurgList: [],
      // ${subTable.functionName}表格数据
      drugsProducerList: [],
      statusOptions: [],
      statusOptions1: [],

      durgOtcTypeOptions: [],
      durgTypeOptions: [],
      listproname: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        durgName: null,
        durgCode: null,
        durgProducer: null,
        durgType: null,
        durgOtcType: null,
        durgUnit: null,
        durgOtcPrice: null,
        durgNumber: null,
        durgNumberMin: null,
        durgConvert: null,
        durgStatus: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {}
    };
  },
  created() { //created是vue中生命周期中的一个函数，进入页面后会自动执行
    this.getList();
    this.getDicts("sys_normal_disable").then(response => {
      this.statusOptions = response.data;
    });
    // this.getDicts("sys_normal_disable").then(response => {
    //   this.statusOptions1 = response.data;
    // });
    this.getDicts("hisdrug_drug").then(response => {
        this.durgOtcTypeOptions = response.data;
      }
    )
    this.getDicts("hisdrug_drug_type").then(response => {
        this.durgTypeOptions = response.data;
      }
    )

  },
  methods: {
    parseTime,
    /** 查询durgdurg列表 */
    getList() {
      this.loading = true;
      listDurgdurg(this.queryParams).then(response => {
        this.durgdurgList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 岗位状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.durgStatus);
    },
    TypeFormat(row, column) {
      return this.selectDictLabel(this.durgTypeOptions, row.durgType);
    },
    durgOtcTypeFormat(row, column) {
      return this.selectDictLabel(this.durgOtcTypeOptions, row.durgOtcType);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        durgId: null,
        durgName: null,
        durgCode: null,
        durgProducer: null,
        durgType: null,
        durgOtcType: null,
        durgUnit: null,
        durgOtcPrice: null,
        durgNumber: null,
        durgNumberMin: null,
        durgConvert: null,
        durgStatus: "0",
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null
      };
      this.drugsProducerList = [];
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
      this.ids = selection.map(item => item.durgId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加药品信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const durgId = row.durgId || this.ids
      getDurgdurg(durgId).then(response => {
        this.form = response.data;
        this.drugsProducerList = response.data.drugsProducerList;
        this.open = true;
        this.title = "修改";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.form.drugsProducerList = this.drugsProducerList;
          if (this.form.durgId != null) {
            updateDurgdurg(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addDurgdurg(this.form).then(response => {
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
      const durgIds = row.durgId || this.ids;
      this.$confirm('是否确认删除编号为"' + durgIds + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return delDurgdurg(durgIds);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      })
    },
    /** ${subTable.functionName}序号 */
    rowDrugsProducerIndex({row, rowIndex}) {
      row.index = rowIndex + 1;
    },

    /** 单选框选中数据 */
    handleDrugsProducerSelectionChange(selection) {
      if (selection.length > 1) {
        this.$refs.drugsProducer.clearSelection();
        this.$refs.drugsProducer.toggleRowSelection(selection.pop());
      } else {
        this.checkedDrugsProducer = selection;
      }
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有药品数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function () {
        return exportDurgdurg(queryParams);
      }).then(response => {
        this.download(response.msg);
      })
    }
  }
};
</script>
