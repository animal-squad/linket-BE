import { Test, TestingModule } from '@nestjs/testing'
import { LinkController } from './link.controller'
import { LinkService } from './link.service'
import { describe } from 'node:test'

const mockLinkService = {
    updateTags: jest.fn(),
}

const mockRequest = {
    session: {
        passport: {
            userId: 1,
        },
    },
}

const userId = mockRequest.session.passport.userId

const mockLink = {
    linkId: 'test-linkId',
    URL: 'test-url',
    userId: 1,
    createdAt: new Date('2024-01-01T00:00:00Z'),
    openedAt: new Date('2024-01-01T00:00:00Z'),
    views: 0,
    tags: ['none'],
    title: 'test-title',
}

describe('LinkController', () => {
    let linkController: LinkController
    let linkService: LinkService

    beforeEach(async () => {
        jest.clearAllMocks()
        jest.resetAllMocks()
        jest.restoreAllMocks()

        const module: TestingModule = await Test.createTestingModule({
            controllers: [LinkController],
            providers: [{ provide: LinkService, useValue: mockLinkService }],
        }).compile()

        linkController = module.get<LinkController>(LinkController)
        linkService = module.get<LinkService>(LinkService)
    })

    afterAll(async () => {
        jest.clearAllMocks()
        jest.resetAllMocks()
        jest.restoreAllMocks()
    })

    it('should be defined', () => {
        expect(linkController).toBeDefined()
    })

    describe('updateTags', () => {
        it('should update tags of link', async () => {
            const mockTags = ['test1', 'test2', 'test3']
            const updatedLink = { ...mockLink, tags: mockTags }

            mockLinkService.updateTags.mockResolvedValue(updatedLink)
            const result = await linkController.updateTags(mockLink.linkId, mockTags, userId)

            expect(linkService.updateTags).toHaveBeenCalledWith(mockLink.linkId, mockTags)
            expect(result).toEqual(updatedLink)
        })
    })
})