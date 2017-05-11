package com.home.controller;

import com.home.common.model.GlobalConstants;
import com.home.common.utils.CookieUtils;
import com.home.common.utils.StringUtils;
import com.home.user.center.client.service.UserService;
import com.home.user.center.client.vo.UserParam;
import com.home.user.center.client.vo.UserResult;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Created by wuzebo1 on 2016/5/4.
 */
public class BaseController {

    private static final Logger logger = LoggerFactory.getLogger(BaseController.class);

    @Resource
    protected HttpServletRequest request;

    @Resource
    protected UserService userService;


    /**
     * 获取当前登录用户
     *
     * @return
     */
    protected UserResult getUserInfo(HttpServletRequest request) {
        String cookieValue = CookieUtils.getCookieValue(request, GlobalConstants.USER_ID_COOKIE);
        logger.info("-----------------cookie-----------------"+cookieValue);

        UserResult userResult = null;
        if(!StringUtils.isNullString(cookieValue)){
            try {
                UserParam userParam = new UserParam();
                userParam.setId(Long.parseLong(cookieValue));
                userResult = userService.getUserInfo(userParam);
            } catch (Exception e) {
                logger.error("getUserInfo, id is " + cookieValue);
                return null;
            }
        }
        return userResult;
    }

    /**
     * 获取当前登录用户ID
     *
     * @return
     */
    protected Long getUserId(HttpServletRequest request) {
        UserResult userResult = getUserInfo(request);
        if(userResult != null){
            return userResult.getId();
        }
        return null;
    }

}
