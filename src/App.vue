<template>
    <div id="app">
      <!-- 头部 -->
      <div class="header">
          <div class="title">聚焦时事新闻</div>
          <div class="info">
            <img class="photo" :src="user.userface" alt="">
            <div class="u"> 
              <el-dropdown @command='handleCommand'>
                <span class="el-dropdown-link">
                  {{user.nickname}}<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>个人中心</el-dropdown-item>
                  <el-dropdown-item command='logout'>退出</el-dropdown-item>               
                </el-dropdown-menu>
              </el-dropdown>
            </div>
    
            </div>
      </div>
      <div class="center">
        <div class="left-nav">
          <ul>
            <li :class='{current:currentRoute=="/"}'>
              <i class="fa fa-bank"></i>
              <router-link to='/Homepage'>首页</router-link>
              <i class="fa fa-angle-right"></i>
            </li>
            <li :class='{current:currentRoute=="/Category"}'>
              <i class="fa fa-list"></i>
              <router-link to='/Category'>栏目管理</router-link>
              <i class="fa fa-angle-right"></i>
            </li>
            <li :class='{current:currentRoute=="/Article"}'>
              <i class="fa fa-certificate"></i>
              <router-link to='/Article'>文章管理</router-link>
              <i class="fa fa-angle-right"></i>
            </li>
            <li :class='{current:currentRoute=="/User"}'>
              <i class="fa fa-user"></i>
              <router-link to='/User'>用户管理</router-link>
              <i class="fa fa-angle-right"></i>
            </li>
           
          </ul>
        </div> 
        <div class="content">
          <div class="wrapper">
            <router-view></router-view>
          </div>
       </div>
      </div>
  </div>
</template>

<script>
  import axios from '@/http/axios';
  
  export default {
      data(){
          return{
            currentRoute:'/',
            user:{}
          }
      },
       watch:{
        '$route':function(to,from){
          this.currentRoute = to.path;
        }
      },
      created(){
        
        //获取用户信息
        let user = JSON.parse(localStorage.getItem('user'));
        if(user&&user.id){
            this.user = user;
            this.currentRoute = this.$route.path;
        }else{
          window.vm.currentComponent = 'Login';
        };
        
      },
      methods:{
        handleCommand(command){
            if(command == 'logout'){
               axios.get('/logout').then((response)=>{
                  //退出后跳转到登陆界面
                  window.vm.currentComponent = 'Login';
                  localStorage.removeItem('user');
              });
            }
        }
       
      },
     
  }
</script>

<style>
  *{
    padding: 0;
    margin: 0;
    list-style:  none ;
    text-decoration: none;
  }
  html{
    font: normal normal 12px '微软雅黑','Microsoft YaHei';
    color: #666;
  }
  a{
    color:#666;
    list-style: none;
    text-decoration: none;
  }
  div{
    box-sizing:border-box;
  }
  .header{
    position: absolute;
    width: 100%;
    height: 60px;
    /*background-color: teal;*/
    background-image: url('./assets/beijing.jpg');
    padding: 0 1em;
  }
  .header .title{
    color: #fff;
    line-height: 60px;
    font-size: 18px;
    float: left;
    margin-left: 30px;
  }
  .header .photo{
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-top: 5px;
    margin-right: 1em;
  }
  .header .info{
    float: right;
    cursor: pointer;
  }
  .header .info .u{
    float: right;
    line-height: 20px;
    margin-top: 20px;
  } 
  .header .info .el-dropdown{
    color: #fff;
  }
  .center{
    position: absolute;
    top: 60px;
    bottom: 0;
    width: 100%;
  }
  .center >.left-nav{
    width: 180px;
    height: 100%;
    float: left;

  }
  .center >.left-nav ul li{
    font-size: 17px;
    line-height: 2em;
    text-align: center;
    border-bottom: 1px solid #ccc;
    position: relative;
  }
  .center > .left-nav > ul > li i.fa {
    position: absolute;
    top: 50%;
    margin-top: -.5em;
  }
  .center > .left-nav > ul > li i.fa:last-child {
    right: 1em;
  }
  .center > .left-nav > ul > li i.fa:first-child {
    left: 1em;
  }
  
  .center >.left-nav>ul>li.current{
    
    background-color: #ededed;
  }
  .center >.content{

    margin-left: 180px;
    height: 100%;
    background-color: #ededed;
    padding: 1em 1em 0 1em;
    overflow-y: auto;
  }
  .center >.content >.wrapper{
    padding: 10px;
    width: 100%;
    /* height: 100%; */
    border-radius: 5px;
    background-color: #fff;
  }
</style>
