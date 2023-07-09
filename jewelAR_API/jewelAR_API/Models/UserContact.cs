using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace jewelAR_API.Models
{
    public class UserContact
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
    }
}
