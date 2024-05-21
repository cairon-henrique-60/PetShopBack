import { Repository } from 'typeorm';
import { Inject, Injectable, ForbiddenException } from '@nestjs/common';

import { PaginationService } from 'src/lib/pagination/pagination.service';
import { NotFoundError } from 'src/lib/http-exceptions/errors/types/not-found-error';

import { UserService } from 'src/modules/user/services/user.service';
import { PetBreed } from 'src/modules/pet-breed/entities/pet-breed.entity';
import { PetSpecies } from 'src/modules/pet-species/entities/pet-species.entity';
import { PetBreedService } from 'src/modules/pet-breed/services/pet-breed.service';
import { PetSpeciesService } from 'src/modules/pet-species/services/pet-species.service';
import { BadRequestError } from 'src/lib/http-exceptions/errors/types/bad-request-error';

import { Pet } from '../entities/pet.entity';
import type { UpdatePetPayload } from '../dtos/update-pet.dto';
import type { CreatePetPayload } from '../dtos/create-pet.dto';
import type { ListPetsQuerysDTO } from '../dtos/list-pets-querys.dto';
import type { PaginatePetsQuerysType } from '../dtos/paginate-pets-querys.dto';

@Injectable()
export class PetService {
  constructor(
    @Inject('PET_REPOSITORY') private petRepository: Repository<Pet>,
    private readonly paginationService: PaginationService,
    private readonly userService: UserService,
    private readonly petBreedService: PetBreedService,
    private readonly petSpeciesService: PetSpeciesService,
  ) {}

  async paginatePets(
    {
      limit,
      page,
      order_by_created_at,
      order_by_updated_at,
      pet_breed_id,
      pet_species_id,
      pet_color,
      pet_gender,
      pet_name,
    }: PaginatePetsQuerysType,
    decoded_token: DecodedTokenType,
  ) {
    const isCommomUser = decoded_token.user_type.toUpperCase() !== 'ADMIN';

    const petQueryBuilder = this.petRepository
      .createQueryBuilder('pet')
      .select([
        'pet',
        't.id',
        't.user_name',
        't.user_email',
        't.phone_number',
        't.is_email_verified',
      ])
      .leftJoin('pet.tutor', 't')
      .where(isCommomUser ? 'pet.tutor_id = :tutor_id' : '1=1', {
        tutor_id: decoded_token.id,
      })
      .andWhere(pet_breed_id ? 'pet.pet_breed_id = :pet_breed_id' : '1=1', {
        pet_breed_id,
      })
      .andWhere(
        pet_species_id ? 'pet.pet_species_id = :pet_species_id' : '1=1',
        {
          pet_species_id,
        },
      )
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

  async getPetById(id: string): Promise<Pet> {
    const foundedPet = await this.petRepository
      .createQueryBuilder('pet')
      .leftJoinAndSelect('pet.tutor', 'tutor')
      .leftJoinAndSelect('pet.pet_species', 'species')
      .leftJoinAndSelect('pet.pet_breed', 'breed')
      .select([
        'pet.id',
        'pet.created_at',
        'pet.updated_at',
        'pet.pet_name',
        'pet.date_of_birth',
        'pet.pet_gender',
        'pet.pet_color',
        'pet.alergies',
        'pet.medical_conditions',
        'pet.current_medication',
        'pet.pet_microship_id',
        'tutor.id',
        'tutor.user_name',
        'tutor.user_email',
        'tutor.is_email_verified',
        'species',
        'breed',
      ])
      .where('pet.id = :id', { id })
      .getOne();

    if (!foundedPet) throw new NotFoundError('Not Found');

    return foundedPet;
  }

  async list(
    {
      pet_breed_id,
      pet_species_id,
      pet_color,
      pet_gender,
      pet_name,
      id,
    }: ListPetsQuerysDTO,
    decoded_token: DecodedTokenType,
  ): Promise<Pet[]> {
    const isCommomUser = decoded_token.user_type.toUpperCase() !== 'ADMIN';

    const petQueryBuilder = this.petRepository
      .createQueryBuilder('pet')
      .select([
        'pet',
        'e',
        'b',
        't.id',
        't.user_name',
        't.user_email',
        't.phone_number',
        't.is_email_verified',
      ])
      .leftJoin('pet.tutor', 't')
      .leftJoin('pet.pet_species', 'e')
      .leftJoin('pet.pet_breed', 'b')
      .where(isCommomUser ? 'pet.tutor_id = :tutor_id' : '1=1', {
        tutor_id: decoded_token.id,
      })
      .andWhere(id ? 'pet.id = :id' : '1=1', {
        id,
      })
      .andWhere(pet_breed_id ? 'pet.pet_breed_id = :pet_breed_id' : '1=1', {
        pet_breed_id,
      })
      .andWhere(
        pet_species_id ? 'pet.pet_species_id = :pet_species_id' : '1=1',
        {
          pet_species_id,
        },
      )
      .andWhere(pet_name ? 'pet.pet_name LIKE :pet_name' : '1=1', {
        pet_name: `%${pet_name}%`,
      })
      .andWhere(pet_color ? 'pet.pet_color LIKE :pet_color' : '1=1', {
        pet_color: `%${pet_color}%`,
      })
      .andWhere(pet_gender ? 'pet.pet_gender LIKE :pet_gender' : '1=1', {
        pet_gender: `%${pet_gender}%`,
      })
      .getMany();

    return petQueryBuilder;
  }

  async createPet(payload: CreatePetPayload, tutor_id: string): Promise<Pet> {
    await Promise.all([
      this.petBreedService.getBreedById(payload.pet_breed_id),
      this.petSpeciesService.getPetSpeciesById(payload.pet_species_id),
      this.userService.getUserById(tutor_id),
    ]).then(([breed, species]) => {
      if (species.id !== breed.species_id) {
        throw new BadRequestError(
          "The species ID does not match the breed's species ID.",
        );
      }
    });

    const petItem = Pet.create({ tutor_id, ...payload });

    return this.petRepository.save(petItem);
  }

  async updatePet(id: string, tutor_id: string, payload: UpdatePetPayload) {
    const petToUpdate = await this.getPetById(id);

    let breed: PetBreed | undefined = undefined;
    let species: PetSpecies | undefined = undefined;

    if (payload.pet_breed_id) {
      breed = await this.petBreedService.getBreedById(payload.pet_breed_id);
    }

    if (payload.pet_species_id) {
      species = await this.petSpeciesService.getPetSpeciesById(
        payload.pet_species_id,
      );
    }

    if (breed && species && species.id !== breed.species_id) {
      throw new BadRequestError(
        "The species ID does not match the breed's species ID.",
      );
    }

    const petItem = Pet.update({ tutor_id, ...payload });

    await this.petRepository.update(id, petItem);

    return this.getPetById(petToUpdate.id);
  }

  async deletePet(id: string, current_user_id: string) {
    const petToDelete = await this.getPetById(id);

    this.checkIfTutorOwnsCurrentPet(petToDelete, current_user_id);

    return this.petRepository.remove(petToDelete);
  }

  private checkIfTutorOwnsCurrentPet(currentPet: Pet, tutor_id: string) {
    if (currentPet.tutor.id !== tutor_id) {
      throw new ForbiddenException(
        'Não é possivel alterar ou deletar um pet que não é seu!',
      );
    }
  }
}
