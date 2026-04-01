using MediatR;
using Hypesoft.Application.DTOs;

namespace Hypesoft.Application.Queries;

public record GetDashboardQuery : IRequest<DashboardDto>;
