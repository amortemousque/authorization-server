﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using MediatR;
using Newtonsoft.Json;

namespace AuthorizationServer.Application.Commands
{
    public class UpdatePermissionCommand : IRequest<bool>
    {
        [JsonIgnore]
        public Guid Id { get; set; }
        public string Description { get; set; }
    }
}
