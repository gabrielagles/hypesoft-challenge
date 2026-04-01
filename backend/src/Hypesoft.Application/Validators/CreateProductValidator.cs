using FluentValidation;
using Hypesoft.Application.Commands.Products;

namespace Hypesoft.Application.Validators;

public class CreateProductValidator : AbstractValidator<CreateProductCommand>
{
    public CreateProductValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Nome é obrigatório")
            .MaximumLength(200).WithMessage("Nome deve ter no máximo 200 caracteres");

        RuleFor(x => x.Price)
            .GreaterThanOrEqualTo(0).WithMessage("Preço não pode ser negativo");

        RuleFor(x => x.CategoryId)
            .NotEmpty().WithMessage("Categoria é obrigatória");

        RuleFor(x => x.StockQuantity)
            .GreaterThanOrEqualTo(0).WithMessage("Estoque não pode ser negativo");
    }
}
