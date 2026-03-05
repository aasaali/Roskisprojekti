package src;

import java.sql.*;
import java.time.LocalDateTime;
import java.util.Random;

public class Main {

    private static final String URL = "jdbc:mysql://localhost:3306/iot_bins?serverTimezone=UTC&useSSL=false";

    private static final String USER = "root";
    private static final String PASSWORD = "N!ppon861";
    private static final Random random = new Random();

    public static void main(String[] args) {
        try (Connection conn = DriverManager.getConnection(URL, USER, PASSWORD)) {
            System.out.println("IoT-simulaatio käynnissä... Paina Ctrl+C lopettaaksesi.");

            while (true) {
                paivitaMittaukset(conn);
                Thread.sleep(5000);
            }
        } catch (Exception e) {
            System.err.println("Virhe simulaatiossa: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private static void paivitaMittaukset(Connection conn) throws SQLException {
        String hakuSql = "SELECT id, name FROM site";
        try (Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(hakuSql)) {

            while (rs.next()) {
                long siteId = rs.getLong("id");
                String nimi = rs.getString("name");

                double edellinenTaytto = haeViimeisinTaytto(conn, siteId);
                double uusiTaytto = Math.min(100.0, edellinenTaytto + (random.nextDouble() * 5));
                uusiTaytto = Math.round(uusiTaytto * 100.0) / 100.0;

                tallennaMittaus(conn, siteId, uusiTaytto);
                System.out.println(nimi + " päivitetty: " + uusiTaytto + "%");

                tarkistaHalytys(conn, siteId, uusiTaytto);
            }
        }
    }

    private static double haeViimeisinTaytto(Connection conn, long siteId) throws SQLException {
        String sql = "SELECT fill_percent FROM measurement WHERE bin_id = ? ORDER BY measured_at DESC LIMIT 1";
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, siteId);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) return rs.getDouble("fill_percent");
            }
        }
        return random.nextDouble() * 20.0;
    }

    private static void tallennaMittaus(Connection conn, long siteId, double fill) throws SQLException {
        String sql = "INSERT INTO measurement (bin_id, fill_percent, measured_at) VALUES (?, ?, ?)";
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, siteId);
            ps.setDouble(2, fill);
            ps.setTimestamp(3, Timestamp.valueOf(LocalDateTime.now()));
            ps.executeUpdate();
        }
    }

    private static void tarkistaHalytys(Connection conn, long siteId, double fill) throws SQLException {
        // TÄMÄ ON TESTIPRINTTI: Näet heti konsolissa, jos ehto täyttyy
        if (fill >= 80.0) {
            System.out.println("⚠️ TESTI-ILMOITUS: Kohde " + siteId + " ylitti 80% (Nykyinen: " + fill + "%)");
        }

        // Varsinainen logiikka, joka tallentaa tietokantaan
        if (fill >= 95.0) {
            luoHalytys(conn, siteId, "HÄLYTYS");
        }
        else if (fill >= 80.0) {
            luoHalytys(conn, siteId, "VAROITUS");
        }
    }

    private static void luoHalytys(Connection conn, long siteId, String tyyppi) throws SQLException {
        String tarkistusSql = "SELECT COUNT(*) FROM alert WHERE bin_id = ? AND state = 'AVOIN'";
        try (PreparedStatement ps = conn.prepareStatement(tarkistusSql)) {
            ps.setLong(1, siteId);
            try (ResultSet rs = ps.executeQuery()) {
                rs.next();
                if (rs.getInt(1) > 0) return;
            }
        }

        String insertSql = "INSERT INTO alert (bin_id, alert_type) VALUES (?, ?)";
        try (PreparedStatement ps = conn.prepareStatement(insertSql, Statement.RETURN_GENERATED_KEYS)) {
            ps.setLong(1, siteId);
            ps.setString(2, tyyppi);
            ps.executeUpdate();

            // Tulostetaan konsoliin huomioviesti
            System.out.println(">>> HUOMIO: " + tyyppi + " tallennettu kohteelle ID " + siteId);

            if (tyyppi.equals("HÄLYTYS")) {
                try (ResultSet keys = ps.getGeneratedKeys()) {
                    if (keys.next()) luoTehtava(conn, keys.getLong(1));
                }
            }
        }
    }

    private static void luoTehtava(Connection conn, long alertId) throws SQLException {
        String sql = "INSERT INTO task (alert_id) VALUES (?)";
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, alertId);
            ps.executeUpdate();
            System.out.println("!!! Uusi työtehtävä luotu hälytykselle ID: " + alertId);
        }
    }
}
