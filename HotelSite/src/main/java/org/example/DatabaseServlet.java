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
            String ID = "";

            //Case handling for SQL command building
            switch (queryType){
                case "GetChainNames":
                    sql = "SELECT \"Chain_Name\", \"Address\" FROM \"Hotel_Chain\"";
                    break;

                case "GetContacts":
                    sql = "SELECT \"Chain_Name\", \"Phone\" FROM \"Hotel_Chain\";";
                    break;

                case "SearchRooms":
                    String hotelChain = request.getParameter("hotelChain");
                    String maxPrice = request.getParameter("maxPrice");
                    String guests = request.getParameter("guests");
                    String attraction = request.getParameter("attraction");
                    // Build the SQL query with parameters
                    StringBuilder sqlBuilder = new StringBuilder();
                    sqlBuilder.append("SELECT r.\"Hotel_Num\", r.\"Room_Num\", r.\"Price\", r.\"Amenities\", r.\"Capacity\", r.\"View\" ");
                    sqlBuilder.append("FROM \"Room\" r ");
                    sqlBuilder.append("JOIN \"Hotel\" h ON r.\"Hotel_Num\" = h.\"Hotel_Num\" ");
                    sqlBuilder.append("JOIN \"Owns\" o ON h.\"Hotel_Num\" = o.\"Hotel_Num\" ");
                    sqlBuilder.append("WHERE o.\"Chain_Name\" = '").append(hotelChain).append("' ");
                    sqlBuilder.append("AND r.\"Booked\" = FALSE ");
                    // Add filter for price if provided
                    if (maxPrice != null && !maxPrice.isEmpty()) {
                        sqlBuilder.append("AND r.\"Price\" <= ").append(maxPrice).append(" ");
                    }
                    // Add filter for capacity if guests parameter is provided
                    if (guests != null && !guests.isEmpty()) {
                        sqlBuilder.append("AND r.\"Capacity\" >= ").append(guests).append(" ");
                    }
                    // Add filter for view/attraction if provided
                    if (attraction != null && !attraction.isEmpty()) {
                        if (attraction.equals("Mountains")) {
                            sqlBuilder.append("AND r.\"View\" = 'mountain' ");
                        } else if (attraction.equals("Beach")) {
                            sqlBuilder.append("AND r.\"View\" = 'sea' ");
                        } else {
                            sqlBuilder.append("AND r.\"View\" = 'other' ");
                        }
                    }
                    // Order by price
                    sqlBuilder.append("ORDER BY r.\"Price\" ASC");
                    sql = sqlBuilder.toString();
                    break;

                case "checkID":
                    ID = request.getParameter("ID");
                    sql = "SELECT EXISTS ( SELECT 1 FROM \"Person\" WHERE \"ID\" = '" + ID + "' );";
                    break;
                case "checkEmpID":
                    ID = request.getParameter("ID");
                    sql = "SELECT EXISTS ( SELECT 1 FROM \"Employee\" WHERE \"ID\" = '" + ID + "' );";
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
        String ID = "";
        String Name = "";
        String Address = "";
        String ID_Type = "";
        String Role = "";
        String sql = "";
        try{
            String queryType = request.getParameter("queryType");

            db = DriverManager.getConnection("jdbc:postgresql:postgres", "postgres", "postgre");

            switch (queryType){
                case "RegEmployee":
                    ID = request.getParameter("ID");
                    Name = request.getParameter("Name");
                    Address = request.getParameter("Address");
                    ID_Type = request.getParameter("ID_Type");
                    Role = request.getParameter("Role");

                    sql = "INSERT INTO \"Person\" (\"ID\", \"Name\", \"Address\", \"ID_Type\") VALUES (?, ?, ?, ?);\n  INSERT INTO \"Employee\" (\"ID\", \"Name\", \"Address\", \"Role\") VALUES (?, ?, ?, ?);";

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

                case "RegUser":
                    ID = request.getParameter("ID");
                    Name = request.getParameter("Name");
                    Address = request.getParameter("Address");
                    ID_Type = request.getParameter("ID_Type");

                    sql = "INSERT INTO \"Person\" (\"ID\", \"Name\", \"Address\", \"ID_Type\") VALUES (?, ?, ?, ?);";

                    pstmt = db.prepareStatement(sql);
                    pstmt.setString(1, ID);
                    pstmt.setString(2, Name);
                    pstmt.setString(3, Address);
                    pstmt.setString(4, ID_Type);

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