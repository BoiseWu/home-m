package mq.active;

import org.apache.activemq.broker.BrokerService;

/**
 * Created by wuzebo1 on 2016/8/9.
 */
public class Test {

    public static void main(String [] args) throws Exception{
        BrokerService brokerService = new BrokerService();
        brokerService.addConnector("http://localhost:8161");
        brokerService.start();
    }
}

