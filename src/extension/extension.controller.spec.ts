import { Test, TestingModule } from '@nestjs/testing'
import { ExtensionController } from './extension.controller'

describe('ExtensionController', () => {
    let controller: ExtensionController

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ExtensionController],
        }).compile()

        controller = module.get<ExtensionController>(ExtensionController)
    })

    it('should be defined', () => {
        expect(controller).toBeDefined()
    })
})
