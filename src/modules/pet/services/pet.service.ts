import { Repository } from 'typeorm';
import { Inject, Injectable, ForbiddenException } from '@nestjs/common';

import { PaginationService } from 'src/lib/pagination/pagination.service';
import { NotFoundError } from 'src/lib/http-exceptions/errors/types/not-found-error';

import { Pet } from '../entities/pet.entity';
import type { CreatePetPayload } from '../dtos/create-pet.dto';
import type { PaginatePetsQuerysType } from '../dtos/paginate-pets-querys.dto';

@Injectable()
export class PetService {
  constructor(
    @Inject('PET_REPOSITORY') private petRepository: Repository<Pet>,
    private readonly paginationService: PaginationService,
  ) {}

  async paginatePets({
    limit,
    page,
    order_by_created_at,
    order_by_updated_at,
    pet_breed,
    pet_color,
    pet_gender,
    tutor_id,
    pet_name,
  }: PaginatePetsQuerysType) {
    const petQueryBuilder = this.petRepository
      .createQueryBuilder('p')
      .select([
        'p.pet_name',
        'p.pet_breed',
        'p.pet_gender',
        'p.pet_color',
        'p.tutor_id',
        'p.pet_image_url',
        'p.pet_species_id',
        'p.createdAt',
        'p.updatedAt',
      ])
      .where(tutor_id ? 'p.tutor_id = :tutor_id' : '1=1', { tutor_id })
      .andWhere(pet_breed ? 'p.pet_breed LIKE :pet_breed' : '1=1', {
        pet_breed: `%${pet_breed}%`,
      })
      .andWhere(pet_name ? 'p.pet_name LIKE :pet_name' : '1=1', {
        pet_name: `%${pet_name}%`,
      })
      .andWhere(pet_color ? 'p.pet_color LIKE :pet_color' : '1=1', {
        pet_color: `%${pet_color}%`,
      })
      .andWhere(pet_gender ? 'p.pet_gender LIKE :pet_gender' : '1=1', {
        pet_gender: `%${pet_gender}%`,
      });

    if (order_by_created_at)
      petQueryBuilder.orderBy('p.createdAt', order_by_created_at);

    if (order_by_updated_at)
      petQueryBuilder.orderBy('p.updatedAt', order_by_updated_at);

    return this.paginationService.paginateWithQueryBuilder(petQueryBuilder, {
      limit,
      page,
    });
  }

  async getPet(id: string): Promise<Pet> {
    const foundedPet = await this.petRepository.findOne({
      where: { id },
      select: {
        alergies: true,
        createdAt: true,
        current_medication: true,
        date_of_birth: true,
        id: true,
        medical_conditions: true,
        pet_breed: true,
        pet_color: true,
        pet_microship_id: true,
        pet_image_url: true,
        updatedAt: true,
        pet_gender: true,
        pet_species: {
          species_name: true,
          id: true,
        },
        pet_name: true,
        tutor: {
          id: true,
          user_name: true,
          user_email: true,
        },
      },
    });

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

  async deletePet(id: string, current_user_id: string) {
    const petToDelete = await this.getPet(id);

    if (petToDelete.tutor.id !== current_user_id) {
      throw new ForbiddenException(
        'Não é possivel deletar um pet que não é seu',
      );
    }

    return this.petRepository.remove(petToDelete);
  }
}
