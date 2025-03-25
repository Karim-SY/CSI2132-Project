package org.example;

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
            System.out.println("Test!");
            PrintWriter out = null;

            Connection db = DriverManager.getConnection("jdbc:postgresql:postgres", "postgres", "postgre");
            Statement st = db.createStatement();
            ResultSet rs = st.executeQuery("SELECT B.\"Date\", B.\"Hotel_Num\", B.\"Room_Num\", P.\"Name\" AS Customer_Name\n" +
                    "FROM \"Book\" B\n" +
                    "JOIN \"Customer\" C ON B.\"Customer_ID\" = C.\"ID\"\n" +
                    "JOIN \"Person\" P ON C.\"ID\" = P.\"ID\";\n");
            while (rs.next()){
                out.println("<html><body> ");
                out.println(rs.getString(1));
                out.println(rs.getString(2));
                out.println(rs.getString(3));
                out.println(rs.getString(4));
                out.println("</body></html> ");
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