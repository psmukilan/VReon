using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace jewelAR_API.Models
{
    public class Cart
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }
        public string JewellerId { get; set; }
        public JewelCartDetails[] JewelCartDetails { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public int TotalPrice { get; set; }
    }

    public class JewelCartDetails
    {
        public string Id { get; set; }
        public double Price { get; set; }
        public int Quantity { get; set; }
        public double TotalJewelPrice { get; set; }
    }
}
