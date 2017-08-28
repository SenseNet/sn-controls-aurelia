import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import { ComponentTestBase } from '../component-test.base';
import { Breadcrumbs } from '../../src/index';

@suite('Breadcrumbs component')
export class BreadcrumbTests extends ComponentTestBase<Breadcrumbs>{

    @test
    public async 'Should be initialized'() {
        const viewModel = await this.createAndGetViewModel('<breadcrumbs></breadcrumbs>', 'breadcrumbs');
        expect(viewModel).to.be.instanceof(Breadcrumbs);
    }


    @test
    public async 'Should return empty segments array if no Selection is provided'() {
        const viewModel = await this.createAndGetViewModel('<breadcrumbs></breadcrumbs>', 'breadcrumbs');
        expect(viewModel.Segments.length).to.be.eq(0);
    }

    @test
    public async 'Should return empty segments array if the Selection has no Path'() {
        const viewModel = await this.createAndGetViewModel('<breadcrumbs></breadcrumbs>', 'breadcrumbs');
        const selection = this.mockRepo.HandleLoadedContent({Name: 'Test', Id: 235235} as any);
        viewModel.Selection = selection;
        expect(viewModel.Segments.length).to.be.eq(0);
    }

    @test
    public async 'Should return a proper segments array'() {
        const viewModel = await this.createAndGetViewModel('<breadcrumbs></breadcrumbs>', 'breadcrumbs');
        const selection = this.mockRepo.HandleLoadedContent({Name: 'Test', Path: 'Root/Test', Id: 235235});
        viewModel.Selection = selection;
        expect(viewModel.Segments.length).to.be.eq(2);
        expect(viewModel.Segments[0]).to.be.deep.eq({name: 'Root', path: '/Root'});
        expect(viewModel.Segments[1]).to.be.deep.eq({name: 'Test', path: '/Root/Test'})
    }

}