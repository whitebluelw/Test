<template>
  <div class="container">
    <div class="layout-breadcrumb">
      <Breadcrumb>
        <Breadcrumb-item href="#/">首页</Breadcrumb-item>
        <Breadcrumb-item>上传模块</Breadcrumb-item>
      </Breadcrumb>
    </div>
    <Row>
      <Col span="3">
      <cate-tree :type="2" :selectChange="selectChange"></cate-tree>
      </Col>
      <Col span="16">
      <div class="btns">
        <Button type="error" @click="removes">删除数据</Button>
        <Input icon="search" v-model="filter.originalname" placeholder="请输入..." style="width: 200px"></Input>
        <Button type="ghost" @click="search">搜索数据</Button>
      </div>
      <Tree :data="baseData" @on-select-change="selectChange"></Tree>
      <Table border :context="self" :columns="columns" :data="list" @on-selection-change="handlerSelectionChange"></Table>
  
      <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
          <Page :total="filter.total" :current="filter.page" :page-size="5" @on-change="changePage"></Page>
        </div>
      </div>
      </Col>
      <Col span="5" style="padding-left:10px;">
      <h2>上传文件</h2>
      <Upload 
      ref="upload"
      type="drag" 
      multiple 
      :action="postUrl" 
      :data="postData"
      name="avatar" 
      :format="['jpg','jpeg','png']" 
      :max-size="100" 
      :before-upload="handleBeforeUpload"
      :on-success="handleSuccess" 
      :on-error="handleError"
      :on-format-error="handleFormatError" 
      :on-exceeded-size="handleMaxSize">
        <div style="padding: 20px 0">
          <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
          <p>点击或将文件拖拽到这里上传</p>
        </div>
      </Upload>
      </Col>
    </Row>
  </div>
</template>

<script>
  import CateTree from '../../components/layout/Cate.vue';
  import Base from '../../common/Base.js'
  var moment = require('moment');
  
  export default {
    mixins: [Base],
    components: {
      CateTree
    },
  
    data() {
      return {
        module: 'uploads',
        filter:{
          originalname:null,
          cateId:null
        },
        postData:{
          _id: null
        },
        handleBeforeUpload(){
    
          
        },
        handleError(err){
          if(err){
             this.$Message.info('请选择分类');
          }
        },
        columns: [{
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '原始名称',
            key: 'originalname'
          },
          {
            title: '文件大小',
            key: 'size'
          },
          {
            title: '文件名称',
            key: 'filename',
            width: 200
          },
          {
            title: '文件名称',
            key: 'path',
            width: 100,
            render (row) {
                return `<img src="http://localhost:3000/${row.filename}" width="50" height="50"/>`;
            }
          },
          {
            title: '上传时间',
            key: 'date',
            width:160,
            render (row) {
                return `${ new Date(row.date).toLocaleString() }`;
            }
          },
          {
            title: '操作',
            key: 'action',
            width: 80,
            align: 'center',
            render(row, column, index) {
              return `
                        <i-button type="error" size="small" @click="remove(${index})">删除</i-button>
                        `;
            }
          }
        ]
      };
    },
    methods: {
      selectChange(node) {
        this.postData._id = node[0]._id;
        this.filter.cateId = node[0]._id;
        this.getData()
      },
      handleSuccess() {
        this.getData()
        //this.$refs.upload.clearFiles();
      },
      handleFormatError(file) {
        this.$Notice.warning({
          title: '文件格式不正确',
          desc: '文件 ' + file.name + ' 格式不正确，请上传 jpg 或 png 格式的图片。'
        });
      },
      handleMaxSize(file) {
        this.$Notice.warning({
          title: '超出文件大小限制',
          desc: '文件 ' + file.name + ' 太大，不能超过 2M。'
        });
      }
    },
    computed:{
      postUrl(){
        return `http://localhost:3000/uploads/filedata/${this.postData._id}`
      }
    }
  
  }
</script>