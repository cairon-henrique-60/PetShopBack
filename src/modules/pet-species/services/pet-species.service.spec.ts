import { Test, TestingModule } from '@nestjs/testing';

import { NotFoundError } from 'src/lib/http-exceptions/errors/types/not-found-error';

import { PetSpeciesService } from './pet-species.service';
import { PetSpecies } from '../entities/pet-species.entity';

describe('PetSpeciesService', () => {
  let petSpeciesService: PetSpeciesService;

  const mockPetSpeciesRepository = {
    createQueryBuilder: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getMany: jest.fn(),
    })),
    findOne: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockPetSpeciesEntity = new PetSpecies();

  mockPetSpeciesEntity.id = '3f49ca1c-a0f1-4eb4-9991-aaec5f60f820';
  mockPetSpeciesEntity.species_name = 'Cachorro';
  mockPetSpeciesEntity.created_at = '2024-05-21 13:46:26.90663';
  mockPetSpeciesEntity.updated_at = '2024-05-21 13:46:26.90663';

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PetSpeciesService,
        {
          provide: 'PET_SPECIES_REPOSITORY',
          useValue: mockPetSpeciesRepository,
        },
      ],
    }).compile();

    petSpeciesService = module.get<PetSpeciesService>(PetSpeciesService);
  });

  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(petSpeciesService).toBeDefined();
  });

  describe('list', () => {
    it('should return a list of pet species', async () => {
      const queryResult = [mockPetSpeciesEntity];
      mockPetSpeciesRepository
        .createQueryBuilder()
        .getMany.mockResolvedValue(queryResult);

      const result = await petSpeciesService.list({
        id: undefined,
        species_name: undefined,
      });

      expect(result).toEqual(queryResult);
      expect(mockPetSpeciesRepository.createQueryBuilder).toBeCalled();
    });
  });

  describe('getPetSpeciesById', () => {
    it('should return a pet species by id', async () => {
      mockPetSpeciesRepository.findOne.mockResolvedValue(mockPetSpeciesEntity);

      const result = await petSpeciesService.getPetSpeciesById(
        mockPetSpeciesEntity.id,
      );

      expect(result).toEqual(mockPetSpeciesEntity);
      expect(mockPetSpeciesRepository.findOne).toBeCalledWith({
        where: { id: mockPetSpeciesEntity.id },
      });
    });

    it('should throw NotFoundError if pet species is not found', async () => {
      mockPetSpeciesRepository.findOne.mockResolvedValue(null);

      await expect(
        petSpeciesService.getPetSpeciesById('non-existing-id'),
      ).rejects.toThrow(NotFoundError);
      expect(mockPetSpeciesRepository.findOne).toBeCalledWith({
        where: { id: 'non-existing-id' },
      });
    });
  });

  describe('createPetSpecies', () => {
    it('should create and return a new pet species', async () => {
      const speciesName = 'Gato';
      const newPetSpecies = new PetSpecies();
      newPetSpecies.species_name = speciesName;

      jest.spyOn(PetSpecies, 'createOrUpdate').mockReturnValue(newPetSpecies);
      mockPetSpeciesRepository.save.mockResolvedValue(newPetSpecies);

      const result = await petSpeciesService.createPetSpecies(speciesName);

      expect(result).toEqual(newPetSpecies);
      expect(PetSpecies.createOrUpdate).toBeCalledWith({
        species_name: speciesName,
      });
      expect(mockPetSpeciesRepository.save).toBeCalledWith(newPetSpecies);
    });
  });

  describe('updatePetSpecies', () => {
    it('should update and return an existing pet species', async () => {
      const newSpeciesName = 'Gato';

      jest
        .spyOn(petSpeciesService, 'getPetSpeciesById')
        .mockResolvedValue(mockPetSpeciesEntity);
      jest.spyOn(PetSpecies, 'createOrUpdate').mockReturnValue({
        ...mockPetSpeciesEntity,
        species_name: newSpeciesName,
      });

      mockPetSpeciesRepository.update.mockResolvedValue({} as any);

      const result = await petSpeciesService.updatePetSpecies(
        mockPetSpeciesEntity.id,
        newSpeciesName,
      );

      expect(result).toEqual({
        ...mockPetSpeciesEntity,
        species_name: newSpeciesName,
      });
      expect(petSpeciesService.getPetSpeciesById).toBeCalledWith(
        mockPetSpeciesEntity.id,
      );
      expect(PetSpecies.createOrUpdate).toBeCalledWith({
        species_name: newSpeciesName,
      });
      expect(mockPetSpeciesRepository.update).toBeCalledWith(
        mockPetSpeciesEntity.id,
        {
          ...mockPetSpeciesEntity,
          species_name: newSpeciesName,
        },
      );
    });
  });

  describe('deletePetSpecies', () => {
    it('should delete a pet species by id', async () => {
      jest
        .spyOn(petSpeciesService, 'getPetSpeciesById')
        .mockResolvedValue(mockPetSpeciesEntity);
      mockPetSpeciesRepository.delete.mockResolvedValue({} as any);

      const result = await petSpeciesService.deletePetSpecies(
        mockPetSpeciesEntity.id,
      );

      expect(result).toEqual({});
      expect(petSpeciesService.getPetSpeciesById).toBeCalledWith(
        mockPetSpeciesEntity.id,
      );
      expect(mockPetSpeciesRepository.delete).toBeCalledWith(
        mockPetSpeciesEntity.id,
      );
    });
  });
});
