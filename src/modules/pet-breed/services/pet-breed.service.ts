import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { PaginationService } from 'src/lib/pagination/pagination.service';
import { NotFoundError } from 'src/lib/http-exceptions/errors/types/not-found-error';
import { PetSpeciesService } from 'src/modules/pet-species/services/pet-species.service';

import { PetBreed } from '../entities/pet-breed.entity';
import type { CreatePetBreedPayload } from '../dtos/create-pet-breed.dto';
import type { UpdatePetBreedPayload } from '../dtos/update-pet-breed.dto';
import type { PaginatePetBreedPayload } from '../dtos/paginate-pet-breed.dto';

@Injectable()
export class PetBreedService {
  constructor(
    @Inject('PET_BREED_REPOSITORY')
    private petBreedRepository: Repository<PetBreed>,
    private readonly paginationService: PaginationService,
    private readonly petSpeciesService: PetSpeciesService,
  ) {}

  async paginateBreeds({
    page,
    limit,
    breed_name,
    order_by_created_at,
    order_by_updated_at,
    species_id,
  }: PaginatePetBreedPayload) {
    const petBreedQueryBuilder = this.petBreedRepository
      .createQueryBuilder('breed')
      .select([
        'breed.breed_name',
        'breed.id',
        'breed.created_at',
        'breed.updated_at',
        'breed.species_id',
      ])
      .where(species_id ? 'breed.species_id = :species_id' : '1=1', {
        species_id,
      })
      .andWhere(breed_name ? 'breed.breed_name LIKE :breed_name' : '1=1', {
        breed_name: `%${breed_name}%`,
      });

    if (order_by_created_at)
      petBreedQueryBuilder.orderBy('breed.created_at', order_by_created_at);

    if (order_by_updated_at)
      petBreedQueryBuilder.orderBy('breed.updated_at', order_by_updated_at);

    return this.paginationService.paginateWithQueryBuilder(
      petBreedQueryBuilder,
      { limit, page },
    );
  }

  async getBreedById(id: string) {
    const breed = await this.petBreedRepository
      .createQueryBuilder('breed')
      .where('breed.id = :id', { id })
      .leftJoinAndSelect('breed.species', 'species')
      .select([
        'breed.breed_name',
        'breed.id',
        'breed.created_at',
        'breed.updated_at',
        'species.species_name',
        'species.id',
      ])
      .getOne();

    if (!breed) {
      throw new NotFoundError('Raça invalida');
    }

    return breed;
  }

  async getBreedByName(
    breed_name: string,
  ): Promise<Pick<PetBreed, 'breed_name' | 'id'> | null> {
    const breed = await this.petBreedRepository.findOne({
      where: { breed_name },
      select: ['breed_name', 'id'],
    });

    return breed;
  }

  async getBreedsBySpeciesId(
    species_id: string,
  ): Promise<Pick<PetBreed, 'breed_name' | 'id'>[]> {
    const breeds = await this.petBreedRepository.find({
      where: { species_id },
      select: ['breed_name', 'id'],
    });

    return breeds;
  }

  async createPetBreed(payload: CreatePetBreedPayload) {
    const isThereBreedWithSameName = await this.getBreedByName(
      payload.breed_name,
    );

    if (isThereBreedWithSameName) {
      throw new ForbiddenException('Já há uma raca com esse nome');
    }

    // validates if species_id is valid in the database
    await this.petSpeciesService.getPetSpecies(payload.species_id);

    const petBreedItem = this.petBreedRepository.create();

    Object.assign(petBreedItem, payload);

    return this.petBreedRepository.save(petBreedItem);
  }

  async updatePetBreed(breed_id: string, payload: UpdatePetBreedPayload) {
    const { id } = await this.getBreedById(breed_id);
    const breedItem = this.petBreedRepository.create();

    Object.assign(breedItem, payload);

    await this.petBreedRepository.update(id, breedItem);

    return this.getBreedById(id);
  }

  async deletePetBreed(id: string) {
    const breedToDelete = await this.getBreedById(id);

    return this.petBreedRepository.remove(breedToDelete);
  }
}
