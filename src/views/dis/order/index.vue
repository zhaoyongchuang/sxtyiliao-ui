<template>
  <div class="app-container">
    <el-form v-show="showSearch" ref="queryForm" :inline="true" :model="queryParams" label-width="68px">
      <el-form-item label="供应商" prop="supportName">
        <el-input
          v-model="queryParams.supportName"
          clearable
          placeholder="请输入供应商名称"
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="申请人" prop="orderMan">
        <el-input
          v-model="queryParams.orderMan"
          clearable
          placeholder="请输入申请人"
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="申请状态" prop="detailStatus">
        <el-select v-model="queryParams.detailStatus" clearable placeholder="明细状态" size="small">
          <el-option
            v-for="dict in detailStatus"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
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
          :disabled="addOrder"
          icon="el-icon-plus"
          plain
          size="mini"
          type="primary"
        >
          <router-link to="/dis/drug/addOrder">新增采购</router-link>
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          :disabled="submitExam"
          icon="el-icon-edit"
          plain
          size="mini"
          type="success"
          @click="goToExamine"
        >提交审核
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          :disabled="cancelOrder"
          icon="el-icon-delete"
          plain
          size="mini"
          type="danger"
          @click="handleDelete"
        >作废
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          :disabled="puInStock"
          icon="el-icon-download"
          plain
          size="mini"
          type="success"
          @click="handlePutInStock"
        >提交入库
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="postList" @selection-change="handleSelectionChange">
      <el-table-column align="center" type="selection" width="55"/>
      <el-table-column align="center" label="单据ID" prop="orderId"/>
      <el-table-column align="center" label="供应商" prop="supportName"/>
      <el-table-column align="center" label="药品名称" prop="durgName"/>
      <el-table-column align="center" label="药品批次" prop="detailBathNum"/>
      <el-table-column align="center" label="批次总额" prop="detailTotalPrice"/>
      <el-table-column :formatter="detailFormat" align="center" label="状态" prop="detailStatus"/>
      <el-table-column align="center" label="申请人" prop="orderMan"/>
      <el-table-column align="center" label="入库操作人" prop="detailOperator"/>
      <el-table-column align="center" label="入库时间" prop="detailDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.detailDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" class-name="small-padding fixed-width" label="操作">
        <template slot-scope="scope">
          <el-button
            icon="el-icon-edit"
            size="mini"
            type="text"
            @click="handleUpdate(scope.row)"
          >
            修改
            <!--            <router-link :to="{path:'/his/drug/addOrder',query:{orderId:1}}">修改</router-link>-->
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

    <!-- 添加或修改岗位对话框 -->
    <el-dialog :title="title" :visible.sync="open" append-to-body width="500px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="岗位名称" prop="postName">
          <el-input v-model="form.postName" placeholder="请输入岗位名称"/>
        </el-form-item>
        <el-form-item label="岗位编码" prop="postCode">
          <el-input v-model="form.postCode" placeholder="请输入编码名称"/>
        </el-form-item>
        <el-form-item label="岗位顺序" prop="postSort">
          <el-input-number v-model="form.postSort" :min="0" controls-position="right"/>
        </el-form-item>
        <el-form-item label="岗位状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in detailStatusOptions"
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
import {addPost, listPost, putInStock, updatePost, upDateStatus} from "@/api/dis/drug/purchaseAndPutIn";
import {parseTime} from "@/utils";


export default {
  name: "Post",
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
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 状态数据字典
      detailStatusOptions: [],
      detailStatus: [],
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
    this.getDicts("order_detail_status").then(response => {
      this.detailStatus = response.data;
    });
  },
  methods: {
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
        this.postList = response.rows;
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
