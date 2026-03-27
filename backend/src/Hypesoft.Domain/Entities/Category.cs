namespace Hypesoft.Domain.Entities;

public class Category : BaseEntity
{
    public string Name { get; private set; } = string.Empty;
    public string? Description { get; private set; }

    private Category() { }

    public static Category Create(string name, string? description)
    {
        var category = new Category();
        category.SetName(name);
        category.SetDescription(description);
        return category;
    }

    public void Update(string name, string? description)
    {
        SetName(name);
        SetDescription(description);
    }

    private void SetName(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("Nome da categoria é obrigatório");

        Name = name;
    }

    private void SetDescription(string? description)
    {
        Description = description;
    }
}
