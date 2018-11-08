<template>
    <div class="category">
        <!-- 按钮区 -->
        <div class="btns">
            <el-button size="mini" type="primary" @click="toAddCategory">添加</el-button>
            <el-button size="mini" type="danger" @click="batchDeleteCategory(values
            )">批量删除</el-button>      
        </div>
        <!-- 按钮区结束 -->
        <!-- 表格区 -->
        <div class="table" v-loading='loading'>
			<el-table :border='true' size='small' :data="categories" style="width: 100%" @selection-change="selsChange">
                <el-table-column
                    type="selection"
                    width="55" >
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="栏目名称"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="parent.name"
                    label="父栏目"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="comment"
                    label="描述">
                </el-table-column>
                <el-table-column label="操作" width='80'>
                    <template slot-scope='{row}'>
                        <i class="fa fa-trash" @click='deleteCategory(row.id)'></i>
                        <i class="fa fa-pencil" @click="updateCategory(row)"></i>
                    </template>
                </el-table-column>
	        </el-table>
		</div>
        <!-- 表格区结束 -->
        <!-- 模态框 -->
        <el-dialog :title="categoryDialog.title" :visible.sync="categoryDialog.visible" >
			<!-- {{categoryDialog.form}} -->
		  <el-form :model="categoryDialog.form" label-position="top">
		    <el-form-item label="栏目名称:" label-width="120px">
		      <el-input v-model="categoryDialog.form.name" autocomplete="off"></el-input>
		    </el-form-item>
		    <el-form-item label="父栏目:" label-width="120px">
		      <el-select v-model="categoryDialog.form.parentId" placeholder="一级栏目">
		        <el-option v-for='c in categories' :label="c.name" :value="c.id" :key="c.id"></el-option>
		      </el-select>
		    </el-form-item>
				<el-form-item label="描述信息:" label-width="120px">
		        <el-input
					  type="textarea"
					  :rows="2"
					  placeholder="请输入内容"
					  v-model="categoryDialog.form.comment">
				</el-input>
		    </el-form-item>
		  </el-form>
		  <div slot="footer" class="dialog-footer">
		    <el-button size='small' @click='closeCategoryDialog'>取 消</el-button>
		    <el-button size='small' type="primary" @click='saveOrUpdateCategory'>确 定</el-button>
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
                categories:[],
                values:[],
                loading:false,
                categoryDialog:{
                    title:'',
                    form:{},
                    visible:false
                }
            }
        },
        created(){
            //加载所有栏目信息
            this.findAllCategories();
        },
        methods:{
            //获取多选框改变事件
            selsChange(values){
                this.values = values;
            },
            //修改
            updateCategory(row){
                this.categoryDialog.form = row;
                this.categoryDialog.visible = true;
                this.categoryDialog.title = '修改栏目';
            },
            //批量删除
            batchDeleteCategory(rows){
                var ids = [];
                rows.forEach(element =>{
                    ids.push(element.id)
                })
                this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                }).then(()=>{
                    let url = '/manager/category/batchDeleteCategory';
                    axios.post(url,{ids:ids})
                    .then(({data:result})=>{
                        this.$notify({
                            title: '成功',
                            message: result.message,
                            type: 'success'
                            });
                        this.findAllCategories();
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
            deleteCategory(id){
                this.$confirm('此操作将永久删除该栏目及其所属栏目和文章, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                }).then(()=>{
                    let url = '/manager/category/deleteCategoryById?id='+id;
                    axios.get(url)
                    .then(({data:result})=>{
                        this.$notify({
                            title: '成功',
                            message: result.message,
                            type: 'success'
                            });
                        this.findAllCategories();
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
            saveOrUpdateCategory(){
                let url = '/manager/category/saveOrUpdateCategory';
                axios.post(url,this.categoryDialog.form).then(({data:result})=>{
                    if(result.status = 200){
						//1. 关闭模态框
						this.closeCategoryDialog();
						//2. 提示成功
						this.$notify({
                            title: '成功',
                            message: result.message,
                            type: 'success'
                        });
                        //3.刷新
                        this.findAllCategories();
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
            closeCategoryDialog(){
                this.categoryDialog.form = {};
                this.categoryDialog.visible = false;
            },
            //添加栏目
            toAddCategory(){
                this.categoryDialog.form = {};
                this.categoryDialog.title = '添加栏目';
                this.categoryDialog.visible = true;
            },
            //查询所有栏目
            findAllCategories(){
                this.loading = true;
                let url = '/manager/category/findAllCategory';
                axios.get(url).then(({data:result})=>{
                    //将查询到的数据绑定到模型中
                    this.categories = result.data;
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
    
    .btns{
        margin-bottom: .5em;
    }
    i.fa{
        margin: 0 .3em;
        cursor: pointer;
    }
    i.fa.fa-trash{
        color: #F56C6C;
    }
</style>

