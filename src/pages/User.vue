<template>
    <div class="user">
        <!-- 按钮区 -->
        <div class="btns">
            <el-button size="mini" type="primary" @click="toAddUser">添加</el-button>
        </div>
        <!-- 按钮区结束 -->
        <!-- 卡片区 -->
        <div class="box-card"  v-for="value in Users"  :key="value.id">
            <div slot="header" class="clearfix">
                <img class="img-circle" style="width:100px;height:100px;" src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1514093920321&di=913e88c23f382933ef430024afd9128a&imgtype=0&src=http%3A%2F%2Fp.3761.com%2Fpic%2F9771429316733.jpg" alt="...">
                <el-button style="float: right; padding: 3px 3px;" type="danger" @click="deleteUser(value.id)">删除</el-button>
                <el-button style="float: right;margin-right:5px; padding: 3px 3px" type="primary" @click="updateUser(value)">修改</el-button>
            </div>
            <div  class="textitem">
                <ul class="item"  >
                    <li  >用户名：</li>
                    <li  >真实姓名：</li>
                    <li  >注册时间：</li>
                    <li  >email：</li>
                    <li  >状态：</li>
                </ul>
                <ul class="data">
                    <li>{{value.username?value.username:'--'}}</li>
                    <li>{{value.nickname?value.nickname:'--'}}</li>
                    <li>{{value.regTime}}</li>
                    <li>{{value.email?value.email:'--'}}</li>
                    <li><el-switch v-model="value.enabled"              active-color="#13ce66"
                          inactive-color="#ff4949">
                        </el-switch>
                    </li>
                </ul>
            </div>
            
            </div>
        <!-- 卡片区结束 -->
        <!-- 模态框 -->
        <el-dialog :title="UserDialog.title" :visible.sync="UserDialog.visible" >
			<!-- {{UserDialog.form}} -->
		  <el-form :model="UserDialog.form" label-position="top">
		    <el-form-item label="用户名:" label-width="120px">
		      <el-input v-model="UserDialog.form.username" autocomplete="off"></el-input>
		    </el-form-item>
            <el-form-item label="真实姓名:" label-width="120px">
		      <el-input v-model="UserDialog.form.nickname" autocomplete="off"></el-input>
		    </el-form-item>
		    <el-form-item label="密码:" label-width="120px">
		      <el-input v-model="UserDialog.form.password" autocomplete="off"></el-input>
		    </el-form-item>
			
            <el-form-item label="email:" label-width="120px">
		      <el-input v-model="UserDialog.form.email" autocomplete="off"></el-input>
		    </el-form-item>
            <el-form-item label="状态:" label-width="120px">
		      <el-switch v-model="UserDialog.form.enabled"          active-color="#13ce66" inactive-color="#ff4949">
              </el-switch>
		    </el-form-item>
		  </el-form>
		  <div slot="footer" class="dialog-footer">
		    <el-button size='small' @click='closeUserDialog'>取 消</el-button>
		    <el-button size='small' type="primary" @click='saveOrUpdateUser'>确 定</el-button>
		  </div>
		</el-dialog>
        <!-- 模态框结束 -->
    </div>
</template>
<script>
    import axios from '@/http/axios'

    export default {
        data(){
            return{
                Users:[{}],
                loading:false,
                UserDialog:{
                    title:'',
                    form:{},
                    visible:false
                }
            }
        },
        created(){
            //加载所有栏目信息
            this.findAllUser();
        },
        methods:{
            // //获取多选框改变事件
            // selsChange(values){
            //     this.values = values;
            // },
            //修改
            updateUser(value){
                //1.打开模态框
                this.UserDialog.visible = true;
                this.UserDialog.title = '修改用户';
                //2.数据选择操作

                //2.1克隆当前行数据
                let user = _.cloneDeep(value);
                console.log(user)
                //2.2梳理表单数据
                delete user.regTime;
                delete user.roles;
                this.UserDialog.form = user;
                // console.log(value)
            },
            
            //删除
            deleteUser(id){
                this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                }).then(()=>{
                    let url = '/manager/user/deleteUserById?id='+id;
                    axios.get(url)
                    .then(({data:result})=>{
                        this.$notify({
                            title: '成功',
                            message: result.message,
                            type: 'success'
                            });
                        this.findAllUser();
                    }).catch(()=>{
                            this.$notify.error({
                                title: '错误',
                                message: '删除异常'
                            });
                    });
                }).catch(()=>{

                });
            },
            //保存或修改
            saveOrUpdateUser(){
                let url = '/manager/user/saveOrUpdateUser';
                axios.post(url,this.UserDialog.form).then(({data:result})=>{
                    if(result.status = 200){
						//1. 关闭模态框
						this.closeUserDialog();
						//2. 提示成功
						this.$notify({
                            title: '成功',
                            message: result.message,
                            type: 'success'
                        });
                        //3.刷新
                        this.findAllUser();
                    }else{
                        this.$notify.error({
                            title: '错误',
                            message: result.message
                        });
                    }
                }).catch((error)=>{
                    this.$notify.error({
                    title: '错误',
                    message: '网络异常'
                    });
                });
            },
            //关闭模态框
            closeUserDialog(){
                this.UserDialog.form = {};
                this.UserDialog.visible = false;
            },
            //添加用户
            toAddUser(){
                this.UserDialog.form = {};
                this.UserDialog.title = '添加栏目';
                this.UserDialog.visible = true;
            },
            //查询所有用户
            findAllUser(){
                this.loading = true;
                let url = '/manager/user/findAllUser';
                axios.get(url).then(({data:result})=>{
                    //将查询到的数据绑定到模型中
                    this.Users = result.data;
                }).catch((error)=>{
                    console.log('error',error);
                }).finally(()=>{
                    this.loading = false;
                })
            }
        }
    }
</script>
<style scoped>
    .user{
        overflow: hidden;
    }
    div.clearfix{
        height: 100px;
        padding: 15px;
    }
    
    div.box-card:after {
        clear: both;
    }
    .box-card{
        width: 340px;
        float: left;
        border: 1px solid #0ceedb;
        margin: 10px 10px 10px 10px;
        background-color: azure;
    }
    div.textitem{
        width: 340px;
        height: 220px;
        padding: 20px;
        position: relative;
    }
    ul.item{
        width: 100px;
        height:180px;
        float: left;
    }
    ul.item li{
        margin-bottom: 10px;
        width: 100px;
        height: 26px;
        font-size: 15px;
        float: left;
    }
    ul.data{
        width: 198px;
        height:180px;
        float: left;
    }
    ul.data li{
        margin-bottom: 10px;
        width: 198px;
        height: 26px;
        font-size: 15px;
        float: left;
    }
    img.img-circle{
        border-radius: 50%;
    }
    .btns{
        margin-bottom: .5em;
        margin-left: 10px;
    }
    i.fa{
        margin: 0 .3em;
        cursor: pointer;
    }
    i.fa.fa-trash{
        color: #F56C6C;
    }
</style>

