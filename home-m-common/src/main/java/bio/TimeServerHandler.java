package bio;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.Socket;
import java.util.Date;

/**
 * Created by wuzebo1 on 2016/6/24.
 */
public class TimeServerHandler implements Runnable{
    private Socket socket;

    public TimeServerHandler(Socket socket) {
        this.socket = socket;
    }

    @Override
    public void run() {
        BufferedReader reader = null;
        PrintWriter writer = null;
        try {
            reader = new BufferedReader(new InputStreamReader(this.socket.getInputStream()));
            writer = new PrintWriter(this.socket.getOutputStream());

            String body = null;
            while (true){
                body = reader.readLine();
                if(body == null){
                    break;
                }
                System.out.print(new Date().getTime()+"-----------"+body);
            }

        }catch (Exception e){

        }

    }
}
