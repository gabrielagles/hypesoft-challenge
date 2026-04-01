using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using MediatR;
using Hypesoft.Application.Commands.Products;
using Hypesoft.Application.Queries;
using Hypesoft.Application.DTOs;

namespace Hypesoft.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IMediator _mediator;

    public ProductsController(IMediator mediator)
    {
        _mediator = mediator;
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
    public async Task<ActionResult<ProductDto>> Create([FromBody] CreateProductCommand command, CancellationToken ct)
    {
        try
        {
            var result = await _mediator.Send(command, ct);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ProductDto>> Update(string id, [FromBody] UpdateProductCommand command, CancellationToken ct)
    {
        if (id != command.Id) return BadRequest();
        try
        {
            return Ok(await _mediator.Send(command, ct));
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
            await _mediator.Send(new DeleteProductCommand(id), ct);
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }
}
