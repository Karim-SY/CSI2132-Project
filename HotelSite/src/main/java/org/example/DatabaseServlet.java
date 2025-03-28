package org.example;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
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

                case "GetContacts":
                    sql = "SELECT \"Chain_Name\", \"Phone\" FROM \"Hotel_Chain\";";
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
        Connection db = null;
        PreparedStatement pstmt = null;
        try{
            String queryType = request.getParameter("queryType");

            db = DriverManager.getConnection("jdbc:postgresql:postgres", "postgres", "postgre");

            switch (queryType){
                case "RegEmployee":
                    String ID = request.getParameter("ID");
                    String Name = request.getParameter("Name");
                    String Address = request.getParameter("Address");
                    String ID_Type = request.getParameter("ID_Type");
                    String Role = request.getParameter("Role");

                    String sql = "INSERT INTO \"Person\" (\"ID\", \"Name\", \"Address\", \"ID_Type\") VALUES (?, ?, ?, ?);\n  INSERT INTO \"Employee\" (\"ID\", \"Name\", \"Address\", \"Role\") VALUES (?, ?, ?, ?);";

                    pstmt = db.prepareStatement(sql);
                    pstmt.setString(1, ID);
                    pstmt.setString(2, Name);
                    pstmt.setString(3, Address);
                    pstmt.setString(4, ID_Type);
                    pstmt.setString(5, ID);
                    pstmt.setString(6, Name);
                    pstmt.setString(7, Address);
                    pstmt.setString(8, Role);
                    break;

                case "PostSomethingElse":
                    // Handle other query types with PreparedStatement as well
                    break;
            }

            if (pstmt != null) {
                pstmt.executeUpdate(); // Use executeUpdate for INSERT, UPDATE, DELETE
            }

        }
        catch (SQLException e) {
            throw new RuntimeException(e);
        } finally {
            // Close resources in a finally block to ensure they are always closed
            try {
                if (pstmt != null) pstmt.close();
                if (db != null) db.close();
            } catch (SQLException ex) {
                ex.printStackTrace(); // Log any errors during closing
            }
        }
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