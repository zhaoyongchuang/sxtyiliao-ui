<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="form" :inline="true" :model="form" label-width="68px">
      <el-form-item label="总批发额" prop="orderTotal">
        <el-input
          v-model="form.supportName"
          :disabled="true"
          size="small"
        />
      </el-form-item>
      <el-form-item label="供应商" prop="supportId">
        <el-select v-model="form.supportId" clearable placeholder="供应商" size="small" @change="changeSupport">
          <el-option
            v-for="dict in supportnameList"
            :key="dict.supportId"
            :label="dict.supportName"
            :value="dict.supportId"
          />
        </el-select>
      </el-form-item>
    </el-form>

    <el-row :gutter="24" class="mb8">
      <el-col :span="1.5" offset="16">
        <el-button
          icon="el-icon-plus"
          plain
          size="mini"
          type="primary"
        >添加药品
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          icon="el-icon-shopping-cart-2"
          plain
          size="mini"
          type="success"
        >暂存
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          icon="el-icon-thumb"
          plain
          size="mini"
          type="danger"
        >提交审核
        </el-button>
      </el-col>

    </el-row>

    <el-table v-loading="loading" :data="orderDetialList" @selection-change="handleSelectionChange">
      <el-table-column align="center" type="selection" width="55"/>
      <el-table-column align="center" label=行ID" prop="orderId"/>
      <el-table-column align="center" label="药品ID" prop="supportName"/>
      <el-table-column align="center" label="药品名称" prop="durgName"/>
      <el-table-column align="center" label="规格" prop="durgName"/>
      <el-table-column align="center" label="生产厂家" prop="detailBathNum"/>
      <el-table-column align="center" label="进药数量" prop="detailTotalPrice"/>
      <el-table-column align="center" label="单位" prop="orderMan"/>
      <el-table-column align="center" label="进药单价" prop="detailOperator"/>
      <el-table-column align="center" label="批发总额" prop="detailOperator"/>
      <el-table-column align="center" label="入库时间" prop="detailOperator"/>

      <el-table-column align="center" class-name="small-padding fixed-width" label="操作">
        <template slot-scope="scope">
          <el-button
            v-has-permi="['dis:order:edit']"
            icon="el-icon-edit"
            size="mini"
            type="text"
            @click="handleUpdate(scope.row)"
          >修改
          </el-button>
          <el-button
            v-has-permi="['dis:order:edit']"
            icon="el-icon-edit"
            size="mini"
            type="text"
            @click="handleUpdate(scope.row)"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--新增采购单对话框 -->
    <el-dialog :title="title" :visible.sync="open" append-to-body width="500px">
      <el-table v-loading="loading" :data="drugBySupportIdList" @selection-change="handleSelectionChange">
        <el-table-column align="center" type="selection" width="55"/>
        <el-table-column align="center" label="药品ID" prop="durgId"/>
        <el-table-column align="center" label="药品名称" prop="durgName"/>
        <el-table-column align="center" label="药品编码" prop="durgCode"/>
        <el-table-column align="center" label="生产厂家" prop="pillFactory.proName" width="100"/>
        <el-table-column :formatter="TypeFormat" align="center" label="药品类型" prop="durgType"/>
        <el-table-column :formatter="durgOtcTypeFormat" align="center" label="处方类型" prop="durgOtcType"/>
        <el-table-column align="center" label="单位g" prop="durgUnit"/>
        <el-table-column align="center" label="处方价格" prop="durgOtcPrice"/>
        <el-table-column align="center" label="处方价格" prop="durgOtcPrice"/>
      </el-table>
      <pagination
        v-show="drugBySupportIdTotal> 0"
        :limit.sync="queryParams.pageSize"
        :page.sync="queryParams.pageNum"
        :total="drugBySupportIdTotal"
        @pagination="getAllDrugSupport"
      >
      </pagination>
    </el-dialog>
  </div>
</template>

<script>
import {addPost, listPost, putInStock, updatePost, upDateStatus} from "@/api/dis/drug/purchaseAndPutIn";
import {parseTime} from "@/utils";
import {getAllDrugSupports} from "@/api/dis/drug/addOrder";
import {getDrugBySupportId} from "@/api/dis/drug";


export default {
  name: "addOrder",
  data() {
    return {
      //表格选中的数据
      selections: [],
      //当前row的orderId
      curOrderId: 0,
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 新增采购，永不禁用
      addOrder: false,
      //提交审核
      submitExam: true,
      //作废
      cancelOrder: true,
      // 提交入库
      puInStock: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 岗位表格数据
      postList: [],
      orderDetialList: [],
      drugBySupportIdList: [],
      drugBySupportIdTotal: 0,
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 状态数据字典
      detailStatusOptions: [],
      detailStatus: [],
      supportnameList: [],//供应商列表
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        supportName: undefined,
        applyMan: undefined,
        orderDetailStatus: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        postName: [
          {required: true, message: "岗位名称不能为空", trigger: "blur"}
        ],
        postCode: [
          {required: true, message: "岗位编码不能为空", trigger: "blur"}
        ],
        postSort: [
          {required: true, message: "岗位顺序不能为空", trigger: "blur"}
        ]
      }
    };
  },
  created() {
    this.getList();
    this.getAllDrugSupport();
    this.getDicts("order_detail_status").then(response => {
      this.detailStatus = response.data;
    });
    //   查询供应商列表
    this.getSupportNameList();
  },
  methods: {
    // 选择不同供应商
    changeSupport(supportId) {
      // alert(supportId);
      // 查询供应商下的药品列表，根据供应商id查询所有可供应的药品，drug_support表 drug_pro_sup
      // 供应商和生产厂商
      // 表drug_producer,drugs_durg表
      // 生产厂商和药品
      this.getDrugListBySupportId(supportId);
      this.open = true;
      this.title = "药品信息";

    },
    TypeFormat(row, column) {
      return this.selectDictLabel(this.durgTypeOptions, row.durgType);
    },
    durgOtcTypeFormat(row, column) {
      return this.selectDictLabel(this.durgOtcTypeOptions, row.durgOtcType);
    },
    // 查询供应商列表===================================
    getDrugListBySupportId(supportId) {
      this.loading = true;
      getDrugBySupportId(supportId).then(response1 => {
        this.drugBySupportIdList = response1.rows;//获取供应商列表
        this.drugBySupportIdTotal = response1.total;//获取供应商列表
        this.loading = false;//关闭遮罩层
      });

    },
    getAllDrugSupport() {
      this.loading = true;
      getAllDrugSupports().then(response => {
        this.supportnameList = response.data;//获取供应商列表
        this.loading = false;//关闭遮罩层
      });
    },
    //提交审核
    goToExamine() {
      let ids = "";
      this.selections.forEach(item => {
        if (ids == "") {
          ids += item.detailId;
        } else {
          ids += "," + item.detailId;
        }
      });
      //批量审核成功
      this.updateBatchStatus(ids, 1);
      cleanArray(this.postList);
      this.postList = [];
      this.getList();
    },
    updateBatchStatus(ids, status) {
      upDateStatus({ids: ids, status: status})
        .then(res => {
          if (res > 0) {
            this.$message.success('操作成功！');
          } else {
            this.$message.error('操作失败！');
          }
        })
    },
    /** 查询岗位列表 */
    getList() {
      this.loading = true;
      listPost(this.queryParams).then(response => {
        this.orderDetialList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 岗位状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.detailStatusOptions, row.detailStatus);
    },
    detailFormat(row, column) {
      return this.selectDictLabel(this.detailStatus, row.detailStatus);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        postId: undefined,
        postCode: undefined,
        postName: undefined,
        postSort: 0,
        status: "0",
        remark: undefined,
        orderMan: undefined,
        supportName: undefined,
        supportId: undefined,
        orderTotal: 0.0,

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
      this.selections = selection;

      // console.log(selection)
      if (selection.length > 0) {

        //先遍历一遍，如果有不为的，就不能点击入库
        let okPutIn = false; //表示可以入库
        selection.forEach(item => {
          if (item.detailStatus != 3) {
            okPutIn = true; //如果有状态不为3的就不能入库
          }
        });
        this.puInStock = okPutIn;

        let okCheck = false; //表示可以审核
        selection.forEach(item => {
          if (item.detailStatus == 1 || item.detailStatus == 2 || item.detailStatus == 3 || item.detailStatus == 4 || item.detailStatus == 5) {
            okCheck = true; //如果为 审核失败，审核成功 ,入库 ，作废 都不能审核
          }
        });
        this.submitExam = okCheck;


        let okCancel = false; //表示可以作废
        selection.forEach(item => {
          if (item.detailStatus == 3 || item.detailStatus == 5 || item.detailStatus == 4) {
            okCancel = true; //如果为 审核成功 ，作废 ，入库都不能作废
          }
        });
        this.cancelOrder = okCancel;
      } else {
        this.submitExam = true;
        this.cancelOrder = true;
        this.puInStock = true;
      }

    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.postId != undefined) {
            updatePost(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addPost(this.form).then(response => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 作废按钮操作 */
    handleDelete(row) {
      let ids = "";
      this.selections.forEach(item => {
        if (ids == "") {
          ids += item.detailId;
        } else {
          ids += "," + item.detailId;
        }
      });
      //批量审核成功
      this.updateBatchStatus(ids, 5);
      cleanArray(this.postList);
      this.postList = [];
      this.getList();
    },
    /** 提交入库按钮操作 */
    handlePutInStock() {
      let ids = "";
      this.selections.forEach(item => {
        if (ids == "") {
          ids += item.detailId;
        } else {
          ids += "," + item.detailId;
        }
      });

      putInStock({ids: ids})
        .then(res => {
          if (res > 0) {
            this.$message.success('入库成功！');
          } else {
            this.$message.error('入库失败！');
          }
        });

      cleanArray(this.postList);
      this.postList = [];
      this.getList();

    },
    handleUpdate(row) {
      if (row.detailStatus == 4 || row.detailStatus == 5) {
        if (row.detailStatus == 4) {
          this.$message.warning('已经入库，不能修改！');
        } else if (row.detailStatus == 5) {
          this.$message.warning('已经作废，不能修改!');
        }
      } else {
        this.$router.push({path: '/dis/drug/addOrder', query: {orderId: row.orderId}});
      }

    }
  }
};
</script>
