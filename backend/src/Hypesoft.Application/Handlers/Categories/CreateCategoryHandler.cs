namespace Hypesoft.Application.Handlers.Category;

using Hypesoft.Domain.Repositories;
using MediatR;

public class CreateCategoryHandler : IRequestHandler<CreateCategoryCommand, string>
{
    private readonly ICategoryRepository _repository;

    public CreateCategoryHandler(ICategoryRepository repository)
    {
        _repository = repository;
    }

    public async Task<string> Handle(CreateCategoryCommand request, CancellationToken cancellationToken)
    {
        var category = Category.Create(
            request.Name,
            request.Description
        );

        await _repository.AddAsync(category, cancellationToken);

        return category.Id;
    }
}