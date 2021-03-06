﻿using System;
using MediatR;

namespace AuthorizationServer.Application.Commands
{
    public class DeleteTenantCommand : IRequest<bool>
    {
        public Guid Id { get; set; }
    }
}
    