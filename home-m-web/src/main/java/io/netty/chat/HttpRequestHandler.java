package io.netty.chat;

import io.netty.channel.*;
import io.netty.handler.codec.http.*;
import io.netty.handler.codec.http.HttpResponse;
import io.netty.handler.codec.http.HttpResponseStatus;
import io.netty.handler.codec.http.HttpVersion;
import io.netty.handler.codec.string.StringDecoder;
import io.netty.handler.ssl.SslHandler;
import io.netty.handler.stream.ChunkedNioFile;

import java.io.File;
import java.io.RandomAccessFile;
import java.net.URISyntaxException;
import java.net.URL;

/**
 * Created by wuzebo1 on 2016/7/29.
 */
public class HttpRequestHandler extends SimpleChannelInboundHandler<FullHttpRequest> {
    private final String wsUri;
    private static final File INDEX;

    static {
        URL location = HttpRequestHandler.class.getProtectionDomain().getCodeSource().getLocation();
        try {
            String path = location.toURI()+"websocketChatClient.html";
            path = !path.contains("file:")? path : path.substring(5);
            INDEX = new File(path);
        }catch (URISyntaxException e){
            throw new IllegalStateException("unable to locate webSocketChatClient.html", e);
        }
    }
    public HttpRequestHandler(String wsUri){
        this.wsUri = wsUri;
    }
    @Override
    protected void channelRead0(ChannelHandlerContext ctx, FullHttpRequest fullHttpRequest) throws Exception {
        if(wsUri.equalsIgnoreCase(fullHttpRequest.getUri())){
            ctx.fireChannelRead(fullHttpRequest.retain());
        }else {
            if(HttpHeaders.is100ContinueExpected(fullHttpRequest)){
                send100Continue(ctx);
            }
            send100Continue(ctx);

            RandomAccessFile file = new RandomAccessFile(INDEX, "r");

            HttpResponse response = new DefaultFullHttpResponse(fullHttpRequest.getProtocolVersion(), HttpResponseStatus.OK);

            response.headers().set(HttpHeaders.Names.CONTENT_TYPE,"text/html;charset=UTF-8");

            boolean keepAlive = HttpHeaders.isKeepAlive(fullHttpRequest);

            if(keepAlive){
                response.headers().set(HttpHeaders.Names.CONTENT_LENGTH, file.length());
                response.headers().set(HttpHeaders.Names.CONNECTION, HttpHeaders.Values.KEEP_ALIVE);
            }
            ctx.write(response);
            if(ctx.pipeline().get(SslHandler.class) == null){
                ctx.write(new DefaultFileRegion(file.getChannel(),0,file.length()));
            }else {
                ctx.write(new ChunkedNioFile(file.getChannel()));
            }
            ChannelFuture future = ctx.writeAndFlush(LastHttpContent.EMPTY_LAST_CONTENT);
            if(!keepAlive){
                future.addListener(ChannelFutureListener.CLOSE);
            }
            file.close();
        }
    }

    private static void send100Continue(ChannelHandlerContext ctx){
        FullHttpResponse response = new DefaultFullHttpResponse(HttpVersion.HTTP_1_1, HttpResponseStatus.CONTINUE);
        ctx.writeAndFlush(response);
    }

    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) throws Exception {
        Channel incoming = ctx.channel();
        System.out.println("SimpleChatClient:"+incoming.remoteAddress()+" 异常");
        cause.printStackTrace();
        ctx.close();
    }
}
