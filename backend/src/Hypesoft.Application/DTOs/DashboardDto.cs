namespace Hypesoft.Application.DTOs;

public class DashboardDto
{
    public int TotalProducts { get; set; }
    public decimal TotalStockValue { get; set; }
    public int LowStockCount { get; set; }
    public IEnumerable<ProductDto> LowStockProducts { get; set; } = Enumerable.Empty<ProductDto>();
    public IEnumerable<CategoryProductCount> ProductsByCategory { get; set; } = Enumerable.Empty<CategoryProductCount>();
}

public class CategoryProductCount
{
    public string CategoryId { get; set; } = string.Empty;
    public string CategoryName { get; set; } = string.Empty;
    public int ProductCount { get; set; }
}
