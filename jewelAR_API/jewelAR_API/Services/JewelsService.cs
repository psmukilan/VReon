using jewelAR_API.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace jewelAR_API.Services
{
    public class JewelsService
    {
        private readonly IMongoCollection<Jewel> _jewelsCollection;

        public JewelsService(
            IOptions<JewelARDatabaseSettings> jewelARDatabaseSettings)
        {
            var mongoClient = new MongoClient(
                jewelARDatabaseSettings.Value.ConnectionString);

            var mongoDatabase = mongoClient.GetDatabase(
                jewelARDatabaseSettings.Value.DatabaseName);

            _jewelsCollection = mongoDatabase.GetCollection<Jewel>(
                jewelARDatabaseSettings.Value.JewelsCollectionName);
        }

        public async Task<List<Jewel>> GetAsync() =>
            await _jewelsCollection.Find(_ => true).ToListAsync();

        public async Task<Jewel?> GetAsync(string id) =>
            await _jewelsCollection.Find(x => x.Id == id).FirstOrDefaultAsync();

        public async Task<List<Jewel>> GetByCategoryAsync(string category) =>
            await _jewelsCollection.Find(x => x.Category == category).ToListAsync();

        public async Task CreateAsync(Jewel newJewel) =>
            await _jewelsCollection.InsertOneAsync(newJewel);

        public async Task UpdateAsync(string id, Jewel updatedJewel) =>
            await _jewelsCollection.ReplaceOneAsync(x => x.Id == id, updatedJewel);

        public async Task RemoveAsync(string id) =>
            await _jewelsCollection.DeleteOneAsync(x => x.Id == id);
    }
}
