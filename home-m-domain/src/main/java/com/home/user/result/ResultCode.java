package com.home.user.result;

/**
 * Created by wuzebo1 on 2016/5/20.
 */
public enum ResultCode {

    EXCEPTION(-1, "异常"),
    SUCCESS(0, "成功"),
    FAILURE(1, "失败"),
    NOT_NULL(2, "参数不能为空"),
    USER_NO_LOGIN(3, "用户未登录"),
    PASS_NOT_CONSISTENT(4, "密码不一致"),
    AUTH_CODE_NOT_TRUE(5, "验证码不正确"),
    PHOTO_TYPE_NOT_TRUE(6, "图片类型不正确");

    private int code;
    private String msg;

    ResultCode(int code, String msg) {
        this.code = code;
        this.msg = msg;
    }

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
