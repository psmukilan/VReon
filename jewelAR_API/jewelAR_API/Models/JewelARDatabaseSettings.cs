namespace jewelAR_API.Models
{
    public class JewelARDatabaseSettings
    {
        public string ConnectionString { get; set; } = null!;
        public string DatabaseName { get; set; } = null!;
        public string JewelsCollectionName { get; set; } = null!;
        public string UsersCollectionName { get; set; } = null!;
    }
}
