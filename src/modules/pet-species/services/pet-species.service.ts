import { Repository } from 'typeorm';
import { Inject, Injectable } from '@nestjs/common';

import { NotFoundError } from 'src/lib/http-exceptions/errors/types/not-found-error';

import { PetSpecies } from '../entities/pet-species.entity';

@Injectable()
export class PetSpeciesService {
  constructor(
    @Inject('PET_SPECIES_REPOSITORY')
    private petSpeciesRepository: Repository<PetSpecies>,
  ) {}

  async getAllSpecies(): Promise<PetSpecies[]> {
    return this.petSpeciesRepository.find();
  }

  async getPetSpecies(id: string) {
    const foundedPetSpecies = await this.petSpeciesRepository.findOne({
      where: { id },
    });

    if (!foundedPetSpecies) {
      throw new NotFoundError('Especie de pet não encontrada');
    }

    return foundedPetSpecies;
  }

  async createPetSpecies(species_name: string): Promise<PetSpecies> {
    const speciesToCreate = this.petSpeciesRepository.create();

    speciesToCreate.species_name = species_name;

    return this.petSpeciesRepository.save(speciesToCreate);
  }

  async updatePetSpecies(id: string, new_species_name: string) {
    const speciesToUpdate = await this.getPetSpecies(id);

    const speciesItem = new PetSpecies();

    speciesItem.species_name = new_species_name;

    await this.petSpeciesRepository.update(id, speciesItem);

    return this.getPetSpecies(speciesToUpdate.id);
  }

  async deletePetSpecies(id: string) {
    const speciesToDelete = await this.getPetSpecies(id);

    return this.petSpeciesRepository.remove(speciesToDelete);
  }
}
