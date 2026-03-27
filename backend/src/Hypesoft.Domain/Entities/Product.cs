namespace Hypesoft.Domain.Entities;

public class Product : BaseEntity 
{
    public string Name { get; private set; } = string.Empty;
    public string? Description { get; private set; }
    public decimal Price { get; private set; }
    public string CategoryId { get; private set; } = string.Empty;
    public int StockQuantity { get; private set; }

    public bool IsLowStock => StockQuantity < 10; 

    private Product() { }

    public static Product Create(string name, string? description, 
        decimal price, string categoryId, int stockQuantity)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("Nome é obrigatório.");
        if (price < 0)
            throw new ArgumentException("Preço não pode ser negativo.");

        return new Product
        {
            Name = name,
            Description = description,
            Price = price,
            CategoryId = categoryId,
            StockQuantity = stockQuantity
        };
    }

    public void Update(string name, string? description, decimal price, string categoryId)
    {
        Name = name;
        Description = description;
        Price = price;
        CategoryId = categoryId;
        UpdatedAt = DateTime.UtcNow;
    }

    public void UpdateStock(int quantity)
    {
        if (quantity < 0)
            throw new ArgumentException("Estoque não pode ser negativo.");
        StockQuantity = quantity;
        UpdatedAt = DateTime.UtcNow;
    }
}