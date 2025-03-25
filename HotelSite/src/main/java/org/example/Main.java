package org.example;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.*;


public class Main {

    public static void main(String[] args) throws SQLException {
        Connection db = DriverManager.getConnection("jdbc:postgresql:postgres", "postgres", "postgres");
        Statement st = db.createStatement();
        ResultSet rs = st.executeQuery("SELECT B.\"Date\", B.\"Hotel_Num\", B.\"Room_Num\", P.\"Name\" AS Customer_Name\n" +
                                            "FROM \"Book\" B\n" +
                                            "JOIN \"Customer\" C ON B.\"Customer_ID\" = C.\"ID\"\n" +
                                            "JOIN \"Person\" P ON C.\"ID\" = P.\"ID\";\n");
        while (rs.next()){
            System.out.println("Return: ");
            System.out.println(rs.getString(1));
            System.out.println(rs.getString(2));
            System.out.println(rs.getString(3));
            System.out.println(rs.getString(4));
        }

        rs.close();
        st.close();



    }
}

