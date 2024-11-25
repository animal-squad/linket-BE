import { Test, TestingModule } from '@nestjs/testing'
import { LinkController } from './link.controller'
import { LinkService } from './link.service'
import { describe } from 'node:test'
import { HttpService } from '@nestjs/axios'
import { CreateLinkDto } from './dto/link.dto'
import { of } from 'rxjs'

const mockLinkService = {
    updateTags: jest.fn(),
    createOne: jest.fn(),
    updateTagAndTitle: jest.fn(),
    deleteLinks: jest.fn(),
}

const mockHttpService = {
    post: jest.fn(),
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
    let httpService: HttpService

    beforeEach(async () => {
        jest.clearAllMocks()
        jest.resetAllMocks()
        jest.restoreAllMocks()

        const module: TestingModule = await Test.createTestingModule({
            controllers: [LinkController],
            providers: [
                { provide: LinkService, useValue: mockLinkService },
                { provide: HttpService, useValue: mockHttpService },
            ],
        }).compile()

        linkController = module.get<LinkController>(LinkController)
        linkService = module.get<LinkService>(LinkService)
        httpService = module.get<HttpService>(HttpService)
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

    describe('createOneLink', () => {
        it('should create a link', async () => {
            const createLinkDto: CreateLinkDto = {
                URL: 'test-url',
            }

            const createdLink = {
                linkId: 'test-linkId',
                URL: 'test-url',
                content: null,
            }

            const aiRequest = {
                URL: 'test-url',
                linkId: 'test-linkId',
                content: null,
            }

            const aiResponse = {
                data: {
                    links: [
                        {
                            linkId: 'test-linkId',
                            tags: ['tag1', 'tag2'],
                            title: 'ai title',
                        },
                    ],
                },
            }

            mockLinkService.createOne.mockResolvedValue(createdLink)
            mockHttpService.post.mockReturnValue(of(aiResponse))
            mockLinkService.updateTagAndTitle.mockResolvedValue(aiResponse.data)

            const result = await linkController.createLink(createLinkDto, userId)

            expect(mockLinkService.createOne).toHaveBeenCalledWith(createLinkDto, userId)
            expect(mockHttpService.post).toHaveBeenCalledWith(expect.any(String), { links: [aiRequest] }, { timeout: 60000 })
            expect(mockLinkService.updateTagAndTitle).toHaveBeenCalledWith(aiResponse.data)
        })
    })

    describe('DeleteLinks', () => {
        it('should delete links', async () => {
            const mockLinkIds = ['test-linkId1', 'test-linkId2', 'test-linkId3']
            mockLinkService.deleteLinks.mockResolvedValue({ count: 3 })
            await linkController.deleteLinks(mockLinkIds, userId)
            expect(mockLinkService.deleteLinks).toHaveBeenCalledWith(mockLinkIds)
        })
    })
})
