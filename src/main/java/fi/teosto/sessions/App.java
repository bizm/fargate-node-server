package fi.teosto.sessions;

import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

public class App
{

    public static void main(String[] args) throws Exception {
      HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);
      server.createContext("/", new TestHandler());
      server.setExecutor(null);
      server.start();
    }

    static class TestHandler implements HttpHandler {
      public void handle(HttpExchange t) throws IOException {
        String response = "Sessions test app";
        t.sendResponseHeaders(200, response.length());
        OutputStream os = t.getResponseBody();
        os.write(response.getBytes());
        os.close();
      }
    }

}
