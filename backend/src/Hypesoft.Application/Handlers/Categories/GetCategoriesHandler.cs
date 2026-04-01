namespace Hypesoft.Application.Handlers.Categories;
 
using Hypesoft.Application.Queries.Categories;
using Hypesoft.Domain.Entities;
using Hypesoft.Domain.Repositories;
using MediatR;
 
public class GetCategoriesHandler : IRequestHandler<GetCategoriesQuery, IEnumerable<Category>>
{
    private readonly ICategoryRepository _repository;
 
    public GetCategoriesHandler(ICategoryRepository repository)
    {
        _repository = repository;
    }
 
    public async Task<IEnumerable<Category>> Handle(GetCategoriesQuery request, CancellationToken cancellationToken)
    {
        return await _repository.GetAllAsync(cancellationToken);
    }
}