package bio;

import java.io.IOException;
import java.net.ServerSocket;
import java.net.Socket;

/**
 * Created by wuzebo1 on 2016/6/24.
 */
public class TimeServer {
    public static void main(String args[]) throws Exception{
        int port = 8001;
        ServerSocket serverSocket = null;
        try {
            serverSocket = new ServerSocket(port);

            Socket socket = null;

            while (true){
                System.out.println("等待客户端请求");
                socket = serverSocket.accept();
                System.out.println("接受客户端请求");
                new Thread(new TimeServerHandler(socket)).start();
            }

        } catch (IOException e) {
            e.printStackTrace();
        }finally {
            if(serverSocket != null){
                serverSocket.close();
                serverSocket = null;
            }
        }
    }
}
