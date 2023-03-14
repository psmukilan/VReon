using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace jewelAR_API.Models
{
    public class Jewel
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }
        public string JewellerId { get; set; }
        public string Category { get; set; } = null!;
        public string Purity { get; set; }
        public decimal Weight { get; set; }
        public decimal Price { get; set; }
        public string Image { get; set; }
    }
}
