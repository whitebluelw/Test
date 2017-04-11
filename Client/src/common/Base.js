 var CryptoJS = require("crypto-js");

 export default {
   data() {
     return {
       modal1: false,
       ids: [],
       list: [],
       filter: {
         page: 1,
         limit: 5,
         name: '',
         total: 0
       },
       self: this
     }
   },
   methods: {
     edit(index) {
       var vm = this;
       var dataObj = Object.assign({}, vm.list[index]);
       vm.modal1 = true;
       vm.formValidate = dataObj;
     },
     remove(index) {
       var vm = this;

       this.$Modal.confirm({
         title: '确认删除数据',
         content: '<p>确认删除数据</p>',
         onOk: () => {
           let deleteUrl = `http://localhost:3000/${vm.module}/` + vm.list[index]._id;
           vm.$http.delete(deleteUrl)
             .then(response => {

               vm.getData()
               this.$Message.info('成功删除数据');
             })
         },
         onCancel: () => {
           this.$Message.info('取消删除数据');
         }
       });

     },
     removes() {
       var vm = this;
       if (vm.ids.length > 0) {
         this.$Modal.confirm({
           title: '确认删除数据',
           content: '<p>确认删除数据</p>',
           onOk: () => {
             let deleteUrl = `http://localhost:3000/${vm.module}/removes`;
             vm.$http.post(deleteUrl, { ids: vm.ids })
               .then(response => {
                 vm.getData()
                 this.$Message.info('成功删除数据');
               })
           },
           onCancel: () => {
             this.$Message.info('取消删除数据');
           }
         });
       } else {
         alert('请选择要删除的数据')
       }
     },
     changePage(page) {
       var vm = this;
       vm.filter.page = page;
       vm.getData();
     },
     search() {
       var vm = this;
       vm.getData();
     },
     handleSubmit(name) {
       var vm = this;
       var submitUrl, submitMethods;

       if (vm.formValidate._id != null) {
         submitUrl = `http://localhost:3000/${vm.module}/data/` + vm.formValidate._id;
         submitMethods = 'PUT';
       } else {
         submitUrl = `http://localhost:3000/${vm.module}/data`;
         submitMethods = 'POST'
       }
       vm.$refs[name].validate((valid) => {
         if (valid) {
           vm.formValidate.password = CryptoJS.MD5(vm.formValidate.password, { asString: true })
             .toString();
           vm.$http({
               url: submitUrl,
               method: submitMethods,
               data: vm.formValidate
             })
             .then(function (response) {
               vm.$Message.success('提交成功!');
               vm.modal1 = false;
               vm.getData();
               Object.assign(vm.$data.formValidate, vm.$options.data()
                 .formValidate); // 让我们的数据恢复到初始化状态
             })
         } else {
           this.$Message.error('表单验证失败!');
         }
       })
     },
     handlerSelectionChange(selection) {
       var vm = this;
       if (selection && selection.length > 0) {
         var ids = [];
         let selectionLen = selection.length;
         for (let i = 0; i < selectionLen; i++) {
           ids.push(selection[i]._id);
         }
         vm.ids = ids;
       }

     },
     handleReset(name) {
       this.$refs[name].resetFields();
     },
     getData() {
       var vm = this;
       vm.$http.post(`http://localhost:3000/${vm.module}/list`, vm.filter)
         .then(function (response) {
           vm.list = response.data.docs;
           vm.filter.total = response.data.total;

         })
     }
   },
   created() {
     this.getData();
   }
 }