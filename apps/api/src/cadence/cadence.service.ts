import { Injectable, NotFoundException } from "@nestjs/common";
import { Cadence, CreateCadenceDto, UpdateCadenceStepsDto } from "@repo/types";

@Injectable()
export class CadenceService {
  private cadences = new Map<string, Cadence>();

  create(dto: CreateCadenceDto): Cadence {
    const id = `cad_${Math.random().toString(36).substring(7)}`;
    const cadence: Cadence = {
      id,
      ...dto,
    };
    this.cadences.set(id, cadence);
    return cadence;
  }

  findOne(id: string): Cadence {
    const cadence = this.cadences.get(id);
    if (!cadence) throw new NotFoundException("Cadence not found");
    return cadence;
  }

  update(id: string, dto: UpdateCadenceStepsDto): Cadence {
    const cadence = this.findOne(id);
    cadence.steps = dto.steps;
    return cadence;
  }
}
