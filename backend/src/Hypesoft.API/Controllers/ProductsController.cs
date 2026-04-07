using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using MediatR;
using Hypesoft.Application.Commands.Products;
using Hypesoft.Application.Queries;
using Hypesoft.Application.Queries.Products;
using Hypesoft.Application.DTOs;
using Hypesoft.Application.Handlers.Products;

namespace Hypesoft.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly CreateProductHandler _createHandler;
    private readonly UpdateProductHandler _updateHandler;
    private readonly DeleteProductHandler _deleteHandler;

    public ProductsController(
        IMediator mediator,
        CreateProductHandler createHandler,
        UpdateProductHandler updateHandler,
        DeleteProductHandler deleteHandler)
    {
        _mediator = mediator;
        _createHandler = createHandler;
        _updateHandler = updateHandler;
        _deleteHandler = deleteHandler;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<IEnumerable<ProductDto>>> GetProducts(
        [FromQuery] int page = 1, 
        [FromQuery] int pageSize = 10,
        [FromQuery] string? categoryId = null,
        [FromQuery] string? search = null,
        CancellationToken ct = default)
    {
        var query = new GetProductsQuery(page, pageSize, categoryId, search);
        var result = await _mediator.Send(query, ct);
        return Ok(result);
    }

    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<ActionResult<ProductDto>> GetById(string id, CancellationToken ct)
    {
        var query = new GetProductByIdQuery(id);
        var result = await _mediator.Send(query, ct);
        return result is null ? NotFound() : Ok(result);
    }

    [HttpGet("low-stock")]
    [AllowAnonymous]
    public async Task<ActionResult<IEnumerable<ProductDto>>> GetLowStock(CancellationToken ct)
    {
        var result = await _mediator.Send(new GetLowStockQuery(), ct);
        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<ProductDto>> Create([FromBody] ProductCreateUpdateDto dto, CancellationToken ct)
    {
        try
        {
            var command = new CreateProductCommand(dto.Name, dto.Description ?? "", dto.Price, dto.CategoryId, dto.StockQuantity);
            var result = await _createHandler.Handle(command, ct);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ProductDto>> Update(string id, [FromBody] ProductCreateUpdateDto dto, CancellationToken ct)
    {
        try
        {
            var command = new UpdateProductCommand(id, dto.Name, dto.Description ?? "", dto.Price, dto.CategoryId, dto.StockQuantity);
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
            await _deleteHandler.Handle(new DeleteProductCommand(id), ct);
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }
}

public class ProductCreateUpdateDto
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public string CategoryId { get; set; } = string.Empty;
    public int StockQuantity { get; set; }
}
