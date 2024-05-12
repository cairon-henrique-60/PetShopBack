import { Test, TestingModule } from '@nestjs/testing';

import { PetSpeciesService } from '../services/pet-species.service';
import { PetSpeciesController } from '../controllers/pet-species.controller';
import { CreateOrUpdateSpeciesDTO } from '../dtos/create-or-update-pet-species.dto';

describe('PetSpeciesController', () => {
  let controller: PetSpeciesController;
  let petSpeciesService: PetSpeciesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PetSpeciesController],
      providers: [PetSpeciesService],
    }).compile();

    controller = module.get<PetSpeciesController>(PetSpeciesController);
    petSpeciesService = module.get<PetSpeciesService>(PetSpeciesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAll', () => {
    it('should return an array of pet species', async () => {
      const result = ['Cat', 'Dog']; // Example data
      jest.spyOn(petSpeciesService, 'getAllSpecies');
      expect(await controller.getAll()).toBe(result);
    });
  });

  describe('create', () => {
    it('should create a new pet species', async () => {
      const dto: CreateOrUpdateSpeciesDTO = { species_name: 'Cat' };
      jest.spyOn(petSpeciesService, 'createPetSpecies');
      expect(await controller.create(dto)).toBe(dto);
    });
  });

  describe('update', () => {
    it('should update an existing pet species', async () => {
      const id = '1'; // Example ID
      const dto: CreateOrUpdateSpeciesDTO = { species_name: 'Dog' };
      jest.spyOn(petSpeciesService, 'updatePetSpecies');
      expect(await controller.update(id, dto)).toBe(dto);
    });
  });

  describe('delete', () => {
    it('should delete an existing pet species', async () => {
      const id = '1'; // Example ID
      jest.spyOn(petSpeciesService, 'deletePetSpecies');

      expect(await controller.delete(id)).toBeUndefined();
    });
  });
});
