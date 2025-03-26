package org.example;

import com.sun.tools.jconsole.JConsoleContext;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.*;


@WebServlet("/HotelSite")
public class DatabaseServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/html");
        try{
            String queryType = request.getParameter("queryType");

            PrintWriter out = null;

            Connection db = DriverManager.getConnection("jdbc:postgresql:postgres", "postgres", "postgre");
            Statement st = db.createStatement();
            String sql = null;

            //Case handling for SQL command building
            switch (queryType){
                case "GetChainNames":
                    sql = "SELECT \"Chain_Name\", \"Address\" FROM \"Hotel_Chain\"";

                case "GetSomethingElse":
                    sql = "something";

            }

            ResultSet rs = st.executeQuery(sql);

            //case handling for parsing data of differing column sizes
            switch (queryType){
                case "GetChainNames":
                    String output = "";
                    while (rs.next()){
                        output = output + rs.getString(1) + "_";
                        output = output + rs.getString(2) + "\n";
                    }
                    System.out.print(output);
                    String[] temp = {};
                    String[] temp2 = {};
                    String finalStr = "";
                    temp = output.split("\n");
                    for (String s : temp) {
                        temp2 = s.split("_");
                        finalStr = finalStr + "<option value=\"" + temp2[1] + "\">" + temp2[0] + "</option>\n";
                    }
                    out.println(finalStr);
                    System.out.println(finalStr);

                case "GetSomethingElse":
                    sql = "something";

            }


            rs.close();
            st.close();

        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        // Handle POST requests here
        response.setContentType("text/html");
        System.out.println("<html><body>");
        System.out.println("<h1>You sent a POST request!</h1>");
        System.out.println("</body></html>");
    }
}