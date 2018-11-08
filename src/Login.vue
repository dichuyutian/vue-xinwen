<template>
    <div class="login" >
        <div class="cont">
            <h2>登录界面</h2>
            <!-- {{form}} -->
            <el-form ref='userForm' :model="form" :rules="rules" label-position='left'>
                <el-form-item label="用户名:" label-width="80px" prop="username">
                <el-input v-model="form.username" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="密码:" label-width="80px" prop="password">
                <el-input v-model="form.password" autocomplete="off" type="password"></el-input>
                </el-form-item>
            </el-form>
            <el-button size="small" @click="login">登录</el-button>
        </div> 
    </div>
</template>
<script>
    import axios from '@/http/axios'

    export default {
        data(){
            return {
                form:{

                },
                rules:{
                    username:[{
                        required:true,
                        message:'请输入用户名',
                        trigger:'blur'
                    }],
                    password:[{
                        required:true,
                        message:'请输入密码',
                        trigger:'blur'
                    }]
                }
            }
        },
        methods:{
            login(){
                this.$refs.userForm.validate((valid)=>{
                    if(valid){
                        axios.post('/login',this.form)
                        .then(({data:result})=>{
                            console.log('success',result);
                        
                                window.vm.currentComponent = 'App';
                                localStorage.setItem('user',JSON.stringify(result.data))
                            if(result.status==200 && result.message=='登陆成功' ){
                                //1.跳转到后台界面
                                console.log('--------------------');
                                //this.$root.currentComponent = 'App'
                                //2.将登陆用户信息保存到浏览器中
                            
                            }      
                        })
                        .catch((error)=>{
                            console.log(error);
                        });
                    }
                })
                
               
            }
        }
    }
</script>
<style>
    *{
        margin: 0px;
       
    }
    .login{
        width: 100%;
        height: 631px;
        position: relative;
        background-image: url('./assets/beijing.jpg')

    }
    .cont{
        position: absolute;
        padding: 15px;
        top: 140px;
        left: 35%;
        opacity: 10%;
        text-align: center;
        width: 400px;
         color: #fff;
        border: 2px solid #ccc;
        /* background-image: url('./assets/deng.jpg') */
    }
    .cont h2{
        margin: 10px 0;
    }
    .cont .el-form-item__label{
        color: #fff;
        font-weight: bold;
    }
</style>
