package com.home.user.result;

/**
 * Created by wuzebo1 on 2016/5/20.
 */
public class ResponseResult {
    private int code;
    private String msg;
    private Object result;

    public ResponseResult(ResultCode resultCode){
        this.code = resultCode.getCode();
        this.msg = resultCode.getMsg();
    }

    public ResponseResult(int code, String msg) {
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

    public Object getResult() {
        return result;
    }

    public void setResult(Object result) {
        this.result = result;
    }
}
