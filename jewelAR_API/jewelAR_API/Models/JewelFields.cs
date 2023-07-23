namespace jewelAR_API.Models
{
    public class JewelFields
    {
        public string JewellerId { get; set; }
        public List<SubCategoriesForCategory> subCategoriesForCategory { get; set; } = null!;
        public List<string>? Purity { get; set; }
        public List<string>? MetalType { get; set; }
    }

    public class SubCategoriesForCategory
    {
        public string Category { get; set; } = null!;
        public List<string>? SubCategory { get; set; } = null!;
    }
}
