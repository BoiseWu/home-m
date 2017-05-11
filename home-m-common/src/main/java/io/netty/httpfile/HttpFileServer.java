package io.netty.httpfile;

import io.netty.bootstrap.ServerBootstrap;
import io.netty.channel.ChannelFuture;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.EventLoopGroup;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.ServerSocketChannel;
import io.netty.channel.socket.nio.NioServerSocketChannel;
import io.netty.channel.socket.nio.NioSocketChannel;
import io.netty.handler.codec.http.HttpObjectAggregator;
import io.netty.handler.codec.http.HttpRequestDecoder;
import io.netty.handler.codec.http.HttpResponseEncoder;
import io.netty.handler.stream.ChunkedWriteHandler;

/**
 * Created by wuzebo1 on 2016/7/6.
 */
public class HttpFileServer {

    public void bind(String host, int port) throws Exception{
        EventLoopGroup bossGroup = new NioEventLoopGroup();
        EventLoopGroup workerGroup = new NioEventLoopGroup();
        try {
            ServerBootstrap bootstrap = new ServerBootstrap();
            bootstrap.group(bossGroup, workerGroup)
                    .channel(NioServerSocketChannel.class)
                    .childHandler(new ChannelInitializer<ServerSocketChannel>() {
                        @Override
                        protected void initChannel(ServerSocketChannel serverSocketChannel) throws Exception {
                            serverSocketChannel.pipeline().addLast("http-decoder", new HttpRequestDecoder());
                            serverSocketChannel.pipeline().addLast("http-aggregator", new HttpObjectAggregator(65536));
                            serverSocketChannel.pipeline().addLast("http-encoder", new HttpResponseEncoder());
                            serverSocketChannel.pipeline().addLast("http-chunked", new ChunkedWriteHandler());
                           // serverSocketChannel.pipeline().addLast("fileServerHandler", new HttpFileServerHandler());
                        }
                    });

            ChannelFuture channelFuture = bootstrap.bind("192.168.1.102",port).sync();
            channelFuture.channel().closeFuture().sync();

        }finally {
            bossGroup.shutdownGracefully();
            workerGroup.shutdownGracefully();
        }
    }
    public static void main(String args[])throws Exception{
        new HttpFileServer().bind("127.0.0.1",8080);
    }

}
