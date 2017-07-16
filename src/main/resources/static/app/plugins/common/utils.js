/**
 * Created by 李恒名 on 2016/6/28.
 * 工具包
 */
(function (window, $) {
    //封装的模态框对象
    var Modal = {
        show: function modal() {
            $.get('../../template/login/register.html').done(function (html) {
                layer.closeAll();
                layer.open({
                    offset: '40%',
                    type: 1,
                    closeBtn: 0,
                    shadeClose: false,
                    content: html
                });

            });
        }
    };

    var md5_key = 'RUHANG@#$%2016';

    /**
     * 将表单序列化为json对象
     * @param 表单的id
     * @returns {{}}
     */
    function fromToJson(form) {
        var result = {"client":3,"uuid":Util.createUuid(32,16)};
        var fieldArray = $('#' + form).serializeArray();
        for (var i = 0; i < fieldArray.length; i++) {
            var field = fieldArray[i];
            if (field.name in result) {
                result[field.name] += ',' + field.value;
            } else {
                result[field.name] = field.value;
            }
        }
        return result;
    }

    /**
     * 去除空格
     * @param str
     * @returns {*}
     */
    function trim(str) {
        if (typeof str !== "string") {
            return str;
        }
        if (typeof str.trim === "function") {
            return str.trim();
        } else {
            return str.replace(/^(\u3000|\s|\t|\u00A0)*|(\u3000|\s|\t|\u00A0)*$/g, "");
        }
    }

    /**
     * 空字符串判断
     * @param obj
     * @returns {boolean}
     */
    function isEmpty(obj) {
        if (obj === undefined) {
            return true;
        } else if (obj == null) {
            return true;
        } else if (typeof obj === "string") {
            if (trim(obj) == "") {
                return true;
            }
        }
        return false;
    }

    /**
     * 生成uuid
     * @param len
     * @param radix
     * @returns {string}
     */
    function createUuid(len, radix) {
        /*判断当前有浏览器中是否有uuid的cookie*/
        var uuidCookie = $.cookie("client_id");
        if (isEmpty(uuidCookie)) {
            var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
            var uuid = [], i;
            radix = radix || chars.length;

            if (len) {
                // Compact form
                for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
            } else {
                // rfc4122, version 4 form
                var r;

                // rfc4122 requires these characters
                uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
                uuid[14] = '4';

                // Fill in random data.  At i==19 set the high bits of clock sequence as
                // per rfc4122, sec. 4.1.5
                for (i = 0; i < 36; i++) {
                    if (!uuid[i]) {
                        r = 0 | Math.random() * 16;
                        uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
                    }
                }
            }
            $.cookie('client_id', uuid.join(''));
            return uuid.join('');
        } else {
            return uuidCookie;
        }
    }

    /**
     * 拼接参数
     * @param data
     * @returns {string}
     */
    function appendParams(data){
        var paramStr = '';
        if(data!=null && data!=''){
            paramStr = sortParam(data);
        }
        return paramStr;
    }

    /**
     * 参数排序
     * @param data
     */
    function sortParam(data){
        var arr = new Array();
        var arrIndex = 0;
        for(var key in data){
            arr[arrIndex] = key;
            arrIndex++;
        }
        arr = arr.sort();
        var params = '';
        for(var i = 0;i<arrIndex;i++){
            if(i==0){
                params+=arr[i]+"="+data[arr[i]];
            }else{
                params+="&"+arr[i]+"="+data[arr[i]];
            }
        }
        return params;
    }

    /**
     * 参数加密
     * @param paramStr
     * @returns {*}
     */
    function getSign(paramStr){
        if(!isEmpty(paramStr)){
            return md5(paramStr+md5_key);
        }
    }

    var User = {
        id:function(id){
            return id
        },
        login: login,
        indexLogin: function () {
            this.login(function (user) {
                location.href = location.href.indexOf('?') == -1 ? location.href : (location.href.substring(0, location.href.indexOf('?')));
                if (location.href.indexOf('?') == -1) location.reload();
            });
        }
    }

    /**
     * 通用的登录方法，调用该方放将在调用页面弹出登录框
     * @param callback  回掉函数，登录成功后执行的方法，会将user对象传入，可以进下一步操作，一般情况下传入function(){location.reload()}刷新页面即可。
     */
    function login(callback) {
        $.get('/kjs_web/template/login/login.html').done(function (html) {
            layer.closeAll();
            layer.open({
                offset: '40%',
                type: 1,
                closeBtn: 0,
                shadeClose: false,
                content: html
            });
            $('#login-btn').click(function () {
                if ($.trim($('#login-username').val()) == '' || $.trim($('#login-username').val()) == $('#login-username').attr('data-tag')) {
                    $('#login-username').siblings('.positioning').html('请输入账号');
                    $('#login-username').focus();
                }
                else if ($.trim($('#login-password').val()) == '' || $.trim($('#login-password').val()) == '请输入密码' || $.trim($('#login-password').val()) == $('#login-password').attr('data-tag')) {
                    $('#login-password').siblings('.positioning').html('请输入密码');
                    $('#login-username').focus();
                } else {
                    var data = Util.fromToJson('login-form');
                    data.sign = getSign(appendParams(data));
                    $.post(apiPath+'user/login', data).done(function (result) {
                        console.log(result);
                        if (result.stateInfo == 'SUCCESS') {
                            /*登录成功后存储用户信息*/
                            var user = result.resInfo;
                            saveUser(user);
                        } else {
                            $('#login-username').siblings('.positioning').html(result.message);
                        }
                    })
                }
            });
            //回车登录
            onEnter(function () {
                $('#login-btn').click();
            })
        });
    }

    var userInfo = {

    };

    /**
     * 存储用户信息
     * @param user
     */
    function saveUser(user){
        $.cookie("user_id",user.id);
        $.cookie("nickName",user.nickName);
        $.cookie("headUrl",user.headUrl);
        $.cookie("isVip",user.vipInfo.isVip);
        $.cookie("vipLevel",user.vipInfo.vipLevel);
        $.cookie("vipExpireDate",user.vipInfo.vipExpireDate);
        $.cookie("registerDate",user.registerDate);
    }

    /**
     * 初始化用户信息
     */
    function initUsers(){
        userInfo.id=$.cookie("user_id");
        userInfo.nickName=$.cookie("nickName");
        userInfo.headUrl=$.cookie("headUrl");
        userInfo.isVip=$.cookie("isVip");
        userInfo.vipLevel=$.cookie("vipLevel");
        userInfo.vipExpireDate=$.cookie("vipExpireDate");
        userInfo.registerDate=$.cookie("registerDate");
    }

    /**
     * 删除用户信息
     */
    function delUser(){
        $.cookie("user_id",null);
        $.cookie("nickName",null);
        $.cookie("headUrl",null);
        $.cookie("isVip",null);
        $.cookie("vipLevel",null);
        $.cookie("vipExpireDate",null);
    }

    /**
     * 公共头部
     */
    function initHead(){
        var headHtml = '';
        headHtml+= '<div class="head_center">';
        headHtml+= '<div class="head_logo">';
        headHtml+= '<a href="/"> <img src="../../resources/common/images/trh.png" alt="" height="30"/></a>';
        headHtml+= '</div>';
        headHtml+= '<div class="head_menu">';
        headHtml+= '<span><a href="/">首页</a></span>';
        headHtml+= '<span id="course"><a href="/course">课程</a></span>';
        headHtml+= '<span id="live"><a href="/live">直播</a></span>';
        headHtml+= '<span id="stu-evaluate"><a href="/stu-evaluate">学员好评</a></span>';
        headHtml+= '<span id="vip"><a href="/vip">开通会员</a></span>';
        headHtml+= '<span id="add-app"><a>下载APP</a><div class="addapp-ewm"></div></span>';
        headHtml+='<span id="add-ewm"><a>关注微信</a><div class="addewm-ewm"></div></span>';
        headHtml+='</div>';
        headHtml+='<div class="head_search">';
        headHtml+='<div class="head_search_in">';
        headHtml+='<a id="search-btn"><img src="../../resources/common/images/courseInfo_search.png" height="20" alt=""/></a>';
        headHtml+='<input id="search-word" style="color:#999" type="text" data-tag="你希望学习什么？" value="你希望学习什么？" />';
        headHtml+='</div>';
        headHtml+='<div class="head_login">';
        headHtml+='<a href="http://www.duia.com" target="_blank">去对啊网</a>&nbsp;|&nbsp;';
        headHtml+='<a href="javascript:void(0)" onclick="Util.User.indexLogin();">';
        headHtml+='登录</a>&nbsp;|&nbsp;';
        headHtml+='<a href="javascript:void(0)" onclick="Util.Modal.show();">';
        headHtml+='注册</a>';
        headHtml+='</div>';
        headHtml+='</div>';
        headHtml+='</div>';
        $(".headerBg").html(headHtml);
        //搜索按钮点击事件
        $('#search-btn').click(function () {
            var word = $.trim($('#search-word').val());
            if (word){
                location.href = '/search?word=' + word;
            } else{
                layer.alert('请输入搜索内容!', {
                    title: '温馨提示',
                    end:function () {
                        $('#search-word').focus();
                    },
                    offset:'150px'
                });
            }
        });
        $('#search-word').focus(function () {
            if(this.value=="你希望学习什么？"){
                this.value='';
            }
            Util.onEnter(function () {
                $('#search-btn').click();
            });
        });
    }

    /**
     * 公共底部
     */
    function initBoot(){
        var bootHtml = '';
        bootHtml+='<div class="kjs-f-con">';
        bootHtml+='<div class="kjs-f-text clearfloat">';
        bootHtml+='<img src="../../resources/common/images/foter-logo.png" class="kjs-f-l">';
        bootHtml+='<div class="kjs-f-c">';
        bootHtml+='<div class="kjs-f-about">';
        bootHtml+='<a href="#?m=5">关于我们</a>|';
        bootHtml+='<a href="#">会员服务</a>|';
        bootHtml+='<a href="#?m=3&sm=3">隐私条款</a>|';
        bootHtml+='<a href="#?m=3">用户协议</a>|';
        bootHtml+='<a href="#">帮助中心</a>|';
        bootHtml+='<a href="#?m=4">联系我们</a>|';
        bootHtml+='<a href="#?m=2">意见反馈</a>|';
        bootHtml+='<a href="http://www.duia.com" target="_blank">去对啊网</a>';
        bootHtml+='</div>';
        bootHtml+='<div class="kjs-f-bq">';
        bootHtml+='<span>Copyright@2016</span> <span>北京入行教育科技有限公司版权所有</span> <span> 京ICP备16011120号-2</span><span> 京ICP证160803号</span><span>京公网安备11030102010060号</span>';
        bootHtml+='</div>';
        bootHtml+='</div>';
        bootHtml+='</div>';
        bootHtml+='<a class="kjs-fo-tittle"style="top: 0px;" key ="57a7f329efbfb00b583282a1"  logo_size="124x47"  logo_type="realname"  href="http://www.anquan.org" ><script src="//static.anquan.org/static/outer/js/aq_auth.js"></script></a>';
        bootHtml+='</div>';
        $(".kjs-fotter").html(bootHtml);
    }

    function getRequestParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }

    /**
     * 初始化 jQuery File Upload 上传文件插件
     * @param fileId
     * @param previewId  预览图id
     * @param savePathInputId  保存图片路径的input id
     * @param saveDirName  服务器上保存图片的目录
     */
    function initFileupload(fileId,previewId,savePathInputId,saveDirName,callback) {
        $('#'+fileId).fileupload({
            // url:'/upload/image?dirName='+saveDirName,
            url: '/help',
            done: function (e, result) {
                if(result.result.success){
                    var path = result.result.data.path;
                    $('#'+previewId).attr('src', path);
                    $('#'+savePathInputId).val(path);
                    (typeof callback == 'function' && callback())
                }else{
                    var alert = layer.alert||window.alert;
                    layer.alert(result.result.message);
                }
            }
        });
    }

    function getFileName(o){
        var pos=o.lastIndexOf("\\");
        return o.substring(pos+1);
    }

    /**
     * 页面右侧浮动
     */

    function rightFloat() {
        //alert(document.cookie.split(";")[0])
        if (document.cookie.split(";")[0] != "superh") {
            $(".toolbar").css("display", "block")

        }
        if (document.cookie.split(";")[0] == "superh") {
            $('.too-ewm em').css("display", "none")
            $(".too-ewm").css("background", "#444851")
            $('.too-ewm em small').css("display", "none");
            $(".res").removeClass("end-res")
            $('.too-ewm em').attr("data-end", "1");
            $(".toolbar").css("display", "block")
        }
        $('.too-ewm em small').click(function () {
            $('.too-ewm em').css("display", "none")
            $('.too-ewm em small').css("display", "none");
            $('.too-ewm em').attr("data-end", "1");
            $(".too-ewm").css("background", "#444851")
            $(".res").removeClass("end-res")
            document.cookie = "superh";

        })

        $('.too-ewm').hover(function () {
            if ($('.too-ewm em').attr("data-end") == 1) {
                $('.too-ewm em').css("display", "block")
                $(".res").addClass("end-res")
            }
        }, function () {
            if ($('.too-ewm em').attr("data-end") == 1) {
                $('.too-ewm em').css("display", "none")
                $(".res").removeClass("end-res")
            }
        });

        $('.too-xn').hover(function () {
            if ($('.too-ewm em').attr("data-end") == 0) {
                $('.too-ewm em').stop().animate({'right': '50px', 'opacity': 'hide'}, 'fast');
                $('.too-ewm em small').css("display", "none");
                $('.too-ewm em').attr("data-end", "1")
            }
            $('.too-xn em').css("display", "block")

        }, function () {
            $('.too-xn em').css("display", "none")
        });

        $('.too-scrollT').on('click', function () {
            $('body,html').animate({scrollTop: 0})
        });
    }

    //点击回车调用方法
    function onEnter(callback) {
        window.document.onkeydown = function (e) {
            var ev = document.all ? window.event : e;
            ev.keyCode == 13 && callback();
        }
    }

    //埋点存储
    var visitTime = getTime();//访问进入时间
    function saveVisit() {
        try {
            var stayTime = getTime();//离开时间
            var gid = $.cookie('gid');//cookie
            var currentUrl = window.location.href;
            var refererUrl = getRefererUrl() ? getRefererUrl() : currentUrl;
            var datas = {
                currentUrl: currentUrl, refererUrl: refererUrl,
                visitTime: visitTime, stayTime: stayTime, gid: gid
            };
            if (!datas) return;
            $.post('/userVisit/save', datas);
        } catch (e) {
        }
    }

    //埋点存储监听
    function addEventListener() {
        saveVisit();
        $(window).unbind().bind(leaveEvent(), function () {
            saveVisit();
        });
    }

    //设置导航栏颜色
    function NavbarCss() {
        var currentUrl = window.location.href;
        var s = currentUrl.lastIndexOf('/') + 1;
        var e = currentUrl.lastIndexOf('?') != -1 ? currentUrl.lastIndexOf('?') : currentUrl.length;
        var cssObj = currentUrl.substring(s, e);
        $('#' + cssObj + ' a').css('color', '#5583db');
    }

    //获取当前时间,适用各种浏览器,格式如2011-08-03 09:15:11
    function getTime() {
        var time = new Date();
        var y = time.getFullYear();
        var M = time.getMonth();
        var d = time.getDate();
        var h = time.getHours();
        var m = time.getMinutes();
        var s = time.getSeconds();

        M = (M < 10 ? ('0' + M) : M);
        d = (d < 10 ? ('0' + d) : d);
        h = (h < 10 ? ('0' + h) : h);
        m = (m < 10 ? ('0' + m) : m);
        s = (s < 10 ? ('0' + s) : s);

        return new Date(y, M, d, h, m, s);
    }

    //获取来源地址
    function getRefererUrl() {
        var ref = document.referrer;
        try {

            var jsRef = window.opener.location.href;
            if (ref.length == 0 && jsRef.length > 0) {
                ref = jsRef;
            }

        } catch (e) {
        }

        return ref;
    }

    //登录回调监听器(监听URL参数)
    function loginListener() {
        var url = Util.getRequestParam('login');//如果该参数存在说明是从未登录页面跳转过来的，弹出登陆框，登录后并返回之前页面。
        var remind = getRequestParam('remind');
        var mobile = getRequestParam('mobile');

        if (url && (!mobile)) {
            Util.User.login(function (user) {
                location.href = url;
            });
        } else {
            var p = getRequestParam('p');
            var info = getRequestParam('info');
            //如果为真弹出第三方登录完善资料弹框
            if (p == 'perfection' && info) {
                Modal.show('/resources/modal/bound.html?info=' + info);
            }
            // var remind = getRequestParam('remind');
            // var mobile = getRequestParam('mobile');
            //第三方登录弹框
            if (remind && mobile) {
                $.get('/resources/modal/tc' + remind + '.html').done(function (html) {
                    layer.closeAll();
                    layer.open({
                        offset: '40%',
                        type: 1,
                        closeBtn: 0,
                        shadeClose: false,
                        content: html.replace(/#mobile/g, mobile)
                    });

                });
            }
        }
    }

    //根据不同浏览器做离开监听事件
    function leaveEvent() {
        var s = 'beforeunload';
        var o = navigator.userAgent.toLowerCase();
        if (/firefox/.test(o)) s = 'unload';//火狐
        return s;
    }

    //阿拉伯数字转中文
    function convertToChinese(num) {
        var N = [
            "零", "一", "二", "三", "四", "五", "六", "七", "八", "九"
        ];
        var str = num.toString();
        var len = num.toString().length;
        var C_Num = [];
        for (var i = 0; i < len; i++) {
            C_Num.push(N[str.charAt(i)]);
        }
        return C_Num.join('').toString();
    }

    /**
     * 发送短信验证码
     * @param buttonId 发送按钮ID
     * @param type 发送类型
     */
    function sendSms(buttonId, type) {
        var locked = false; //防止重复点击的锁
        $("#" + buttonId).click(function (event) {
            if (!locked) {
                var time = 59;
                var $readOnlyBtn = $('#sms-btn-readonly');
                var $sendBtn = $(this);
                var $phone = $('#phone');
                var $imageCaptcha = $('#image-captcha');

                var captcha = $.trim($imageCaptcha.val());
                var mobile = $.trim($phone.val());
                var positioning = $('#phone').siblings('.positioning').html()
                if (!/^(13[0-9]|17[0-9]|14[0-9]|15[0-9]|18[0-9])\d{8}$/.test(mobile)) {
                    $phone.siblings('.positioning').html('请输入正确的手机号');
                } else if (positioning == '该手机号已被注册' || positioning == '此手机号尚未绑定会计狮账号') {
                    return;
                } else if (captcha == '') {
                    $imageCaptcha.siblings('.positioning').html('请输入图形验证码');
                } else {
                    locked = true;
                    $.post('/captcha/sms', {imageCaptcha: captcha, mobile: mobile, type: type}).done(function (result) {
                        if (result.success) {
                            $sendBtn.hide();
                            $readOnlyBtn.html(time + "秒");
                            $readOnlyBtn.show();
                            var t = setInterval(function () {
                                time--;
                                $readOnlyBtn.html(time + "秒");
                                if (time == 0) {
                                    clearInterval(t);
                                    $sendBtn.html('重新获取');
                                    $('#capt-img').click();
                                    $readOnlyBtn.hide();
                                    locked = false;
                                    $sendBtn.show();
                                }
                            }, 1000);
                        } else {
                            $imageCaptcha.siblings('.positioning').html(result.message);
                            locked = false;
                        }
                    });
                }
            }
        });
    }

    window.Util = {
        Modal: Modal,
        User: User,
        fromToJson: fromToJson,
        getRequestParam: getRequestParam,
        uploadFile: initFileupload,
        rightFloat: rightFloat,
        onEnter: onEnter,
        addEventListener: addEventListener,
        leaveEvent: leaveEvent,
        loginListener: loginListener,
        convertToChinese: convertToChinese,
        sendSms: sendSms,
        navbarCss: NavbarCss,
        createUuid: createUuid,
        getSign:getSign,
        appendParams:appendParams,
        sortParam:sortParam,
        userInfo:userInfo,
        initUsers:initUsers,
        initBoot:initBoot,
        initHead:initHead
    };

})(this, jQuery);


//百度统计
var _hmt = _hmt || [];

$(function () {
    Util.loginListener();

    Util.addEventListener();

    if (location.host == 'www.kuaijishizi.com') {
        var hm = document.createElement("script");
        hm.src = "//hm.baidu.com/hm.js?6340b0bfb57596fe8af2668cb897848c";
        var s = document.getElementsByTagName("script")[0];
        s.parentNode.insertBefore(hm, s);
    }
});