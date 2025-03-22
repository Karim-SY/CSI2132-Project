package org.example;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.sql.*;


@WebServlet("/database")
public class DatabaseServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        String sql = "SELECT B.\"Date\", B.\"Hotel_Num\", B.\"Room_Num\", P.\"Name\" AS Customer_Name\n" +
                    "FROM \"Book\" B\n" +
                    "JOIN \"Customer\" C ON B.\"Customer_ID\" = C.\"ID\"\n" +
                    "JOIN \"Person\" P ON C.\"ID\" = P.\"ID\";\n";

        try (Connection db = DriverManager.getConnection("jdbc:postgresql:postgres", "postgres", "password");
             Statement st = db.createStatement()) {

            ResultSet rs = st.executeQuery(sql);
            while (rs.next()){
                System.out.println("Return: ");
                System.out.println(rs.getString(1));
                System.out.println(rs.getString(2));
                System.out.println(rs.getString(3));
                System.out.println(rs.getString(4));
            }

        } catch (SQLException e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("Database error: " + e.getMessage());
        }
    }
}
