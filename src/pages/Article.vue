<template>
    <div class="article">
        <!-- 按钮区 -->
        <div class="btns">
            <el-select size="small" v-model="params.categoryId" clearable placeholder="请选择栏目" >
                <el-option
                v-for="item in categories"
                :key="item.id"
                :label="item.name"
                :value="item.id">
                </el-option>
            </el-select>
            <el-input
                style="width:180px"
                size="small"
                placeholder="请输入关键字"
                v-model="params.keywords"
                clearable >
            </el-input>
            <el-button size="mini" type="primary" @click="toAddArticle">添加</el-button>
            <el-button size="mini" type="danger" @click="batchDeleteArticle(values
            )">批量删除</el-button>      
        </div>
        <!-- 按钮区结束 -->
        <!-- 表格区 -->
        <div class="table" v-loading='loading'>
			<el-table :border='true' size='small' :data="articles" style="width: 100%" @selection-change="selsChange">
                <el-table-column
                    type="selection"
                    width="55" >
                </el-table-column>
                <el-table-column
                    prop="title"
                    label="栏目标题"
                    width="120">
                </el-table-column>
                <el-table-column
                    prop="category.name"
                    label="所属栏目"
                    width="120">
                </el-table-column>
                <el-table-column
                    prop="liststyle"
                    label="列表样式">
                </el-table-column>
                 <el-table-column
                    prop="author"
                    label="作者">
                </el-table-column>
                <el-table-column
                    prop="publishtime"
                    label="发布时间">
                </el-table-column>
                <el-table-column
                    prop="readtimes"
                    label="阅读次数">
                </el-table-column>
                <el-table-column label="操作" width='60'>
                    <template slot-scope='{row}'>
                        <i class="fa fa-trash" @click='deleteArticle(row.id)'></i>
                        <i class="fa fa-pencil" @click="updateArticle(row)"></i>
                    </template>
                </el-table-column>
	        </el-table>
		</div>
        <!-- 表格区结束 -->
        <!-- 分页区 -->
        <div class="page">
            <el-pagination background
                layout="prev, pager, next"
                 @current-change='handleCurrentChange'
                :page-size='params.pageSize'
                :total="total">
            </el-pagination>
        </div>
        <!-- 分页区结束 -->
        <!-- 模态框 -->
        <el-dialog fullscreen :title="articleDialog.title" :visible.sync="articleDialog.visible" >
			<!-- {{articleDialog.form}} -->
		  <el-form :model="articleDialog.form" :rules="rules" ref="articleDialog.form" label-position="top">
		    <el-form-item label="文章标题:" label-width="120px" prop="title">
		      <el-input v-model="articleDialog.form.title" autocomplete="off"></el-input>
		    </el-form-item>
		    <el-form-item label="所属栏目:" label-width="120px" prop="categoryId">
		      <el-select v-model="articleDialog.form.categoryId" placeholder="一级栏目">
		        <el-option v-for='c in categories' :label="c.name" :value="c.id" :key="c.id"></el-option>
		      </el-select>
		    </el-form-item>
            <el-form-item label="列表样式:" label-width="120px">
		      <div class="list_style">
                  <div class="list_one" :class='{current:articleDialog.form.liststyle == "style-one"}' 
		      	@click='articleDialog.form.liststyle="style-one"'>
                      <img src="@/assets/style-one.jpg" alt="">
                  </div>
                  <div class="list_two" :class='{current:articleDialog.form.liststyle == "style-two"}'
		      	@click='articleDialog.form.liststyle="style-two"'>
                      <img src="@/assets/style-two.jpg" alt="">

                  </div>
              </div>
		    </el-form-item>
            <el-form-item label="缩略图:" label-width="120px" prop="picture">
                <!-- action="http://39.108.219.54:8099/manager/file/upload"  -->
                <!-- action="http://120.78.164.247:8099/manager/file/upload"  -->
                <el-upload  action="http://134.175.154.93:8099/manager/file/upload" 
                    :file-list="articleDialog.fileList"
                    :on-remove='handleUploadRemove'
                    :on-success='handlerUploadSuccess'
                    list-type="picture">
                    <el-button size="mini" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">
                        只能上传jpg/png文件，且不超过500kb
                    </div>
                </el-upload>
		    </el-form-item>
			<el-form-item label="正文:" label-width="120px" prop="content">
		        <!-- <el-input
					  type="textarea"
					  :rows="4"
					  placeholder="请输入内容"
					  v-model="articleDialog.form.content">
				</el-input> -->
                <div class="editor">
                    <mavon-editor ref=md v-model="articleDialog.form.content"/>
                </div>
		    </el-form-item>
		  </el-form>
		  <div slot="footer" class="dialog-footer">
		    <el-button size='small' @click='closeArticleDialog'>取 消</el-button>
		    <el-button size='small' type="primary" @click='saveOrUpdateArticle(articleDialog.form)'>确 定</el-button>
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
                total:0,
                params:{
                    page:0,
                    pageSize:10,
                },
                //所属栏目数据获取
                categories:[],
                //文章信息获取
                articles:[],
                //批量删除
                values:[],
                loading:false,
                //模态框数据
                articleDialog:{
                    title:'',
                    form:{
                        liststyle:'style-one',
                        fileIds:[],
                        source:''               
                    },
                    visible:false,
                    fileList:[]
                },
                rules:{
                    title: [
                        { required: true, message: '请输入文章标题', trigger: 'blur' },
                        { min: 3, max: 30, message: '长度在 3 到 20个字符', trigger: 'blur' }
                    ],
                    categoryId: [
                        { required: true, message: '请选择所属栏目', trigger: 'change' }
                    ],
                    content: [
                        { required: true, message: '请填写咨询正文', trigger: 'blur' }
                    ]
                }
                
            }
        },
        //监听
        watch:{
			// 只要params中的任意参数发生改变，就要刷新页面
			params:{
				handler:function(){
					this.findAllArticle();
				},
				deep:true
			}
		},
        created(){
            //加载所有文章信息
            this.findAllArticle();
            this.findAllCategories();
        },
        methods:{ 
            // //选择搜索
            // optionchange(value){
            //     //获取搜索框的id
            //     this.value = value;
            //     this.findAllArticle(this.value);   
            // },
            //获取多选框改变事件
            selsChange(values){
                this.values = values;
            },
            //删除附件
            handleUploadRemove(file){
                //1.调用接口删除图片
                axios.get('/manager/file/delete',{
					params:{
						id:file.name
                    }
                })
                .then(()=>{
					this.$notify({title:'成功', message:'操作成功'})
					//2. 从fileIds中移除掉
					_.remove(this.articleDialog.form.fileIds,(id)=>{
						return id == file.name;
					});
					this.articleDialog.form.fileIds.push(1);
					this.articleDialog.form.fileIds.pop();
				})
				.catch(()=>{
					this.$notify.error({title:'错误', message:'网络异常'})
				})
            },
            //文件上传成功时的钩子,将上传的图片的id即图片路径放入fileIds
            handlerUploadSuccess(response, file, fileList){
                this.articleDialog.form.fileIds.push(response.data.id);
                console.log(response.data)
            },
            //修改
            updateArticle(row){ 
                //1.显示模态框
                this.articleDialog.visible = true;
                this.articleDialog.title = '修改资讯';
                //2.克隆当前行数据
                let article = _.cloneDeep(row);
                //3.处理附件默认显示
                this.articleDialog.fileList = article.articleFileVMs.map((item)=>{
                    return {
                        name:item.cmsFile.id,
						url:'http://39.108.81.60:8888/group1/'+item.cmsFile.id
                    }
                })
                //4.处理表单数据
                //4.1 依赖项目category - > categoryId
                article.categoryId = article.category.id;
				delete article.category;
				// 4.2 依赖文件 articleFileVMs -> fileIds
				article.fileIds = article.articleFileVMs.map(item=>item.cmsFile.id);
				delete article.articleFileVMs;
				// 4.3 取消默认空值
				for(let key in article){
					let val = article[key]
					if(!val){
						delete article[key];
					}
				}
				//5 将处理后的结果与表单双向绑定
				this.articleDialog.form = article;
                
            },
             //添加文章
            toAddArticle(){
                this.articleDialog.fileList = [];
                this.articleDialog.form = {
                    liststyle:'style-one',
					fileIds:[]
                };
                this.articleDialog.title = '发布资讯';
                this.articleDialog.visible = true;
            },
            //批量删除
            batchDeleteArticle(rows){
                //ids获取的另一种方法
                //let ids  = this.values.map((item)=>{
				// 	return item.id;
				// })
                var ids = [];
                rows.forEach(element =>{
                    ids.push(element.id)
                })
                this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                }).then(()=>{
                    let url = '/manager/article/batchDeleteArticle';
                    axios.post(url,{ids:ids})
                    .then(({data:result})=>{
                        this.$notify({
                            title: '成功',
                            message: result.message,
                            type: 'success'
                            });
                        this.findAllArticle();
                    }).catch(()=>{
                            this.$notify.error({
                                title: '错误',
                                message: '删除异常'
                            });
                    });
                }).catch(()=>{

                });
            },
            //删除
            deleteArticle(id){
                this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                }).then(()=>{
                    let url = '/manager/article/deleteArticleById?id='+id;
                    axios.get(url)
                    .then(({data:result})=>{
                        this.$notify({
                            title: '成功',
                            message: result.message,
                            type: 'success'
                            });
                        this.findAllArticle();
                    }).catch(()=>{
                            this.$notify.error({
                                title: '错误',
                                message: '删除异常'
                            });
                    });
                }).catch(()=>{

                });
            },
            //保存或修改文章
            saveOrUpdateArticle(){
                this.articleDialog.form.source = this.$refs.md.d__render;
                let url = '/manager/article/saveOrUpdateArticle';
                axios.post(url,this.articleDialog.form).then(({data:result})=>{
                    if(result.status = 200){
						//1. 关闭模态框
						this.closeArticleDialog();
						//2. 提示成功
						this.$notify({
                            title: '成功',
                            message: result.message,
                            type: 'success'
                        });
                        //3.刷新
                        this.findAllArticle();
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
            closeArticleDialog(){
                this.articleDialog.form = {};
                this.articleDialog.visible = false;
            },
           
            //查询所有栏目
             findAllCategories(){
               
                let url = '/manager/category/findAllCategory';
                axios.get(url).then(({data:result})=>{
                    //将查询到的数据绑定到模型中
                    this.categories = result.data;
                }).catch((error)=>{
                    this.$notify.error({
                            title: '错误',
                            message: result.message
                    });
                })
            },
            //分页处理
            handleCurrentChange(page){
				this.params.page = page-1;
			},
            //查询所有文章
            findAllArticle(){
                //?page=0&pageSize=1000&categoryId='+this.value
                this.loading = true;
                let url = '/manager/article/findArticle';
                axios.get(url,{
                    params:this.params
                }).then(({data:result})=>{
                    //将查询到的数据绑定到模型中
                    this.total = result.data.total;
                    this.articles = result.data.list;
                }).catch((error)=>{
                    this.$notify.error({
                            title: '错误',
                            message: result.message
                    });
                }).finally(()=>{
                    this.loading = false;
                })
            }
        }
    }
</script>
<style scoped>
    
    .list_style>div{
        width: 200px;
        height: 100px;
        overflow-y:hidden;
        border: 1px solid #cccc;
        margin: .5em;
        float: left;
    }
    .list_style > div.current{
		border-color: #419fff;
	}
    .list_style img{
        width: 100%;
        height: 100%;
    }
    .btns{
        margin-bottom: .5em;
    }
    i.fa{
        margin: 0 .3em;
        cursor: pointer;
    }
    i.fa.fa-pencil{
        color: aqua;
    }
    i.fa.fa-trash{
        color: #F56C6C;
    }
    div.editor{
        width: 100%;
       
    }
</style>

