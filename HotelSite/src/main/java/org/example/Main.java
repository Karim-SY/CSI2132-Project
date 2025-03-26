package org.example;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.*;
import java.util.ArrayList;


public class Main {

    public static void main(String[] args) throws SQLException {
        Connection db = DriverManager.getConnection("jdbc:postgresql:postgres", "postgres", "postgres");
        Statement st = db.createStatement();
        ResultSet rs = st.executeQuery("SELECT \"Chain_Name\", \"Address\" FROM \"Hotel_Chain\"");
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

        System.out.println(finalStr);

        rs.close();
        st.close();
    }
}

