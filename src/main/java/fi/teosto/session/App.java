package fi.teosto.session;

import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

import org.apache.log4j.Logger;

public class App
{
    private static final Logger logger = Logger.getLogger(App.class);

    public static void main(String[] args) throws Exception {
      logger.info("Starting HTTP server...");
      HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);
      server.createContext("/", new TestHandler());
      server.setExecutor(null);
      server.start();
      logger.info("HTTP server started successfully\n");
    }

    static class TestHandler implements HttpHandler {
      public void handle(HttpExchange t) throws IOException {
        logger.info("Handling (" + t.getRequestMethod() + ") request to '" + t.getRequestURI() + "'");
        StringBuffer headers = new StringBuffer("Headers:");
        for (String header : t.getRequestHeaders().keySet()) {
          headers.append(System.getProperty("line.separator")).append("\t")
            .append(header).append(": ")
            .append(t.getRequestHeaders().getFirst(header));
        }
        headers.append(System.getProperty("line.separator"));
        logger.info(headers);

        String response = "Teosto-Session test app";
        t.sendResponseHeaders(200, response.length());
        OutputStream os = t.getResponseBody();
        os.write(response.getBytes());
        os.close();
      }
    }

}
