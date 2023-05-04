using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace jewelAR_API.Models
{
    public class User
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public bool IsJeweller { get; set; }
    }

    public class UserCredentials
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
}
