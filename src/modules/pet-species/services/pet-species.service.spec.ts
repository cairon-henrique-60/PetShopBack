import { Test, TestingModule } from '@nestjs/testing';

import { PetSpeciesService } from './pet-species.service';
import { PetSpecies } from '../entities/pet-species.entity';
import type { ListSpeciesPayload } from '../dtos/list-species.dto';

describe('PetSpeciesService', () => {
  let petSpeciesService: PetSpeciesService;

  const mockService = {
    createQueryBuilder: jest.fn(),
    list: jest.fn(),
    getPetSpeciesById: jest.fn(),
    createPetSpecies: jest.fn(),
    updatePetSpecies: jest.fn(),
    deletePetSpecies: jest.fn(),
  };

  const mockPetSpeciesEntity = new PetSpecies();

  mockPetSpeciesEntity.id = '3f49ca1c-a0f1-4eb4-9991-aaec5f60f820';
  mockPetSpeciesEntity.species_name = 'Cachorro';
  mockPetSpeciesEntity.created_at = '2024-05-21 13:46:26.90663';
  mockPetSpeciesEntity.updated_at = '2024-05-21 13:46:26.90663';

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PetSpeciesService],
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
    it('should list pet species', async () => {
      const params: ListSpeciesPayload = {
        id: undefined,
        species_name: undefined,
      };

      jest.spyOn(mockService, 'list').mockReturnValue({
        select: jest.fn().mockReturnThis(),
        leftJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
      });

      await petSpeciesService.list(params);
    });
  });
});
