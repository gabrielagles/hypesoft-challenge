using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using MediatR;
using Hypesoft.Application.Commands.Categories;
using Hypesoft.Application.Queries;
using Hypesoft.Application.Queries.Categories;
using Hypesoft.Application.DTOs;
using Hypesoft.Application.Handlers.Categories;

namespace Hypesoft.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly CreateCategoryHandler _createHandler;
    private readonly UpdateCategoryHandler _updateHandler;
    private readonly DeleteCategoryHandler _deleteHandler;

    public CategoriesController(
        IMediator mediator,
        CreateCategoryHandler createHandler,
        UpdateCategoryHandler updateHandler,
        DeleteCategoryHandler deleteHandler)
    {
        _mediator = mediator;
        _createHandler = createHandler;
        _updateHandler = updateHandler;
        _deleteHandler = deleteHandler;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<IEnumerable<CategoryDto>>> GetAll(CancellationToken ct)
    {
        return Ok(await _mediator.Send(new GetCategoriesQuery(), ct));
    }

    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<ActionResult<CategoryDto>> GetById(string id, CancellationToken ct)
    {
        var query = new GetCategoryByIdQuery(id);
        var result = await _mediator.Send(query, ct);
        return result is null ? NotFound() : Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<CategoryDto>> Create([FromBody] CategoryCreateUpdateDto dto, CancellationToken ct)
    {
        var command = new CreateCategoryCommand(dto.Name, dto.Description ?? "");
        var result = await _createHandler.Handle(command, ct);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<CategoryDto>> Update(string id, [FromBody] CategoryCreateUpdateDto dto, CancellationToken ct)
    {
        try
        {
            var command = new UpdateCategoryCommand(id, dto.Name, dto.Description ?? "");
            return Ok(await _updateHandler.Handle(command, ct));
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(string id, CancellationToken ct)
    {
        try
        {
            await _deleteHandler.Handle(new DeleteCategoryCommand(id), ct);
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }
}

public class CategoryCreateUpdateDto
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
}
