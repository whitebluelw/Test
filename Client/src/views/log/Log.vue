<template>
    <div>
        <div class="layout-breadcrumb">
            <Breadcrumb>
                <Breadcrumb-item href="#/">首页</Breadcrumb-item>
                <Breadcrumb-item>日志模块</Breadcrumb-item>
            </Breadcrumb>
        </div>
    

    
        <Modal v-model="modal1" title="普通的Modal对话框标题" width="980">
            <div slot="footer">
                Tip:本模块是用户添加及修改模块!
            </div>
    
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
                <Form-item label="姓名" prop="name">
                    <Input v-model="formValidate.name" placeholder="请输入标题"></Input>
                </Form-item>
                <Form-item label="日志内容" prop="desc">
                    <quill-editor v-model="formValidate.desc" ref="myQuillEditor"></quill-editor>
                </Form-item>
                <Form-item>
                    <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
                    <Button type="ghost" @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
                </Form-item>
            </Form>
        </Modal>
        <Row>
            <Col span="3">
                <cate-tree :type="1" :selectChange="selectChange"></cate-tree>
            </Col>
            <Col span="21">
                <div class="btns">
                    <Button type="info" @click="modal1 = true">添加数据</Button>
                    <Button type="error" @click="removes">删除数据</Button>
                    <Input icon="search" v-model="filter.name" placeholder="请输入..." style="width: 200px"></Input>
                    <Button type="ghost" @click="search">搜索数据</Button>
                </div>
                <Table border :context="self" :columns="columns" :data="list" @on-selection-change="handlerSelectionChange"></Table>
        
                <div style="margin: 10px;overflow: hidden">
                    <div style="float: right;">
                        <Page :total="filter.total" :current="filter.page" :page-size="5" @on-change="changePage"></Page>
                    </div>
                </div>
            </Col>
        </Row>
    
    
    </div>
</template>

<script>
    import Base from '../../common/Base.js'
    import VueUEditor from 'vue-ueditor'
    import CateTree from '../../components/layout/Cate.vue';

    export default {
        mixins: [Base],
        components: {
            VueUEditor,
            CateTree
        },
        data() {
            return {
                ue: null,
                module: 'log',
                filter:{
                    cateId:null,
                    cate:{}
                },
                formValidate: {
                    cateId:null,
                    _id: null,
                    name: '',
                    desc: ''
                },
                ruleValidate: {
                    name: [{
                        required: true,
                        message: '标题不能为空',
                        trigger: 'blur'
                    }],
                    desc: [{
                            required: true,
                            message: '内容不能为空',
                            trigger: 'blur'
                        },
                        {
                            type: 'string',
                            min: 2,
                            message: '介绍不能少于2字',
                            trigger: 'blur'
                        }
                    ]
                },
                columns: [{
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '标题',
                        key: 'name'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 150,
                        align: 'center',
                        render(row, column, index) {
                            return `
                                    <i-button type="primary" size="small" @click="edit('${index}')">编辑</i-button> 
                                    <i-button type="error" size="small" @click="remove(${index})">删除</i-button>
                                    `;
                        }
                    }
                ]
            }
        },
        methods: {
            selectChange(node) {
                this.formValidate.cateId = node[0]._id;
                this.formValidate.cate = {
                    _id : node[0]._id,
                    title : node[0].title
                }
                this.filter.cateId = node[0]._id;
                this.getData()
            }
        }
    }
</script>

<style lang="scss">
    .btns {
        padding: 10px;
    }
</style>