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

import com.fasterxml.jackson.databind.*;
import com.fasterxml.jackson.databind.node.*;

@WebServlet("/database")
public class DatabaseServlet extends HttpServlet {

    private static final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json;charset=UTF-8");
        try{
            String queryType = request.getParameter("queryType");

            Connection db = DriverManager.getConnection("jdbc:postgresql:postgres", "postgres", "postgre");
            Statement st = db.createStatement();
            String sql = null;

            //Case handling for SQL command building
            switch (queryType){
                case "GetChainNames":
                    sql = "SELECT \"Chain_Name\", \"Address\" FROM \"Hotel_Chain\"";
                    break;

                case "GetSomethingElse":
                    sql = "something";
                    break;

            }

            ResultSet rs = st.executeQuery(sql);
            ArrayNode jsonArray = convertResultSetToJson(rs);
            response.getWriter().write(objectMapper.writeValueAsString(jsonArray));


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
        response.setContentType("application/json;charset=UTF-8");
        System.out.println("<html><body>");
        System.out.println("<h1>You sent a POST request!</h1>");
        System.out.println("</body></html>");
    }


    private ArrayNode convertResultSetToJson(ResultSet resultSet) throws SQLException {
        ResultSetMetaData metaData = resultSet.getMetaData();
        int columnCount = metaData.getColumnCount();
        ArrayNode jsonArray = objectMapper.createArrayNode();

        while (resultSet.next()) {
            ObjectNode jsonObject = objectMapper.createObjectNode();
            for (int i = 1; i <= columnCount; i++) {
                String columnName = metaData.getColumnName(i);
                Object columnValue = resultSet.getObject(i);
                jsonObject.putPOJO(columnName, columnValue); // Handles various data types
            }
            jsonArray.add(jsonObject);
        }

        return jsonArray;
    }
}