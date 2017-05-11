package bio;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.Socket;

/**
 * Created by wuzebo1 on 2016/6/24.
 */
public class TimeClient {
    public static void main(String args[]) throws Exception{
        int port = 8001;
        Socket socket = null;
        BufferedReader reader = null;
        PrintWriter writer = null;
        try {
            socket = new Socket("127.0.0.1",port);
            reader = new BufferedReader(new InputStreamReader(socket.getInputStream()));
            writer = new PrintWriter(socket.getOutputStream());

            writer.print("aaaaaaaaaaaaaaaaa");
            System.out.print(reader.readLine());
            while (true){
                    new Thread(new TimeServerHandler(socket)).start();
            }

        } catch (IOException e) {
            e.printStackTrace();
        }finally {

        }
    }
}
