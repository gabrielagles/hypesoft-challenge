using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using MediatR;
using Hypesoft.Application.Queries;
using Hypesoft.Application.DTOs;

namespace Hypesoft.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DashboardController : ControllerBase
{
    private readonly IMediator _mediator;

    public DashboardController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<DashboardDto>> Get(CancellationToken ct)
    {
        return Ok(await _mediator.Send(new GetDashboardQuery(), ct));
    }
}
