package io.netty.chat1;

import io.netty.bootstrap.Bootstrap;
import io.netty.channel.Channel;
import io.netty.channel.EventLoopGroup;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.nio.NioSocketChannel;

import java.io.BufferedReader;
import java.io.InputStreamReader;

/**
 * Created by wuzebo1 on 2016/7/29.
 */
public class SimpleChatClient  {
    private final int port;
    private final String host;

    public SimpleChatClient(int port, String host) {
        this.port = port;
        this.host = host;
    }

    public void run()throws Exception{
        EventLoopGroup group = new NioEventLoopGroup();
        try {
            Bootstrap bootstrap = new Bootstrap();
            bootstrap.group(group)
                    .channel(NioSocketChannel.class)
                    .handler(new SimpleChatClientInitializer());
            Channel channel = bootstrap.connect(host, port).sync().channel();
            BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
            while (true){
                channel.writeAndFlush(in.readLine()+"\r\n");
            }

        }finally {
            group.shutdownGracefully();
        }
    }

    public static void main(String [] args)throws Exception{
        new SimpleChatClient(8080, "127.0.0.1").run();
    }
}
