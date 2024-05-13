import { Test, TestingModule } from '@nestjs/testing';

import { PetSpecies } from '../entities/pet-species.entity';
import { PetSpeciesService } from '../services/pet-species.service';
import { PetSpeciesController } from '../controllers/pet-species.controller';
import { CreateOrUpdateSpeciesDTO } from '../dtos/create-or-update-pet-species.dto';

describe('PetSpeciesController', () => {
  let controller: PetSpeciesController;
  let service: PetSpeciesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PetSpeciesController],
      providers: [
        {
          provide: PetSpeciesService,
          useValue: {
            getAllSpecies: jest.fn(),
            createPetSpecies: jest.fn(),
            updatePetSpecies: jest.fn(),
            deletePetSpecies: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PetSpeciesController>(PetSpeciesController);
    service = module.get<PetSpeciesService>(PetSpeciesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAll', () => {
    it('should return an array of pet species', async () => {
      const result: PetSpecies[] = [
        {
          id: '1',
          species_name: 'Dog',
          created_at: '2024-05-13T12:00:00',
          updated_at: null,
        },
      ];
      jest.spyOn(service, 'getAllSpecies').mockResolvedValue(result);

      expect(await controller.getAll()).toEqual(result);
    });
  });

  describe('create', () => {
    it('should create a new pet species', async () => {
      const newSpecies: CreateOrUpdateSpeciesDTO = { species_name: 'Cat' };
      const createdSpecies: PetSpecies = {
        id: '1',
        ...newSpecies,
        created_at: '2024-05-13T12:00:00',
        updated_at: null,
      };
      jest.spyOn(service, 'createPetSpecies').mockResolvedValue(createdSpecies);

      expect(await controller.create(newSpecies)).toEqual(createdSpecies);
    });
  });

  describe('update', () => {
    it('should update an existing pet species', async () => {
      const id = '1';
      const updatedSpecies: CreateOrUpdateSpeciesDTO = {
        species_name: 'Hamster',
      };
      const modifiedSpecies: PetSpecies = {
        id,
        ...updatedSpecies,
        created_at: '2024-05-13T12:00:00',
        updated_at: '2024-05-13T12:30:00',
      };
      jest
        .spyOn(service, 'updatePetSpecies')
        .mockResolvedValue(modifiedSpecies);

      expect(await controller.update(id, updatedSpecies)).toEqual(
        modifiedSpecies,
      );
    });
  });

  describe('delete', () => {
    it('should delete an existing pet species', async () => {
      const id = '1';
      const deletedSpecies: PetSpecies = {
        id,
        species_name: 'Fish',
        created_at: '2024-05-13T12:00:00',
        updated_at: null,
      };
      jest.spyOn(service, 'deletePetSpecies').mockResolvedValue(deletedSpecies);

      expect(await controller.delete(id)).toEqual(deletedSpecies);
    });
  });
});
