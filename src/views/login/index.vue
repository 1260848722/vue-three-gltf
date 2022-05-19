<!--登录-->
<template>
    <div class="hf--login">
        <section class="login-wrap">
            <h3 class="title">省公司大院智慧机房</h3>
            <el-form ref="loginForm" :model="form" :rules="rules">
                <el-form-item label="" prop="userName">
                    <el-input v-model="form.userName" placeholder="请输入用户名">
                        <i slot="prefix" class="el-input__icon el-icon-user-solid"></i>
                    </el-input>
                </el-form-item>
                <el-form-item label="" prop="password">
                    <el-input type="password" v-model="form.password" placeholder="请输入密码">
                        <i slot="prefix" class="el-input__icon el-icon-lock"></i>
                    </el-input>
                </el-form-item>
                <el-form-item label="" prop="captcha">
                    <div class="flex-row-center">
                        <el-input v-model="form.captcha" placeholder="请输入验证码" />
                        <img class="captcha-image" :src="captchaImgUrl" alt="验证码图片加载错误" title="点击加载验证码" @click.stop="updateCaptcha" />
                    </div>
                </el-form-item>
                <el-button :loading="loading" @click.stop="submit">登录</el-button>
                <el-checkbox v-model="isRememberme">记住用户</el-checkbox>
            </el-form>
        </section>
    </div>
</template>

<script>
import { debounce } from '@/libs/tool'
export default {
    data() {
        return {
            form: {
                userName: '',
                password: '',
                captcha: '',
            },
            rules: {
                userName: [
                    {required: true, message: '用户名不能为空', trigger: 'blur'}
                ],
                password: [
                    {required: true, message: '密码不能为空', trigger: 'blur'}
                ],
                captcha: [
                    {required: true, message: '验证码不能为空', trigger: 'blur'}
                ]
            },
            captchaImgUrl: '',
            isRememberme: false,
            loading: false,
            biyiCaptchaKey: ''
        }
    },
    watch: {
        isRememberme: {
            immediate: true,
            handler(val) {
                localStorage.rememberme = val ? 1 : 0;
            }
        }
    },
    created() {
        this.updateCaptcha();
    },
    methods: {
        //获取验证码
        updateCaptcha() {
            this.form.captcha = '';
            this.$http.get('/api/catpcha/digitalCaptcha').then(response => {
                if(response) {
                    this.biyiCaptchaKey = Object.keys(response.data)[0];
                    this.captchaImgUrl = response.data[this.biyiCaptchaKey];
                }
            })
        },
        submit: debounce(function() {
            this.$refs.loginForm.validate(valid => {
                if(valid) {
                    this.loading = true;
                    this.$http.post('/api/system/login', {
                        username: this.form.userName,
                        password: this.form.password,
                        rememberme: localStorage.rememberme
                    }, {
                        headers: {
                            biyiCaptchaKey: this.biyiCaptchaKey,
                            biyiCaptcha: JSON.stringify({code: this.form.captcha})
                        }
                    }).then(response => {
                        this.loading = false;
                        if(response.data.passwordStatus) {
                            this.$message.warning(response.data.passwordStatus === 1 ? '初始密码强度较弱，请修改后再重新登录！'
                  : '密码已使用3个月，请修改后再重新登录！');
                            // 跳转修改密码页面
                        }else {
                            localStorage.token = response.data.token;
                            this.$message.success({
                                message: '登录成功！',
                                duration: 1500,
                                onClose: () => {
                                    this.$router.push(this.$route.query.name || '/');
                                }
                            });
                        }
                    }).catch(error => {
                        this.updateCaptcha();
                        this.loading = false;
                        if(error.response) {
                            switch(error.response.status) {
                                case 401:
                                    if(error.response.data.attempts) {
                                        this.$message.error(`登录失败，您还有 ${error.response.data.attempts} 尝试机会！`);
                                    }else {
                                        const locktime = this.formatLockedTime(error.response.data.lockoutTime);
                                        this.$message.error(`登录失败，您的账号已被锁定，请在<span style="font-weight: bold; color: #2d8cf0;">${locktime}</span>后重试！`);
                                    }
                                    break;
                                default:
                                    this.$message.error(`登录失败，${error.response.data.message}！`);
                                    break;
                            }
                        }
                    })
                }
            })
        }, 3000),
        formatLockedTime(time) {
            let str = ''
            const d = parseInt(time / (3600 * 24))
            let h = parseInt((time % (3600 * 24)) / 3600)
            let m = parseInt((time % 3600) / 60)
            let s = ((time % 3600) % 60)
            if (d > 0) {
                str = `${str}${d}天`
            }
            if (h > 0) {
                str = `${str}${h}小时`
            }
            if (m > 0) {
                str = `${str}${m}分`
            }
            if (s > 0) {
                str = `${str}${s}秒`
            }
            return str
        }
    }
}
</script>

<style lang="scss" scoped>
    .hf--login{
        width: 100vw;
        height: 100vh;
        background: url('~@/assets/img-login.png') center center/cover no-repeat;
        position: relative;
        .login-wrap{
            width: 40%;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            padding: 30px 0;
            border-radius: 20px;
            background: rgba(0, 0, 0, .2);
            .title{
                font-size: 28px;
                line-height: 60px;
                font-weight: bold;
                text-align: center;
                color: #FFFFFF;
                letter-spacing: 4px;
            }
            ::v-deep .el-form{
                width: 40%;
                margin: auto;
                .flex-row-center{
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    .captcha-image{
                        height: 40px;
                        margin-left: 20px;
                    }
                }
                .el-button{
                    width: 100%;
                    background: #007578;
                    border-color: #007578;
                    color: #FFFFFF;
                }
                .el-checkbox{
                    margin-top: 20px;
                    .el-checkbox__label{
                        color: #FFFFFF;
                    }
                    .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner{
                        background-color: #007578;
                        border-color: #007578;
                    }
                }
            }
        }
    }
</style>s