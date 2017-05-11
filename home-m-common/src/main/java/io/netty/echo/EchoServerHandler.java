package io.netty.echo;

import io.netty.buffer.ByteBuf;
import io.netty.buffer.Unpooled;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.ChannelInboundHandlerAdapter;

/**
 * Created by wuzebo1 on 2016/7/6.
 */
public class EchoServerHandler extends ChannelInboundHandlerAdapter {
    private int count = 0;
    @Override
    public void channelRead(ChannelHandlerContext ctx, Object msg) throws Exception {
        String body = (String)msg;
        System.out.println(++count+"server receive : "+body);
        //body+="$!";
        ByteBuf byteBuf = Unpooled.copiedBuffer(body.getBytes());
        ctx.writeAndFlush(byteBuf);
    }

    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) throws Exception {
        cause.printStackTrace();
        ctx.close();
    }
}
