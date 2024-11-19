import { Test, TestingModule } from '@nestjs/testing'
import { LinkService } from './link.service'
import { describe } from 'node:test'
import { PrismaService } from '../../prisma/prisma.service'

const mockLink = {
    linkId: 'test-linkId',
    URL: 'test-url',
    userId: 1,
    createdAt: new Date('2024-01-01T00:00:00Z'),
    openedAt: new Date('2024-01-02T00:00:00Z'),
    views: 0,
    tags: ['none'],
    title: 'test-title',
}

const mockPrismaService = {
    link: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        createMany: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    },
}

describe('LinkService', () => {
    let linkService: LinkService
    let prismaService: PrismaService

    beforeEach(async () => {
        jest.clearAllMocks()
        jest.resetAllMocks()
        jest.restoreAllMocks()

        const module: TestingModule = await Test.createTestingModule({
            providers: [LinkService, { provide: PrismaService, useValue: mockPrismaService }],
        }).compile()

        linkService = module.get<LinkService>(LinkService)
        prismaService = module.get<PrismaService>(PrismaService)
    })

    afterAll(async () => {
        jest.clearAllMocks()
        jest.resetAllMocks()
        jest.restoreAllMocks()
    })

    it('should be defined', () => {
        expect(linkService).toBeDefined()
    })

    describe('updateTags', () => {
        it('should update tags of link', async () => {
            const mockTags = ['test1', 'test2', 'test3']
            const updateLink = { ...mockLink, tags: mockTags }

            mockPrismaService.link.update.mockResolvedValue(updateLink)

            const result = await linkService.updateTags(mockLink.linkId, mockTags)

            expect(prismaService.link.update).toHaveBeenCalledWith({
                where: { linkId: mockLink.linkId },
                data: { tags: mockTags },
            })
            expect(result).toEqual(updateLink)
        })
    })
})
