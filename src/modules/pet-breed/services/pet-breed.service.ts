import { Inject, Injectable } from '@nestjs/common';
import { DeleteResult, Repository } from 'typeorm';

import { PaginationService } from 'src/lib/pagination/pagination.service';
import { NotFoundError } from 'src/lib/http-exceptions/errors/types/not-found-error';
import { PetSpeciesService } from 'src/modules/pet-species/services/pet-species.service';

import { PetBreed } from '../entities/pet-breed.entity';
import type { ListPetBreedPayload } from '../dtos/list-pet-breed.dto';
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
      .select(['breed', 'species'])
      .leftJoinAndSelect('breed.species', 'species')
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
      .select(['breed', 'species'])
      .leftJoinAndSelect('breed.species', 'species')
      .where('breed.id = :id', { id })
      .getOne();

    if (!breed) {
      throw new NotFoundError('Raça invalida');
    }

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

  async list({
    breed_name,
    species_id,
  }: ListPetBreedPayload): Promise<PetBreed[]> {
    const petQueryBuilder = await this.petBreedRepository
      .createQueryBuilder('breed')
      .select(['breed', 'species'])
      .leftJoinAndSelect('breed.species', 'species')
      .where(species_id ? 'breed.species_id = :species_id' : '1=1', {
        species_id,
      })
      .andWhere(breed_name ? 'breed.breed_name LIKE :breed_name' : '1=1', {
        breed_name: `%${breed_name}%`,
      })
      .getMany();

    return petQueryBuilder;
  }

  async createPetBreed(payload: CreatePetBreedPayload): Promise<PetBreed> {
    await this.petSpeciesService.getPetSpeciesById(payload.species_id);

    const petBreedItem = PetBreed.create(payload);

    return this.petBreedRepository.save(petBreedItem);
  }

  async updatePetBreed(
    breed_id: string,
    payload: UpdatePetBreedPayload,
  ): Promise<PetBreed> {
    await this.getBreedById(breed_id);

    if (payload.species_id)
      await this.petSpeciesService.getPetSpeciesById(payload.species_id);

    const breedItem = PetBreed.update(payload);

    await this.petBreedRepository.update(breed_id, breedItem);

    return this.getBreedById(breed_id);
  }

  async deletePetBreed(id: string): Promise<DeleteResult> {
    await this.getBreedById(id);

    return this.petBreedRepository.delete(id);
  }
}
