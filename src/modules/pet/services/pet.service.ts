import { Repository } from 'typeorm';
import { Inject, Injectable, ForbiddenException } from '@nestjs/common';

import { PaginationService } from 'src/lib/pagination/pagination.service';
import { NotFoundError } from 'src/lib/http-exceptions/errors/types/not-found-error';

import { Pet } from '../entities/pet.entity';
import type { UpdatePetPayload } from '../dtos/update-pet.dto';
import type { CreatePetPayload } from '../dtos/create-pet.dto';
import type { PaginatePetsQuerysType } from '../dtos/paginate-pets-querys.dto';

@Injectable()
export class PetService {
  constructor(
    @Inject('PET_REPOSITORY') private petRepository: Repository<Pet>,
    private readonly paginationService: PaginationService,
  ) {}

  private buildPetQueryBuilder() {
    return this.petRepository.createQueryBuilder('pet');
  }

  async paginatePets({
    limit,
    page,
    order_by_created_at,
    order_by_updated_at,
    pet_breed_id,
    pet_color,
    pet_gender,
    tutor_id,
    pet_name,
  }: PaginatePetsQuerysType) {
    const petQueryBuilder = this.buildPetQueryBuilder()
      .select([
        'pet.pet_name',
        'pet.pet_breed_id',
        'pet.pet_gender',
        'pet.pet_color',
        'pet.tutor_id',
        'pet.pet_image_url',
        'pet.pet_species_id',
        'pet.created_at',
        'pet.updated_at',
        'pet.id',
      ])
      .where(tutor_id ? 'pet.tutor_id = :tutor_id' : '1=1', { tutor_id })
      .andWhere(pet_breed_id ? 'pet.pet_breed_id = :pet_breed_id' : '1=1', {
        pet_breed_id,
      })
      .andWhere(pet_name ? 'pet.pet_name LIKE :pet_name' : '1=1', {
        pet_name: `%${pet_name}%`,
      })
      .andWhere(pet_color ? 'pet.pet_color LIKE :pet_color' : '1=1', {
        pet_color: `%${pet_color}%`,
      })
      .andWhere(pet_gender ? 'pet.pet_gender LIKE :pet_gender' : '1=1', {
        pet_gender: `%${pet_gender}%`,
      });

    if (order_by_created_at)
      petQueryBuilder.orderBy('pet.created_at', order_by_created_at);

    if (order_by_updated_at)
      petQueryBuilder.orderBy('pet.updated_at', order_by_updated_at);

    return this.paginationService.paginateWithQueryBuilder(petQueryBuilder, {
      limit,
      page,
    });
  }

  async getPet(id: string): Promise<Pet> {
    const foundedPet = await this.buildPetQueryBuilder()
      .where('pet.id = :id', { id })
      .leftJoinAndSelect('pet.pet_species', 'pet_species')
      .leftJoinAndSelect('pet.tutor', 'tutor')
      .leftJoinAndSelect('pet.pet_breed', 'pet_breed')
      .select([
        'pet.id',
        'pet.pet_name',
        'pet.pet_breed',
        'pet.date_of_birth',
        'pet.pet_gender',
        'pet.pet_color',
        'pet.alergies',
        'pet.medical_conditions',
        'pet.current_medication',
        'pet.pet_image_url',
        'pet.pet_microship_id',
        'pet.created_at',
        'pet.updated_at',
        'pet_species.species_name',
        'pet_species.id',
        'pet_breed.id',
        'pet_breed.breed_name',
        'tutor.id',
        'tutor.user_name',
        'tutor.user_email',
      ])
      .getOne();

    if (!foundedPet) {
      throw new NotFoundError('Pet Não encontrado');
    }

    return foundedPet;
  }

  async createPet(payload: CreatePetPayload): Promise<Pet> {
    const petItem = this.petRepository.create();

    Object.assign(petItem, payload);

    return this.petRepository.save(petItem);
  }

  async updatePet(id: string, tutor_id: string, payload: UpdatePetPayload) {
    const petToUpdate = await this.getPet(id);

    this.checkIfTutorOwnsCurrentPet(petToUpdate, tutor_id);

    const petItem = this.petRepository.create();

    Object.assign(petItem, payload);

    await this.petRepository.update(id, petItem);

    return this.getPet(petToUpdate.id);
  }

  async deletePet(id: string, current_user_id: string) {
    const petToDelete = await this.getPet(id);

    this.checkIfTutorOwnsCurrentPet(petToDelete, current_user_id);

    return this.petRepository.remove(petToDelete);
  }

  private checkIfTutorOwnsCurrentPet(currentPet: Pet, tutor_id: string) {
    if (currentPet.tutor.id !== tutor_id) {
      throw new ForbiddenException(
        'Não é possivel alterar ou deletar um pet que não é seu',
      );
    }
  }
}
