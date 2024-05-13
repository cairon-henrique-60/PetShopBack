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
        'p.created_at',
        'p.updated_at',
        'p.id',
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
      petQueryBuilder.orderBy('p.created_at', order_by_created_at);

    if (order_by_updated_at)
      petQueryBuilder.orderBy('p.updated_at', order_by_updated_at);

    return this.paginationService.paginateWithQueryBuilder(petQueryBuilder, {
      limit,
      page,
    });
  }

  async getPet(id: string): Promise<Pet> {
    const foundedPet = await this.petRepository
      .createQueryBuilder('pet')
      .where('pet.id = :id', { id })
      .leftJoinAndSelect('pet.pet_species', 'pet_species')
      .leftJoinAndSelect('pet.tutor', 'tutor')
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

    Object.assign(petItem, {
      pet_name: payload.pet_name ?? petToUpdate.pet_name,
      pet_breed: payload.pet_breed ?? petToUpdate.pet_breed,
      date_of_birth: payload.date_of_birth ?? petToUpdate.date_of_birth,
      pet_gender: payload.pet_gender ?? petToUpdate.pet_gender,
      pet_color: payload.pet_color ?? petToUpdate.pet_color,
      alergies: payload.alergies ?? petToUpdate.alergies,
      medical_conditions:
        payload.medical_conditions ?? petToUpdate.medical_conditions,
      current_medication:
        payload.current_medication ?? petToUpdate.current_medication,
      pet_image_url: payload.pet_image_url ?? petToUpdate.pet_image_url,
      pet_microship_id:
        payload.pet_microship_id ?? petToUpdate.pet_microship_id,
      tutor_id: payload.tutor_id ?? petToUpdate.tutor_id,
      pet_species_id: payload.pet_species_id ?? petToUpdate.pet_species_id,
    });

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
