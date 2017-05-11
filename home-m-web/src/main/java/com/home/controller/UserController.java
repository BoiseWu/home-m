package com.home.controller;

import com.home.common.model.GlobalConstants;
import com.home.common.utils.CookieUtils;
import com.home.common.utils.MD5Utils;
import com.home.common.utils.StringUtils;
import com.home.user.center.client.service.PictureService;
import com.home.user.center.client.service.UserGroupService;
import com.home.user.center.client.service.UserService;
import com.home.user.center.client.vo.PictureParam;
import com.home.user.center.client.vo.PictureResult;
import com.home.user.center.client.vo.UserParam;
import com.home.user.center.client.vo.UserResult;
import com.home.user.result.ResponseResult;
import com.home.user.result.ResultCode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by wuzebo1 on 2016/5/4.
 */
@Controller
@RequestMapping("/m/user")
public class UserController extends BaseController{

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);


    @Resource
    private UserGroupService userGroupService;
    @Resource
    private PictureService pictureService;

    @RequestMapping("/login")
    @ResponseBody
    public ResponseResult login(String userName, String userPass, String authcode,HttpServletResponse response){
        logger.info("UserController---login");
        ResponseResult responseResult = new ResponseResult(ResultCode.SUCCESS);
        if(StringUtils.isNullString(userName) || StringUtils.isNullString(userPass) || StringUtils.isNullString(authcode)){
            return new ResponseResult(ResultCode.NOT_NULL);
        }

        String code = (String)request.getSession().getAttribute(com.google.code.kaptcha.Constants.KAPTCHA_SESSION_KEY);
        if(!authcode.equals(code)){
            return new ResponseResult(ResultCode.AUTH_CODE_NOT_TRUE);
        }

        UserParam userParam = new UserParam();
        userParam.setUserName(userName);
        userPass = MD5Utils.GetMD5Code(userPass);
        userParam.setUserPass(userPass);

        UserResult userResult = userService.getUserInfo(userParam);
        if(userResult != null && userResult.getId() != null){
            CookieUtils.setCookie(request,response, GlobalConstants.USER_ID_COOKIE,userResult.getId().toString());
            responseResult.setResult(userResult);
        }
        return responseResult;
    }

    @RequestMapping("/getInfo")
    @ResponseBody
    public ResponseResult getInfo(){
        logger.info("UserController---getInfo");
        ResponseResult responseResult = new ResponseResult(ResultCode.SUCCESS);
        UserResult userResult = super.getUserInfo(request);
        if(userResult == null){
            return new ResponseResult(ResultCode.USER_NO_LOGIN);
        }
        responseResult.setResult(userResult);

        //创建连接


        return responseResult;
    }

    @RequestMapping("/register")
    @ResponseBody
    public ResponseResult regist(UserParam userParam, String confirmUserPass){
        logger.info("UserController---register");
        ResponseResult responseResult = new ResponseResult(ResultCode.SUCCESS);
        if(userParam == null || StringUtils.isNullString(userParam.getUserName())
                || StringUtils.isNullString(userParam.getUserPass()) || StringUtils.isNullString(confirmUserPass)){
            return new ResponseResult(ResultCode.NOT_NULL);
        }
        if(!confirmUserPass.equals(userParam.getUserPass())){
            return new ResponseResult(ResultCode.PASS_NOT_CONSISTENT);
        }
        userParam.setUserPass(MD5Utils.GetMD5Code(userParam.getUserPass()));
        userParam.setUserStatus(1);
        userParam.setUserType(1);
        Integer i = userService.regUserInfo(userParam);
        if(i == null || i == 0){
            return new ResponseResult(ResultCode.FAILURE);
        }
        return responseResult;
    }

    @RequestMapping("/getUserPhoto")
    @ResponseBody
    public ResponseResult getUserPhoto(){
        logger.info("UserController---getUserPhoto");
        ResponseResult responseResult = new ResponseResult(ResultCode.SUCCESS);
        Long userId = super.getUserId(request);
        List<PictureResult> pictureResults = pictureService.getPictureByUserId(userId);
        responseResult.setResult(pictureResults);
        return responseResult;
    }

    @RequestMapping("/editUserPhoto")
    @ResponseBody
    public ResponseResult editUserPhoto(@RequestParam(value="editImgs[]") String[] editImgs){
        logger.info("UserController---editUserPhoto");
        if(editImgs == null || editImgs.length == 0){
            return new ResponseResult(ResultCode.NOT_NULL);
        }
        ResponseResult responseResult = new ResponseResult(ResultCode.SUCCESS);
        Long userId = super.getUserId(request);
        boolean flag = true;
        for(String editImg : editImgs){
            if(!StringUtils.isNullString(editImg)){
                if(editImg.indexOf("http")>0){
                    PictureParam pictureParam = new PictureParam();
                    pictureParam.setUserId(userId);
                    pictureParam.setPicStatus(1);
                    pictureParam.setPicType(1);
                    pictureParam.setPicUrl(editImg);
                    Integer integer = pictureService.insertPicture(pictureParam);
                    if(integer == null || integer == 0){
                        flag = false;
                    }
                }else{
                    PictureParam pictureParam = new PictureParam();
                    pictureParam.setId(Long.parseLong(editImg));
                    pictureParam.setPicStatus(0);
                    Integer integer = pictureService.updatePicture(pictureParam);
                    if(integer == null || integer == 0){
                        flag = false;
                    }
                }
            }
        }
        if(flag){
            return new ResponseResult(ResultCode.SUCCESS);
        }
        return new ResponseResult(ResultCode.FAILURE);
    }




}
