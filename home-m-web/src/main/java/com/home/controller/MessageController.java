package com.home.controller;

import com.home.user.center.client.service.MessageService;
import com.home.user.center.client.vo.MessageParam;
import com.home.user.center.client.vo.MessageResult;
import com.home.user.result.ResponseResult;
import com.home.user.result.ResultCode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

/**
 * Created by wuzebo1 on 2016/6/9.
 */
@Controller
@RequestMapping("/m/message")
public class MessageController extends BaseController {
    private static final Logger logger = LoggerFactory.getLogger(MessageController.class);

    @Autowired
    private MessageService messageService;

    @RequestMapping("/saveMessage")
    @ResponseBody
    public ResponseResult saveMessage(MessageParam messageParam){
        logger.info("MessageController---saveMessage");
        Long userId = super.getUserId(request);
        if(messageParam == null){
            return new ResponseResult(ResultCode.NOT_NULL);
        }
        messageParam.setType(1);
        messageParam.setUserId(userId);
        Integer i = messageService.insertMessage(messageParam);
        if(i == null || i ==0){
            return new ResponseResult(ResultCode.FAILURE);
        }
        return new ResponseResult(ResultCode.SUCCESS);
    }
    @RequestMapping("/getMessages")
    @ResponseBody
    public ResponseResult getMessages(){
        logger.info("MessageController---getMessages");
        ResponseResult responseResult = new ResponseResult(ResultCode.SUCCESS);
        MessageParam messageParam = new MessageParam();
        messageParam.setUserId(super.getUserId(request));
        List<MessageResult> messageList = messageService.getMessageList(messageParam);
        responseResult.setResult(messageList);
        return responseResult;
    }
}
