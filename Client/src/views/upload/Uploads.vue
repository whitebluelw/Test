<template>
    
        <div class="container">
        <h2>Upload file</h2>
        <vue-base64-file-upload 
            class="v1"
            accept="image/png,image/jpeg"
            image-class="v1-image"
            input-class="v1-image"
            :max-size="customImageMaxSize"
            @size-exceeded="onSizeExceeded"
            @file="onFile"
            @load="onLoad" />
            <Button type="success" @click="uploadImage">上传图片</Button>
            
             <Upload
                    
                    type="drag"
                    action="http://localhost:3000/uploads/filedata"
                    name="avatar"
                    :max-size="2048"
                    :on-success="handleSuccess"
                    :format="['jpg','jpeg','png']"
                    :on-format-error="handleFormatError"
                    :on-exceeded-size="handleMaxSize"
                    :before-upload="handleBeforeUpload">
                    <div style="padding: 20px 0">
                        <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                        <p>点击或将文件拖拽到这里上传</p>
                    </div>
            </Upload>
        </div>
    
</template>
<script>
    import VueBase64FileUpload from 'vue-base64-file-upload';
    export default{
        components: {
    VueBase64FileUpload
  },
 
  data() {
    return {
      file:{
          lastModified:'',
          name:'',
          size:0,
          type:'',
          data:''
      },
      customImageMaxSize: 3 // megabytes 
    };
  },
 
  methods: {
    handleSuccess (res, file) {
                // 因为上传过程为实例，这里模拟添加 url
                file.url = 'https://o5wwk8baw.qnssl.com/7eb99afb9d5f317c912f08b5212fd69a/avatar';
                file.name = '7eb99afb9d5f317c912f08b5212fd69a';
            },
            handleFormatError (file) {
                this.$Notice.warning({
                    title: '文件格式不正确',
                    desc: '文件 ' + file.name + ' 格式不正确，请上传 jpg 或 png 格式的图片。'
                });
            },
            handleMaxSize (file) {
                this.$Notice.warning({
                    title: '超出文件大小限制',
                    desc: '文件 ' + file.name + ' 太大，不能超过 2M。'
                });
            },
               handleBeforeUpload () {
               
            },
    onFile(file) {
        this.file=file;
    //   console.log(file); // file object 
    },
 
    onLoad(dataUri) {
    //   console.log(dataUri); // data-uri string 
      this.file=Object.assign(this.file,{"data":dataUri})
      console.log(this.file);
    },
 
    onSizeExceeded(size) {
      alert(`Image ${size}Mb size exceeds limits of ${this.customImageMaxSize}Mb!`);
    },
    uploadImage(){
        var _this=this;
        _this.$http({
            url:`http://localhost:3000/uploads/data`,//执行增加的方法，在路由中看
            method:'POST',
            data: {name:_this.file.name,data:_this.file.data }})
        .then(function(response){
            console.log(response)
        })
    
  }
    }
    }
</script>