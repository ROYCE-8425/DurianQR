using MySqlConnector;
using System;

class Program
{
    static void Main()
    {
        string connStr = "Server=ns22.dailysieure.com;Port=3306;Database=tannhuyonline_DurianQR;User=tannhuyonline_dbuser;Password=Durian2026;";
        try
        {
            using var conn = new MySqlConnection(connStr);
            conn.Open();
            Console.WriteLine("Connected. Tables:");
            using var cmd = new MySqlCommand("SHOW TABLES;", conn);
            using var reader = cmd.ExecuteReader();
            while (reader.Read())
            {
                Console.WriteLine("- " + reader.GetString(0));
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine("Error: " + ex.Message);
        }
    }
}
