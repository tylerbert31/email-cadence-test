import { Controller, Get, Post, Body, Param, Put } from "@nestjs/common";
import { CadenceService } from "./cadence.service";
import { CreateCadenceDto, UpdateCadenceStepsDto } from "@repo/types";

@Controller("cadences")
export class CadenceController {
  constructor(private readonly cadenceService: CadenceService) {}

  @Post()
  create(@Body() dto: CreateCadenceDto) {
    return this.cadenceService.create(dto);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.cadenceService.findOne(id);
  }

  @Put(":id")
  update(@Param("id") id: string, @Body() dto: UpdateCadenceStepsDto) {
    return this.cadenceService.update(id, dto);
  }
}
