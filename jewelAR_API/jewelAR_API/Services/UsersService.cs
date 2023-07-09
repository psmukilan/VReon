using jewelAR_API.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace jewelAR_API.Services
{
    public class UsersService
    {
        private readonly IMongoCollection<User> _usersCollection;
        private readonly IMongoCollection<UserContact> _userContactCollection;

        public UsersService(
            IOptions<JewelARDatabaseSettings> jewelARDatabaseSettings)
        {
            var mongoClient = new MongoClient(
                jewelARDatabaseSettings.Value.ConnectionString);

            var mongoDatabase = mongoClient.GetDatabase(
                jewelARDatabaseSettings.Value.DatabaseName);

            _usersCollection = mongoDatabase.GetCollection<User>(
                jewelARDatabaseSettings.Value.UsersCollectionName);

            _userContactCollection = mongoDatabase.GetCollection<UserContact>(
                jewelARDatabaseSettings.Value.UserContactsCollectionName);
        }

        public async Task<List<User>> GetAsync() =>
            await _usersCollection.Find(_ => true).ToListAsync();

        public async Task<User?> GetAsync(string id) =>
            await _usersCollection.Find(x => x.Id == id).FirstOrDefaultAsync();

        public async Task<User?> ValidateUserAsync(string email, string password) =>
            await _usersCollection.Find(x => x.Email == email && x.Password == password).FirstOrDefaultAsync();

        public async Task<User> GetDefaultUserAsync() =>
            await _usersCollection.Find(_ => true).FirstOrDefaultAsync();

        public async Task CreateAsync(User newUser) =>
            await _usersCollection.InsertOneAsync(newUser);

        public async Task CreateUserContactAsync(UserContact newUser) =>
            await _userContactCollection.InsertOneAsync(newUser);

        public async Task UpdateAsync(string id, User updatedUser) =>
            await _usersCollection.ReplaceOneAsync(x => x.Id == id, updatedUser);

        public async Task RemoveAsync(string id) =>
            await _usersCollection.DeleteOneAsync(x => x.Id == id);

        public async Task<List<User>> GetJewellersAsync() => 
            await _usersCollection.Find(x => x.IsJeweller == true && x.IsAdmin == false).ToListAsync();
    }
}
