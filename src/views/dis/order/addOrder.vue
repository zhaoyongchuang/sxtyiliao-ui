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

    <el-table v-loading="loading" :data="orderDetialList" :model="orderDetialList">
      <el-table-column align="center" type="selection" width="55"/>
      <el-table-column align="center" label="行ID" type="index"/>
      <el-table-column align="center" label="药品ID" prop="durgId"/>
      <el-table-column align="center" label="药品名称" prop="durgName"/>
      <el-table-column align="center" label="药品编码" prop="durgCode"/>
      <el-table-column align="center" label="生产厂家" prop="pillFactory.proName"/>
      <el-table-column :formatter="TypeFormat" align="center" label="药品类型" prop="durgType"/>
      <el-table-column :formatter="durgOtcTypeFormat" align="center" label="处方类型" prop="durgOtcType"/>
      <el-table-column align="center" label="单位g" prop="durgUnit"/>
      <el-table-column align="center" label="批次号" prop="detailBathNum">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.detailBathNum"
            size="small"
          />
        </template>
      </el-table-column>
      <el-table-column align="center" label="批发单价" prop="detailDrugPrice">
        <template slot-scope="scope">
          <el-input-number v-model="scope.row.detailDrugPrice" :min="0"
                           size="small" @change="changeDrugPrice(scope.row)">
          </el-input-number>
        </template>
      </el-table-column>
      <el-table-column align="center" label="进药数量" prop="detailDrugNum">
        <template slot-scope="scope">
          <el-input-number v-model="scope.row.detailDrugNum" :min="1"
                           size="small">
            <!--                           @change="changeDrugNum(scope.row)">-->
          </el-input-number>
        </template>
      </el-table-column>
      <el-table-column align="center" label="批发总额" prop="detailTotalPrice">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.detailTotalPrice"
            :disabled="true"
            :value="scope.row.detailDrugNum*scope.row.detailDrugPrice"
            size="small"
          />
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button
            icon="el-icon-edit"
            size="mini"
            type="text"
            @click="handleModifyDetail(scope.row)"
          >修改
          </el-button>
          <el-button
            icon="el-icon-delete"
            size="mini"
            type="text"
            @click="handleDeleteDetail(scope.row)"
          >删除
          </el-button>
        </template>

      </el-table-column>

    </el-table>


    <el-dialog :title="title" :visible.sync="open" append-to-body width="900px">
      <el-table v-loading="loading" :data="drugBySupportList" @selection-change="handleDrugSelectionChange">
        <el-table-column align="center" type="selection" width="55"/>
        <el-table-column align="center" label="药品ID" prop="durgId"/>
        <el-table-column align="center" label="药品名称" prop="durgName"/>
        <el-table-column align="center" label="药品编码" prop="durgCode"/>
        <el-table-column align="center" label="生产厂家" prop="pillFactory.proName" width="100"/>
        <el-table-column :formatter="TypeFormat" align="center" label="药品类型" prop="durgType"/>
        <el-table-column :formatter="durgOtcTypeFormat" align="center" label="处方类型" prop="durgOtcType"/>
        <el-table-column align="center" label="单位g" prop="durgUnit"/>
      </el-table>
      <pagination
        v-show="drugBySupportTotal> 0"
        :limit.sync="queryParams.pageSize"
        :page.sync="queryParams.pageNum"
        :total="drugBySupportTotal"
        @pagination="getDrugListBySupportId"
      >
      </pagination>
    </el-dialog>

    <el-dialog :title="title" :visible.sync="orderDetailOpen" append-to-body width="600px">
      <el-form ref="orderDetail" :model="orderDetail" :rules="rules" label-width="80px">
        <el-form-item align="center" label="药品名称" prop="detailDrugPrice">
          <el-input v-model="orderDetail.durgName"/>
        </el-form-item>
        <el-form-item align="center" label="批次号" prop="detailDrugNum">
          <el-input v-model="orderDetail.detailBathNum"/>
        </el-form-item>
        <el-form-item align="center" label="批发单价" prop="detailDrugPrice">
          <el-input v-model="orderDetail.detailDrugPrice"/>
        </el-form-item>
        <el-form-item align="center" label="进药数量" prop="detailDrugNum">
          <el-input v-model="orderDetail.detailDrugNum"/>
        </el-form-item>
        <el-form-item align="center" label="批发总额" prop="detailTotalPrice">
          <template slot-scope="scope">
            <el-input
              v-model="scope.orderDetail.detailTotalPrice"
              :disabled="true"
              :value="scope.orderDetail.detailDrugNum*scope.orderDetail.detailDrugPrice"
              size="small"
            />
          </template>
        </el-form-item>

        <!--        确定 和取消按钮-->
        <el-form-item align="center">
          <el-button type="primary" @click="submitFormOrderDetail">确定</el-button>
          <el-button @click="cancelOrderDetail">取消</el-button>
        </el-form-item>

      </el-form>
    </el-dialog>


  </div>
</template>

<script>
import {addPost, listPost, putInStock, updatePost, upDateStatus} from "@/api/dis/drug/purchaseAndPutIn";
import {parseTime} from "@/utils";
import {getAllDrugSupports} from "@/api/dis/drug/addOrder";
import {getDrugBySupportId} from "@/api/dis/drug";
import {listFactory} from "@/api/dis/factory";

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
      // total: 0,
      // 岗位表格数据
      postList: [],
      orderDetialList: [],
      drugBySupportList: [],
      drugBySupportTotal: 0,
      currenSupportId: 0,
      factoryList: [],
      // 弹出层标题
      title: "药品信息列表",
      // 是否显示弹出层
      open: false,
      // 状态数据字典
      detailStatusOptions: [],
      detailStatus: [],
      supportnameList: [],//供应商列表
      orderDetail: [],//正在采购单
      orderDetailOpen: false,//采购框

      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        supportName: undefined,
        orderMan: undefined,
        orderDetailStatus: undefined,
        supportId: undefined,
        durgId: undefined,
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
    this.getFactoryList()
    // this.getDrugListBySupportId(supportId)
    this.getDicts("order_detail_status").then(response => {
      this.detailStatus = response.data;
    });
    this.getDicts("hisdrug_drug").then(response => {
        this.durgOtcTypeOptions = response.data;
      }
    )
    this.getDicts("hisdrug_drug_type").then(response => {
        this.durgTypeOptions = response.data;
      }
    )

    //   查询供应商列表
    this.getSupportNameList();
  },
  methods: {
    handleModifyDetail(row) {
      //   打开一个对话框
      this.resetOrderDetail()
      this.orderDetailOpen = true;
      this.orderDetail = row;
      this.orderDetail.durgName = row.durgName;
      this.orderDetail.durgId = row.durgId;
      this.orderDetail.durgProducer = row.durgProducer;
      this.orderDetail.detailDrugPrice = row.detailDrugPrice;
      this.orderDetail.detailDrugNum = row.detailDrugNum;
      this.orderDetail.detailTotalPrice = row.detailTotalPrice;
      this.orderDetail.detailBathNum = row.detailBathNum;
    },

    handleDrugSelectionChange(selection) {
      this.orderDetialList = selection;
      for (var i = 0; i < this.orderDetialList.length; i++) {
        this.orderDetialList[i].detailTotalPrice = 0;
      }
    },
    // 选择不同供应商
    changeSupport(supportId) {
      // alert(supportId);
      // 查询供应商下的药品列表，根据供应商id查询所有可供应的药品，drug_support表 drug_pro_sup
      // 供应商和生产厂商
      // 表drug_producer,drugs_durg表
      // 生产厂商和药品
      // 判断是否一致
      if ((supportId) !== this.currenSupportId) {
        //   清空表格
        this.orderDetialList = [];
      }
      // 记录当前供应商id
      this.currenSupportId = supportId;


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
      getDrugBySupportId(supportId).then(response => {
        this.drugBySupportList = response.rows;//获取供应商列表
        this.drugBySupportTotal = response.total;//获取供应商列表
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
    getFactoryList() {
      listFactory().then(response => {
        this.factoryList = response.rows
      })
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    cancelOrderDetail() {
      this.orderDetailOpen = false;
      this.resetOrderDetail();
    },
    resetOrderDetail() {
      this.orderDetail = {
        ind: 0,
        durgName: undefined,
        durgId: undefined,
        durgCode: undefined,
        detailDrugPrice: undefined,
        detailDrugNum: undefined,
        detailTotalPrice: undefined,
        detailBathNum: undefined
      };
      this.resetForm("resetOrderDetail");
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
    //确定按钮
    submitFormOrderDetail: function () {
      if (valid) {
        if (this.orderDetail.detailId != undefined) {
          (this.orderDetail).then(response => {
            this.msgSuccess("修改成功");
            this.orderDetailOpen = false;
            this.getList();
          });
        } else {
          (this.orderDetail).then(response => {
            this.msgSuccess("新增成功");
            this.orderDetailOpen = false;
            this.getList();
          });
        }
      }
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
