using jewelAR_API.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace jewelAR_API.Services
{
    public class CartService
    {
        private readonly IMongoCollection<Cart> _cartCollection;

        public CartService(
            IOptions<JewelARDatabaseSettings> jewelARDatabaseSettings)
        {
            var mongoClient = new MongoClient(
                jewelARDatabaseSettings.Value.ConnectionString);

            var mongoDatabase = mongoClient.GetDatabase(
                jewelARDatabaseSettings.Value.DatabaseName);

            _cartCollection = mongoDatabase.GetCollection<Cart>(
                jewelARDatabaseSettings.Value.CartCollectionName);
        }

        public async Task<List<Cart>> GetAsync() =>
            await _cartCollection.Find(_ => true).ToListAsync();

        public async Task<List<Cart>> GetAllJewelsForUserAsync(string userEmailId) =>
            await _cartCollection.Find(x => x.Email == userEmailId).ToListAsync();

        public async Task CreateAsync(Cart newCart) =>
            await _cartCollection.InsertOneAsync(newCart);
    }
}
