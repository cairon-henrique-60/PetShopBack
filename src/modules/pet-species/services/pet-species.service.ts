import { DeleteResult } from 'typeorm';
import { Injectable } from '@nestjs/common';

import { NotFoundError } from 'src/lib/http-exceptions/errors/types/not-found-error';

import { PetSpecies } from '../entities/pet-species.entity';
import { petSpeciesRepository } from '../repository/petSpecieRepository';

import { ListSpeciesPayload } from '../dtos/list-species.dto';

@Injectable()
export class PetSpeciesService {
  async list({ id, species_name }: ListSpeciesPayload) {
    const foundedPetSpecies = await petSpeciesRepository
      .createQueryBuilder('species')
      .select(['species', 'breeds'])
      .leftJoinAndSelect('species.breeds', 'breeds')
      .where(id ? 'species.id = :id' : '1=1', {
        id,
      })
      .andWhere(
        species_name ? 'breed.species_name LIKE :species_name' : '1=1',
        {
          species_name: `%${species_name}%`,
        },
      )
      .getMany();

    return foundedPetSpecies;
  }

  async getPetSpeciesById(id: string): Promise<PetSpecies> {
    const foundedPetSpecies = await petSpeciesRepository.findOne({
      where: { id },
    });

    if (!foundedPetSpecies)
      throw new NotFoundError('Especie de pet não encontrada');

    return foundedPetSpecies;
  }

  async createPetSpecies(species_name: string): Promise<PetSpecies> {
    const speciesToCreate = PetSpecies.createOrUpdate({ species_name });

    return petSpeciesRepository.save(speciesToCreate);
  }

  async updatePetSpecies(
    id: string,
    new_species_name: string,
  ): Promise<PetSpecies> {
    await this.getPetSpeciesById(id);

    const speciesItem = PetSpecies.createOrUpdate({
      species_name: new_species_name,
    });

    await petSpeciesRepository.update(id, speciesItem);

    return this.getPetSpeciesById(id);
  }

  async deletePetSpecies(id: string): Promise<DeleteResult> {
    await this.getPetSpeciesById(id);

    return petSpeciesRepository.delete(id);
  }
}
