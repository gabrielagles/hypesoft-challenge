namespace Hypesoft.Application.Commands.Stock;
 
using MediatR;
 
public record UpdateStockCommand(string ProductId, int Quantity) : IRequest;