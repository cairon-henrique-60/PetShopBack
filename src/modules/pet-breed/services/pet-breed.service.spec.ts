import { NotFoundError } from 'src/lib/http-exceptions/errors/types/not-found-error';

import { PetBreedService } from './pet-breed.service';

// Create mocks for the dependencies
const mockPetBreedRepository = () => ({
  createQueryBuilder: jest.fn(),
  find: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

const mockPaginationService = () => ({
  paginateWithQueryBuilder: jest.fn(),
});

const mockPetSpeciesService = () => ({
  getPetSpeciesById: jest.fn(),
});

describe('PetBreedService', () => {
  let petBreedService: PetBreedService;
  let petBreedRepository;
  let paginationService;
  let petSpeciesService;

  beforeEach(() => {
    petBreedRepository = mockPetBreedRepository();
    paginationService = mockPaginationService();
    petSpeciesService = mockPetSpeciesService();

    petBreedService = new PetBreedService(
      petBreedRepository,
      paginationService,
      petSpeciesService,
    );
  });

  // Add individual test cases here

  describe('paginateBreeds', () => {
    it('should return paginated breeds', async () => {
      const paginatedResult = { items: [], meta: {} };
      paginationService.paginateWithQueryBuilder.mockResolvedValue(
        paginatedResult,
      );

      const result = await petBreedService.paginateBreeds({
        page: 1,
        limit: 10,
        breed_name: 'Bulldog',
        order_by_created_at: 'ASC',
        order_by_updated_at: 'DESC',
        species_id: 'speciesId1',
      });

      expect(paginationService.paginateWithQueryBuilder).toHaveBeenCalled();
      expect(result).toEqual(paginatedResult);
    });
  });

  describe('getBreedById', () => {
    it('should return the breed if found', async () => {
      const breed = { id: 'breedId', breed_name: 'Bulldog' };
      petBreedRepository.createQueryBuilder.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(breed),
      });

      const result = await petBreedService.getBreedById('breedId');

      expect(result).toEqual(breed);
    });

    it('should throw NotFoundError if breed is not found', async () => {
      petBreedRepository.createQueryBuilder.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      });

      await expect(petBreedService.getBreedById('breedId')).rejects.toThrow(
        NotFoundError,
      );
    });
  });

  describe('createPetBreed', () => {
    it('should create and return the new breed', async () => {
      const payload = { breed_name: 'Bulldog', species_id: 'speciesId1' };
      const breed = { ...payload, id: 'breedId' };

      petSpeciesService.getPetSpeciesById.mockResolvedValue({});
      petBreedRepository.save.mockResolvedValue(breed);

      const result = await petBreedService.createPetBreed(payload);

      expect(petSpeciesService.getPetSpeciesById).toHaveBeenCalledWith(
        payload.species_id,
      );
      expect(petBreedRepository.save).toHaveBeenCalledWith(
        expect.objectContaining(payload),
      );
      expect(result).toEqual(breed);
    });
  });
});
